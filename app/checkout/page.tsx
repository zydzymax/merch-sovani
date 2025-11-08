'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function CheckoutPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [subtotal, setSubtotal] = useState(0)

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    fullName: '',
    region: '',
    city: '',
    address: '',
    postalCode: '',
    participatesInPromo: false,
  })

  const [consents, setConsents] = useState({
    privacyAndOffer: false,
    promoRules: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load cart data
  useEffect(() => {
    fetch('/api/cart/get')
      .then((res) => res.json())
      .then((data) => {
        setCartItems(data.items || [])
        setSubtotal(data.subtotal || 0)
      })
      .catch((err) => console.error('Load cart error:', err))
  }, [])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) newErrors.email = 'Email обязателен'
    if (!formData.phone) newErrors.phone = 'Телефон обязателен'
    if (!formData.fullName) newErrors.fullName = 'ФИО обязательно'
    if (!formData.region) newErrors.region = 'Регион обязателен'
    if (!formData.city) newErrors.city = 'Город обязателен'
    if (!formData.address) newErrors.address = 'Адрес обязателен'
    if (!formData.postalCode) newErrors.postalCode = 'Индекс обязателен'

    // Validate email format
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Неверный формат email'
    }

    // Validate phone format
    if (formData.phone && !/^\+?[0-9\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Неверный формат телефона'
    }

    // Validate postal code
    if (formData.postalCode && !/^\d{6}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Индекс должен содержать 6 цифр'
    }

    // Validate consent checkboxes
    if (!consents.privacyAndOffer) {
      newErrors.consent = 'Необходимо согласие на обработку персональных данных'
    }

    if (formData.participatesInPromo && !consents.promoRules) {
      newErrors.promoConsent = 'Необходимо согласие с правилами розыгрыша'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    if (cartItems.length === 0) {
      alert('Корзина пуста')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Ошибка оформления заказа')
      }

      // Redirect to payment page
      router.push(data.paymentUrl)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return `${(price / 100).toLocaleString('ru-RU')} ₽`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-serif font-bold text-primary">
            SoVAni
          </Link>
        </div>
      </header>

      {/* Checkout Form */}
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8">Оформление заказа</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 space-y-6">
              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Контактные данные</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Телефон <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+7 (999) 123-45-67"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Адрес доставки (Почта РФ)</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ФИО получателя <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Иванов Иван Иванович"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Регион/область <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                          errors.region ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Московская область"
                      />
                      {errors.region && (
                        <p className="text-red-500 text-sm mt-1">{errors.region}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Город <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Москва"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Улица, дом, квартира <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="ул. Ленина, д. 1, кв. 10"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div className="md:w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Почтовый индекс <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.postalCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="123456"
                      maxLength={6}
                    />
                    {errors.postalCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Promo Participation */}
              <div className="border-t pt-6">
                <h2 className="text-2xl font-bold mb-4">Участие в акции</h2>
                <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.participatesInPromo}
                      onChange={(e) =>
                        setFormData({ ...formData, participatesInPromo: e.target.checked })
                      }
                      className="mt-1 w-5 h-5 text-primary"
                    />
                    <div>
                      <p className="font-semibold mb-2">
                        Хочу участвовать в акции «1 покупка = 1 шанс»
                      </p>
                      <p className="text-sm text-gray-700 mb-2">
                        После оплаты вы получите уникальный код участия в розыгрыше призов на сумму до 240 000 ₽
                      </p>
                      <p className="text-sm text-red-700 font-medium">
                        ⚠️ Внимание: При участии в акции возврат товара надлежащего качества становится невозможным
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Legal Consent Checkboxes */}
              <div className="border-t pt-6 space-y-4">
                <h2 className="text-2xl font-bold mb-4">Согласие на обработку данных</h2>
                
                {/* Privacy and Offer Consent - Always required */}
                <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer ${
                  errors.consent ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'
                }`}>
                  <input
                    type="checkbox"
                    required
                    checked={consents.privacyAndOffer}
                    onChange={(e) => setConsents({ ...consents, privacyAndOffer: e.target.checked })}
                    className="mt-1 w-5 h-5 text-primary flex-shrink-0"
                  />
                  <span className="text-sm text-gray-700">
                    Я согласен(на) с{' '}
                    <Link href="/legal/privacy" className="text-blue-600 hover:underline font-medium" target="_blank">
                      Политикой обработки персональных данных
                    </Link>
                    ,{' '}
                    <Link href="/legal/consent" className="text-blue-600 hover:underline font-medium" target="_blank">
                      Согласием на обработку ПДн
                    </Link>
                    {' '}и{' '}
                    <Link href="/legal/offer" className="text-blue-600 hover:underline font-medium" target="_blank">
                      Публичной офертой
                    </Link>
                    . <span className="text-red-500">*</span>
                  </span>
                </label>
                {errors.consent && <p className="text-red-500 text-sm">{errors.consent}</p>}

                {/* Promo Rules Consent - Only if participating */}
                {formData.participatesInPromo && (
                  <>
                    <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer ${
                      errors.promoConsent ? 'border-red-500 bg-red-50' : 'border-yellow-200 bg-yellow-50'
                    }`}>
                      <input
                        type="checkbox"
                        required
                        checked={consents.promoRules}
                        onChange={(e) => setConsents({ ...consents, promoRules: e.target.checked })}
                        className="mt-1 w-5 h-5 text-primary flex-shrink-0"
                      />
                      <span className="text-sm text-gray-700">
                        Я ознакомлен(а) с{' '}
                        <Link href="/legal/promo-rules" className="text-blue-600 hover:underline font-medium" target="_blank">
                          Правилами розыгрыша
                        </Link>
                        {' '}и понимаю, что при участии в акции{' '}
                        <strong>право на возврат товара утрачивается</strong>, а также что с призов свыше 4 000 ₽ удерживается НДФЛ 35%.
                        {' '}<span className="text-red-500">*</span>
                      </span>
                    </label>
                    {errors.promoConsent && <p className="text-red-500 text-sm">{errors.promoConsent}</p>}
                  </>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || cartItems.length === 0}
                className="w-full bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Обработка...' : 'Перейти к оплате'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Ваш заказ</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.variant.product.images[0] && (
                        <Image
                          src={item.variant.product.images[0]}
                          alt={item.variant.product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.variant.product.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {item.quantity} × {formatPrice(item.variant.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">
                        {formatPrice(item.variant.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Товары:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t">
                  <span>Итого:</span>
                  <span className="text-primary">{formatPrice(subtotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
