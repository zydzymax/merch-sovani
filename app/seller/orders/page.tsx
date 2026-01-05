'use client'

import { useEffect, useState } from 'react'

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    try {
      const response = await fetch('/api/seller/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Failed to load orders:', error)
    } finally {
      setLoading(false)
    }
  }

  function getStatusLabel(status: string) {
    const labels: Record<string, string> = {
      PENDING: 'Ожидает обработки',
      CONFIRMED: 'Подтверждён',
      SHIPPED: 'Отправлен',
      DELIVERED: 'Доставлен',
      CANCELLED: 'Отменён',
    }
    return labels[status] || status
  }

  function getStatusColor(status: string) {
    const colors: Record<string, string> = {
      PENDING: 'var(--warning)',
      CONFIRMED: 'var(--info)',
      SHIPPED: 'var(--primary)',
      DELIVERED: 'var(--success)',
      CANCELLED: 'var(--muted)',
    }
    return colors[status] || 'var(--muted)'
  }

  if (loading) {
    return <div>Загрузка...</div>
  }

  return (
    <div>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 30 }}>
        Заказы
      </h1>

      {orders.length === 0 ? (
        <div className="tile" style={{ padding: 60, textAlign: 'center' }}>
          <p style={{ fontSize: 16, color: 'var(--muted)' }}>
            У вас пока нет заказов. Администратор будет добавлять заказы вручную.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 20 }}>
          {orders.map((order: any) => (
            <div key={order.id} className="tile" style={{ padding: 25 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 5 }}>
                    Заказ №{order.id.slice(0, 8)}
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--muted)' }}>
                    {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                <div style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  background: getStatusColor(order.status) + '20',
                  color: getStatusColor(order.status),
                }}>
                  {getStatusLabel(order.status)}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 10 }}>
                  Товары:
                </div>
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--ring)' }}>
                    <div>
                      <div style={{ fontSize: 15 }}>{item.variant?.product?.name || 'Товар'}</div>
                      <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                        {item.quantity} шт. × {(item.priceAtPurchase / 100).toFixed(2)} ₽
                      </div>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>
                      {((item.priceAtPurchase * item.quantity) / 100).toFixed(2)} ₽
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15, borderTop: '2px solid var(--ring)' }}>
                <div>
                  <div style={{ fontSize: 14, color: 'var(--muted)' }}>
                    Доставка: {order.shippingAddress || 'Не указан адрес'}
                  </div>
                  {order.trackingNumber && (
                    <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                      Трек-номер: {order.trackingNumber}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, color: 'var(--muted)' }}>
                    Итого:
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>
                    {(order.total / 100).toFixed(2)} ₽
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--success)', marginTop: 4 }}>
                    Ваш доход: {((order.total * 0.5) / 100).toFixed(2)} ₽
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
