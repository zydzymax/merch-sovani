import Link from 'next/link'
import Navbar from '@/app/_components/Navbar'
import BigFooter from '@/app/_components/BigFooter'

export default function LegalPage() {
  return (
    <div className="min-h-screen" style={{background:'var(--bg)',color:'var(--text)'}}>
      <Navbar />

      <section className="section">
        <div className="container" style={{maxWidth:900}}>
          <h1 className="font-display" style={{fontSize:'40px',marginBottom:32}}>
            Реквизиты и правовая информация
          </h1>

          <div style={{display:'grid',gap:24}}>
            <div className="tile" style={{padding:40}}>
              <h2 className="font-display" style={{fontSize:'28px',marginBottom:24}}>
                Продавец
              </h2>
              <div className="lead" style={{fontSize:'16px',lineHeight:1.8,display:'grid',gap:8}}>
                <p><strong>Индивидуальный предприниматель:</strong> Гладких Виталий Олегович</p>
                <p><strong>ИНН:</strong> 381705889083</p>
                <p><strong>ОГРНИП:</strong> 325774600805724</p>
                <p><strong>Адрес:</strong> г. Москва, ул. Маршала Бирюзова, д. 9, кв. 7</p>
                <p><strong>Email:</strong> <a href="mailto:shop@getnwin.ru" style={{color:'var(--accent)'}}>shop@getnwin.ru</a></p>
                <p><strong>Телефон:</strong> <a href="tel:+79938981301" style={{color:'var(--accent)'}}>+7 (993) 898-13-01</a></p>
              </div>

              <div style={{marginTop:24,padding:20,background:'var(--surface)',borderRadius:16,borderLeft:'4px solid var(--accent)'}}>
                <p className="lead" style={{fontSize:'14px',lineHeight:1.6,opacity:0.9,margin:0}}>
                  Продавец осуществляет продажу товаров через интернет-магазин getnwin.ru, приём платежей и отправку электронных чеков в соответствии с 54-ФЗ.
                </p>
              </div>
            </div>

            <div className="tile" style={{padding:40}}>
              <h2 className="font-display" style={{fontSize:'28px',marginBottom:24}}>
                Документы
              </h2>
              <div className="lead" style={{fontSize:'16px',lineHeight:1.6}}>
                <p>Для получения полной информации ознакомьтесь со следующими документами:</p>
                <ul style={{paddingLeft:24,marginTop:16,display:'grid',gap:8}}>
                  <li>
                    <Link href="/docs/user-agreement" style={{color:'var(--accent)'}}>Пользовательское соглашение</Link> — условия использования сайта
                  </li>
                  <li>
                    <Link href="/docs/offer" style={{color:'var(--accent)'}}>Публичная оферта</Link> — условия покупки товаров
                  </li>
                  <li>
                    <Link href="/docs/privacy" style={{color:'var(--accent)'}}>Политика конфиденциальности</Link> — обработка персональных данных
                  </li>
                  <li>
                    <Link href="/docs/cookies" style={{color:'var(--accent)'}}>Политика cookies</Link> — использование файлов cookie
                  </li>
                  <li>
                    <Link href="/docs/delivery" style={{color:'var(--accent)'}}>Доставка</Link> — условия и сроки доставки
                  </li>
                  <li>
                    <Link href="/docs/payment" style={{color:'var(--accent)'}}>Оплата</Link> — способы оплаты
                  </li>
                  <li>
                    <Link href="/legal/returns" style={{color:'var(--accent)'}}>Возврат товара</Link> — условия возврата
                  </li>
                </ul>
              </div>
            </div>

            <div className="tile" style={{padding:40}}>
              <h2 className="font-display" style={{fontSize:'28px',marginBottom:24}}>
                Подсудность и применимое право
              </h2>
              <div className="lead" style={{fontSize:'16px',lineHeight:1.6}}>
                <p>
                  Все споры и разногласия, возникающие из использования сайта, подлежат разрешению в соответствии с законодательством Российской Федерации.
                </p>
                <p style={{marginTop:12}}>
                  Подсудность: по месту нахождения Продавца (г. Москва).
                </p>
              </div>
            </div>
          </div>

          <div style={{marginTop:40,padding:20,background:'var(--surface)',borderRadius:16,borderLeft:'4px solid var(--accent)'}}>
            <p className="lead" style={{fontSize:'14px',opacity:0.9}}>
              Дата последнего обновления: 17 декабря 2025 г.
            </p>
          </div>
        </div>
      </section>

      <BigFooter />
    </div>
  )
}
