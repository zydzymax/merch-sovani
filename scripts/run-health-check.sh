#!/bin/bash
cd /root/fashion-shop
source .env
export TELEGRAM_BOT_TOKEN
export TELEGRAM_ADMIN_CHAT_ID
export DATABASE_URL
export REDIS_URL
export NEXT_PUBLIC_SITE_URL
npx tsx scripts/healthCheck.ts >> /var/log/fashion-shop-health.log 2>&1
