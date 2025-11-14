import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db/prisma'
import Navbar from '@/app/_components/Navbar'
import BigFooter from '@/app/_components/BigFooter'

export default async function DrawsPage() {
  // Fetch all draws with prizes
  const draws = await prisma.draw.findMany({
    include: { prize: true },
    orderBy: { createdAt: 'desc' },
  })

  const activeDraw = draws.find((d) => d.status === 'ACTIVE')
  const completedDraws = draws.filter((d) => d.status === 'COMPLETED')
  const upcomingDraws = draws.filter((d) => d.status === 'UPCOMING')

  return (
    <div className="min-h-screen" style={{background:'var(--bg)',color:'var(--text)'}}>
      <Navbar />

      {/* Page content */}
      <section className="section">
        <div className="container">
          <h1 className="font-display" style={{fontSize:'48px',marginBottom:32}}>Розыгрыши призов</h1>

          {/* Active Draw */}
          {activeDraw && (
            <div style={{marginBottom:64}}>
              <h2 className="font-display" style={{fontSize:'36px',marginBottom:24}}>Текущий розыгрыш</h2>
              <div className="tile" style={{padding:40}}>
              <div className="grid grid-2" style={{gap:32}}>
                <div>
                  <div style={{display:'inline-block',background:'#22c55e',color:'#fff',padding:'8px 16px',borderRadius:'999px',fontSize:'14px',fontWeight:700,marginBottom:16}}>
                    🔴 Активен
                  </div>
                  <h3 className="font-display" style={{fontSize:'32px',marginBottom:16}}>{activeDraw.name}</h3>
                  <p className="lead" style={{fontSize:'18px',marginBottom:24}}>{activeDraw.description}</p>

                  <div style={{background:'var(--surface)',borderRadius:20,padding:24,marginBottom:24,border:'1px solid var(--ring)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:16}}>
                      <div style={{fontSize:'40px'}}>📅</div>
                      <div>
                        <p className="lead" style={{fontSize:'14px'}}>До окончания</p>
                        <p className="font-display" style={{fontSize:'28px',color:'var(--accent)'}}>
                          {Math.max(
                            0,
                            Math.ceil(
                              (new Date(activeDraw.endsAt).getTime() - Date.now()) /
                                (1000 * 60 * 60 * 24)
                            )
                          )}{' '}
                          дней
                        </p>
                      </div>
                    </div>
                  </div>

                  {activeDraw.prize && (
                    <div style={{background:'var(--surface)',borderRadius:20,padding:24,border:'1px solid var(--ring)'}}>
                      <h4 className="font-display" style={{fontSize:'20px',marginBottom:8}}>Главный приз</h4>
                      <p className="font-display" style={{fontSize:'24px',color:'var(--accent)',marginBottom:8}}>
                        {activeDraw.prize.name}
                      </p>
                      {activeDraw.prize.value && (
                        <p className="lead" style={{fontSize:'14px'}}>
                          Стоимость:{' '}
                          <span style={{fontWeight:700,color:'var(--text)'}}>
                            {(activeDraw.prize.value / 100).toLocaleString('ru-RU')} ₽
                          </span>
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  {activeDraw.prize?.image && (
                    <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                      <Image
                        src={activeDraw.prize.image}
                        alt={activeDraw.prize.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div style={{marginTop:32,textAlign:'center'}}>
                <Link href="/catalog" className="btn btn-primary" style={{fontSize:'16px',padding:'18px 36px'}}>
                  Участвовать сейчас
                </Link>
              </div>
            </div>
            </div>
          )}

          {/* Upcoming Draws */}
          {upcomingDraws.length > 0 && (
            <div style={{marginBottom:64}}>
              <h2 className="font-display" style={{fontSize:'36px',marginBottom:24}}>
                Предстоящие розыгрыши
              </h2>
              <div className="grid grid-2" style={{gap:24}}>
                {upcomingDraws.map((draw) => (
                  <div key={draw.id} className="tile" style={{padding:32}}>
                    <div style={{display:'inline-block',background:'#3b82f6',color:'#fff',padding:'6px 12px',borderRadius:'999px',fontSize:'13px',fontWeight:700,marginBottom:16}}>
                      📅 Скоро
                    </div>
                    <h3 className="font-display" style={{fontSize:'24px',marginBottom:12}}>{draw.name}</h3>
                    <p className="lead" style={{fontSize:'16px',marginBottom:16}}>{draw.description}</p>
                    {draw.prize && (
                      <div style={{borderTop:'1px solid var(--ring)',paddingTop:16}}>
                        <p className="lead" style={{fontSize:'14px',marginBottom:4}}>Приз:</p>
                        <p className="font-display" style={{fontSize:'20px',color:'var(--accent)'}}>{draw.prize.name}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Draws */}
          {completedDraws.length > 0 && (
            <div>
              <h2 className="font-display" style={{fontSize:'36px',marginBottom:24}}>
                Завершённые розыгрыши
              </h2>
              <div style={{display:'grid',gap:16}}>
                {completedDraws.map((draw) => (
                  <div
                    key={draw.id}
                    className="tile"
                    style={{padding:32,borderLeft:'4px solid var(--muted)'}}
                  >
                    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:24,flexWrap:'wrap'}}>
                      <div>
                        <div style={{display:'inline-block',background:'#6b7280',color:'#fff',padding:'6px 12px',borderRadius:'999px',fontSize:'13px',fontWeight:700,marginBottom:12}}>
                          ✓ Завершён
                        </div>
                        <h3 className="font-display" style={{fontSize:'20px',marginBottom:8}}>{draw.name}</h3>
                        <p className="lead" style={{fontSize:'16px'}}>{draw.description}</p>
                        {draw.winnerId && (
                          <p style={{fontSize:'14px',color:'#22c55e',fontWeight:600,marginTop:8}}>
                            ✓ Победитель определён
                          </p>
                        )}
                      </div>
                      {draw.prize && (
                        <div style={{textAlign:'right'}}>
                          <p className="lead" style={{fontSize:'14px',marginBottom:4}}>Приз</p>
                          <p className="font-display" style={{fontSize:'18px'}}>{draw.prize.name}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No draws */}
          {draws.length === 0 && (
            <div style={{textAlign:'center',padding:'64px 0'}}>
              <p className="lead" style={{fontSize:'20px'}}>Розыгрыши пока не проводились</p>
            </div>
          )}
        </div>
      </section>

      <BigFooter />
    </div>
  )
}
