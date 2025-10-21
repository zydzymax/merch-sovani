'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [participatesInPromo, setParticipatesInPromo] = useState(false) // ← ПО УМОЛЧАНИЮ ВЫКЛЮЧЕН
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    shippingFullName: '',
    shippingAddress: '',
    shippingCity: '',
    shippingRegion: '',
    shippingPostalCode: '',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          participatesInPromo, // ← Передаем состояние чекбокса
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'Ошибка при оформлении заказа')
        setLoading(false)
        return
      }

      // Redirect to payment
      router.push(data.payment.confirmationUrl)
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Произошла ошибка. Попробуйте снова.')
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-xl font-serif font-bold text-primary">
            Fashion Shop
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-3xl font-serif font-bold mb-8">Оформление заказа</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Info */}
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Контактная информация</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Телефон *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
            </div>
          </section>

          {/* Shipping */}
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Адрес доставки</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">ФИО получателя *</label>
                <input
                  type="text"
                  name="shippingFullName"
                  value={formData.shippingFullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                  placeholder="Иванов Иван Иванович"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Город *</label>
                  <input
                    type="text"
                    name="shippingCity"
                    value={formData.shippingCity}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                    placeholder="Москва"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Регион *</label>
                  <input
                    type="text"
                    name="shippingRegion"
                    value={formData.shippingRegion}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                    placeholder="Московская область"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Адрес *</label>
                <input
                  type="text"
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                  placeholder="ул. Ленина, д. 1, кв. 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Индекс *</label>
                <input
                  type="text"
                  name="shippingPostalCode"
                  value={formData.shippingPostalCode}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                  placeholder="123456"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Комментарий к заказу</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary"
                  placeholder="Дополнительная информация..."
                />
              </div>
            </div>
          </section>

          {/* КРИТИЧЕСКИЙ БЛОК: Чекбокс участия в акции */}
          <section className="bg-gradient-to-r from-primary/5 to-accent/5 border-2 border-primary/20 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="participatesInPromo"
                checked={participatesInPromo}
                onChange={(e) => setParticipatesInPromo(e.target.checked)}
                className="mt-1 w-5 h-5 text-primary border-primary/30 rounded focus:ring-2 focus:ring-primary"
              />
              <div className="flex-1">
                <label htmlFor="participatesInPromo" className="block font-medium cursor-pointer">
                  Хочу участвовать в акции «1 покупка = 1 шанс»
                </label>
                <p className="text-sm text-muted-foreground mt-2">
                  После оплаты вы получите персональный код участия в розыгрыше призов.
                </p>
                <div className="mt-3 p-3 bg-white/60 border border-destructive/30 rounded text-sm">
                  <p className="text-destructive font-medium">⚠️ Важно:</p>
                  <p className="mt-1 text-foreground/80">
                    При участии в акции{' '}
                    <strong className="text-destructive">
                      возврат товара надлежащего качества становится невозможным
                    </strong>{' '}
                    после получения кода участия (п. 7.4{' '}
                    <Link href="/legal/offer" className="text-primary hover:underline" target="_blank">
                      Публичной оферты
                    </Link>
                    ). Возврат товара ненадлежащего качества осуществляется по закону.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Summary */}
          <section className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Итого</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Товары:</span>
                <span className="font-medium">... руб.</span>
              </div>
              <div className="flex justify-between">
                <span>Доставка (Почта РФ):</span>
                <span className="font-medium text-green-600">Бесплатно</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Всего:</span>
                <span>... руб.</span>
              </div>
            </div>
          </section>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-lg font-medium text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Оформление...' : 'Перейти к оплате'}
          </button>

          <p className="text-sm text-center text-muted-foreground">
            Нажимая кнопку, вы принимаете условия{' '}
            <Link href="/legal/offer" className="text-primary hover:underline" target="_blank">
              Публичной оферты
            </Link>{' '}
            и{' '}
            <Link href="/legal/privacy" className="text-primary hover:underline" target="_blank">
              Политики конфиденциальности
            </Link>
          </p>
        </form>
      </main>
    </div>
  )
}
