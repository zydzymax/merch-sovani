import { prisma } from '@/lib/db/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  // Fetch statistics
  const [
    totalOrders,
    totalRevenue,
    totalUsers,
    totalProducts,
    activeEntries,
    recentOrders,
    topProducts,
  ] = await Promise.all([
    // Total orders count
    prisma.order.count(),

    // Total revenue (sum of all PAID orders)
    prisma.order.aggregate({
      where: { status: 'PAID' },
      _sum: { total: true },
    }),

    // Total users
    prisma.user.count(),

    // Total active products
    prisma.product.count({ where: { isActive: true } }),

    // Active lottery entries
    prisma.entry.count({ where: { isActive: true } }),

    // Recent orders (last 10)
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { email: true, name: true } },
      },
    }),

    // Top selling products
    prisma.orderItem.groupBy({
      by: ['variantId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),
  ])

  const revenue = totalRevenue._sum.total || 0

  // Fraud statistics
  const highRiskOrders = await prisma.order.count({
    where: { fraudScore: { gte: 50 } },
  })

  const refundedOrders = await prisma.order.count({
    where: { status: 'REFUNDED' },
  })

  const stats = [
    {
      label: 'Всего заказов',
      value: totalOrders,
      icon: '📦',
      color: '#00A1FF',
    },
    {
      label: 'Выручка',
      value: `${(revenue / 100).toLocaleString('ru-RU')} ₽`,
      icon: '💰',
      color: '#00C853',
    },
    {
      label: 'Пользователей',
      value: totalUsers,
      icon: '👥',
      color: '#FF2B2B',
    },
    {
      label: 'Активных товаров',
      value: totalProducts,
      icon: '🛍️',
      color: '#FFB300',
    },
    {
      label: 'Активных шансов',
      value: activeEntries,
      icon: '🎁',
      color: '#7C4DFF',
    },
    {
      label: 'Возвраты',
      value: refundedOrders,
      icon: '↩️',
      color: '#FF5722',
    },
    {
      label: 'Подозрительные заказы',
      value: highRiskOrders,
      icon: '⚠️',
      color: '#F44336',
    },
  ]

  return (
    <div style={{ display: 'grid', gap: 32 }}>
      <div>
        <h1 className="font-display" style={{ fontSize: 40, marginBottom: 8 }}>
          Статистика
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 16 }}>
          Обзор основных показателей магазина
        </p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 20,
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            className="tile"
            style={{
              padding: 24,
              borderLeft: `4px solid ${stat.color}`,
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>{stat.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
              {stat.value}
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 14 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="tile" style={{ padding: 32 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <h2 className="font-display" style={{ fontSize: 24 }}>
            Последние заказы
          </h2>
          <Link href="/admin/orders" className="btn btn-ghost">
            Все заказы →
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--ring)' }}>
                <th style={{ padding: 12, textAlign: 'left', fontSize: 14 }}>
                  Номер заказа
                </th>
                <th style={{ padding: 12, textAlign: 'left', fontSize: 14 }}>
                  Клиент
                </th>
                <th style={{ padding: 12, textAlign: 'left', fontSize: 14 }}>
                  Сумма
                </th>
                <th style={{ padding: 12, textAlign: 'left', fontSize: 14 }}>
                  Статус
                </th>
                <th style={{ padding: 12, textAlign: 'left', fontSize: 14 }}>
                  Дата
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  style={{ borderBottom: '1px solid var(--ring)' }}
                >
                  <td style={{ padding: 12, fontSize: 14, fontFamily: 'monospace' }}>
                    {order.orderNumber}
                  </td>
                  <td style={{ padding: 12, fontSize: 14 }}>
                    {order.user?.name || order.email}
                  </td>
                  <td style={{ padding: 12, fontSize: 14, fontWeight: 600 }}>
                    {(order.total / 100).toLocaleString('ru-RU')} ₽
                  </td>
                  <td style={{ padding: 12, fontSize: 14 }}>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 600,
                        background:
                          order.status === 'PAID'
                            ? '#00C853'
                            : order.status === 'REFUNDED'
                            ? '#F44336'
                            : 'var(--surface)',
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: 12, fontSize: 14, color: 'var(--muted)' }}>
                    {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="tile" style={{ padding: 32 }}>
        <h2 className="font-display" style={{ fontSize: 24, marginBottom: 20 }}>
          Быстрые действия
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <Link href="/admin/products/new" className="btn btn-primary">
            + Добавить товар
          </Link>
          <Link href="/admin/draws" className="btn btn-ghost">
            Просмотр розыгрышей
          </Link>
          <Link href="/admin/content" className="btn btn-ghost">
            Редактировать контент
          </Link>
          <Link href="/admin/settings" className="btn btn-ghost">
            Настройки
          </Link>
        </div>
      </div>
    </div>
  )
}
