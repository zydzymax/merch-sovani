import type { Metadata } from 'next'
import { Montserrat, Unbounded, Playfair_Display, Marck_Script } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils/cn'
import CookieBanner from '@/components/CookieBanner'
import MainNav from '@/app/_components/MainNav'

const montserrat = Montserrat({ subsets: ['latin', 'cyrillic'], variable: '--font-montserrat' })
const unbounded = Unbounded({ subsets: ['latin', 'cyrillic'], variable: '--font-unbounded' })
const playfair = Playfair_Display({ subsets: ['latin', 'cyrillic'], variable: '--font-playfair' })
const marckScript = Marck_Script({ weight: '400', subsets: ['latin', 'cyrillic'], variable: '--font-marck' })

export const metadata: Metadata = {
  title: 'SoVAni — Стильная одежда с акцией "1 покупка = 1 шанс"',
  description:
    'Интернет-магазин модной одежды. Участвуйте в акции "1 покупка = 1 шанс" и выигрывайте iPhone 17 Pro, Apple Watch Ultra и XREAL Air 2 Ultra!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const yandexMetrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID

  return (
    <html lang="ru" className={cn(montserrat.variable, unbounded.variable, playfair.variable, marckScript.variable)}>
      <head>
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
        <MainNav />
        <main className="flex-1">
          {children}
        </main>
        <CookieBanner />
      </body>
    </html>
  )
}
