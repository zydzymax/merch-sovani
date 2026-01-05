'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface Variant {
  id?: string
  size: string
  price: number
  stock: number
  weight?: number
  length?: number
  width?: number
  height?: number
}

interface ProductFormData {
  name: string
  category: 'CLOTHING' | 'SUPPLEMENTS'
  description: string
  images: string[]
  material?: string
  brand?: string
  country?: string
  care?: string
  composition?: string
  sellerName?: string
  sellerInn?: string
  sellerOgrn?: string
  sellerAddress?: string
  variants: Variant[]
}

export default function ProductEditPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const isNew = productId === 'new'

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: 'CLOTHING',
    description: '',
    images: [''],
    material: '',
    brand: '',
    country: '',
    care: '',
    composition: '',
    sellerName: '',
    sellerInn: '',
    sellerOgrn: '',
    sellerAddress: '',
    variants: [{ size: 'Универсальный', price: 0, stock: 0, weight: 0, length: 0, width: 0, height: 0 }],
  })

  useEffect(() => {
    if (!isNew) {
      fetchProduct()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId])

  async function fetchProduct() {
    try {
      const res = await fetch(`/api/admin/products/${productId}`)
      if (res.ok) {
        const data = await res.json()
        setFormData({
          name: data.name,
          category: data.category || 'CLOTHING',
          description: data.description || '',
          images: data.images.length > 0 ? data.images : [''],
          material: data.material || '',
          brand: data.brand || '',
          country: data.country || '',
          care: data.care || '',
          composition: data.composition || '',
          sellerName: data.sellerName || '',
          sellerInn: data.sellerInn || '',
          sellerOgrn: data.sellerOgrn || '',
          sellerAddress: data.sellerAddress || '',
          variants: data.variants.length > 0 ? data.variants : [{ size: 'Универсальный', price: 0, stock: 0 }],
        })
      }
    } catch (error) {
      console.error('Failed to fetch product:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const endpoint = isNew ? '/api/admin/products' : `/api/admin/products/${productId}`
      const method = isNew ? 'POST' : 'PUT'

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images: formData.images.filter(img => img.trim() !== ''),
        }),
      })

      if (res.ok) {
        router.push('/admin/products')
      } else {
        alert('Ошибка при сохранении товара')
      }
    } catch (error) {
      console.error('Failed to save product:', error)
      alert('Ошибка при сохранении товара')
    } finally {
      setSaving(false)
    }
  }

  function addImage() {
    setFormData({ ...formData, images: [...formData.images, ''] })
  }

  function updateImage(index: number, value: string) {
    const newImages = [...formData.images]
    newImages[index] = value
    setFormData({ ...formData, images: newImages })
  }

  function removeImage(index: number) {
    const newImages = formData.images.filter((_, i) => i !== index)
    setFormData({ ...formData, images: newImages.length > 0 ? newImages : [''] })
  }

  function addVariant() {
    setFormData({
      ...formData,
      variants: [...formData.variants, { size: '', price: 0, stock: 0, weight: 0, length: 0, width: 0, height: 0 }],
    })
  }

  function updateVariant(index: number, field: keyof Variant, value: string | number) {
    const newVariants = [...formData.variants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setFormData({ ...formData, variants: newVariants })
  }

  function removeVariant(index: number) {
    const newVariants = formData.variants.filter((_, i) => i !== index)
    setFormData({ ...formData, variants: newVariants.length > 0 ? newVariants : [{ size: '', price: 0, stock: 0 }] })
  }

  if (loading) {
    return <div style={{ padding: 40 }}>Загрузка...</div>
  }

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ marginBottom: 30 }}>{isNew ? 'Новый товар' : 'Редактирование товара'}</h1>

      <form onSubmit={handleSubmit}>
        {/* Основная информация */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, marginBottom: 20 }}>Основная информация</h2>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Название товара *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid #333',
                background: '#1a1a1a',
                color: '#fff',
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Категория *</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as 'CLOTHING' | 'SUPPLEMENTS' })}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid #333',
                background: '#1a1a1a',
                color: '#fff',
              }}
            >
              <option value="CLOTHING">Аксессуары</option>
              <option value="SUPPLEMENTS">Добавки</option>
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Описание</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid #333',
                background: '#1a1a1a',
                color: '#fff',
                resize: 'vertical',
              }}
            />
          </div>


          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Бренд</label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid #333',
                background: '#1a1a1a',
                color: '#fff',
              }}
            />
          </div>
        </section>

        {/* Изображения */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, marginBottom: 20 }}>Изображения</h2>
          {formData.images.map((img, index) => (
            <div key={index} style={{ marginBottom: 12, display: 'flex', gap: 12 }}>
              <input
                type="text"
                placeholder="URL изображения"
                value={img}
                onChange={(e) => updateImage(index, e.target.value)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '1px solid #333',
                  background: '#1a1a1a',
                  color: '#fff',
                }}
              />
              {formData.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: 8,
                    border: '1px solid #d32f2f',
                    background: 'transparent',
                    color: '#d32f2f',
                    cursor: 'pointer',
                  }}
                >
                  Удалить
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImage}
            style={{
              padding: '12px 24px',
              borderRadius: 8,
              border: '1px solid #fff',
              background: 'transparent',
              color: '#fff',
              cursor: 'pointer',
              marginTop: 8,
            }}
          >
            + Добавить изображение
          </button>
        </section>

        {/* Характеристики товара */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, marginBottom: 20 }}>Характеристики товара</h2>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Материал</label>
            <input
              type="text"
              placeholder="Например: 100% хлопок"
              value={formData.material}
              onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid #333',
                background: '#1a1a1a',
                color: '#fff',
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Страна производства</label>
            <input
              type="text"
              placeholder="Например: Россия"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid #333',
                background: '#1a1a1a',
                color: '#fff',
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Состав</label>
            <textarea
              placeholder="Подробный состав товара"
              value={formData.composition}
              onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
              rows={3}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid #333',
                background: '#1a1a1a',
                color: '#fff',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Уход за товаром</label>
            <textarea
              placeholder="Инструкции по уходу"
              value={formData.care}
              onChange={(e) => setFormData({ ...formData, care: e.target.value })}
              rows={3}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid #333',
                background: '#1a1a1a',
                color: '#fff',
                resize: 'vertical',
              }}
            />
          </div>
        </section>

        {/* Данные продавца */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, marginBottom: 20 }}>Данные продавца</h2>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Наименование (ИП/ООО)</label>
            <input
              type="text"
              placeholder="Например: ИП Иванов Иван Иванович"
              value={formData.sellerName}
              onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid #333',
                background: '#1a1a1a',
                color: '#fff',
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>ИНН</label>
            <input
              type="text"
              placeholder="12 цифр"
              value={formData.sellerInn}
              onChange={(e) => setFormData({ ...formData, sellerInn: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid #333',
                background: '#1a1a1a',
                color: '#fff',
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>ОГРН/ОГРНИП</label>
            <input
              type="text"
              placeholder="13 или 15 цифр"
              value={formData.sellerOgrn}
              onChange={(e) => setFormData({ ...formData, sellerOgrn: e.target.value })}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid #333',
                background: '#1a1a1a',
                color: '#fff',
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Юридический адрес</label>
            <textarea
              placeholder="Полный юридический адрес"
              value={formData.sellerAddress}
              onChange={(e) => setFormData({ ...formData, sellerAddress: e.target.value })}
              rows={2}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid #333',
                background: '#1a1a1a',
                color: '#fff',
                resize: 'vertical',
              }}
            />
          </div>
        </section>

        {/* Варианты и габариты */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, marginBottom: 20 }}>Варианты товара и габариты</h2>
          {formData.variants.map((variant, index) => (
            <div
              key={index}
              style={{
                marginBottom: 20,
                padding: 20,
                border: '1px solid #333',
                borderRadius: 8,
                background: '#1a1a1a',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 18 }}>Вариант {index + 1}</h3>
                {formData.variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 6,
                      border: '1px solid #d32f2f',
                      background: 'transparent',
                      color: '#d32f2f',
                      cursor: 'pointer',
                      fontSize: 14,
                    }}
                  >
                    Удалить вариант
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>
                    Размер *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="S, M, L или Универсальный"
                    value={variant.size}
                    onChange={(e) => updateVariant(index, 'size', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 6,
                      border: '1px solid #444',
                      background: '#0a0a0a',
                      color: '#fff',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>
                    Цена (в копейках) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="Например: 199900"
                    value={variant.price}
                    onChange={(e) => updateVariant(index, 'price', parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 6,
                      border: '1px solid #444',
                      background: '#0a0a0a',
                      color: '#fff',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>
                    Количество на складе *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={variant.stock}
                    onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 6,
                      border: '1px solid #444',
                      background: '#0a0a0a',
                      color: '#fff',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>
                    Вес (грамм)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Например: 250"
                    value={variant.weight || ''}
                    onChange={(e) => updateVariant(index, 'weight', parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 6,
                      border: '1px solid #444',
                      background: '#0a0a0a',
                      color: '#fff',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>
                    Длина (см)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Например: 30"
                    value={variant.length || ''}
                    onChange={(e) => updateVariant(index, 'length', parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 6,
                      border: '1px solid #444',
                      background: '#0a0a0a',
                      color: '#fff',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>
                    Ширина (см)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Например: 20"
                    value={variant.width || ''}
                    onChange={(e) => updateVariant(index, 'width', parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 6,
                      border: '1px solid #444',
                      background: '#0a0a0a',
                      color: '#fff',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>
                    Высота (см)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Например: 5"
                    value={variant.height || ''}
                    onChange={(e) => updateVariant(index, 'height', parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 6,
                      border: '1px solid #444',
                      background: '#0a0a0a',
                      color: '#fff',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addVariant}
            style={{
              padding: '12px 24px',
              borderRadius: 8,
              border: '1px solid #fff',
              background: 'transparent',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            + Добавить вариант
          </button>
        </section>

        {/* Кнопки действий */}
        <div style={{ display: 'flex', gap: 16, paddingTop: 20, borderTop: '1px solid #333' }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '14px 32px',
              borderRadius: 8,
              border: 'none',
              background: '#fff',
              color: '#000',
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? 'Сохранение...' : 'Сохранить товар'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            style={{
              padding: '14px 32px',
              borderRadius: 8,
              border: '1px solid #666',
              background: 'transparent',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  )
}
