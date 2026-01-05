#!/bin/bash
cd /root/fashion-shop
source .env
export TELEGRAM_BOT_TOKEN
export TELEGRAM_ADMIN_CHAT_ID
export DATABASE_URL
npx tsx scripts/sendDailyStats.ts >> /var/log/fashion-shop-stats.log 2>&1
