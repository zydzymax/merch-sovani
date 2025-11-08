'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CartItemActionsProps {
  itemId: string
  currentQuantity: number
}

export default function CartItemActions({ itemId, currentQuantity }: CartItemActionsProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const updateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return

    setLoading(true)
    try {
      const res = await fetch('/api/cart/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, quantity: newQuantity }),
      })

      if (!res.ok) throw new Error('Ошибка обновления')

      router.refresh()
    } catch (error) {
      console.error('Update error:', error)
      alert('Ошибка при обновлении количества')
    } finally {
      setLoading(false)
    }
  }

  const removeItem = async () => {
    if (!confirm('Удалить товар из корзины?')) return

    setLoading(true)
    try {
      const res = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      })

      if (!res.ok) throw new Error('Ошибка удаления')

      router.refresh()
    } catch (error) {
      console.error('Remove error:', error)
      alert('Ошибка при удалении товара')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Quantity controls */}
      <div className="flex items-center border rounded-lg">
        <button
          onClick={() => updateQuantity(currentQuantity - 1)}
          disabled={loading || currentQuantity <= 1}
          className="px-3 py-1 hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          −
        </button>
        <span className="px-3 py-1 border-x text-center min-w-[40px]">{currentQuantity}</span>
        <button
          onClick={() => updateQuantity(currentQuantity + 1)}
          disabled={loading}
          className="px-3 py-1 hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          +
        </button>
      </div>

      {/* Remove button */}
      <button
        onClick={removeItem}
        disabled={loading}
        className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
      >
        Удалить
      </button>
    </div>
  )
}
