'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string
  productName: string
}) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm(`Вы уверены, что хотите удалить товар "${productName}"?`)) {
      return
    }

    setDeleting(true)

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        router.refresh()
      } else {
        alert('Ошибка при удалении товара')
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
      alert('Ошибка при удалении товара')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="btn btn-ghost"
      style={{
        fontSize: 14,
        color: '#d32f2f',
        opacity: deleting ? 0.6 : 1,
        cursor: deleting ? 'not-allowed' : 'pointer',
      }}
    >
      {deleting ? 'Удаление...' : 'Удалить'}
    </button>
  )
}
