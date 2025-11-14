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
                Оператор площадки (Технический оператор и Агент)
              </h2>
              <div className="lead" style={{fontSize:'16px',lineHeight:1.8,display:'grid',gap:8}}>
                <p><strong>Индивидуальный предприниматель:</strong> Zakriev Maksharip Ziavdinovich</p>
                <p><strong>ИНН:</strong> 1234567890</p>
                <p><strong>ОГРНИП:</strong> 1234567890123</p>
                <p><strong>Email:</strong> <a href="mailto:hello@sovani.ru" style={{color:'var(--accent)'}}>hello@sovani.ru</a></p>
                <p><strong>Телефон:</strong> <a href="tel:+79991234567" style={{color:'var(--accent)'}}>+7 (999) 123-45-67</a></p>
              </div>

              <div style={{marginTop:24,padding:20,background:'var(--surface)',borderRadius:16,borderLeft:'4px solid var(--accent)'}}>
                <p className="lead" style={{fontSize:'14px',lineHeight:1.6,opacity:0.9,margin:0}}>
                  <strong>Роль Оператора:</strong> Оператор площадки обеспечивает техническую работу сайта justbusiness.lol и выполняет функции Агента по приёму платежей от имени и по поручению Продавца (Принципала). Оператор НЕ является организатором стимулирующей акции, НЕ определяет победителей и НЕ вручает призы.
                </p>
              </div>
            </div>

            <div className="tile" style={{padding:40}}>
              <h2 className="font-display" style={{fontSize:'28px',marginBottom:24}}>
                Организатор акции и Продавец
              </h2>
              <div className="lead" style={{fontSize:'16px',lineHeight:1.8,display:'grid',gap:8}}>
                <p><strong>Наименование:</strong> [ОРГАНИЗАТОР_НАЗВАНИЕ]</p>
                <p><strong>ИНН:</strong> [ОРГАНИЗАТОР_ИНН]</p>
                <p><strong>ОГРН:</strong> [ОРГАНИЗАТОР_ОГРН]</p>
                <p><strong>Адрес:</strong> [ОРГАНИЗАТОР_АДРЕС]</p>
                <p><strong>Email:</strong> [ОРГАНИЗАТОР_EMAIL]</p>
                <p><strong>Телефон:</strong> [ОРГАНИЗАТОР_ТЕЛ]</p>
              </div>

              <div style={{marginTop:24,padding:20,background:'var(--surface)',borderRadius:16,borderLeft:'4px solid var(--accent)'}}>
                <p className="lead" style={{fontSize:'14px',lineHeight:1.6,opacity:0.9,margin:0}}>
                  <strong>Роль Организатора:</strong> Организатор является продавцом товаров, организатором стимулирующей акции «5 недель — 5 смартфонов», определяет победителей, вручает призы и уплачивает НДФЛ 35% с призов в соответствии с п. 2 ст. 224 НК РФ.
                </p>
              </div>
            </div>

            <div className="tile" style={{padding:40}}>
              <h2 className="font-display" style={{fontSize:'28px',marginBottom:24}}>
                Важные дисклеймеры
              </h2>

              <div style={{display:'grid',gap:24}}>
                <section>
                  <h3 className="font-display" style={{fontSize:'20px',marginBottom:12}}>
                    Разделение ответственности
                  </h3>
                  <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                    <p>
                      <strong>Оператор площадки (ИП Zakriev Maksharip Ziavdinovich)</strong> выполняет исключительно технические функции:
                    </p>
                    <ul style={{paddingLeft:24}}>
                      <li>Обеспечивает работу сайта justbusiness.lol;</li>
                      <li>Принимает платежи от имени Продавца как Агент;</li>
                      <li>Формирует чеки с признаком агента согласно 54-ФЗ;</li>
                      <li>Обеспечивает техническую поддержку.</li>
                    </ul>

                    <p style={{marginTop:16}}>
                      <strong>Организатор акции</strong> несёт полную ответственность за:
                    </p>
                    <ul style={{paddingLeft:24}}>
                      <li>Качество и доставку товаров;</li>
                      <li>Организацию и проведение стимулирующей акции;</li>
                      <li>Определение победителей в прямом эфире;</li>
                      <li>Вручение призов победителям;</li>
                      <li>Уплату НДФЛ 35% с призов;</li>
                      <li>Размещение рекламы в социальных сетях.</li>
                    </ul>

                    <p style={{marginTop:16}}>
                      <strong>Претензии по качеству товаров, срокам доставки, проведению акции и вручению призов</strong> направляются Организатору по контактам, указанным выше.
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="font-display" style={{fontSize:'20px',marginBottom:12}}>
                    Торговые марки
                  </h3>
                  <div className="lead" style={{fontSize:'16px',lineHeight:1.6}}>
                    <p>
                      Apple, iPhone, iPhone 17 Pro Max и другие упомянутые на сайте торговые марки не являются организаторами, спонсорами или партнёрами стимулирующей акции. Все права на торговые марки принадлежат их владельцам.
                    </p>
                    <p style={{marginTop:12}}>
                      Использование названий брендов и моделей товаров осуществляется исключительно в информационных целях для описания призов акции.
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="font-display" style={{fontSize:'20px',marginBottom:12}}>
                    Instagram и Meta Platforms Inc.
                  </h3>
                  <div className="lead" style={{fontSize:'16px',lineHeight:1.6}}>
                    <p>
                      <strong>Instagram*</strong> принадлежит компании Meta Platforms Inc., которая признана экстремистской организацией и запрещена на территории Российской Федерации.
                    </p>
                    <p style={{marginTop:12}}>
                      Деятельность Meta Platforms Inc. на территории РФ запрещена решением суда.
                    </p>
                    <p style={{marginTop:12}}>
                      <strong>Размещение материалов в Instagram*</strong> осуществляется исключительно Организатором акции. Оператор площадки (ИП Zakriev Maksharip Ziavdinovich) не размещает рекламу и контент в Instagram*.
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="font-display" style={{fontSize:'20px',marginBottom:12}}>
                    Фискализация и агентский договор
                  </h3>
                  <div className="lead" style={{fontSize:'16px',lineHeight:1.6}}>
                    <p>
                      В соответствии с 54-ФЗ «О применении контрольно-кассовой техники», Оператор площадки формирует фискальные чеки с <strong>признаком агента</strong>.
                    </p>
                    <p style={{marginTop:12}}>
                      В чеке указываются:
                    </p>
                    <ul style={{paddingLeft:24}}>
                      <li>Реквизиты Продавца (Организатора) как поставщика товара;</li>
                      <li>Реквизиты Агента (Оператора площадки) как принимающей платёж стороны;</li>
                      <li>Признак агента согласно требованиям законодательства.</li>
                    </ul>
                    <p style={{marginTop:12}}>
                      Оператор действует на основании агентского договора с Организатором (Принципалом).
                    </p>
                  </div>
                </section>
              </div>
            </div>

            <div className="tile" style={{padding:40}}>
              <h2 className="font-display" style={{fontSize:'28px',marginBottom:24}}>
                Документы и правила
              </h2>
              <div className="lead" style={{fontSize:'16px',lineHeight:1.6}}>
                <p>Для получения полной информации об условиях использования сайта, правилах акции и обработке персональных данных ознакомьтесь со следующими документами:</p>
                <ul style={{paddingLeft:24,marginTop:16,display:'grid',gap:8}}>
                  <li>
                    <Link href="/docs/user-agreement" style={{color:'var(--accent)'}}>Пользовательское соглашение</Link> — условия использования сайта
                  </li>
                  <li>
                    <Link href="/docs/offer" style={{color:'var(--accent)'}}>Публичная оферта</Link> — условия покупки товаров
                  </li>
                  <li>
                    <Link href="/docs/rules" style={{color:'var(--accent)'}}>Правила акции</Link> — полные правила стимулирующей акции
                  </li>
                  <li>
                    <Link href="/docs/privacy" style={{color:'var(--accent)'}}>Политика конфиденциальности</Link> — обработка персональных данных
                  </li>
                  <li>
                    <Link href="/docs/cookies" style={{color:'var(--accent)'}}>Политика cookies</Link> — использование файлов cookie
                  </li>
                  <li>
                    <Link href="/winners" style={{color:'var(--accent)'}}>Победители</Link> — результаты розыгрышей
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
                  Все споры и разногласия, возникающие из использования сайта или участия в акции, подлежат разрешению в соответствии с законодательством Российской Федерации.
                </p>
                <p style={{marginTop:12}}>
                  Подсудность: по месту нахождения Оператора или Организатора, в зависимости от характера спора.
                </p>
              </div>
            </div>
          </div>

          <div style={{marginTop:40,padding:20,background:'var(--surface)',borderRadius:16,borderLeft:'4px solid var(--accent)'}}>
            <p className="lead" style={{fontSize:'14px',opacity:0.9}}>
              Дата последнего обновления: 14 ноября 2025 г.
            </p>
          </div>
        </div>
      </section>

      <BigFooter />
    </div>
  )
}
