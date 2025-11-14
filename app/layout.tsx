import type { Metadata } from 'next'
import { Montserrat, Unbounded } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils/cn'
import CookieBanner from '@/components/CookieBanner'

const montserrat = Montserrat({ subsets: ['latin', 'cyrillic'], weight: ['400','500','600'], variable: '--font-body' })
const unbounded = Unbounded({ subsets: ['latin', 'cyrillic'], weight: ['600','700','800'], variable: '--font-display' })

export const metadata: Metadata = {
  title: 'SoVAni — Стильная одежда с акцией "1 покупка = 1 шанс"',
  description:
    'Интернет-магазин модной одежды. Участвуйте в акции "1 покупка = 1 шанс" и выигрывайте iPhone 17 Pro, Apple Watch Ultra и XREAL Air 2 Ultra!',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    viewportFit: 'cover',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const yandexMetrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID

  return (
    <html lang="ru" className={cn(montserrat.variable, unbounded.variable)}>
      <head>
        {/* Theme initialization script - runs before hydration to prevent FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var t = localStorage.getItem('theme');
                  if (!t) { t = 'legacy'; }
                  if (t && typeof document !== 'undefined') {
                    document.documentElement.style.colorScheme = 'dark';
                    // Apply theme class immediately
                    var applyTheme = function() {
                      var body = document.body || document.getElementsByTagName('body')[0];
                      if (body) {
                        body.classList.remove('legacy', 'theme-dark-electric', 'theme-blue-coral');
                        body.classList.add(t);
                      }
                    };
                    // Try to apply immediately
                    if (document.body) {
                      applyTheme();
                    }
                    // Also apply on DOMContentLoaded as fallback
                    if (document.readyState === 'loading') {
                      document.addEventListener('DOMContentLoaded', applyTheme);
                    } else {
                      applyTheme();
                    }
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        {yandexMetrikaId && (
          <>
            <script
              type="text/javascript"
              dangerouslySetInnerHTML={{
                __html: `
                  (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                  m[i].l=1*new Date();
                  for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                  k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                  (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

                  ym(${yandexMetrikaId}, "init", {
                    clickmap:true,
                    trackLinks:true,
                    accurateTrackBounce:true,
                    webvisor:true,
                    ecommerce:"dataLayer"
                  });
                `,
              }}
            />
            <noscript>
              <div>
                <img
                  src={`https://mc.yandex.ru/watch/${yandexMetrikaId}`}
                  style={{ position: 'absolute', left: '-9999px' }}
                  alt=""
                />
              </div>
            </noscript>
          </>
        )}
      </head>
      <body className={cn(montserrat.className, 'antialiased')}>
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}
