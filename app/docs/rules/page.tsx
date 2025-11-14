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
            Правила стимулирующей акции «5 недель — 5 смартфонов»
          </h1>

          <div className="tile" style={{padding:40}}>
            <div style={{display:'grid',gap:32}}>
              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>1. Организатор и технический оператор</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p><strong>Организатор акции:</strong> [ОРГАНИЗАТОР_НАЗВАНИЕ], ИНН [ОРГАНИЗАТОР_ИНН], ОГРН [ОРГАНИЗАТОР_ОГРН].</p>
                  <p><strong>Технический оператор (Агент):</strong> ИП Zakriev Maksharip Ziavdinovich, ИНН 1234567890, ОГРНИП 1234567890123.</p>
                  <p>Технический оператор обеспечивает работу сайта, приём платежей от имени Организатора и техническую поддержку акции. Организатор определяет победителей и вручает призы.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>2. Период проведения акции</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p><strong>Период акции:</strong> 1 декабря 2025 г. — 5 января 2026 г. (5 недель).</p>
                  <p><strong>Розыгрыши:</strong> проводятся еженедельно в прямом эфире на платформах YouTube, Telegram, VK.</p>
                  <p><strong>График розыгрышей:</strong></p>
                  <ul style={{paddingLeft:24}}>
                    <li>Неделя 1: [ДАТА_НЕДЕЛИ_1]</li>
                    <li>Неделя 2: [ДАТА_НЕДЕЛИ_2]</li>
                    <li>Неделя 3: [ДАТА_НЕДЕЛИ_3]</li>
                    <li>Неделя 4: [ДАТА_НЕДЕЛИ_4]</li>
                    <li>Неделя 5: [ДАТА_НЕДЕЛИ_5]</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>3. Условия участия</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p><strong>Кто может участвовать:</strong> совершеннолетние граждане РФ.</p>
                  <p><strong>Как участвовать:</strong></p>
                  <ul style={{paddingLeft:24}}>
                    <li>Приобрести брелок стоимостью 1 999 ₽ на сайте justbusiness.lol;</li>
                    <li>1 брелок = 1 шанс участия в еженедельном розыгрыше;</li>
                    <li>Шанс активируется после статуса заказа «оплачен»;</li>
                    <li>Участник может приобрести неограниченное количество брелоков для увеличения шансов.</li>
                  </ul>
                  <p><strong>Важно:</strong> Шансы действуют только на текущую неделю. Если участник не выиграл, шансы переносятся на следующую неделю до окончания акции.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>4. Реферальная программа</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p><strong>Условия:</strong> +1 шанс пригласившему и приглашённому после <strong>первой оплаченной покупки брелока</strong> приглашённым.</p>
                  <p><strong>Как работает:</strong></p>
                  <ul style={{paddingLeft:24}}>
                    <li>Участник получает реферальную ссылку в личном кабинете;</li>
                    <li>Делится ссылкой с друзьями;</li>
                    <li>Когда друг регистрируется по ссылке и оплачивает первый заказ брелока — оба получают +1 шанс;</li>
                    <li>Бонус начисляется только за первую покупку приглашённого.</li>
                  </ul>
                  <p><strong>Антифрод:</strong></p>
                  <ul style={{paddingLeft:24}}>
                    <li>Запрещён самореферал (регистрация по своей ссылке);</li>
                    <li>Запрещены мультиаккаунты;</li>
                    <li>Верификация по телефону, платёжным данным, адресу доставки, устройству;</li>
                    <li>Организатор вправе аннулировать бонусы при выявлении нарушений.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>5. Определение победителей</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Победители определяются случайным образом с использованием генератора случайных чисел в прямом эфире.</p>
                  <p><strong>Процедура:</strong></p>
                  <ul style={{paddingLeft:24}}>
                    <li>Формируется список всех участников с их шансами;</li>
                    <li>Генератор случайных чисел выбирает победителя;</li>
                    <li>Результат фиксируется в протоколе;</li>
                    <li>Запись эфира публикуется на странице <Link href="/winners" style={{color:'var(--accent)'}}>/winners</Link>;</li>
                    <li>Победитель уведомляется по email и телефону в течение 24 часов.</li>
                  </ul>
                  <p><strong>Публикация результатов:</strong> обезличенные данные (Ф.И.О. частично, № заказа маскирован) публикуются на сайте.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>6. Призы</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p><strong>Главные призы:</strong> 5 смартфонов iPhone 17 Pro Max (1 приз в неделю).</p>
                  <p><strong>Вручение:</strong></p>
                  <ul style={{paddingLeft:24}}>
                    <li>Организатор связывается с победителем в течение 24 часов;</li>
                    <li>Победитель предоставляет ФИО, паспортные данные, ИНН для уплаты НДФЛ;</li>
                    <li>Приз доставляется бесплатно в течение 14 дней;</li>
                    <li>Замена приза на денежный эквивалент не предусмотрена.</li>
                  </ul>
                  <p><strong>Ограничения:</strong> один участник может выиграть только один раз за весь период акции.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>7. Налоги</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Стоимость приза облагается НДФЛ по ставке 35% согласно п. 2 ст. 224 НК РФ.</p>
                  <p><strong>Кто платит:</strong> Организатор акции удерживает и уплачивает НДФЛ.</p>
                  <p><strong>Обязанности победителя:</strong></p>
                  <ul style={{paddingLeft:24}}>
                    <li>Предоставить ФИО, ИНН, паспортные данные;</li>
                    <li>Подписать акт приёма-передачи приза;</li>
                    <li>Декларировать доход по форме 3-НДФЛ (если требуется).</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>8. Возвраты и аннулирование шансов</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p><strong>При возврате брелока:</strong></p>
                  <ul style={{paddingLeft:24}}>
                    <li>Аннулируются шансы участия по соответствующему заказу;</li>
                    <li>Снимается реферальный бонус (если был начислен);</li>
                    <li>Если возврат происходит после выигрыша — приз аннулируется, разыгрывается повторно.</li>
                  </ul>
                  <p>Условия возврата указаны в <Link href="/docs/offer" style={{color:'var(--accent)'}}>Публичной оферте</Link>.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>9. Персональные данные</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Участвуя в акции, Участник соглашается на обработку персональных данных в соответствии с <Link href="/docs/privacy" style={{color:'var(--accent)'}}>Политикой конфиденциальности</Link>.</p>
                  <p>Данные обрабатываются для формирования списков участников, определения победителей, публикации обезличенных результатов и вручения призов.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>10. Дисклеймеры</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p><strong>Бренды:</strong> Apple, iPhone и другие упомянутые торговые марки не являются организаторами или спонсорами акции. Все права на торговые марки принадлежат их владельцам.</p>
                  <p><strong>Instagram:</strong> Размещение материалов в Instagram* осуществляется Организатором. Технический оператор рекламу не размещает.</p>
                  <p><strong>Meta Platforms Inc.:</strong> Instagram принадлежит Meta Platforms Inc., признанной экстремистской организацией в Российской Федерации. Деятельность Meta Platforms Inc. запрещена на территории РФ.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>11. Контакты</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p><strong>Организатор акции:</strong></p>
                  <p>[ОРГАНИЗАТОР_НАЗВАНИЕ]<br/>
                  Email: [ОРГАНИЗАТОР_EMAIL]<br/>
                  Тел: [ОРГАНИЗАТОР_ТЕЛ]</p>

                  <p><strong>Технический оператор:</strong></p>
                  <p>ИП Zakriev Maksharip Ziavdinovich<br/>
                  Email: hello@sovani.ru<br/>
                  Тел: +7 (999) 123-45-67</p>
                </div>
              </section>

              <div style={{marginTop:40,padding:20,background:'var(--surface)',borderRadius:16,borderLeft:'4px solid var(--accent)'}}>
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
