import { Metadata } from 'next'
import Navbar from '../../_components/Navbar'
import BigFooter from '../../_components/BigFooter'

export const metadata: Metadata = {
  title: 'Доставка СДЭК | SoVAni',
  description: 'Информация о доставке товаров SoVAni курьерской службой СДЭК по всей России',
}

export default function DeliveryPage() {
  return (
    <>
      <Navbar />
      <main className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <h1 className="font-display" style={{ fontSize: 32, marginBottom: 24 }}>
            Доставка
          </h1>

          <div className="tile" style={{ padding: 32, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <span style={{ fontSize: 48 }}>📦</span>
              <div>
                <h2 className="font-display" style={{ fontSize: 24, marginBottom: 4 }}>
                  Доставка СДЭК
                </h2>
                <p className="lead" style={{ opacity: 0.8 }}>
                  Быстрая и надёжная доставка по всей России
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gap: 16 }}>
              <div style={{ padding: 16, background: 'var(--surface)', borderRadius: 12 }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Сроки доставки</div>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  <li>Москва и Санкт-Петербург: 1-3 дня</li>
                  <li>Крупные города России: 3-5 дней</li>
                  <li>Остальные регионы: 5-7 дней</li>
                </ul>
              </div>

              <div style={{ padding: 16, background: 'var(--surface)', borderRadius: 12 }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Стоимость доставки</div>
                <p style={{ margin: 0 }}>
                  Стоимость доставки рассчитывается автоматически при оформлении заказа
                  в зависимости от вашего региона и веса заказа.
                </p>
                <p style={{ margin: '8px 0 0', opacity: 0.8, fontSize: 14 }}>
                  Средняя стоимость: от 250 до 500 рублей
                </p>
              </div>

              <div style={{ padding: 16, background: 'var(--surface)', borderRadius: 12 }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Способы получения</div>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  <li>Пункт выдачи СДЭК (более 5000 пунктов по России)</li>
                  <li>Курьерская доставка до двери</li>
                  <li>Постаматы СДЭК</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="tile" style={{ padding: 32, marginBottom: 24 }}>
            <h2 className="font-display" style={{ fontSize: 20, marginBottom: 16 }}>
              Как оформить доставку
            </h2>
            <ol style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 12 }}>
              <li>Добавьте товары в корзину</li>
              <li>Перейдите к оформлению заказа</li>
              <li>Укажите ваш адрес или выберите пункт выдачи СДЭК</li>
              <li>Оплатите заказ удобным способом</li>
              <li>Получите трек-номер для отслеживания посылки</li>
            </ol>
          </div>

          <div className="tile" style={{ padding: 32, marginBottom: 24 }}>
            <h2 className="font-display" style={{ fontSize: 20, marginBottom: 16 }}>
              Отслеживание заказа
            </h2>
            <p className="lead">
              После отправки заказа вы получите трек-номер на указанный email и телефон.
              Отследить посылку можно на сайте СДЭК:
            </p>
            <a
              href="https://www.cdek.ru/ru/tracking"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ marginTop: 16, display: 'inline-flex' }}
            >
              Отследить посылку на СДЭК →
            </a>
          </div>

          <div className="tile" style={{ padding: 32, background: 'var(--accent)', color: '#fff' }}>
            <h2 className="font-display" style={{ fontSize: 20, marginBottom: 12 }}>
              Остались вопросы по доставке?
            </h2>
            <p style={{ marginBottom: 16, opacity: 0.9 }}>
              Свяжитесь с нами любым удобным способом:
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <a href="mailto:shop@sovani.info" className="btn" style={{ background: '#fff', color: '#000' }}>
                shop@sovani.info
              </a>
              <a href="tel:+79938981301" className="btn" style={{ background: '#fff', color: '#000' }}>
                +7 (993) 898-13-01
              </a>
            </div>
          </div>
        </div>
      </main>
      <BigFooter />
    </>
  )
}
