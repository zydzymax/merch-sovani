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
          <h1 className="font-display" style={{fontSize:'48px',marginBottom:32,textAlign:'center'}}>Розыгрыши призов</h1>

          {/* Main Prize Info */}
          <div className="tile" style={{padding:40,marginBottom:64}}>
            <div className="grid grid-2" style={{gap:40}}>
              <div>
                <h2 className="font-display" style={{fontSize:'36px',marginBottom:16,color:'var(--accent)'}}>
                  Главный приз
                </h2>
                <h3 className="font-display" style={{fontSize:'32px',marginBottom:24}}>
                  iPhone 17 Pro Max
                </h3>
                <p className="lead" style={{fontSize:'18px',marginBottom:24,lineHeight:1.6}}>
                  Разыгрываем один новый iPhone 17 Pro Max среди всех участников акции.
                  Один победитель получит главный приз!
                </p>
                <div style={{background:'var(--surface)',borderRadius:20,padding:24,marginBottom:24}}>
                  <h4 className="font-display" style={{fontSize:'20px',marginBottom:16}}>Условия участия:</h4>
                  <ul style={{display:'grid',gap:12,fontSize:'16px',lineHeight:1.6}}>
                    <li>✓ Купите брелок в нашем магазине</li>
                    <li>✓ Каждый брелок = 1 шанс на выигрыш</li>
                    <li>✓ Чем больше брелоков, тем выше шансы</li>
                    <li>✓ Победитель определяется случайным образом</li>
                  </ul>
                </div>
                <Link href="/catalog" className="btn btn-primary" style={{fontSize:'16px',padding:'18px 36px',display:'inline-block'}}>
                  Купить брелок и участвовать
                </Link>
              </div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
                <div style={{position:'relative',width:'100%',maxWidth:400}}>
                  <Image
                    src="/images/орнаж.png"
                    alt="iPhone 17 Pro Max"
                    width={400}
                    height={400}
                    style={{width:'100%',height:'auto',objectFit:'contain'}}
                    priority
                  />
                </div>
              </div>
            </div>
          </div>


          {/* Upcoming Draws */}
          {upcomingDraws.length > 0 && (
            <div style={{marginBottom:64}}>
              <h2 className="font-display" style={{fontSize:'36px',marginBottom:24,textAlign:'center'}}>
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
              <h2 className="font-display" style={{fontSize:'36px',marginBottom:24,textAlign:'center'}}>
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
