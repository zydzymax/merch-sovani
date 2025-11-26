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
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>1. Стороны и предмет договора</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p><strong>Продавец:</strong> [ОРГАНИЗАТОР_НАЗВАНИЕ], ИНН [ОРГАНИЗАТОР_ИНН], ОГРН [ОРГАНИЗАТОР_ОГРН], адрес: [ОРГАНИЗАТОР_АДРЕС].</p>
                  <p><strong>Агент Продавца:</strong> ИП Zakriev Maksharip Ziavdinovich, ИНН 1234567890, ОГРНИП 1234567890123.</p>
                  <p>Агент действует от имени и по поручению Продавца (Принципала) в части приёма платежей, фискализации чеков с признаком агента согласно 54-ФЗ и технического обеспечения продаж через сайт justbusiness.lol.</p>
                  <p><strong>Покупатель:</strong> физическое лицо, совершающее заказ товаров на Сайте.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>2. Товары</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Продавец реализует следующие категории товаров:</p>
                  <ul style={{paddingLeft:24}}>
                    <li>Одежда и аксессуары;</li>
                    <li>Брелоки (участие в стимулирующей акции);</li>
                    <li>Прочие товары согласно каталогу на Сайте.</li>
                  </ul>
                  <p><strong>Особенности брелока:</strong> Покупка брелока = 1 шанс участия в розыгрыше iPhone 17 Pro Max. Только брелок участвует в акции. Подробнее в <Link href="/docs/rules" style={{color:'var(--accent)'}}>Правилах акции</Link>.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>3. Оплата и фискализация</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Оплата производится онлайн через эквайринг. Агент принимает платёж от имени Продавца.</p>
                  <p><strong>Чек 54-ФЗ:</strong> формируется с признаком «агент». В чеке указываются реквизиты Продавца как поставщика товара.</p>
                  <p>Цены указаны в рублях РФ с учётом НДС (если применимо).</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>4. Доставка</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Доставка товаров осуществляется курьерской службой по адресу, указанному Покупателем при оформлении заказа.</p>
                  <p>Стоимость доставки рассчитывается индивидуально и сообщается при оформлении заказа.</p>
                  <p>Сроки доставки: от 3 до 14 рабочих дней в зависимости от региона.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>5. Возврат товара</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p><strong>Возврат товара надлежащего качества:</strong></p>
                  <ul style={{paddingLeft:24}}>
                    <li>Срок: 7 дней с момента получения;</li>
                    <li>Условие: сохранён товарный вид, упаковка, бирки;</li>
                    <li>Стоимость доставки при возврате не возвращается;</li>
                    <li>Обратная пересылка — за счёт Покупателя.</li>
                  </ul>
                  <p><strong>Возврат товара ненадлежащего качества:</strong> в соответствии с Законом «О защите прав потребителей».</p>
                  <p><strong>Важно:</strong> При возврате брелока аннулируются шансы участия в розыгрыше по соответствующему заказу. Реферальный бонус (если был начислен) также снимается.</p>
                  <p>Срок возврата денежных средств: до 10 рабочих дней с момента получения Продавцом возвращённого товара.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>6. Права и обязанности сторон</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p><strong>Продавец обязуется:</strong></p>
                  <ul style={{paddingLeft:24}}>
                    <li>Предоставить товар надлежащего качества;</li>
                    <li>Обеспечить доставку в указанные сроки;</li>
                    <li>Принять возврат товара при соблюдении условий;</li>
                    <li>Организовать и провести стимулирующую акцию (для брелоков).</li>
                  </ul>
                  <p><strong>Покупатель обязуется:</strong></p>
                  <ul style={{paddingLeft:24}}>
                    <li>Оплатить заказ в полном объёме;</li>
                    <li>Предоставить достоверные контактные данные и адрес доставки;</li>
                    <li>Принять товар и проверить его на соответствие.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>7. Ответственность</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>За качество товаров, сроки доставки и организацию акции отвечает <strong>Продавец</strong>.</p>
                  <p>Агент не несёт ответственности за качество товаров и условия акции. Агент обеспечивает только приём платежей и техническую работу Сайта.</p>
                  <p>Претензии по качеству товаров направляются Продавцу по контактам, указанным в разделе «Контакты».</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>8. Дисклеймеры</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p><strong>Бренды:</strong> Apple, iPhone и другие упомянутые торговые марки не являются организаторами или спонсорами стимулирующей акции.</p>
                  <p><strong>Instagram:</strong> Материалы в Instagram* размещаются Организатором акции. Instagram (Meta Platforms Inc.) признана экстремистской организацией; её деятельность запрещена в РФ.</p>
                  <p><strong>Реклама:</strong> Все рекламные размещения в социальных сетях осуществляются Организатором. Агент рекламу не размещает.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>9. Контакты</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p><strong>Продавец:</strong></p>
                  <p>[ОРГАНИЗАТОР_НАЗВАНИЕ]<br/>
                  ИНН: [ОРГАНИЗАТОР_ИНН]<br/>
                  ОГРН: [ОРГАНИЗАТОР_ОГРН]<br/>
                  Адрес: [ОРГАНИЗАТОР_АДРЕС]<br/>
                  Email: [ОРГАНИЗАТОР_EMAIL]<br/>
                  Тел: [ОРГАНИЗАТОР_ТЕЛ]</p>

                  <p><strong>Агент (технический оператор):</strong></p>
                  <p>ИП Zakriev Maksharip Ziavdinovich<br/>
                  ИНН: 1234567890<br/>
                  ОГРНИП: 1234567890123<br/>
                  Email: hello@sovani.ru<br/>
                  Тел: +7 (999) 123-45-67</p>
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
