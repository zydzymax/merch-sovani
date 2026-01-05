#!/usr/bin/env npx tsx
/**
 * Health Check & Alerting System
 * Monitors critical services and sends Telegram alerts on issues
 * Run via cron every 5 minutes
 */

import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import fs from 'fs'

const prisma = new PrismaClient()

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || ''
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://getnwin.ru'
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6381'

const STATE_FILE = '/tmp/fashion-shop-health-state.json'

interface HealthState {
  lastAlerts: Record<string, number> // timestamp of last alert per issue type
  consecutiveFailures: Record<string, number>
}

interface CheckResult {
  name: string
  ok: boolean
  message: string
  critical: boolean
}

// Minimum interval between repeated alerts (30 minutes)
const ALERT_COOLDOWN_MS = 30 * 60 * 1000

async function sendTelegramAlert(text: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_ADMIN_CHAT_ID) {
    console.error('Telegram not configured')
    return false
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_ADMIN_CHAT_ID,
          text,
          parse_mode: 'HTML',
        }),
      }
    )
    const data = await response.json()
    return data.ok
  } catch (error) {
    console.error('Failed to send Telegram alert:', error)
    return false
  }
}

function loadState(): HealthState {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'))
    }
  } catch {}
  return { lastAlerts: {}, consecutiveFailures: {} }
}

function saveState(state: HealthState): void {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state))
}

function shouldAlert(state: HealthState, issueKey: string): boolean {
  const lastAlert = state.lastAlerts[issueKey] || 0
  const now = Date.now()
  return now - lastAlert > ALERT_COOLDOWN_MS
}

// Health Checks

async function checkWebsite(): Promise<CheckResult> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(SITE_URL, {
      signal: controller.signal,
      headers: { 'User-Agent': 'HealthCheck/1.0' }
    })
    clearTimeout(timeout)

    if (response.ok) {
      return { name: 'Website', ok: true, message: `${response.status} OK`, critical: false }
    } else {
      return {
        name: 'Website',
        ok: false,
        message: `HTTP ${response.status}`,
        critical: response.status >= 500
      }
    }
  } catch (error: any) {
    return {
      name: 'Website',
      ok: false,
      message: error.message || 'Connection failed',
      critical: true
    }
  }
}

async function checkDatabase(): Promise<CheckResult> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { name: 'Database', ok: true, message: 'Connected', critical: false }
  } catch (error: any) {
    return {
      name: 'Database',
      ok: false,
      message: error.message || 'Connection failed',
      critical: true
    }
  }
}

function checkRedis(): CheckResult {
  try {
    // Parse REDIS_URL to get host and port
    const match = REDIS_URL.match(/redis:\/\/([^:]+):(\d+)/)
    const host = match ? match[1] : 'localhost'
    const port = match ? match[2] : '6381'

    const output = execSync(`redis-cli -h ${host} -p ${port} ping`, { timeout: 5000 }).toString().trim()
    if (output === 'PONG') {
      return { name: 'Redis', ok: true, message: 'Connected', critical: false }
    }
    return { name: 'Redis', ok: false, message: output, critical: true }
  } catch (error: any) {
    return {
      name: 'Redis',
      ok: false,
      message: error.message || 'Connection failed',
      critical: true
    }
  }
}

function checkDiskSpace(): CheckResult {
  try {
    const output = execSync("df -h / | tail -1 | awk '{print $5}'").toString().trim()
    const usagePercent = parseInt(output.replace('%', ''))

    if (usagePercent >= 95) {
      return {
        name: 'Disk Space',
        ok: false,
        message: `${usagePercent}% used - CRITICAL`,
        critical: true
      }
    } else if (usagePercent >= 90) {
      return {
        name: 'Disk Space',
        ok: false,
        message: `${usagePercent}% used - WARNING`,
        critical: false
      }
    }
    return { name: 'Disk Space', ok: true, message: `${usagePercent}% used`, critical: false }
  } catch (error: any) {
    return { name: 'Disk Space', ok: false, message: error.message, critical: false }
  }
}

function checkMemory(): CheckResult {
  try {
    const output = execSync("free | grep Mem | awk '{print int($3/$2 * 100)}'").toString().trim()
    const usagePercent = parseInt(output)

    if (usagePercent >= 95) {
      return {
        name: 'Memory',
        ok: false,
        message: `${usagePercent}% used - CRITICAL`,
        critical: true
      }
    } else if (usagePercent >= 90) {
      return {
        name: 'Memory',
        ok: false,
        message: `${usagePercent}% used - WARNING`,
        critical: false
      }
    }
    return { name: 'Memory', ok: true, message: `${usagePercent}% used`, critical: false }
  } catch (error: any) {
    return { name: 'Memory', ok: false, message: error.message, critical: false }
  }
}

function checkPM2Process(): CheckResult {
  try {
    const output = execSync('pm2 jlist').toString()
    const processes = JSON.parse(output)
    const fashionShop = processes.find((p: any) => p.name === 'fashion-shop')

    if (!fashionShop) {
      return {
        name: 'PM2 Process',
        ok: false,
        message: 'fashion-shop not found',
        critical: true
      }
    }

    if (fashionShop.pm2_env.status !== 'online') {
      return {
        name: 'PM2 Process',
        ok: false,
        message: `Status: ${fashionShop.pm2_env.status}`,
        critical: true
      }
    }

    // Check for high restart count (might indicate crash loop)
    if (fashionShop.pm2_env.restart_time > 10) {
      return {
        name: 'PM2 Process',
        ok: false,
        message: `High restarts: ${fashionShop.pm2_env.restart_time}`,
        critical: false
      }
    }

    return {
      name: 'PM2 Process',
      ok: true,
      message: `Online, restarts: ${fashionShop.pm2_env.restart_time}`,
      critical: false
    }
  } catch (error: any) {
    return { name: 'PM2 Process', ok: false, message: error.message, critical: true }
  }
}

async function checkSSLCertificate(): Promise<CheckResult> {
  try {
    const output = execSync(
      `echo | openssl s_client -servername getnwin.ru -connect getnwin.ru:443 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2`
    ).toString().trim()

    const expiryDate = new Date(output)
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry <= 7) {
      return {
        name: 'SSL Certificate',
        ok: false,
        message: `Expires in ${daysUntilExpiry} days!`,
        critical: true
      }
    } else if (daysUntilExpiry <= 14) {
      return {
        name: 'SSL Certificate',
        ok: false,
        message: `Expires in ${daysUntilExpiry} days`,
        critical: false
      }
    }
    return {
      name: 'SSL Certificate',
      ok: true,
      message: `Valid for ${daysUntilExpiry} days`,
      critical: false
    }
  } catch (error: any) {
    return { name: 'SSL Certificate', ok: false, message: error.message, critical: false }
  }
}

async function main() {
  console.log('Running health checks...')

  const state = loadState()
  const results: CheckResult[] = []

  // Run all checks
  results.push(await checkWebsite())
  results.push(await checkDatabase())
  results.push(checkRedis())
  results.push(checkDiskSpace())
  results.push(checkMemory())
  results.push(checkPM2Process())
  results.push(await checkSSLCertificate())

  // Process results
  const failures = results.filter(r => !r.ok)
  const criticalFailures = failures.filter(r => r.critical)

  console.log('\nHealth Check Results:')
  for (const result of results) {
    const status = result.ok ? '✓' : (result.critical ? '✗ CRITICAL' : '⚠ WARNING')
    console.log(`  ${status} ${result.name}: ${result.message}`)
  }

  // Send alerts for new issues
  const now = Date.now()

  for (const failure of failures) {
    const issueKey = failure.name
    state.consecutiveFailures[issueKey] = (state.consecutiveFailures[issueKey] || 0) + 1

    // Alert on critical issues immediately, or after 2 consecutive failures for warnings
    const shouldSend = failure.critical || state.consecutiveFailures[issueKey] >= 2

    if (shouldSend && shouldAlert(state, issueKey)) {
      const emoji = failure.critical ? '🚨' : '⚠️'
      const level = failure.critical ? 'CRITICAL' : 'WARNING'

      const alertText = `
${emoji} <b>${level}: ${failure.name}</b>

${failure.message}

🕐 ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}
🌐 ${SITE_URL}
🖥️ Server: 10.0.0.10 (prod)
`.trim()

      console.log(`\nSending alert for: ${failure.name}`)
      await sendTelegramAlert(alertText)
      state.lastAlerts[issueKey] = now
    }
  }

  // Reset consecutive failures for passing checks
  for (const result of results.filter(r => r.ok)) {
    if (state.consecutiveFailures[result.name] > 0) {
      // Send recovery notification if we previously alerted
      if (state.lastAlerts[result.name]) {
        const recoveryText = `
✅ <b>RECOVERED: ${result.name}</b>

${result.message}

🕐 ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}
`.trim()
        await sendTelegramAlert(recoveryText)
      }
    }
    state.consecutiveFailures[result.name] = 0
  }

  saveState(state)

  await prisma.$disconnect()

  if (criticalFailures.length > 0) {
    process.exit(1)
  }
}

main().catch(async (error) => {
  console.error('Health check failed:', error)
  await sendTelegramAlert(`🚨 <b>Health Check Script Failed</b>\n\n${error.message}`)
  await prisma.$disconnect()
  process.exit(1)
})
