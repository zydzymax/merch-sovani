import Link from 'next/link'
import Navbar from '@/app/_components/Navbar'
import BigFooter from '@/app/_components/BigFooter'

export default function UserAgreementPage() {
  return (
    <div className="min-h-screen" style={{background:'var(--bg)',color:'var(--text)'}}>
      <Navbar />

      <section className="section">
        <div className="container" style={{maxWidth:900}}>
          <h1 className="font-display" style={{fontSize:'40px',marginBottom:32}}>
            Пользовательское соглашение
          </h1>

          <div className="tile doc-content" style={{padding:40}}>
            <div style={{display:'grid',gap:32}}>
              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>1. Общие положения</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между ИП Гладких Виталий Олегович (далее — «Продавец») и пользователем интернет-магазина getnwin.ru (далее — «Сайт», «Пользователь»).</p>
                  <p>Использование Сайта означает полное и безоговорочное принятие условий настоящего Соглашения.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>2. Термины и определения</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p><strong>Сайт</strong> — интернет-магазин getnwin.ru, предоставляющий возможность просмотра и приобретения товаров.</p>
                  <p><strong>Пользователь</strong> — физическое лицо, использующее функционал Сайта.</p>
                  <p><strong>Продавец</strong> — ИП Гладких Виталий Олегович, ИНН 381705889083, ОГРНИП 325774600805724.</p>
                  <p><strong>Товар</strong> — продукция, представленная в каталоге Сайта.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>3. Предмет соглашения</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Настоящее Соглашение регулирует отношения между Продавцом и Пользователем при использовании функционала Сайта, включая:</p>
                  <ul style={{paddingLeft:24}}>
                    <li>Просмотр каталога товаров;</li>
                    <li>Оформление и оплата заказов;</li>
                    <li>Получение информации о товарах и услугах.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>4. Оформление заказов</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Для оформления заказов Пользователь должен:</p>
                  <ul style={{paddingLeft:24}}>
                    <li>Быть совершеннолетним (18+);</li>
                    <li>Предоставить достоверные контактные данные;</li>
                    <li>Согласиться с условиями настоящего Соглашения, <Link href="/docs/offer" style={{color:'var(--accent)'}}>Публичной оферты</Link> и <Link href="/docs/privacy" style={{color:'var(--accent)'}}>Политики конфиденциальности</Link>.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>5. Права и обязанности сторон</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p><strong>Продавец обязуется:</strong></p>
                  <ul style={{paddingLeft:24}}>
                    <li>Обеспечивать техническую работу Сайта;</li>
                    <li>Предоставлять актуальную информацию о товарах;</li>
                    <li>Исполнять заказы в соответствии с условиями <Link href="/docs/offer" style={{color:'var(--accent)'}}>Публичной оферты</Link>;</li>
                    <li>Защищать персональные данные Пользователей.</li>
                  </ul>
                  <p><strong>Пользователь обязуется:</strong></p>
                  <ul style={{paddingLeft:24}}>
                    <li>Предоставлять достоверную информацию при оформлении заказа;</li>
                    <li>Не использовать Сайт в противоправных целях;</li>
                    <li>Соблюдать условия настоящего Соглашения.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>6. Права Пользователя</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Пользователь имеет право:</p>
                  <ul style={{paddingLeft:24}}>
                    <li>Свободно просматривать каталог товаров;</li>
                    <li>Оформлять заказы на приобретение товаров;</li>
                    <li>Получать информацию о статусе заказа;</li>
                    <li>Обращаться в службу поддержки;</li>
                    <li>Реализовывать права потребителя согласно законодательству РФ.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>7. Интеллектуальная собственность</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Все материалы Сайта (тексты, изображения, дизайн) защищены авторским правом и принадлежат Продавцу или используются на законных основаниях.</p>
                  <p>Копирование материалов Сайта без письменного разрешения запрещено.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>8. Ограничение ответственности</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Продавец не несёт ответственности за:</p>
                  <ul style={{paddingLeft:24}}>
                    <li>Временную недоступность Сайта по техническим причинам;</li>
                    <li>Действия третьих лиц;</li>
                    <li>Ненадлежащее исполнение обязательств вследствие обстоятельств непреодолимой силы.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>9. Персональные данные</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Обработка персональных данных осуществляется в соответствии с <Link href="/docs/privacy" style={{color:'var(--accent)'}}>Политикой конфиденциальности</Link>.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>10. Изменение соглашения</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Продавец вправе вносить изменения в настоящее Соглашение. Новая редакция вступает в силу с момента её размещения на Сайте.</p>
                  <p>Продолжение использования Сайта после внесения изменений означает согласие Пользователя с новой редакцией.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>11. Контакты</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p><strong>Продавец:</strong> ИП Гладких Виталий Олегович</p>
                  <p>ИНН: 381705889083, ОГРНИП: 325774600805724<br/>
                  Адрес: г. Москва, ул. Маршала Бирюзова, д. 9, кв. 7<br/>
                  Email: shop@getnwin.ru | Тел: +7 (993) 898-13-01</p>
                  <p style={{marginTop:12}}>Подсудность: Российская Федерация, по месту нахождения Продавца (г. Москва).</p>
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
