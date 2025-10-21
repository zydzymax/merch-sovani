import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils/cn'

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin', 'cyrillic'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Fashion Shop — Стильная одежда с акцией "1 покупка = 1 шанс"',
  description:
    'Интернет-магазин модной одежды, БАДов и билетов на ивенты. Участвуйте в акции и выигрывайте призы!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const yandexMetrikaId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID

  return (
    <html lang="ru" className={cn(inter.variable, playfair.variable)}>
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
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  )
}
