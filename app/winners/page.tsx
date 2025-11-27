import Link from 'next/link'
import Navbar from '@/app/_components/Navbar'
import BigFooter from '@/app/_components/BigFooter'

export default function WinnersPage() {
  // Placeholder data - will be replaced with real data from database
  const winners = [
    {
      week: 1,
      date: '[ДАТА_РОЗЫГРЫША]',
      streamUrl: '[ССЫЛКА_НА_ЗАПИСЬ_ЭФИРА]',
      winner: '[И. О. Ф***]',
      orderNumber: '****1234'
    }
  ]

  return (
    <div className="min-h-screen" style={{background:'var(--bg)',color:'var(--text)'}}>
      <Navbar />

      <section className="section">
        <div className="container" style={{maxWidth:900}}>
          <h1 className="font-display" style={{fontSize:'40px',marginBottom:32,textAlign:'center'}}>
            Победители розыгрыша «Выиграй iPhone 17 Pro Max»
          </h1>

          <div className="tile" style={{padding:40,marginBottom:32}}>
            <div style={{display:'grid',gap:16}}>
              <p className="lead" style={{fontSize:'16px',lineHeight:1.6}}>
                <strong>Важная информация:</strong> Данные публикуются в обезличенном виде в соответствии с <Link href="/docs/privacy" style={{color:'var(--accent)'}}>Политикой конфиденциальности</Link>.
              </p>
              <p className="lead" style={{fontSize:'16px',lineHeight:1.6}}>
                Запись прямого эфира и протокол розыгрыша доступны по ссылке в каждом блоке.
              </p>
              <p className="lead" style={{fontSize:'16px',lineHeight:1.6}}>
                Подробные правила акции: <Link href="/docs/rules" style={{color:'var(--accent)'}}>Правила стимулирующей акции</Link>
              </p>
            </div>
          </div>

          <div style={{display:'grid',gap:24}}>
            {winners.map((item) => (
              <div key={item.week} className="tile" style={{padding:32}}>
                <div style={{display:'grid',gap:16}}>
                  <h2 className="font-display" style={{fontSize:'28px',marginBottom:8}}>
                    Главный розыгрыш
                  </h2>

                  <div style={{display:'grid',gap:12}}>
                    <div style={{display:'grid',gridTemplateColumns:'140px 1fr',gap:12,alignItems:'start'}}>
                      <span style={{fontWeight:700,opacity:0.8}}>Дата розыгрыша:</span>
                      <span>{item.date}</span>
                    </div>

                    <div style={{display:'grid',gridTemplateColumns:'140px 1fr',gap:12,alignItems:'start'}}>
                      <span style={{fontWeight:700,opacity:0.8}}>Запись эфира:</span>
                      {item.streamUrl.startsWith('[') ? (
                        <span style={{opacity:0.6,fontStyle:'italic'}}>Будет опубликована после проведения розыгрыша</span>
                      ) : (
                        <a href={item.streamUrl} target="_blank" rel="noopener noreferrer" style={{color:'var(--accent)'}}>
                          Смотреть запись розыгрыша
                        </a>
                      )}
                    </div>

                    <div style={{display:'grid',gridTemplateColumns:'140px 1fr',gap:12,alignItems:'start'}}>
                      <span style={{fontWeight:700,opacity:0.8}}>Победитель:</span>
                      {item.winner.startsWith('[') ? (
                        <span style={{opacity:0.6,fontStyle:'italic'}}>Определяется после розыгрыша</span>
                      ) : (
                        <span>{item.winner}</span>
                      )}
                    </div>

                    <div style={{display:'grid',gridTemplateColumns:'140px 1fr',gap:12,alignItems:'start'}}>
                      <span style={{fontWeight:700,opacity:0.8}}>Номер заказа:</span>
                      {item.orderNumber.startsWith('****') && item.orderNumber === '****1234' ? (
                        <span style={{opacity:0.6,fontStyle:'italic'}}>Будет указан после розыгрыша</span>
                      ) : (
                        <span style={{fontFamily:'monospace'}}>{item.orderNumber}</span>
                      )}
                    </div>

                    <div style={{display:'grid',gridTemplateColumns:'140px 1fr',gap:12,alignItems:'start'}}>
                      <span style={{fontWeight:700,opacity:0.8}}>Приз:</span>
                      <span>iPhone 17 Pro Max</span>
                    </div>
                  </div>

                  {item.week === 1 && (
                    <div style={{marginTop:12,padding:16,background:'var(--surface)',borderRadius:12,borderLeft:'3px solid var(--accent)'}}>
                      <p style={{fontSize:'14px',lineHeight:1.5,opacity:0.9,margin:0}}>
                        <strong>Примечание:</strong> Фамилия, имя и отчество публикуются частично (И. О. Ф***), номер заказа маскируется (****XXXX) в соответствии с требованиями защиты персональных данных.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="tile" style={{padding:32,marginTop:32}}>
            <div style={{display:'grid',gap:16}}>
              <h3 className="font-display" style={{fontSize:'20px'}}>
                Как принять участие?
              </h3>
              <p className="lead" style={{fontSize:'16px',lineHeight:1.6}}>
                Приобретите брелок на сайте <Link href="/" style={{color:'var(--accent)'}}>sovani.info</Link> стоимостью 1 999 ₽. Каждый брелок = 1 шанс участия в розыгрыше.
              </p>
              <p className="lead" style={{fontSize:'16px',lineHeight:1.6}}>
                Пригласите друзей по реферальной ссылке и получите дополнительный шанс после их первой покупки.
              </p>
              <p className="lead" style={{fontSize:'16px',lineHeight:1.6}}>
                Подробнее: <Link href="/docs/rules" style={{color:'var(--accent)'}}>Правила акции</Link>
              </p>
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
