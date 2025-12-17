'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from './Toast'

interface AddToCartButtonProps {
  variantId: string
  productName: string
}

export default function AddToCartButton({ variantId, productName }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const { showToast } = useToast()

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId, quantity }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Ошибка добавления в корзину')
      }

      // Show success state
      setSuccess(true)
      setQuantity(1)

      // Notify navbar to update cart count
      window.dispatchEvent(new Event('cartUpdated'))

      // Show toast
      showToast(`${productName} добавлен в корзину`, 'success')

      // Redirect after delay
      setTimeout(() => {
        router.push('/cart')
      }, 1500)

    } catch (error: any) {
      console.error('Add to cart error:', error)
      showToast(error.message || 'Ошибка при добавлении', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {/* Quantity Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <label style={{ fontWeight: 600, fontSize: 14 }}>Количество:</label>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            border: '1px solid var(--ring)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden'
          }}
        >
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={loading || quantity <= 1}
            type="button"
            style={{
              width: 44,
              height: 44,
              background: 'var(--surface-2)',
              border: 'none',
              color: quantity <= 1 ? 'var(--text-muted)' : 'var(--text)',
              cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
              fontSize: 20,
              fontWeight: 600,
              transition: 'background 0.2s ease'
            }}
          >
            −
          </button>
          <input
            type="number"
            min="1"
            max="10"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
            style={{
              width: 60,
              height: 44,
              textAlign: 'center',
              border: 'none',
              borderLeft: '1px solid var(--ring)',
              borderRight: '1px solid var(--ring)',
              background: 'var(--surface)',
              color: 'var(--text)',
              fontSize: 16,
              fontWeight: 600,
              outline: 'none'
            }}
          />
          <button
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
            disabled={loading || quantity >= 10}
            type="button"
            style={{
              width: 44,
              height: 44,
              background: 'var(--surface-2)',
              border: 'none',
              color: quantity >= 10 ? 'var(--text-muted)' : 'var(--text)',
              cursor: quantity >= 10 ? 'not-allowed' : 'pointer',
              fontSize: 20,
              fontWeight: 600,
              transition: 'background 0.2s ease'
            }}
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={loading || success}
        className="btn btn-primary"
        style={{
          width: '100%',
          padding: '18px 32px',
          fontSize: 16,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          opacity: (loading || success) ? 0.8 : 1,
          cursor: (loading || success) ? 'not-allowed' : 'pointer',
          background: success ? '#22c55e' : undefined,
          transition: 'all 0.3s ease'
        }}
      >
        {loading ? (
          <>
            <span
              style={{
                width: 20,
                height: 20,
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }}
            />
            Добавление...
          </>
        ) : success ? (
          <>
            <span style={{ fontSize: 20 }}>✓</span>
            Добавлено! Переход в корзину...
          </>
        ) : (
          <>
            <span style={{ fontSize: 20 }}>🛒</span>
            Добавить в корзину
          </>
        )}
      </button>

      {/* Quick View Link */}
      <button
        onClick={() => router.push('/cart')}
        className="btn btn-ghost"
        style={{
          width: '100%',
          padding: '14px 24px',
          fontSize: 14
        }}
      >
        Перейти в корзину
      </button>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
