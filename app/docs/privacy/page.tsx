import Link from 'next/link'
import Navbar from '@/app/_components/Navbar'
import BigFooter from '@/app/_components/BigFooter'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{background:'var(--bg)',color:'var(--text)'}}>
      <Navbar />

      <section className="section">
        <div className="container" style={{maxWidth:900}}>
          <h1 className="font-display" style={{fontSize:'40px',marginBottom:32}}>
            Политика конфиденциальности
          </h1>

          <div className="tile doc-content" style={{padding:40}}>
            <div style={{display:'grid',gap:32}}>
              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>1. Оператор персональных данных</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p><strong>Оператор:</strong> ИП Гладких Виталий Олегович</p>
                  <p>ИНН: 381705889083<br/>
                  ОГРНИП: 325774600805724<br/>
                  Адрес: г. Москва, ул. Маршала Бирюзова, д. 9, кв. 7<br/>
                  Email: shop@sovani.info<br/>
                  Тел: +7 (993) 898-13-01</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>2. Цели обработки персональных данных</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Оператор обрабатывает персональные данные для следующих целей:</p>
                  <ul style={{paddingLeft:24}}>
                    <li>Регистрация и авторизация на Сайте;</li>
                    <li>Оформление и обработка заказов;</li>
                    <li>Участие в стимулирующей акции;</li>
                    <li>Формирование списков участников розыгрыша;</li>
                    <li>Публикация обезличенных данных победителей;</li>
                    <li>Реферальная программа (начисление бонусов);</li>
                    <li>Отправка уведомлений (при согласии пользователя);</li>
                    <li>Улучшение качества сервиса и аналитика.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>3. Состав обрабатываемых персональных данных</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Оператор может обрабатывать следующие категории персональных данных:</p>
                  <ul style={{paddingLeft:24}}>
                    <li>Фамилия, имя, отчество;</li>
                    <li>Контактные данные (телефон, email);</li>
                    <li>Адрес доставки;</li>
                    <li>Платёжные данные (маскированные номера карт);</li>
                    <li>IP-адрес, тип устройства, браузер;</li>
                    <li>Реферальные метки и идентификаторы.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>4. Правовое основание обработки</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Обработка персональных данных осуществляется на основании:</p>
                  <ul style={{paddingLeft:24}}>
                    <li>Федерального закона №152-ФЗ «О персональных данных»;</li>
                    <li>Договора/оферты между Оператором и Пользователем;</li>
                    <li>Согласия Пользователя на обработку персональных данных.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>5. Передача третьим лицам</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Персональные данные могут быть переданы следующим категориям третьих лиц:</p>
                  <ul style={{paddingLeft:24}}>
                    <li>Платёжные системы и банки-эквайеры (для обработки платежей);</li>
                    <li>ОФД и ККТ (для фискализации чеков);</li>
                    <li>Курьерские службы (для доставки товаров);</li>
                    <li>Организатор акции ООО «ФЛАЙТ» (для вручения призов и уплаты НДФЛ).</li>
                  </ul>
                  <p>Оператор не передаёт персональные данные третьим лицам для маркетинговых целей без согласия Пользователя.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>6. Сроки хранения</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Персональные данные хранятся в течение срока, необходимого для достижения целей обработки, но не менее:</p>
                  <ul style={{paddingLeft:24}}>
                    <li>5 лет — для целей налогового и бухгалтерского учёта;</li>
                    <li>3 года — для разрешения споров и претензий.</li>
                  </ul>
                  <p>После истечения срока хранения данные удаляются или обезличиваются.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>7. Безопасность</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Оператор принимает необходимые технические и организационные меры для защиты персональных данных от неправомерного доступа, уничтожения, изменения, блокирования или иных неправомерных действий.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>8. Права субъекта персональных данных</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Пользователь имеет право:</p>
                  <ul style={{paddingLeft:24}}>
                    <li>Получать информацию об обработке своих персональных данных;</li>
                    <li>Требовать уточнения, блокирования или удаления неверных данных;</li>
                    <li>Отозвать согласие на обработку персональных данных;</li>
                    <li>Обжаловать действия Оператора в Роскомнадзоре или суде.</li>
                  </ul>
                  <p>Для реализации своих прав обращайтесь по email: shop@sovani.info</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>9. Текст согласия на обработку ПДн</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <div style={{padding:20,background:'var(--surface)',borderRadius:16,borderLeft:'4px solid var(--accent)',color:'#fff'}}>
                    <p style={{fontStyle:'italic'}}>
                      «Я даю согласие Оператору площадки (ИП Гладких Виталий Олегович, ИНН 381705889083) на обработку моих персональных данных для оформления заказа, участия в стимулирующей акции (включая формирование и публикацию списка победителей в обезличенном виде) и получения уведомлений. Политика конфиденциальности: <Link href="/docs/privacy" style={{color:'var(--accent)'}}>justbusiness.lol/docs/privacy</Link>.»
                    </p>
                  </div>
                  <p style={{marginTop:12,fontSize:'14px',opacity:0.8}}>
                    Этот текст используется в чекбоксе при оформлении заказа и подписке на уведомления.
                  </p>
                </div>
              </section>

              <div style={{marginTop:40,padding:20,background:'var(--surface)',borderRadius:16,borderLeft:'4px solid var(--accent)',color:'#fff'}}>
                <p className="lead" style={{fontSize:'14px',opacity:0.9}}>
                  Дата последнего обновления: 14 ноября 2025 г.
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
