import Link from 'next/link'
import Navbar from '@/app/_components/Navbar'
import BigFooter from '@/app/_components/BigFooter'

export default function UserAgreement() {
  return (
    <div className="min-h-screen" style={{background:'var(--bg)',color:'var(--text)'}}>
      <Navbar />

      <section className="section">
        <div className="container" style={{maxWidth:900}}>
          <h1 className="font-display" style={{fontSize:'40px',marginBottom:32}}>
            Пользовательское соглашение
          </h1>

          <div className="tile doc-content" style={{padding:40}}>
            <nav style={{marginBottom:32,padding:20,background:'var(--surface)',borderRadius:16,color:'#fff'}}>
              <h3 style={{fontSize:'16px',fontWeight:700,marginBottom:12}}>Содержание:</h3>
              <ul style={{listStyle:'none',padding:0,margin:0,display:'grid',gap:8}}>
                <li><a href="#terms" style={{color:'var(--accent)'}}>1. Термины и определения</a></li>
                <li><a href="#subject" style={{color:'var(--accent)'}}>2. Предмет соглашения</a></li>
                <li><a href="#roles" style={{color:'var(--accent)'}}>3. Роли сторон</a></li>
                <li><a href="#registration" style={{color:'var(--accent)'}}>4. Регистрация и аккаунт</a></li>
                <li><a href="#rights" style={{color:'var(--accent)'}}>5. Права и обязанности</a></li>
                <li><a href="#ip" style={{color:'var(--accent)'}}>6. Интеллектуальная собственность</a></li>
                <li><a href="#liability" style={{color:'var(--accent)'}}>7. Ответственность</a></li>
                <li><a href="#personal-data" style={{color:'var(--accent)'}}>8. Персональные данные</a></li>
                <li><a href="#changes" style={{color:'var(--accent)'}}>9. Изменения</a></li>
                <li><a href="#contacts" style={{color:'var(--accent)'}}>10. Контакты</a></li>
              </ul>
            </nav>

            <div style={{display:'grid',gap:32}}>
              <section id="terms">
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>1. Термины и определения</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p><strong>Оператор площадки</strong> — ИП Заkriev Maksharip Ziavdinovich, ИНН 1234567890, ОГРНИП 1234567890123.</p>
                  <p><strong>Организатор/Продавец</strong> — [ОРГАНИЗАТОР_НАЗВАНИЕ], ИНН [ОРГАНИЗАТОР_ИНН], ОГРН [ОРГАНИЗАТОР_ОГРН].</p>
                  <p><strong>Сайт</strong> — интернет-ресурс, расположенный по адресу justbusiness.lol.</p>
                  <p><strong>Пользователь</strong> — физическое лицо, использующее Сайт.</p>
                  <p><strong>Агент</strong> — Оператор площадки, действующий от имени и по поручению Организатора (Принципала) в части приёма платежей, фискализации с признаком агента и технического обеспечения акции.</p>
                </div>
              </section>

              <section id="subject">
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>2. Предмет соглашения</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Настоящее Соглашение регулирует отношения между Оператором площадки и Пользователем при использовании функционала Сайта, включая:</p>
                  <ul style={{paddingLeft:24}}>
                    <li>Просмотр каталога товаров;</li>
                    <li>Оформление заказов;</li>
                    <li>Участие в стимулирующей акции;</li>
                    <li>Получение информации об условиях акции.</li>
                  </ul>
                </div>
              </section>

              <section id="roles">
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>3. Роли сторон</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p><strong>Важно:</strong> Оператор площадки выполняет роль технического оператора и Агента, действующего от имени Принципала (Организатора/Продавца).</p>
                  <p>Оператор площадки:</p>
                  <ul style={{paddingLeft:24}}>
                    <li>НЕ является организатором стимулирующей акции;</li>
                    <li>НЕ определяет победителей розыгрыша;</li>
                    <li>Обеспечивает техническую работу Сайта;</li>
                    <li>Принимает платежи от имени Организатора как Агент;</li>
                    <li>Формирует чеки с признаком агента согласно 54-ФЗ.</li>
                  </ul>
                  <p>Организатор/Продавец:</p>
                  <ul style={{paddingLeft:24}}>
                    <li>Является продавцом товаров;</li>
                    <li>Организует и проводит стимулирующую акцию;</li>
                    <li>Определяет победителей;</li>
                    <li>Вручает призы;</li>
                    <li>Уплачивает НДФЛ 35% с призов.</li>
                  </ul>
                </div>
              </section>

              <section id="registration">
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>4. Регистрация и аккаунт</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Для участия в акции и оформления заказов Пользователь должен:</p>
                  <ul style={{paddingLeft:24}}>
                    <li>Быть совершеннолетним (18+);</li>
                    <li>Предоставить достоверные контактные данные;</li>
                    <li>Согласиться с условиями настоящего Соглашения, <Link href="/docs/offer" style={{color:'var(--accent)'}}>Публичной оферты</Link> и <Link href="/docs/privacy" style={{color:'var(--accent)'}}>Политики конфиденциальности</Link>.</li>
                  </ul>
                </div>
              </section>

              <section id="rights">
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>5. Права и обязанности пользователя</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p><strong>Пользователь обязуется:</strong></p>
                  <ul style={{paddingLeft:24}}>
                    <li>Использовать Сайт в соответствии с законодательством РФ;</li>
                    <li>Не нарушать работу Сайта;</li>
                    <li>Не использовать автоматизированные средства для создания мультиаккаунтов;</li>
                    <li>Предоставлять достоверную информацию.</li>
                  </ul>
                  <p><strong>Пользователь имеет право:</strong></p>
                  <ul style={{paddingLeft:24}}>
                    <li>Получать информацию о товарах и условиях акции;</li>
                    <li>Оформлять заказы;</li>
                    <li>Участвовать в стимулирующей акции при выполнении условий;</li>
                    <li>Обращаться в службу поддержки.</li>
                  </ul>
                </div>
              </section>

              <section id="ip">
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>6. Интеллектуальная собственность</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Все материалы Сайта (тексты, изображения, дизайн) защищены авторским правом и принадлежат Оператору или используются на законных основаниях.</p>
                  <p>Запрещается копирование, распространение или иное использование материалов Сайта без письменного разрешения правообладателя.</p>
                </div>
              </section>

              <section id="liability">
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>7. Ответственность</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p><strong>Ответственность за товары и призы</strong> несёт Организатор/Продавец.</p>
                  <p><strong>Ответственность за доступность Сайта</strong> несёт Оператор в пределах технических возможностей.</p>
                  <p>Оператор не несёт ответственности за:</p>
                  <ul style={{paddingLeft:24}}>
                    <li>Качество товаров — претензии направляются Организатору;</li>
                    <li>Определение победителей и вручение призов — организуется Организатором;</li>
                    <li>Форс-мажорные обстоятельства, препятствующие работе Сайта.</li>
                  </ul>
                </div>
              </section>

              <section id="personal-data">
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>8. Персональные данные</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Обработка персональных данных Пользователя осуществляется в соответствии с <Link href="/docs/privacy" style={{color:'var(--accent)'}}>Политикой конфиденциальности</Link> и требованиями 152-ФЗ.</p>
                  <p>Используя Сайт, Пользователь даёт согласие на обработку своих персональных данных для целей, указанных в Политике конфиденциальности.</p>
                </div>
              </section>

              <section id="changes">
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>9. Изменения соглашения</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Оператор вправе вносить изменения в настоящее Соглашение. Новая редакция вступает в силу с момента её размещения на Сайте.</p>
                  <p>Продолжение использования Сайта после внесения изменений означает согласие Пользователя с новой редакцией.</p>
                </div>
              </section>

              <section id="contacts">
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>10. Контакты</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p><strong>Оператор площадки (Агент):</strong></p>
                  <p>ИП Zakriev Maksharip Ziavdinovich<br/>
                  ИНН: 1234567890<br/>
                  ОГРНИП: 1234567890123<br/>
                  Email: hello@sovani.ru<br/>
                  Тел: +7 (999) 123-45-67</p>

                  <p><strong>Организатор акции / Продавец:</strong></p>
                  <p>[ОРГАНИЗАТОР_НАЗВАНИЕ]<br/>
                  ИНН: [ОРГАНИЗАТОР_ИНН]<br/>
                  ОГРН: [ОРГАНИЗАТОР_ОГРН]<br/>
                  Адрес: [ОРГАНИЗАТОР_АДРЕС]<br/>
                  Email: [ОРГАНИЗАТОР_EMAIL]<br/>
                  Тел: [ОРГАНИЗАТОР_ТЕЛ]</p>

                  <p style={{marginTop:20}}>Подсудность: Российская Федерация, по месту нахождения Оператора или Организатора.</p>
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
