'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Tshirt {
  id: string
  name: string
  color: string
  colorHex: string
  price: number
  image: string
}

const tshirts: Tshirt[] = [
  { id: 'tshirt-black', name: 'Футболка', color: 'Чёрная', colorHex: '#1a1a1a', price: 2500, image: '/assets/xmas/minchenko-tshirt-black.png' },
  { id: 'tshirt-gray', name: 'Футболка', color: 'Серая', colorHex: '#6b7280', price: 2500, image: '/assets/xmas/minchenko-tshirt-gray.png' },
  { id: 'tshirt-navy', name: 'Футболка', color: 'Тёмно-синяя', colorHex: '#1e3a5f', price: 2500, image: '/assets/xmas/minchenko-tshirt-navy.png' },
  { id: 'tshirt-burgundy', name: 'Футболка', color: 'Бордовая', colorHex: '#722f37', price: 2500, image: '/assets/xmas/minchenko-tshirt-burgundy.png' },
]

export default function TshirtCatalog() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTshirt, setSelectedTshirt] = useState<Tshirt | null>(null)
  const [formData, setFormData] = useState({ name: '', phone: '', size: 'M' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const openModal = (tshirt: Tshirt) => {
    setSelectedTshirt(tshirt)
    setIsModalOpen(true)
    setIsSuccess(false)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedTshirt(null)
    setFormData({ name: '', phone: '', size: 'M' })
    setIsSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/product-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedTshirt?.id,
          productName: `${selectedTshirt?.name} (${selectedTshirt?.color})`,
          customerName: formData.name,
          customerPhone: formData.phone,
          size: formData.size,
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
      } else {
        alert('Ошибка отправки заявки. Попробуйте позже.')
      }
    } catch (error) {
      alert('Ошибка отправки заявки. Попробуйте позже.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="tshirts" className="section">
      <div className="container">
        <h2 className="font-display" style={{ textAlign: 'center' }}>Футболки</h2>
        <p className="lead" style={{ marginTop: 8, textAlign: 'center', maxWidth: 640, marginInline: 'auto' }}>
          Скоро в продаже! Оставьте заявку, и мы свяжемся с вами, когда товар появится.
        </p>

      </div>
      {/* Carousel wrapper - outside container for full-width scroll */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 8,
          paddingBottom: 8,
          marginTop: 24,
        }}
      >
        {tshirts.map((tshirt) => (
          <article
            key={tshirt.id}
            className="tile"
            style={{
              padding: 20,
              position: 'relative',
              minWidth: 240,
              maxWidth: 240,
              flexShrink: 0,
              scrollSnapAlign: 'start',
            }}
          >
              <div style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: '#f59e0b',
                color: '#fff',
                padding: '5px 10px',
                borderRadius: 16,
                fontSize: 11,
                fontWeight: 600,
              }}>
                Скоро
              </div>

              <div style={{
                width: '100%',
                aspectRatio: '1/1',
                borderRadius: 12,
                background: 'var(--surface-2)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <Image
                  src={tshirt.image}
                  alt={`${tshirt.name} ${tshirt.color}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 240px"
                />
              </div>

              <h3 className="font-display" style={{ marginTop: 14, fontSize: 16, textAlign: 'center' }}>
                {tshirt.name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 6 }}>
                <div style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: tshirt.colorHex,
                  border: tshirt.colorHex === '#ffffff' ? '1px solid #ccc' : 'none',
                }} />
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>{tshirt.color}</span>
              </div>

              <div style={{
                marginTop: 10,
                fontSize: 18,
                fontWeight: 700,
                textAlign: 'center',
                color: 'var(--muted)',
                textDecoration: 'line-through',
              }}>
                {tshirt.price.toLocaleString('ru-RU')} ₽
              </div>

              <button
                onClick={() => openModal(tshirt)}
                className="btn"
                style={{
                  width: '100%',
                  marginTop: 14,
                  padding: '12px 20px',
                  background: 'var(--accent)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Оставить заявку
              </button>
            </article>
          ))}
      </div>

      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 16,
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: 'var(--surface)',
              borderRadius: 20,
              padding: 28,
              maxWidth: 400,
              width: '100%',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                background: 'none',
                border: 'none',
                fontSize: 22,
                cursor: 'pointer',
                color: 'var(--muted)',
              }}
            >
              ×
            </button>

            {isSuccess ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: 44, marginBottom: 14 }}>✅</div>
                <h3 className="font-display" style={{ fontSize: 22, marginBottom: 10 }}>Заявка отправлена!</h3>
                <p style={{ color: 'var(--muted)', marginBottom: 20, fontSize: 14 }}>
                  Мы свяжемся с вами, когда товар появится в наличии.
                </p>
                <button onClick={closeModal} className="btn btn-primary" style={{ padding: '12px 28px' }}>
                  Закрыть
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-display" style={{ fontSize: 22, marginBottom: 6, paddingRight: 28 }}>
                  Оставить заявку
                </h3>
                <p style={{ color: 'var(--muted)', marginBottom: 20, fontSize: 13 }}>
                  {selectedTshirt?.name} ({selectedTshirt?.color})
                </p>

                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', marginBottom: 5, fontSize: 13, fontWeight: 500 }}>Имя</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Иван"
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: 10,
                        border: '1px solid var(--border)',
                        background: 'var(--bg)',
                        fontSize: 15,
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', marginBottom: 5, fontSize: 13, fontWeight: 500 }}>Телефон</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+7 999 123-45-67"
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: 10,
                        border: '1px solid var(--border)',
                        background: 'var(--bg)',
                        fontSize: 15,
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 5, fontSize: 13, fontWeight: 500 }}>Размер</label>
                    <select
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: 10,
                        border: '1px solid var(--border)',
                        background: 'var(--bg)',
                        fontSize: 15,
                      }}
                    >
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      padding: '14px 20px',
                      fontSize: 15,
                      opacity: isSubmitting ? 0.7 : 1,
                    }}
                  >
                    {isSubmitting ? 'Отправка...' : 'Отправить'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
