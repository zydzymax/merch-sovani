'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface CartItem {
  id: string
  quantity: number
  variant: {
    id: string
    price: number
    name: string
    product: {
      id: string
      name: string
      slug: string
      images: string[]
    }
  }
}

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())

  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch('/api/cart/get')
      if (!res.ok) throw new Error('Ошибка загрузки корзины')
      const data = await res.json()
      setCartItems(data.items || [])
      setSubtotal(data.subtotal || 0)
      setError('')
    } catch (err) {
      setError('Не удалось загрузить корзину')
      console.error('Cart fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 100) return

    setUpdatingItems(prev => new Set(prev).add(itemId))

    try {
      const res = await fetch('/api/cart/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, quantity: newQuantity }),
      })

      if (!res.ok) throw new Error('Ошибка обновления')

      // Update local state
      setCartItems(prev => prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ))

      // Recalculate subtotal
      setSubtotal(prev => {
        const item = cartItems.find(i => i.id === itemId)
        if (!item) return prev
        const diff = (newQuantity - item.quantity) * item.variant.price
        return prev + diff
      })

      // Notify navbar
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (err) {
      console.error('Update error:', err)
      fetchCart() // Refresh on error
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev)
        next.delete(itemId)
        return next
      })
    }
  }

  const removeItem = async (itemId: string) => {
    setUpdatingItems(prev => new Set(prev).add(itemId))

    try {
      const res = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      })

      if (!res.ok) throw new Error('Ошибка удаления')

      // Update local state
      const removedItem = cartItems.find(i => i.id === itemId)
      setCartItems(prev => prev.filter(item => item.id !== itemId))

      if (removedItem) {
        setSubtotal(prev => prev - (removedItem.variant.price * removedItem.quantity))
      }

      // Notify navbar
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (err) {
      console.error('Remove error:', err)
      fetchCart() // Refresh on error
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev)
        next.delete(itemId)
        return next
      })
    }
  }

  const formatPrice = (price: number) => {
    return `${(price / 100).toLocaleString('ru-RU')} ₽`
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
        <div className="container" style={{ padding: '48px 24px' }}>
          <h1 className="font-display" style={{ fontSize: '40px', fontWeight: 700, marginBottom: 32 }}>Корзина</h1>
          <div style={{ display: 'grid', gap: 16 }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="tile" style={{
                padding: 24,
                display: 'grid',
                gridTemplateColumns: '100px 1fr auto',
                gap: 24,
                animation: 'pulse 2s infinite'
              }}>
                <div style={{ aspectRatio: '1', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)' }} />
                <div>
                  <div style={{ height: 20, background: 'var(--surface-2)', borderRadius: 8, marginBottom: 12, width: '60%' }} />
                  <div style={{ height: 16, background: 'var(--surface-2)', borderRadius: 8, width: '40%' }} />
                </div>
                <div style={{ height: 24, background: 'var(--surface-2)', borderRadius: 8, width: 80 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
        <div className="container" style={{ padding: '48px 24px' }}>
          <h1 className="font-display" style={{ fontSize: '40px', fontWeight: 700, marginBottom: 32 }}>Корзина</h1>
          <div className="tile" style={{ padding: 48, textAlign: 'center' }}>
            <p style={{ color: 'var(--accent)', marginBottom: 24, fontSize: 18 }}>{error}</p>
            <button
              onClick={() => { setLoading(true); fetchCart(); }}
              className="btn btn-primary"
              style={{ marginRight: 16 }}
            >
              Попробовать снова
            </button>
            <Link href="/catalog" className="btn btn-ghost">
              В каталог
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
        <div className="container" style={{ padding: '48px 24px' }}>
          <h1 className="font-display" style={{ fontSize: '40px', fontWeight: 700, marginBottom: 32 }}>Корзина</h1>
          <div className="tile" style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 64, marginBottom: 24 }}>🛒</div>
            <p className="lead" style={{ fontSize: 20, marginBottom: 24, color: 'var(--text-muted)' }}>
              Ваша корзина пуста
            </p>
            <Link
              href="/catalog"
              className="btn btn-primary"
              style={{ display: 'inline-block', padding: '14px 32px' }}
            >
              Перейти в каталог
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Cart with items
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <div className="container" style={{ padding: '48px 24px' }}>
        <h1 className="font-display" style={{ fontSize: '40px', fontWeight: 700, marginBottom: 32 }}>Корзина</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }} className="lg-grid-cart">
          {/* Cart Items */}
          <div style={{ display: 'grid', gap: 16 }}>
            {cartItems.map((item) => {
              const isUpdating = updatingItems.has(item.id)
              return (
                <div
                  key={item.id}
                  className="tile"
                  style={{
                    padding: 24,
                    display: 'grid',
                    gridTemplateColumns: '100px 1fr',
                    gap: 24,
                    opacity: isUpdating ? 0.6 : 1,
                    transition: 'opacity 0.2s ease'
                  }}
                >
                  {/* Product Image */}
                  <Link href={`/product/${item.variant.product.slug}`}>
                    <div style={{
                      position: 'relative',
                      aspectRatio: '1',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      background: 'var(--surface-2)'
                    }}>
                      {item.variant.product.images?.[0] ? (
                        <Image
                          src={item.variant.product.images[0]}
                          alt={item.variant.product.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="100px"
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--text-muted)'
                        }}>
                          Нет фото
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                      <div>
                        <Link href={`/product/${item.variant.product.slug}`}>
                          <h3 style={{
                            fontWeight: 600,
                            fontSize: 16,
                            marginBottom: 4,
                            cursor: 'pointer'
                          }}>
                            {item.variant.product.name}
                          </h3>
                        </Link>
                        {item.variant.name && (
                          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                            {item.variant.name}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={isUpdating}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          padding: 8,
                          fontSize: 18,
                          lineHeight: 1,
                          transition: 'color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                        title="Удалить"
                      >
                        ✕
                      </button>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 'auto'
                    }}>
                      {/* Quantity Controls */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0,
                        border: '1px solid var(--ring)',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden'
                      }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={isUpdating || item.quantity <= 1}
                          style={{
                            width: 36,
                            height: 36,
                            background: 'var(--surface-2)',
                            border: 'none',
                            color: item.quantity <= 1 ? 'var(--text-muted)' : 'var(--text)',
                            cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                            fontSize: 18,
                            fontWeight: 600,
                            transition: 'background 0.2s ease'
                          }}
                        >
                          −
                        </button>
                        <span style={{
                          width: 48,
                          height: 36,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 600,
                          background: 'var(--surface)'
                        }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={isUpdating || item.quantity >= 100}
                          style={{
                            width: 36,
                            height: 36,
                            background: 'var(--surface-2)',
                            border: 'none',
                            color: item.quantity >= 100 ? 'var(--text-muted)' : 'var(--text)',
                            cursor: item.quantity >= 100 ? 'not-allowed' : 'pointer',
                            fontSize: 18,
                            fontWeight: 600,
                            transition: 'background 0.2s ease'
                          }}
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div style={{ textAlign: 'right' }}>
                        <p style={{
                          fontWeight: 700,
                          fontSize: 18,
                          color: 'var(--text)'
                        }}>
                          {formatPrice(item.variant.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                            {formatPrice(item.variant.price)} за шт.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="tile cart-summary" style={{
            padding: 32,
            height: 'fit-content',
            position: 'sticky',
            top: 100
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Итого</h2>

            <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Товары ({cartItems.reduce((sum, i) => sum + i.quantity, 0)} шт.)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Доставка</span>
                <span>Бесплатно</span>
              </div>
              <div style={{
                paddingTop: 16,
                borderTop: '1px solid var(--ring)',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 20,
                fontWeight: 700
              }}>
                <span>К оплате</span>
                <span style={{ color: 'var(--accent)' }}>{formatPrice(subtotal)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="btn btn-primary"
              style={{
                width: '100%',
                textAlign: 'center',
                padding: '16px 24px',
                display: 'block',
                fontSize: 16
              }}
            >
              Оформить заказ
            </Link>

            <Link
              href="/catalog"
              className="btn btn-ghost"
              style={{
                width: '100%',
                textAlign: 'center',
                padding: '14px 24px',
                display: 'block',
                marginTop: 12
              }}
            >
              Продолжить покупки
            </Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.8; }
        }

        @media (min-width: 1024px) {
          .lg-grid-cart {
            grid-template-columns: 1fr 380px !important;
          }
        }

        @media (max-width: 640px) {
          .cart-summary {
            position: relative !important;
            top: 0 !important;
          }
        }
      `}</style>
    </div>
  )
}
