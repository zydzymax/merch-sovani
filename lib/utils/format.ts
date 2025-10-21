/**
 * Format price from kopeks to rubles
 */
export function formatPrice(kopeks: number): string {
  const rubles = kopeks / 100
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rubles)
}

/**
 * Format date
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

/**
 * Format datetime
 */
export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

/**
 * Generate random code (base36)
 */
export function generateCode(length: number = 10): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Generate entry code with checksum
 */
export function generateEntryCode(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = generateCode(4)
  const checksum = (parseInt(timestamp, 36) + parseInt(random, 36)) % 36
  return `${timestamp}${random}${checksum.toString(36).toUpperCase()}`
}

/**
 * Validate entry code
 */
export function validateEntryCode(code: string): boolean {
  if (!code || code.length < 6) return false
  try {
    const checksum = code.slice(-1)
    const rest = code.slice(0, -1)
    const timestampLen = Math.ceil(rest.length / 2)
    const timestamp = rest.slice(0, timestampLen)
    const random = rest.slice(timestampLen)
    const expected = (parseInt(timestamp, 36) + parseInt(random, 36)) % 36
    return checksum === expected.toString(36).toUpperCase()
  } catch {
    return false
  }
}
