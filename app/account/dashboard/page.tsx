export const dynamic = "force-dynamic";
export const revalidate = 0;
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth/getUser'
import { prisma } from '@/lib/db/prisma'
import LogoutButton from '@/components/LogoutButton'

export default async function DashboardPage() {
  const user = await getUser()

  if (!user) {
    redirect('/account')
  }

  // Fetch user's orders
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  // Fetch user's entries
  const entries = await prisma.entry.findMany({
    where: { userId: user.id },
    include: {
      order: true,
      draw: {
        include: {
          prize: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

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
              <Link href="/draws" className="hover:text-primary transition-colors">
                Розыгрыши
              </Link>
              <Link href="/account/dashboard" className="text-primary font-medium">
                Личный кабинет
              </Link>
              <LogoutButton />
            </nav>
          </div>
        </div>
      </header>

      {/* Page content */}
      <div className="container mx-auto px-4 py-12">
        {/* User Info */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-serif font-bold mb-4">Личный кабинет</h1>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Имя</p>
              <p className="text-lg font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="text-lg font-medium">{user.email}</p>
            </div>
            {user.phone && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Телефон</p>
                <p className="text-lg font-medium">{user.phone}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600 mb-1">Дата регистрации</p>
              <p className="text-lg font-medium">
                {new Date(user.createdAt).toLocaleDateString('ru-RU')}
              </p>
            </div>
          </div>
        </div>

        {/* Referral Program Banner */}
        <Link href="/account/referrals" className="block mb-8">
          <div className="bg-gradient-to-r from-red-600 via-green-600 to-red-600 rounded-xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer">
            <div className="flex flex-col md:flex-row items-center gap-6 text-white">
              <div className="text-6xl">🎁</div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2">Приведи друга</h2>
                <p className="text-red-100 text-lg">
                  Поделись ссылкой с друзьями и получайте бонусы вместе!
                </p>
              </div>
              <div className="flex items-center gap-2 text-white font-bold bg-white/20 px-6 py-3 rounded-lg">
                <span>Перейти</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        {/* Entries Section */}
        {entries.length > 0 && (
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl shadow-sm p-8 mb-8 border-2 border-primary/20">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🎟️</span>
              <h2 className="text-2xl font-serif font-bold">Мои коды участия в акции</h2>
            </div>
            <p className="text-sm text-gray-700 mb-6">
              Эти коды автоматически участвуют в еженедельных розыгрышах призов
            </p>
            <div className="space-y-4">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white border-2 border-primary/20 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Код участия:</p>
                        <p className="font-mono text-2xl font-bold text-primary tracking-wider">
                          {entry.uniqueCode}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div>
                          <span className="text-gray-500">Создан:</span>{' '}
                          <span className="font-medium">
                            {new Date(entry.createdAt).toLocaleDateString('ru-RU', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        {entry.order && (
                          <div>
                            <span className="text-gray-500">Заказ:</span>{' '}
                            <span className="font-medium font-mono">{entry.order.orderNumber}</span>
                          </div>
                        )}
                      </div>
                      {entry.draw && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">
                            <span className="text-gray-500">Розыгрыш:</span>{' '}
                            <span className="font-medium">{entry.draw.name}</span>
                          </p>
                          {entry.draw.prize && (
                            <p className="text-sm text-primary font-medium">
                              Главный приз: {entry.draw.prize.name}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      {entry.draw?.status === 'ACTIVE' && (
                        <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                          ✓ Активен
                        </span>
                      )}
                      {entry.draw?.status === 'COMPLETED' && (
                        <span className="inline-block bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-semibold">
                          Завершён
                        </span>
                      )}
                      {!entry.draw && (
                        <span className="inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold">
                          Ожидает розыгрыша
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Section */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-serif font-bold mb-6">Мои заказы</h2>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">У вас пока нет заказов</p>
              <Link
                href="/catalog"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Начать покупки
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-mono text-sm text-gray-600 mb-1">
                        Заказ #{order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === 'PAID'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status === 'PAID' && 'Оплачен'}
                        {order.status === 'PENDING' && 'Ожидает оплаты'}
                        {order.status === 'PROCESSING' && 'В обработке'}
                        {order.status === 'SHIPPED' && 'Отправлен'}
                        {order.status === 'DELIVERED' && 'Доставлен'}
                        {order.status === 'CANCELLED' && 'Отменён'}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="flex-1">
                          <p className="font-medium">{item.variant.product.name}</p>
                          <p className="text-sm text-gray-600">
                            {item.variant.name || ''} × {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {((item.priceAtPurchase * item.quantity) / 100).toLocaleString(
                              'ru-RU'
                            )}{' '}
                            ₽
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4 flex justify-between items-center">
                    <div>
                      {order.participatesInPromo && (
                        <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                          ✓ Участвует в акции
                        </span>
                      )}
                      {order.entryCode && (
                        <p className="text-sm text-gray-600 mt-2">
                          Код участия: <span className="font-mono font-bold">{order.entryCode}</span>
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Итого</p>
                      <p className="text-2xl font-bold text-primary">
                        {(order.total / 100).toLocaleString('ru-RU')} ₽
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
