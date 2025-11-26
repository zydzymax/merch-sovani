import { prisma } from '@/lib/db/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    take: 100,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { email: true, name: true } },
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
  })

  const stats = {
    total: orders.length,
    paid: orders.filter((o) => o.status === 'PAID').length,
    pending: orders.filter((o) => o.status === 'PENDING').length,
    refunded: orders.filter((o) => o.status === 'REFUNDED').length,
    cancelled: orders.filter((o) => o.status === 'CANCELLED').length,
  }

  return (
    <div style={{ display: 'grid', gap: 32 }}>
      <div>
        <h1 className="font-display" style={{ fontSize: 40, marginBottom: 8 }}>
          Заказы
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 16 }}>
          Всего заказов: {orders.length}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
        <div className="tile" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{stats.paid}</div>
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>Оплачено</div>
        </div>
        <div className="tile" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{stats.pending}</div>
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>Ожидает оплаты</div>
        </div>
        <div className="tile" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{stats.refunded}</div>
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>Возвраты</div>
        </div>
        <div className="tile" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{stats.cancelled}</div>
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>Отменено</div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="tile" style={{ padding: 32 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--ring)' }}>
                <th style={{ padding: 12, textAlign: 'left', fontSize: 14 }}>Номер</th>
                <th style={{ padding: 12, textAlign: 'left', fontSize: 14 }}>Клиент</th>
                <th style={{ padding: 12, textAlign: 'left', fontSize: 14 }}>Товары</th>
                <th style={{ padding: 12, textAlign: 'right', fontSize: 14 }}>Сумма</th>
                <th style={{ padding: 12, textAlign: 'center', fontSize: 14 }}>Статус</th>
                <th style={{ padding: 12, textAlign: 'center', fontSize: 14 }}>Fraud</th>
                <th style={{ padding: 12, textAlign: 'left', fontSize: 14 }}>Дата</th>
                <th style={{ padding: 12, textAlign: 'center', fontSize: 14 }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--ring)' }}>
                  <td style={{ padding: 12, fontSize: 13, fontFamily: 'monospace' }}>
                    {order.orderNumber}
                  </td>
                  <td style={{ padding: 12, fontSize: 14 }}>
                    <div>{order.user?.name || order.shippingFullName}</div>
                    <div style={{ color: 'var(--muted)', fontSize: 12 }}>{order.email}</div>
                  </td>
                  <td style={{ padding: 12, fontSize: 13 }}>
                    {order.items.length} товар(ов)
                  </td>
                  <td style={{ padding: 12, fontSize: 14, fontWeight: 600, textAlign: 'right' }}>
                    {(order.total / 100).toLocaleString('ru-RU')} ₽
                  </td>
                  <td style={{ padding: 12, textAlign: 'center' }}>
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
                  <td style={{ padding: 12, textAlign: 'center' }}>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                        background:
                          order.fraudScore >= 50
                            ? '#F44336'
                            : order.fraudScore >= 30
                            ? '#FFB300'
                            : '#00C853',
                      }}
                    >
                      {order.fraudScore}
                    </span>
                  </td>
                  <td style={{ padding: 12, fontSize: 13, color: 'var(--muted)' }}>
                    {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                  </td>
                  <td style={{ padding: 12, textAlign: 'center' }}>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      style={{ fontSize: 12, color: 'var(--accent)' }}
                    >
                      Детали →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
