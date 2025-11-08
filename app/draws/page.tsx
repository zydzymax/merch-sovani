import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db/prisma'

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-serif font-bold text-primary">
              SoVAni
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/catalog" className="hover:text-primary transition-colors">
                Каталог
              </Link>
              <Link href="/promo" className="hover:text-primary transition-colors">
                Акция
              </Link>
              <Link href="/draws" className="text-primary font-medium">
                Розыгрыши
              </Link>
              <Link
                href="/account"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
              >
                Войти
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Page content */}
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8">Розыгрыши призов</h1>

        {/* Active Draw */}
        {activeDraw && (
          <section className="mb-16">
            <h2 className="text-3xl font-serif font-bold mb-6 text-gray-800">Текущий розыгрыш</h2>
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 border-2 border-primary/20">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="inline-block bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    🔴 Активен
                  </div>
                  <h3 className="text-3xl font-bold mb-4">{activeDraw.name}</h3>
                  <p className="text-lg text-gray-700 mb-6">{activeDraw.description}</p>

                  <div className="bg-white rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">📅</div>
                      <div>
                        <p className="text-sm text-gray-600">До окончания</p>
                        <p className="text-2xl font-bold text-primary">
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
                    <div className="bg-white rounded-xl p-6">
                      <h4 className="text-xl font-bold mb-2">Главный приз</h4>
                      <p className="text-2xl font-bold text-primary mb-2">
                        {activeDraw.prize.name}
                      </p>
                      {activeDraw.prize.value && (
                        <p className="text-gray-600">
                          Стоимость:{' '}
                          <span className="font-bold">
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

              <div className="mt-8 text-center">
                <Link
                  href="/catalog"
                  className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors text-lg"
                >
                  Участвовать сейчас
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Upcoming Draws */}
        {upcomingDraws.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-serif font-bold mb-6 text-gray-800">
              Предстоящие розыгрыши
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {upcomingDraws.map((draw) => (
                <div key={draw.id} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                    📅 Скоро
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{draw.name}</h3>
                  <p className="text-gray-600 mb-4">{draw.description}</p>
                  {draw.prize && (
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-600 mb-1">Приз:</p>
                      <p className="text-xl font-bold text-primary">{draw.prize.name}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Completed Draws */}
        {completedDraws.length > 0 && (
          <section>
            <h2 className="text-3xl font-serif font-bold mb-6 text-gray-800">
              Завершённые розыгрыши
            </h2>
            <div className="space-y-4">
              {completedDraws.map((draw) => (
                <div
                  key={draw.id}
                  className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-gray-300"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="inline-block bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-3">
                        ✓ Завершён
                      </div>
                      <h3 className="text-xl font-bold mb-2">{draw.name}</h3>
                      <p className="text-gray-600">{draw.description}</p>
                      {draw.winnerId && (
                        <p className="text-sm text-green-600 font-medium mt-2">
                          ✓ Победитель определён
                        </p>
                      )}
                    </div>
                    {draw.prize && (
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Приз</p>
                        <p className="font-bold text-lg">{draw.prize.name}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* No draws */}
        {draws.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">Розыгрыши пока не проводились</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm opacity-80">
            © 2025 SoVAni. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  )
}
