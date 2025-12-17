'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Navbar from '@/app/_components/Navbar'
import BigFooter from '@/app/_components/BigFooter'

interface CartItem {
  id: string
  quantity: number
  variant: {
    price: number
    product: {
      name: string
      slug: string
      images: string[]
    }
  }
}

interface FormErrors {
  [key: string]: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [cartLoading, setCartLoading] = useState(true)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
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

  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Check if cart contains promo items (keychain)
  const hasPromoItem = cartItems.some((item) =>
    item.variant?.product?.slug === 'keychain' ||
    item.variant?.product?.name?.toLowerCase().includes('брелок')
  )

  // Load cart data
  useEffect(() => {
    fetch('/api/cart/get')
      .then((res) => res.json())
      .then((data) => {
        setCartItems(data.items || [])
        setSubtotal(data.subtotal || 0)

        // Auto-enable promo participation if cart has keychain
        const hasKeychain = (data.items || []).some((item: CartItem) =>
          item.variant?.product?.slug === 'keychain' ||
          item.variant?.product?.name?.toLowerCase().includes('брелок')
        )
        if (hasKeychain) {
          setFormData(prev => ({ ...prev, participatesInPromo: true }))
        }
      })
      .catch((err) => console.error('Load cart error:', err))
      .finally(() => setCartLoading(false))
  }, [])

  // Real-time field validation
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'email':
        if (!value) return 'Email обязателен'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Неверный формат email'
        return ''
      case 'phone':
        if (!value) return 'Телефон обязателен'
        if (!/^\+?[0-9\s\-\(\)]{10,}$/.test(value.replace(/\s/g, ''))) return 'Неверный формат телефона'
        return ''
      case 'fullName':
        if (!value) return 'ФИО обязательно'
        if (value.length < 3) return 'Минимум 3 символа'
        return ''
      case 'region':
        if (!value) return 'Регион обязателен'
        return ''
      case 'city':
        if (!value) return 'Город обязателен'
        return ''
      case 'address':
        if (!value) return 'Адрес обязателен'
        if (value.length < 5) return 'Укажите полный адрес'
        return ''
      case 'postalCode':
        if (!value) return 'Индекс обязателен'
        if (!/^\d{6}$/.test(value)) return 'Индекс должен содержать 6 цифр'
        return ''
      default:
        return ''
    }
  }

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value

    setFormData(prev => ({ ...prev, [name]: newValue }))

    // Real-time validation for touched fields
    if (touched[name] && type !== 'checkbox') {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    const fields = ['email', 'phone', 'fullName', 'region', 'city', 'address', 'postalCode']

    fields.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData] as string)
      if (error) newErrors[field] = error
    })

    // Validate consent checkboxes
    if (!consents.privacyAndOffer) {
      newErrors.consent = 'Необходимо согласие на обработку данных'
    }

    if (hasPromoItem && !consents.promoRules) {
      newErrors.promoConsent = 'Необходимо согласие с правилами акции'
    }

    setErrors(newErrors)
    setTouched(Object.fromEntries(fields.map(f => [f, true])))
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      // Scroll to first error
      const firstError = document.querySelector('[data-error="true"]')
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    if (cartItems.length === 0) {
      setErrors({ general: 'Корзина пуста' })
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
      setErrors({ general: error.message })
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return `${(price / 100).toLocaleString('ru-RU')} ₽`
  }

  // Input component with dark theme styling
  const InputField = ({
    name,
    label,
    type = 'text',
    placeholder,
    required = true,
    maxLength,
  }: {
    name: string
    label: string
    type?: string
    placeholder?: string
    required?: boolean
    maxLength?: number
  }) => {
    const hasError = touched[name] && errors[name]
    return (
      <div data-error={hasError ? 'true' : 'false'}>
        <label
          htmlFor={name}
          style={{
            display: 'block',
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 8,
            color: 'var(--text)'
          }}
        >
          {label} {required && <span style={{ color: 'var(--accent)' }}>*</span>}
        </label>
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          value={formData[name as keyof typeof formData] as string}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          maxLength={maxLength}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '14px 16px',
            background: 'var(--surface-2)',
            border: `1px solid ${hasError ? 'var(--accent)' : 'var(--ring)'}`,
            borderRadius: 'var(--radius-md)',
            color: 'var(--text)',
            fontSize: 15,
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            outline: 'none'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = hasError ? 'var(--accent)' : 'rgba(255,255,255,0.3)'
            e.target.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.05)'
          }}
        />
        {hasError && (
          <p style={{ color: 'var(--accent)', fontSize: 13, marginTop: 6 }}>
            {errors[name]}
          </p>
        )}
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      <Navbar />

      <div className="container" style={{ padding: '48px 24px' }}>
        <h1
          className="font-display"
          style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 700, marginBottom: 32, textAlign: 'center' }}
        >
          Оформление заказа
        </h1>

        {/* Error Banner */}
        {errors.general && (
          <div
            style={{
              padding: '16px 20px',
              background: 'rgba(255, 43, 43, 0.1)',
              border: '1px solid var(--accent)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 24,
              textAlign: 'center'
            }}
          >
            <p style={{ color: 'var(--accent)', fontWeight: 600 }}>{errors.general}</p>
          </div>
        )}

        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}
          className="checkout-grid"
        >
          {/* Form */}
          <div>
            <form onSubmit={handleSubmit}>
              {/* Contact Info */}
              <div className="tile" style={{ padding: 32, marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>
                  Контактные данные
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
                  <InputField
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="your@email.com"
                  />
                  <InputField
                    name="phone"
                    label="Телефон"
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="tile" style={{ padding: 32, marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>
                  Адрес доставки (Почта РФ)
                </h2>
                <div style={{ display: 'grid', gap: 20 }}>
                  <InputField
                    name="fullName"
                    label="ФИО получателя"
                    placeholder="Иванов Иван Иванович"
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                    <InputField
                      name="region"
                      label="Регион/область"
                      placeholder="Московская область"
                    />
                    <InputField
                      name="city"
                      label="Город"
                      placeholder="Москва"
                    />
                  </div>
                  <InputField
                    name="address"
                    label="Улица, дом, квартира"
                    placeholder="ул. Ленина, д. 1, кв. 10"
                  />
                  <div style={{ maxWidth: 200 }}>
                    <InputField
                      name="postalCode"
                      label="Почтовый индекс"
                      placeholder="123456"
                      maxLength={6}
                    />
                  </div>
                </div>
              </div>

              {/* Promo Participation - only show if cart has keychain */}
              {hasPromoItem && (
              <div className="tile" style={{ padding: 32, marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>
                  Участие в акции
                </h2>
                <div
                  style={{
                    padding: 24,
                    background: 'rgba(255, 193, 7, 0.1)',
                    border: '1px solid rgba(255, 193, 7, 0.5)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      style={{ width: 20, height: 20, marginTop: 2, opacity: 0.6 }}
                    />
                    <div>
                      <p style={{ fontWeight: 700, marginBottom: 8, fontSize: 16 }}>
                        ✓ Вы участвуете в акции
                      </p>
                      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>
                        Брелок является акционным товаром. При покупке вы автоматически участвуете в розыгрыше iPhone 17 Pro Max!
                      </p>
                      <p style={{ fontSize: 14, color: 'var(--accent)', fontWeight: 600 }}>
                        ⚠️ Важно: Для акционных товаров возврат надлежащего качества невозможен
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              )}

              {/* Legal Consent */}
              <div className="tile" style={{ padding: 32, marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>
                  Согласие на обработку данных
                </h2>
                <div style={{ display: 'grid', gap: 16 }}>
                  {/* Privacy Consent */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 16,
                      padding: 20,
                      background: errors.consent ? 'rgba(255, 43, 43, 0.05)' : 'var(--surface-2)',
                      border: `1px solid ${errors.consent ? 'var(--accent)' : 'var(--ring)'}`,
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type="checkbox"
                      required
                      checked={consents.privacyAndOffer}
                      onChange={(e) => {
                        setConsents({ ...consents, privacyAndOffer: e.target.checked })
                        if (e.target.checked) {
                          setErrors(prev => ({ ...prev, consent: '' }))
                        }
                      }}
                      style={{ width: 20, height: 20, marginTop: 2, accentColor: 'var(--accent)', flexShrink: 0 }}
                    />
                    <span style={{ fontSize: 14, lineHeight: 1.6 }}>
                      Я даю согласие Оператору площадки на обработку моих персональных данных для оформления заказа и участия в акции.{' '}
                      <Link href="/docs/privacy" target="_blank" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
                        Политика конфиденциальности
                      </Link>
                      ,{' '}
                      <Link href="/docs/offer" target="_blank" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
                        Публичная оферта
                      </Link>
                      . <span style={{ color: 'var(--accent)' }}>*</span>
                    </span>
                  </label>
                  {errors.consent && (
                    <p style={{ color: 'var(--accent)', fontSize: 13 }}>{errors.consent}</p>
                  )}

                  {/* Promo Rules Consent */}
                  {hasPromoItem && (
                    <>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 16,
                          padding: 20,
                          background: errors.promoConsent ? 'rgba(255, 43, 43, 0.05)' : 'rgba(255, 193, 7, 0.05)',
                          border: `1px solid ${errors.promoConsent ? 'var(--accent)' : 'rgba(255, 193, 7, 0.3)'}`,
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <input
                          type="checkbox"
                          required
                          checked={consents.promoRules}
                          onChange={(e) => {
                            setConsents({ ...consents, promoRules: e.target.checked })
                            if (e.target.checked) {
                              setErrors(prev => ({ ...prev, promoConsent: '' }))
                            }
                          }}
                          style={{ width: 20, height: 20, marginTop: 2, accentColor: 'var(--accent)', flexShrink: 0 }}
                        />
                        <span style={{ fontSize: 14, lineHeight: 1.6 }}>
                          Я ознакомлен(а) с{' '}
                          <Link href="/docs/rules" target="_blank" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
                            Правилами стимулирующей акции
                          </Link>
                          {' '}и понимаю, что при возврате брелока аннулируются шансы участия в розыгрыше, а также что с призов удерживается НДФЛ 35%.
                          {' '}<span style={{ color: 'var(--accent)' }}>*</span>
                        </span>
                      </label>
                      {errors.promoConsent && (
                        <p style={{ color: 'var(--accent)', fontSize: 13 }}>{errors.promoConsent}</p>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || cartItems.length === 0}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '18px 32px',
                  fontSize: 16,
                  fontWeight: 700,
                  opacity: (loading || cartItems.length === 0) ? 0.6 : 1,
                  cursor: (loading || cartItems.length === 0) ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                    <span className="spinner" style={{
                      width: 20,
                      height: 20,
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }} />
                    Обработка...
                  </span>
                ) : (
                  'Перейти к оплате'
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="tile checkout-summary" style={{ padding: 32, position: 'sticky', top: 100 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Ваш заказ</h2>

              {/* Cart Items */}
              {cartLoading ? (
                <div style={{ display: 'grid', gap: 16 }}>
                  {[1, 2].map(i => (
                    <div key={i} style={{ display: 'flex', gap: 12, animation: 'pulse 2s infinite' }}>
                      <div style={{ width: 64, height: 64, background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ height: 16, background: 'var(--surface-2)', borderRadius: 4, marginBottom: 8, width: '80%' }} />
                        <div style={{ height: 14, background: 'var(--surface-2)', borderRadius: 4, width: '50%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 24 }}>
                  <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>Корзина пуста</p>
                  <Link href="/catalog" className="btn btn-ghost">
                    Перейти в каталог
                  </Link>
                </div>
              ) : (
                <>
                  <div style={{ maxHeight: 320, overflowY: 'auto', marginBottom: 24 }}>
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          gap: 12,
                          paddingBottom: 16,
                          marginBottom: 16,
                          borderBottom: '1px solid var(--ring)'
                        }}
                      >
                        <div
                          style={{
                            position: 'relative',
                            width: 64,
                            height: 64,
                            borderRadius: 'var(--radius-sm)',
                            overflow: 'hidden',
                            background: 'var(--surface-2)',
                            flexShrink: 0
                          }}
                        >
                          {item.variant?.product?.images?.[0] && (
                            <Image
                              src={item.variant.product.images[0]}
                              alt={item.variant.product.name}
                              fill
                              style={{ objectFit: 'cover' }}
                              sizes="64px"
                            />
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.variant?.product?.name}
                          </p>
                          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                            {item.quantity} × {formatPrice(item.variant?.price || 0)}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <p style={{ fontSize: 14, fontWeight: 700 }}>
                            {formatPrice((item.variant?.price || 0) * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div style={{ borderTop: '1px solid var(--ring)', paddingTop: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, color: 'var(--text-muted)' }}>
                      <span>Товары:</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, color: 'var(--text-muted)' }}>
                      <span>Доставка:</span>
                      <span>Бесплатно</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingTop: 16,
                        borderTop: '1px solid var(--ring)',
                        fontSize: 20,
                        fontWeight: 700
                      }}
                    >
                      <span>Итого:</span>
                      <span style={{ color: 'var(--accent)' }}>{formatPrice(subtotal)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <BigFooter />

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.8; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (min-width: 1024px) {
          .checkout-grid {
            grid-template-columns: 1fr 400px !important;
          }
        }

        @media (max-width: 640px) {
          .checkout-summary {
            position: relative !important;
            top: 0 !important;
          }
        }
      `}</style>
    </div>
  )
}
