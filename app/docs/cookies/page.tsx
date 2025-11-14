import Link from 'next/link'
import Navbar from '@/app/_components/Navbar'
import BigFooter from '@/app/_components/BigFooter'

export default function CookiesPage() {
  return (
    <div className="min-h-screen" style={{background:'var(--bg)',color:'var(--text)'}}>
      <Navbar />

      <section className="section">
        <div className="container" style={{maxWidth:900}}>
          <h1 className="font-display" style={{fontSize:'40px',marginBottom:32}}>
            Политика использования cookies
          </h1>

          <div className="tile" style={{padding:40}}>
            <div style={{display:'grid',gap:32}}>
              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>1. Что такое cookies?</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Cookies (куки) — это небольшие текстовые файлы, которые сохраняются на вашем устройстве при посещении сайта. Они помогают улучшить работу сайта и предоставить более персонализированный опыт.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>2. Какие cookies мы используем?</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p><strong>Необходимые cookies</strong> — обеспечивают базовую функциональность сайта:</p>
                  <ul style={{paddingLeft:24}}>
                    <li>Авторизация и сессии пользователей;</li>
                    <li>Корзина покупок;</li>
                    <li>Безопасность и защита от подделки запросов (CSRF).</li>
                  </ul>

                  <p><strong>Аналитические cookies</strong> — помогают понять, как пользователи взаимодействуют с сайтом:</p>
                  <ul style={{paddingLeft:24}}>
                    <li>Яндекс.Метрика — для анализа посещаемости и поведения пользователей;</li>
                    <li>Сбор обезличенной статистики.</li>
                  </ul>

                  <p><strong>Реферальные cookies</strong> — для учёта реферальных переходов:</p>
                  <ul style={{paddingLeft:24}}>
                    <li>Сохранение реферальных меток (ref, utm-метки);</li>
                    <li>Начисление бонусов за приглашённых пользователей.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>3. Управление cookies</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Вы можете управлять cookies через настройки вашего браузера:</p>
                  <ul style={{paddingLeft:24}}>
                    <li><strong>Chrome:</strong> Настройки → Конфиденциальность и безопасность → Файлы cookie и другие данные сайтов;</li>
                    <li><strong>Firefox:</strong> Настройки → Приватность и защита → Куки и данные сайтов;</li>
                    <li><strong>Safari:</strong> Настройки → Конфиденциальность → Файлы cookie;</li>
                    <li><strong>Edge:</strong> Настройки → Файлы cookie и разрешения сайтов.</li>
                  </ul>
                  <p><strong>Важно:</strong> Отключение необходимых cookies может привести к некорректной работе сайта (невозможность авторизации, оформления заказов и т.д.).</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>4. Согласие на использование cookies</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>Продолжая пользоваться сайтом, вы соглашаетесь с использованием cookies в соответствии с настоящей Политикой.</p>
                  <p>При первом посещении сайта отображается уведомление о cookies. Закрывая уведомление или продолжая использовать сайт, вы даёте согласие на использование cookies.</p>
                </div>
              </section>

              <section>
                <h2 className="font-display" style={{fontSize:'28px',marginBottom:16}}>5. Контакты</h2>
                <div className="lead" style={{fontSize:'16px',lineHeight:1.6,display:'grid',gap:12}}>
                  <p>По вопросам использования cookies обращайтесь:</p>
                  <p>Email: hello@sovani.ru<br/>
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
