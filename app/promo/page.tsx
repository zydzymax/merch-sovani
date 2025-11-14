import Link from 'next/link'
import Image from 'next/image'

export default async function PromoPage() {
  return (
    <div className="min-h-screen" style={{background:'var(--bg)',color:'var(--text)'}}>
      {/* Hero Banner */}
      <section className="section">
        <div className="container">
          <div className="tile" style={{padding:0,overflow:'hidden'}}>
            <Image
              src="/images/5 айфонов.png"
              alt="5 iPhone 17 Pro Max - главные призы розыгрыша"
              width={1200}
              height={600}
              priority
              sizes="(max-width:768px) 100vw, 1200px"
              style={{width:'100%',height:'auto',borderRadius:28}}
            />
          </div>
          <div style={{textAlign:'center',marginTop:40}}>
            <h1 className="font-display" style={{fontSize:'48px',marginBottom:16}}>
              Условия акции
            </h1>
            <p className="lead" style={{fontSize:'20px',maxWidth:800,marginInline:'auto'}}>
              Покупай брелок за 1 999 ₽ и выигрывай iPhone 17 Pro Max.
              Каждую неделю — новый победитель!
            </p>
          </div>
        </div>
      </section>

      {/* Prizes Section */}
      <section className="section">
        <div className="container">
          <h2 className="font-display" style={{fontSize:'40px',marginBottom:32,textAlign:'center'}}>
            Призовой фонд
          </h2>
          <div className="tile" style={{padding:0,overflow:'hidden'}}>
            <Image
              src="/images/Сетка «Еженедельные розыгрыши — 5 недель».png"
              alt="График еженедельных розыгрышей на 5 недель"
              width={1200}
              height={600}
              sizes="(max-width:768px) 100vw, 1200px"
              style={{width:'100%',height:'auto',borderRadius:28}}
            />
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section className="section">
        <div className="container">
          <h2 className="font-display" style={{fontSize:'40px',marginBottom:32,textAlign:'center'}}>
            Правила участия
          </h2>

          <div className="grid grid-2" style={{gap:24}}>
            <div className="tile" style={{padding:32}}>
              <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:16}}>
                <Image
                  src="/images/Иконка «Электронный чек : подтверждение».png"
                  alt="Электронный чек подтверждения"
                  width={64}
                  height={64}
                  style={{width:64,height:64}}
                />
                <h3 className="font-display" style={{fontSize:'28px'}}>
                  Как участвовать?
                </h3>
              </div>
              <ul style={{listStyle:'none',padding:0,margin:0,display:'grid',gap:12}}>
                <li style={{display:'flex',gap:12}}>
                  <span style={{color:'var(--accent)',flexShrink:0}}>•</span>
                  <span>Купи брелок за 1 999 ₽ на нашем сайте</span>
                </li>
                <li style={{display:'flex',gap:12}}>
                  <span style={{color:'var(--accent)',flexShrink:0}}>•</span>
                  <span>Получи электронный чек на email — это твой номер участия</span>
                </li>
                <li style={{display:'flex',gap:12}}>
                  <span style={{color:'var(--accent)',flexShrink:0}}>•</span>
                  <span>Регистрация происходит автоматически</span>
                </li>
                <li style={{display:'flex',gap:12}}>
                  <span style={{color:'var(--accent)',flexShrink:0}}>•</span>
                  <span>Чем больше брелков купишь — тем выше шанс!</span>
                </li>
              </ul>
            </div>

            <div className="tile" style={{padding:32}}>
              <h3 className="font-display" style={{fontSize:'28px',marginBottom:16}}>
                📅 Сроки проведения
              </h3>
              <div style={{display:'grid',gap:12}}>
                <p className="lead" style={{fontSize:'16px',marginBottom:8}}>
                  <strong>Период акции:</strong><br/>
                  1 декабря 2025 — 5 января 2026
                </p>
                <p className="lead" style={{fontSize:'16px',marginBottom:8}}>
                  <strong>Розыгрыши:</strong><br/>
                  Каждую неделю в прямом эфире на YouTube, Telegram и VK
                </p>
                <p className="lead" style={{fontSize:'16px'}}>
                  <strong>Всего призов:</strong><br/>
                  5 смартфонов iPhone 17 Pro Max
                </p>
              </div>
            </div>

            <div className="tile" style={{padding:32}}>
              <h3 className="font-display" style={{fontSize:'28px',marginBottom:16}}>
                🎁 Определение победителей
              </h3>
              <p className="lead" style={{fontSize:'16px',marginBottom:12}}>
                Розыгрыш проводится с использованием генератора случайных чисел в прямом эфире.
              </p>
              <p className="lead" style={{fontSize:'16px',marginBottom:12}}>
                Победители уведомляются по электронной почте и телефону в течение 24 часов.
              </p>
              <p className="lead" style={{fontSize:'16px'}}>
                Каждый участник может выиграть только один раз за всю акцию.
              </p>
            </div>

            <div className="tile" style={{padding:32}}>
              <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:16}}>
                <Image
                  src="/images/Бейдж «Гарантированная регистрация участия».png"
                  alt="Гарантированная регистрация участия"
                  width={64}
                  height={64}
                  style={{width:64,height:64}}
                />
                <h3 className="font-display" style={{fontSize:'28px'}}>
                  Гарантии
                </h3>
              </div>
              <ul style={{listStyle:'none',padding:0,margin:0,display:'grid',gap:12}}>
                <li style={{display:'flex',gap:12}}>
                  <span style={{color:'var(--accent)',flexShrink:0}}>✓</span>
                  <span>Автоматическая регистрация после покупки</span>
                </li>
                <li style={{display:'flex',gap:12}}>
                  <span style={{color:'var(--accent)',flexShrink:0}}>✓</span>
                  <span>Прозрачный розыгрыш в прямом эфире</span>
                </li>
                <li style={{display:'flex',gap:12}}>
                  <span style={{color:'var(--accent)',flexShrink:0}}>✓</span>
                  <span>Бесплатная доставка призов по России</span>
                </li>
                <li style={{display:'flex',gap:12}}>
                  <span style={{color:'var(--accent)',flexShrink:0}}>✓</span>
                  <span>Получение приза в течение 14 дней</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section">
        <div className="container">
          <h2 className="font-display" style={{fontSize:'40px',marginBottom:32,textAlign:'center'}}>
            Частые вопросы
          </h2>

          <div style={{maxWidth:900,marginInline:'auto',display:'grid',gap:16}}>
            <details className="tile" style={{padding:24,cursor:'pointer'}}>
              <summary className="font-display" style={{fontSize:'20px',listStyle:'none',cursor:'pointer'}}>
                Сколько раз я могу участвовать?
              </summary>
              <p className="lead" style={{marginTop:12,fontSize:'16px',color:'var(--muted)'}}>
                Количество участий не ограничено! Каждая покупка брелока = 1 дополнительный шанс.
              </p>
            </details>

            <details className="tile" style={{padding:24,cursor:'pointer'}}>
              <summary className="font-display" style={{fontSize:'20px',listStyle:'none',cursor:'pointer'}}>
                Когда я узнаю результаты?
              </summary>
              <p className="lead" style={{marginTop:12,fontSize:'16px',color:'var(--muted)'}}>
                Розыгрыши проходят каждую неделю в прямом эфире. Следи за объявлениями в наших соц. сетях.
              </p>
            </details>

            <details className="tile" style={{padding:24,cursor:'pointer'}}>
              <summary className="font-display" style={{fontSize:'20px',listStyle:'none',cursor:'pointer'}}>
                Как я получу приз?
              </summary>
              <p className="lead" style={{marginTop:12,fontSize:'16px',color:'var(--muted)'}}>
                Мы свяжемся с тобой по email и телефону в течение 24 часов. Приз доставим бесплатно курьером.
              </p>
            </details>

            <details className="tile" style={{padding:24,cursor:'pointer'}}>
              <summary className="font-display" style={{fontSize:'20px',listStyle:'none',cursor:'pointer'}}>
                Можно ли вернуть брелок?
              </summary>
              <p className="lead" style={{marginTop:12,fontSize:'16px',color:'var(--muted)'}}>
                Товары, купленные с участием в акции, возврату не подлежат согласно правилам розыгрыша.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Legal Info */}
      <section className="section">
        <div className="container tile" style={{padding:32,textAlign:'center'}}>
          <h3 className="font-display" style={{fontSize:'24px',marginBottom:16}}>
            Юридическая информация
          </h3>
          <p className="lead" style={{fontSize:'16px',maxWidth:800,marginInline:'auto'}}>
            Участвуя в акции, вы соглашаетесь с{' '}
            <Link href="/legal/promo-rules" style={{color:'var(--accent)',textDecoration:'underline'}}>
              правилами розыгрыша
            </Link>,{' '}
            <Link href="/legal/offer" style={{color:'var(--accent)',textDecoration:'underline'}}>
              публичной офертой
            </Link>
            {' '}и{' '}
            <Link href="/legal/privacy" style={{color:'var(--accent)',textDecoration:'underline'}}>
              политикой обработки персональных данных
            </Link>.
          </p>
          <div style={{marginTop:24}}>
            <Link href="/catalog">
              <button className="btn btn-primary">
                Купить брелок и участвовать
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
