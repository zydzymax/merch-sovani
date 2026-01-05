'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

type OrderItem = {
  id: string
  quantity: number
  priceAtPurchase: number
  variant: {
    id: string
    name: string | null
    sku: string
    size: string
    product: {
      id: string
      name: string
      images: string[]
    }
  }
}

type Order = {
  id: string
  orderNumber: string
  email: string
  phone: string
  status: string
  total: number
  subtotal: number
  shippingCost: number
  shippingFullName: string | null
  shippingAddress: string | null
  shippingCity: string | null
  shippingPostalCode: string | null
  shippingMethod: string | null
  cdekTrackingNumber: string | null
  cdekOrderUuid: string | null
  fraudScore: number
  notes: string | null
  createdAt: string
  paidAt: string | null
  user: {
    id: string
    email: string
    name: string | null
    phone: string | null
  } | null
  items: OrderItem[]
}

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Ожидает оплаты', color: '#FFB300' },
  { value: 'PAID', label: 'Оплачен', color: '#00C853' },
  { value: 'PROCESSING', label: 'В обработке', color: '#2196F3' },
  { value: 'SHIPPED', label: 'Отправлен', color: '#9C27B0' },
  { value: 'DELIVERED', label: 'Доставлен', color: '#4CAF50' },
  { value: 'CANCELLED', label: 'Отменен', color: '#9E9E9E' },
  { value: 'REFUNDED', label: 'Возврат', color: '#F44336' },
]

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [status, setStatus] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`)
      if (!response.ok) {
        if (response.status === 404) {
          router.push('/admin/orders')
          return
        }
        throw new Error('Failed to fetch order')
      }
      const data = await response.json()
      setOrder(data)
      setTrackingNumber(data.cdekTrackingNumber || '')
      setStatus(data.status)
      setNotes(data.notes || '')
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          cdekTrackingNumber: trackingNumber || null,
          notes: notes || null,
        }),
      })

      if (!response.ok) throw new Error('Failed to update order')
      
      await fetchOrder()
      alert('Заказ обновлен')
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Ошибка при обновлении заказа')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
        Загрузка...
      </div>
    )
  }

  if (!order) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)', marginBottom: 20 }}>Заказ не найден</p>
        <Link href="/admin/orders" className="btn btn-primary">
          ← Вернуться к заказам
        </Link>
      </div>
    )
  }

  const statusInfo = STATUS_OPTIONS.find(s => s.value === order.status) || STATUS_OPTIONS[0]

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Link 
            href="/admin/orders" 
            style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 8, display: 'block' }}
          >
            ← Назад к заказам
          </Link>
          <h1 className="font-display" style={{ fontSize: 32, marginBottom: 8 }}>
            Заказ {order.orderNumber}
          </h1>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span
              style={{
                padding: '6px 16px',
                borderRadius: 20,
                fontSize: 14,
                fontWeight: 600,
                background: statusInfo.color,
                color: '#fff',
              }}
            >
              {statusInfo.label}
            </span>
            <span style={{ color: 'var(--muted)', fontSize: 14 }}>
              {new Date(order.createdAt).toLocaleString('ru-RU')}
            </span>
            {order.fraudScore >= 30 && (
              <span
                style={{
                  padding: '4px 12px',
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 600,
                  background: order.fraudScore >= 50 ? '#F44336' : '#FFB300',
                  color: '#fff',
                }}
              >
                Fraud: {order.fraudScore}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary"
          style={{ padding: '12px 24px' }}
        >
          {saving ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Left Column */}
        <div style={{ display: 'grid', gap: 24 }}>
          {/* Order Items */}
          <div className="tile" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 20, marginBottom: 20 }}>Товары</h2>
            <div style={{ display: 'grid', gap: 16 }}>
              {order.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: 16,
                    padding: 16,
                    background: 'var(--surface)',
                    borderRadius: 12,
                  }}
                >
                  {item.variant.product.images[0] && (
                    <img
                      src={item.variant.product.images[0]}
                      alt={item.variant.product.name}
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: 'cover',
                        borderRadius: 8,
                      }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>
                      {item.variant.product.name}
                    </div>
                    <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 4 }}>
                      {item.variant.size} • SKU: {item.variant.sku}
                    </div>
                    <div style={{ fontSize: 14 }}>
                      {item.quantity} × {(item.priceAtPurchase / 100).toLocaleString('ru-RU')} ₽
                    </div>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>
                    {((item.priceAtPurchase * item.quantity) / 100).toLocaleString('ru-RU')} ₽
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--ring)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'var(--muted)' }}>Товары:</span>
                <span>{(order.subtotal / 100).toLocaleString('ru-RU')} ₽</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'var(--muted)' }}>Доставка:</span>
                <span>{(order.shippingCost / 100).toLocaleString('ru-RU')} ₽</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
                <span>Итого:</span>
                <span>{(order.total / 100).toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="tile" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 20, marginBottom: 16 }}>Заметки</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Добавить заметку к заказу..."
              rows={4}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid var(--ring)',
                background: 'var(--surface)',
                color: 'var(--text)',
                resize: 'vertical',
              }}
            />
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'grid', gap: 24, alignContent: 'start' }}>
          {/* Status & Tracking */}
          <div className="tile" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 20, marginBottom: 16 }}>Статус и доставка</h2>
            
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>
                Статус заказа
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '1px solid var(--ring)',
                  background: 'var(--surface)',
                  color: 'var(--text)',
                }}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>
                Номер накладной СДЭК
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Введите номер накладной"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '1px solid var(--ring)',
                  background: 'var(--surface)',
                  color: 'var(--text)',
                }}
              />
            </div>

            {order.cdekOrderUuid && (
              <div style={{ marginTop: 16, fontSize: 12, color: 'var(--muted)' }}>
                СДЭК UUID: {order.cdekOrderUuid}
              </div>
            )}
          </div>

          {/* Customer Info */}
          <div className="tile" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 20, marginBottom: 16 }}>Покупатель</h2>
            <div style={{ display: 'grid', gap: 12 }}>
              <div>
                <div style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 4 }}>Имя</div>
                <div>{order.shippingFullName || order.user?.name || '—'}</div>
              </div>
              <div>
                <div style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 4 }}>Email</div>
                <div>{order.email}</div>
              </div>
              <div>
                <div style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 4 }}>Телефон</div>
                <div>{order.phone || order.user?.phone || '—'}</div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="tile" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 20, marginBottom: 16 }}>Адрес доставки</h2>
            <div style={{ display: 'grid', gap: 8 }}>
              <div>{order.shippingFullName}</div>
              <div>{order.shippingAddress}</div>
              <div>
                {order.shippingCity}
                {order.shippingPostalCode && `, ${order.shippingPostalCode}`}
              </div>
              {order.shippingMethod && (
                <div style={{ marginTop: 8, color: 'var(--muted)', fontSize: 14 }}>
                  Способ: {order.shippingMethod}
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          {order.paidAt && (
            <div className="tile" style={{ padding: 24 }}>
              <h2 style={{ fontSize: 20, marginBottom: 16 }}>Оплата</h2>
              <div style={{ color: '#00C853', fontWeight: 600 }}>
                Оплачен {new Date(order.paidAt).toLocaleString('ru-RU')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
