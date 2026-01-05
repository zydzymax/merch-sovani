module.exports = {
  apps: [
    {
      name: 'fashion-shop',
      script: 'npm',
      args: 'start',
      cwd: '/root/fashion-shop',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: '/root/.pm2/logs/fashion-shop-error.log',
      out_file: '/root/.pm2/logs/fashion-shop-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Важно: ограничиваем количество рестартов
      max_restarts: 10,
      min_uptime: '10s',

      // Задержка между рестартами
      restart_delay: 4000,

      // Останавливать при превышении лимита рестартов
      stop_exit_codes: [0],

      // Kill timeout
      kill_timeout: 5000,

      // Не перезапускать при ошибке
      autorestart: true,
      exp_backoff_restart_delay: 100
    }
  ]
}
