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
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>1. Общие положения</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей интернет-магазина getnwin.ru.</p>
                  <p><strong>Продавец (оператор персональных данных):</strong> ИП Гладких Виталий Олегович</p>
                  <p>ИНН: 381705889083, ОГРНИП: 325774600805724<br/>
                  Адрес: г. Москва, ул. Маршала Бирюзова, д. 9, кв. 7<br/>
                  Email: shop@getnwin.ru | Тел: +7 (993) 898-13-01</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>2. Цели обработки персональных данных</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Продавец обрабатывает персональные данные для следующих целей:</p>
                  <ul style={{paddingLeft:24}}>
                    <li>Оформление и обработка заказов;</li>
                    <li>Доставка товаров по указанному адресу;</li>
                    <li>Формирование и отправка электронных чеков (54-ФЗ);</li>
                    <li>Ведение бухгалтерского и налогового учёта;</li>
                    <li>Обработка обращений и поддержка клиентов;</li>
                    <li>Улучшение качества сервиса и аналитика.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>3. Состав обрабатываемых персональных данных</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Продавец может обрабатывать следующие категории персональных данных:</p>
                  <ul style={{paddingLeft:24}}>
                    <li>Фамилия, имя, отчество;</li>
                    <li>Контактные данные (телефон, email);</li>
                    <li>Адрес доставки;</li>
                    <li>IP-адрес, тип устройства, браузер.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>4. Правовое основание обработки</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Обработка персональных данных осуществляется на основании:</p>
                  <ul style={{paddingLeft:24}}>
                    <li>Федерального закона № 152-ФЗ «О персональных данных»;</li>
                    <li>Договора (публичной оферты) между Продавцом и Покупателем;</li>
                    <li>Согласия Пользователя на обработку персональных данных.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>5. Передача третьим лицам</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Персональные данные могут быть переданы следующим категориям третьих лиц:</p>
                  <ul style={{paddingLeft:24}}>
                    <li>Платёжные системы и банки-эквайеры — для обработки платежей;</li>
                    <li>Оператор фискальных данных (ОФД) — для формирования чеков;</li>
                    <li>Курьерские службы (СДЭК) — для доставки товаров.</li>
                  </ul>
                  <p>Продавец не передаёт персональные данные третьим лицам для маркетинговых целей без согласия Пользователя.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>6. Сроки хранения</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Персональные данные хранятся в течение срока, необходимого для достижения целей обработки:</p>
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
                  <p>Продавец принимает необходимые технические и организационные меры для защиты персональных данных:</p>
                  <ul style={{paddingLeft:24}}>
                    <li>Шифрование данных при передаче (SSL/TLS);</li>
                    <li>Ограничение доступа к персональным данным;</li>
                    <li>Хранение данных на защищённых серверах на территории РФ.</li>
                  </ul>
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
                    <li>Обжаловать действия Продавца в Роскомнадзоре или суде.</li>
                  </ul>
                  <p>Для реализации своих прав обращайтесь по email: shop@getnwin.ru</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>9. Текст согласия на обработку ПДн</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <div style={{padding:20,background:'var(--surface)',borderRadius:16,borderLeft:'4px solid var(--accent)'}}>
                    <p style={{fontStyle:'italic'}}>
                      «Я даю согласие ИП Гладких Виталий Олегович (ИНН 381705889083) на обработку моих персональных данных для оформления и доставки заказа, формирования чека. Политика конфиденциальности: getnwin.ru/docs/privacy»
                    </p>
                  </div>
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
