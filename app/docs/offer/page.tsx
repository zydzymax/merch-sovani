import Link from 'next/link'
import Navbar from '@/app/_components/Navbar'
import BigFooter from '@/app/_components/BigFooter'

export default function OfferPage() {
  return (
    <div className="min-h-screen" style={{background:'var(--bg)',color:'var(--text)'}}>
      <Navbar />

      <section className="section">
        <div className="container" style={{maxWidth:900}}>
          <h1 className="font-display" style={{fontSize:'40px',marginBottom:32}}>
            Публичная оферта
          </h1>

          <div className="tile doc-content" style={{padding:40}}>
            <div style={{display:'grid',gap:32}}>
              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>1. Общие положения</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Настоящий документ является публичной офертой ИП Гладких Виталий Олегович (далее — «Продавец») и содержит условия продажи товаров через интернет-магазин getnwin.ru.</p>
                  <p>Оформление заказа на Сайте является акцептом данной оферты и подтверждает согласие Покупателя с её условиями.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>2. Продавец</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p><strong>Продавец:</strong> ИП Гладких Виталий Олегович</p>
                  <p>ИНН: 381705889083, ОГРНИП: 325774600805724</p>
                  <p>Адрес: г. Москва, ул. Маршала Бирюзова, д. 9, кв. 7</p>
                  <p>Email: shop@getnwin.ru | Тел: +7 (993) 898-13-01</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>3. Предмет договора</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Продавец обязуется передать Покупателю товары, представленные в каталоге интернет-магазина getnwin.ru, а Покупатель обязуется оплатить и принять товары.</p>
                  <p>Ассортимент товаров: брелоки, аксессуары и другие товары согласно каталогу.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>4. Цены и оплата</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Цены на товары указаны в рублях РФ и включают НДС (при применимости).</p>
                  <p><strong>Способы оплаты:</strong></p>
                  <ul style={{paddingLeft:24}}>
                    <li>Банковская карта (Visa, Mastercard, МИР);</li>
                    <li>Система быстрых платежей (СБП).</li>
                  </ul>
                  <p>Оплата списывается в момент подтверждения заказа. После оплаты Покупатель получает электронный чек на указанный email или телефон (согласно 54-ФЗ).</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>5. Доставка</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Доставка осуществляется службой СДЭК по всей территории России.</p>
                  <p><strong>Сроки доставки:</strong> 2-7 рабочих дней в зависимости от региона.</p>
                  <p>Стоимость доставки рассчитывается при оформлении заказа и сообщается Покупателю до оплаты.</p>
                  <p>Подробнее: <Link href="/docs/delivery" style={{color:'var(--accent)'}}>Условия доставки</Link></p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>6. Возврат и обмен</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p><strong>Возврат товара надлежащего качества:</strong></p>
                  <ul style={{paddingLeft:24}}>
                    <li>Срок: 14 дней с момента получения;</li>
                    <li>Условие: сохранён товарный вид, упаковка, потребительские свойства;</li>
                    <li>Обратная пересылка — за счёт Покупателя.</li>
                  </ul>
                  <p><strong>Возврат товара ненадлежащего качества:</strong> в соответствии с Законом РФ «О защите прав потребителей».</p>
                  <p>Срок возврата денежных средств: до 10 рабочих дней с момента получения возвращённого товара.</p>
                  <p>Подробнее: <Link href="/legal/returns" style={{color:'var(--accent)'}}>Возврат товара</Link></p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>7. Права и обязанности сторон</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p><strong>Продавец обязуется:</strong></p>
                  <ul style={{paddingLeft:24}}>
                    <li>Передать Покупателю товар надлежащего качества;</li>
                    <li>Организовать доставку товара по указанному адресу;</li>
                    <li>Направить электронный чек после оплаты;</li>
                    <li>Принять возврат товара при соблюдении условий.</li>
                  </ul>
                  <p><strong>Покупатель обязуется:</strong></p>
                  <ul style={{paddingLeft:24}}>
                    <li>Оплатить заказ в полном объёме;</li>
                    <li>Предоставить достоверные контактные данные и адрес доставки;</li>
                    <li>Принять товар и проверить его на соответствие заказу.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>8. Ответственность</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Продавец несёт ответственность за качество товаров и соблюдение условий настоящей оферты в соответствии с законодательством РФ.</p>
                  <p>Продавец не несёт ответственности за ненадлежащее исполнение обязательств вследствие обстоятельств непреодолимой силы.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>9. Персональные данные</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Оформляя заказ, Покупатель даёт согласие на обработку персональных данных в соответствии с <Link href="/docs/privacy" style={{color:'var(--accent)'}}>Политикой конфиденциальности</Link>.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>10. Заключительные положения</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Все споры разрешаются путём переговоров, а при недостижении согласия — в судебном порядке по месту нахождения Продавца (г. Москва) в соответствии с законодательством РФ.</p>
                  <p>Продавец вправе вносить изменения в условия оферты. Актуальная версия публикуется на Сайте.</p>
                </div>
              </section>

              <div style={{marginTop:40,padding:20,background:'var(--surface)',borderRadius:16,borderLeft:'4px solid var(--accent)'}}>
                <p className="lead" style={{fontSize:'14px',opacity:0.9}}>
                  Дата последнего обновления: 22 декабря 2025 г.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BigFooter />
    </div>
  )
}
