module.exports = {
  apps: [
    {
      name: 'fashion-shop',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      cwd: '/root/fashion-shop',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '1G',
      watch: false,
    },
  ],
}
