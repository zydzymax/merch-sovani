'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function SellerProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    images: '',
    category: 'CLOTHING',
  })

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    try {
      const response = await fetch('/api/seller/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const productData = {
      name: formData.name,
      description: formData.description,
      images: formData.images.split(',').map(s => s.trim()).filter(Boolean),
      category: formData.category,
    }

    try {
      const url = editingProduct
        ? `/api/seller/products/${editingProduct.id}`
        : '/api/seller/products'

      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        setShowForm(false)
        setEditingProduct(null)
        setFormData({ name: '', description: '', images: '', category: 'CLOTHING' })
        loadProducts()
      } else {
        alert('Ошибка при сохранении товара')
      }
    } catch (error) {
      console.error('Failed to save product:', error)
      alert('Ошибка при сохранении товара')
    }
  }

  function handleEdit(product: any) {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      images: product.images.join(', '),
      category: product.category || 'CLOTHING',
    })
    setShowForm(true)
  }

  async function handleDelete(productId: string) {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return

    try {
      const response = await fetch(`/api/seller/products/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        loadProducts()
      } else {
        alert('Ошибка при удалении товара')
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
      alert('Ошибка при удалении товара')
    }
  }

  if (loading) {
    return <div>Загрузка...</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700 }}>
          Мои товары
        </h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(true)
            setEditingProduct(null)
            setFormData({ name: '', description: '', images: '', category: 'CLOTHING' })
          }}
        >
          + Добавить товар
        </button>
      </div>

      {showForm && (
        <div className="tile" style={{ padding: 30, marginBottom: 30 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>
            {editingProduct ? 'Редактировать товар' : 'Новый товар'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>
                  Название товара *
                </label>
                <input
                  type="text"
                  className="input"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>
                  Описание
                </label>
                <textarea
                  className="input"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>
                  Категория *
                </label>
                <select
                  className="input"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="CLOTHING">Одежда</option>
                  <option value="SUPPLEMENTS">Добавки</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>
                  Ссылки на изображения (через запятую)
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="/images/product1.webp, /images/product2.webp"
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: 15 }}>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Сохранить' : 'Создать'}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setShowForm(false)
                    setEditingProduct(null)
                  }}
                >
                  Отмена
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {products.length === 0 ? (
        <div className="tile" style={{ padding: 60, textAlign: 'center' }}>
          <p style={{ fontSize: 16, color: 'var(--muted)' }}>
            У вас пока нет товаров. Добавьте первый товар, чтобы начать продажи.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 20 }}>
          {products.map((product: any) => (
            <div key={product.id} className="tile" style={{ padding: 20 }}>
              <div style={{ display: 'flex', gap: 20 }}>
                {product.images?.[0] && (
                  <div style={{ width: 120, height: 120, position: 'relative', flexShrink: 0, borderRadius: 8, overflow: 'hidden', background: 'var(--ring)' }}>
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                )}

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
                    {product.name}
                  </h3>
                  {product.description && (
                    <p style={{ color: 'var(--muted)', marginBottom: 12, fontSize: 14 }}>
                      {product.description.substring(0, 150)}
                      {product.description.length > 150 && '...'}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: 20, fontSize: 14 }}>
                    <span>
                      <strong>Категория:</strong> {product.category === 'CLOTHING' ? 'Одежда' : 'Добавки'}
                    </span>
                    <span style={{ color: product.isActive ? 'var(--success)' : 'var(--muted)' }}>
                      {product.isActive ? '✓ Активен' : '○ Не активен'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleEdit(product)}
                  >
                    Редактировать
                  </button>
                  <button
                    className="btn btn-ghost"
                    onClick={() => handleDelete(product.id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
