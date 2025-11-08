'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AddToCartButtonProps {
  variantId: string
  productName: string
}

export default function AddToCartButton({ variantId, productName }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const router = useRouter()

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId, quantity }),
      })

      if (!res.ok) {
        throw new Error('Ошибка добавления в корзину')
      }

      // Redirect to cart
      router.push('/cart')
    } catch (error) {
      console.error('Add to cart error:', error)
      alert('Ошибка при добавлении товара в корзину')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Quantity */}
      <div className="flex items-center gap-4">
        <label className="font-medium">Количество:</label>
        <div className="flex items-center border rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-2 hover:bg-gray-100 transition-colors"
            type="button"
          >
            −
          </button>
          <input
            type="number"
            min="1"
            max="10"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
            className="w-16 text-center border-x py-2 focus:outline-none"
          />
          <button
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
            className="px-4 py-2 hover:bg-gray-100 transition-colors"
            type="button"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="w-full bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
      >
        {loading ? 'Добавление...' : 'Добавить в корзину'}
      </button>
    </div>
  )
}
