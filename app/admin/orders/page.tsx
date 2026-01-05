'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Order = {
  id: string
  orderNumber: string
  email: string
  phone: string
  status: string
  total: number
  subtotal: number
  shippingFullName: string | null
  shippingMethod: string | null
  cdekTrackingNumber: string | null
  fraudScore: number
  createdAt: string
  user: {
    email: string
    name: string | null
  } | null
  items: {
    id: string
    quantity: number
    priceAtPurchase: number
    variant: {
      name: string | null
      sku: string
      product: {
        name: string
      }
    }
  }[]
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTrackingId, setEditingTrackingId] = useState<string | null>(null)
  const [trackingNumbers, setTrackingNumbers] = useState<Record<string, string>>({})
  const [exporting, setExporting] = useState(false)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/orders')
      if (!response.ok) throw new Error('Failed to fetch orders')

      const data = await response.json()
      setOrders(data.orders)

      // Initialize tracking numbers
      const initialTracking: Record<string, string> = {}
      data.orders.forEach((order: Order) => {
        initialTracking[order.id] = order.cdekTrackingNumber || ''
      })
      setTrackingNumbers(initialTracking)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleSaveTracking = async (orderId: string) => {
    try {
      const response = await fetch('/api/admin/orders/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          trackingNumber: trackingNumbers[orderId],
        }),
      })

      if (!response.ok) throw new Error('Failed to save tracking number')

      setEditingTrackingId(null)
      fetchOrders()
    } catch (error) {
      console.error('Error saving tracking number:', error)
      alert('Не удалось сохранить номер накладной')
    }
  }

  const handleExportExcel = async () => {
    setExporting(true)
    try {
      const response = await fetch('/api/admin/orders/export')
      if (!response.ok) throw new Error('Failed to export orders')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `orders_${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error exporting orders:', error)
      alert('Не удалось экспортировать заказы')
    } finally {
      setExporting(false)
    }
  }

  const stats = {
    total: orders.length,
    paid: orders.filter((o) => o.status === 'PAID').length,
    pending: orders.filter((o) => o.status === 'PENDING').length,
    refunded: orders.filter((o) => o.status === 'REFUNDED').length,
    cancelled: orders.filter((o) => o.status === 'CANCELLED').length,
  }

  return (
    <div style={{ display: 'grid', gap: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 40, marginBottom: 8 }}>
            📦 Заказы
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 16 }}>
            Всего заказов: {orders.length}
          </p>
        </div>
        <button
          onClick={handleExportExcel}
          disabled={exporting || orders.length === 0}
          className="btn"
          style={{
            background: 'var(--accent)',
            color: '#fff',
            opacity: exporting || orders.length === 0 ? 0.5 : 1,
            cursor: exporting || orders.length === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          {exporting ? 'Экспорт...' : '📊 Экспорт в Excel'}
        </button>
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
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
            Загрузка...
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--ring)' }}>
                  <th style={{ padding: 12, textAlign: 'left', fontSize: 14 }}>Номер</th>
                  <th style={{ padding: 12, textAlign: 'left', fontSize: 14 }}>Клиент</th>
                  <th style={{ padding: 12, textAlign: 'left', fontSize: 14 }}>Товары</th>
                  <th style={{ padding: 12, textAlign: 'right', fontSize: 14 }}>Сумма</th>
                  <th style={{ padding: 12, textAlign: 'center', fontSize: 14 }}>Статус</th>
                  <th style={{ padding: 12, textAlign: 'left', fontSize: 14 }}>Накладная СДЭК</th>
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
                    <td style={{ padding: 12 }}>
                      {editingTrackingId === order.id ? (
                        <div style={{ display: 'flex', gap: 4 }}>
                          <input
                            type="text"
                            value={trackingNumbers[order.id]}
                            onChange={(e) =>
                              setTrackingNumbers({
                                ...trackingNumbers,
                                [order.id]: e.target.value,
                              })
                            }
                            style={{
                              flex: 1,
                              padding: '4px 8px',
                              borderRadius: 6,
                              border: '1px solid var(--ring)',
                              background: 'var(--surface)',
                              color: 'var(--text)',
                              fontSize: 13,
                            }}
                            placeholder="Номер накладной"
                          />
                          <button
                            onClick={() => handleSaveTracking(order.id)}
                            className="btn"
                            style={{
                              background: 'var(--accent)',
                              color: '#fff',
                              fontSize: 12,
                              padding: '4px 12px',
                            }}
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => setEditingTrackingId(null)}
                            className="btn btn-ghost"
                            style={{
                              fontSize: 12,
                              padding: '4px 12px',
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => setEditingTrackingId(order.id)}
                          style={{
                            cursor: 'pointer',
                            fontSize: 13,
                            color: order.cdekTrackingNumber ? 'var(--text)' : 'var(--muted)',
                            fontFamily: order.cdekTrackingNumber ? 'monospace' : 'inherit',
                          }}
                        >
                          {order.cdekTrackingNumber || '+ Добавить'}
                        </div>
                      )}
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
        )}
      </div>
    </div>
  )
}
