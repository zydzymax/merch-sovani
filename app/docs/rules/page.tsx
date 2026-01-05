import Link from 'next/link'
import Navbar from '@/app/_components/Navbar'
import BigFooter from '@/app/_components/BigFooter'

export default function RulesPage() {
  return (
    <div className="min-h-screen" style={{background:'var(--bg)',color:'var(--text)'}}>
      <Navbar />

      <section className="section">
        <div className="container" style={{maxWidth:900}}>
          <h1 className="font-display" style={{fontSize:'40px',marginBottom:32}}>
            Условия продажи
          </h1>

          <div className="tile doc-content" style={{padding:40}}>
            <div style={{display:'grid',gap:32}}>
              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>1. Продавец</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p><strong>Продавец:</strong> ИП Гладких Виталий Олегович</p>
                  <p>ИНН: 381705889083, ОГРНИП: 325774600805724</p>
                  <p>Адрес: г. Москва, ул. Маршала Бирюзова, д. 9, кв. 7</p>
                  <p>Email: shop@getnwin.ru | Тел: +7 (993) 898-13-01</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>2. Предмет договора</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Продавец реализует товары (брелоки, аксессуары), представленные в каталоге интернет-магазина getnwin.ru.</p>
                  <p>Покупатель оформляет заказ через сайт, оплачивает его и получает товар по указанному адресу доставки.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>3. Цены и оплата</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Цены на товары указаны в рублях РФ и включают НДС (при применимости).</p>
                  <p><strong>Способы оплаты:</strong></p>
                  <ul style={{paddingLeft:24}}>
                    <li>Банковская карта (Visa, Mastercard, МИР);</li>
                    <li>Система быстрых платежей (СБП).</li>
                  </ul>
                  <p>Оплата списывается в момент подтверждения заказа.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>4. Доставка</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Доставка осуществляется службой СДЭК по всей территории России.</p>
                  <p><strong>Сроки доставки:</strong> 2-7 рабочих дней в зависимости от региона.</p>
                  <p>Стоимость доставки рассчитывается при оформлении заказа.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>5. Возврат и обмен</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Возврат товара надлежащего качества возможен в течение 14 дней с момента получения при сохранении товарного вида и потребительских свойств.</p>
                  <p>Возврат товара ненадлежащего качества — в соответствии с Законом о защите прав потребителей.</p>
                  <p>Подробнее: <Link href="/legal/returns" style={{color:'var(--accent)'}}>Возврат товара</Link></p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>6. Электронный чек</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>После оплаты вы получите электронный чек на указанный email или телефон в соответствии с требованиями 54-ФЗ.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>7. Персональные данные</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Оформляя заказ, вы соглашаетесь на обработку персональных данных в соответствии с <Link href="/docs/privacy" style={{color:'var(--accent)'}}>Политикой конфиденциальности</Link>.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>8. Связанные документы</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <ul style={{paddingLeft:24}}>
                    <li><Link href="/docs/offer" style={{color:'var(--accent)'}}>Публичная оферта</Link></li>
                    <li><Link href="/docs/privacy" style={{color:'var(--accent)'}}>Политика конфиденциальности</Link></li>
                    <li><Link href="/docs/delivery" style={{color:'var(--accent)'}}>Условия доставки</Link></li>
                    <li><Link href="/legal/returns" style={{color:'var(--accent)'}}>Возврат товара</Link></li>
                  </ul>
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
