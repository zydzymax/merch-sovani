/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Production optimizations
  poweredByHeader: false, // Remove X-Powered-By header

  images: {
    // Disable optimization to fix Cyrillic filename issues
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Optimize images
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
  },

  // Compress responses
  compress: true,

  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(self)'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Scripts: Next.js requires unsafe-eval and unsafe-inline for hydration
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://mc.yandex.ru https://mc.yandex.com",
              // Styles: Required for styled-jsx and inline styles
              "style-src 'self' 'unsafe-inline'",
              // Images from self, data URIs, and any HTTPS source
              "img-src 'self' data: blob: https:",
              // Fonts from self and data URIs
              "font-src 'self' data:",
              // API connections
              "connect-src 'self' https://mc.yandex.ru https://mc.yandex.com wss:",
              // Frame ancestors - only self
              "frame-ancestors 'self'",
              // Base URI restriction
              "base-uri 'self'",
              // Form submissions only to self
              "form-action 'self'",
              // Upgrade insecure requests in production
              "upgrade-insecure-requests",
              // Block mixed content
              "block-all-mixed-content",
            ].join('; ')
          }
        ],
      },
      // Cache static assets
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Redirect www to non-www (or vice versa)
  async redirects() {
    return []
  },
}

module.exports = nextConfig
