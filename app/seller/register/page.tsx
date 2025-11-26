'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SellerRegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    // Основная информация
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',

    // Юридическая информация
    companyName: '',
    inn: '',
    ogrn: '',
    legalAddress: '',

    // Банковские реквизиты (опционально при регистрации)
    bankAccount: '',
    bankName: '',
    bankBik: '',
    bankCorAccount: '',

    // Согласие с офертой
    acceptOffer: false,
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1 - основная инфо, 2 - юр. инфо, 3 - банк. реквизиты

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.name || !formData.phone) {
        setError('Заполните все обязательные поля')
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Пароли не совпадают')
        return
      }
      if (formData.password.length < 6) {
        setError('Пароль должен содержать минимум 6 символов')
        return
      }
    }

    if (step === 2) {
      if (!formData.companyName || !formData.inn || !formData.ogrn || !formData.legalAddress) {
        setError('Заполните все обязательные поля')
        return
      }
    }

    setError('')
    setStep(step + 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.acceptOffer) {
      setError('Необходимо принять условия агентской оферты')
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/seller/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Ошибка при регистрации')
        setLoading(false)
        return
      }

      // Успешная регистрация - перенаправляем на страницу входа
      router.push('/seller/login?registered=true')
    } catch (err: any) {
      setError('Произошла ошибка при регистрации')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)', padding: '40px 20px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 className="font-display" style={{ fontSize: 32, marginBottom: 12 }}>
            Регистрация продавца
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 16 }}>
            Шаг {step} из 3
          </p>
        </div>

        {/* Индикатор прогресса */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 30 }}>
          <div style={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            background: step >= 1 ? 'var(--accent)' : 'var(--ring)'
          }} />
          <div style={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            background: step >= 2 ? 'var(--accent)' : 'var(--ring)'
          }} />
          <div style={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            background: step >= 3 ? 'var(--accent)' : 'var(--ring)'
          }} />
        </div>

        <div className="tile" style={{ padding: 40 }}>
          <form onSubmit={handleSubmit}>
            {error && (
              <div
                style={{
                  padding: '12px 16px',
                  background: 'rgba(255, 59, 48, 0.1)',
                  border: '1px solid rgba(255, 59, 48, 0.3)',
                  borderRadius: 12,
                  color: '#ff3b30',
                  fontSize: 14,
                  marginBottom: 20,
                }}
              >
                {error}
              </div>
            )}

            {/* Шаг 1: Основная информация */}
            {step === 1 && (
              <div style={{ display: 'grid', gap: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 10 }}>
                  Основная информация
                </h2>

                <div>
                  <label htmlFor="email" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                    style={{ width: '100%', padding: '12px 16px', fontSize: 16 }}
                  />
                </div>

                <div>
                  <label htmlFor="name" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                    ФИО контактного лица *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="input"
                    style={{ width: '100%', padding: '12px 16px', fontSize: 16 }}
                  />
                </div>

                <div>
                  <label htmlFor="phone" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="input"
                    style={{ width: '100%', padding: '12px 16px', fontSize: 16 }}
                    placeholder="+7 999 123-45-67"
                  />
                </div>

                <div>
                  <label htmlFor="password" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                    Пароль *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input"
                    style={{ width: '100%', padding: '12px 16px', fontSize: 16 }}
                  />
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 5 }}>
                    Минимум 6 символов
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                    Подтвердите пароль *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input"
                    style={{ width: '100%', padding: '12px 16px', fontSize: 16 }}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="btn btn-primary"
                  style={{ marginTop: 10 }}
                >
                  Далее
                </button>
              </div>
            )}

            {/* Шаг 2: Юридическая информация */}
            {step === 2 && (
              <div style={{ display: 'grid', gap: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 10 }}>
                  Юридическая информация
                </h2>

                <div>
                  <label htmlFor="companyName" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                    Название компании (ИП/ООО) *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    className="input"
                    style={{ width: '100%', padding: '12px 16px', fontSize: 16 }}
                    placeholder="ИП Иванов Иван Иванович"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <label htmlFor="inn" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                      ИНН *
                    </label>
                    <input
                      type="text"
                      id="inn"
                      name="inn"
                      required
                      value={formData.inn}
                      onChange={handleChange}
                      className="input"
                      style={{ width: '100%', padding: '12px 16px', fontSize: 16 }}
                      placeholder="123456789012"
                    />
                  </div>

                  <div>
                    <label htmlFor="ogrn" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                      ОГРН/ОГРНИП *
                    </label>
                    <input
                      type="text"
                      id="ogrn"
                      name="ogrn"
                      required
                      value={formData.ogrn}
                      onChange={handleChange}
                      className="input"
                      style={{ width: '100%', padding: '12px 16px', fontSize: 16 }}
                      placeholder="1234567890123"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="legalAddress" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                    Юридический адрес *
                  </label>
                  <input
                    type="text"
                    id="legalAddress"
                    name="legalAddress"
                    required
                    value={formData.legalAddress}
                    onChange={handleChange}
                    className="input"
                    style={{ width: '100%', padding: '12px 16px', fontSize: 16 }}
                    placeholder="г. Москва, ул. Ленина, д. 1"
                  />
                </div>

                <div style={{ display: 'flex', gap: 15, marginTop: 10 }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn btn-ghost"
                  >
                    Назад
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    Далее
                  </button>
                </div>
              </div>
            )}

            {/* Шаг 3: Банковские реквизиты и подтверждение */}
            {step === 3 && (
              <div style={{ display: 'grid', gap: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 10 }}>
                  Банковские реквизиты
                </h2>

                <div style={{ padding: 15, background: 'var(--info)20', borderRadius: 8, fontSize: 13, color: 'var(--muted)' }}>
                  Вы можете заполнить банковские реквизиты позже в настройках профиля
                </div>

                <div>
                  <label htmlFor="bankAccount" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                    Расчётный счёт
                  </label>
                  <input
                    type="text"
                    id="bankAccount"
                    name="bankAccount"
                    value={formData.bankAccount}
                    onChange={handleChange}
                    className="input"
                    style={{ width: '100%', padding: '12px 16px', fontSize: 16 }}
                    placeholder="40702810..."
                  />
                </div>

                <div>
                  <label htmlFor="bankName" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                    Название банка
                  </label>
                  <input
                    type="text"
                    id="bankName"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    className="input"
                    style={{ width: '100%', padding: '12px 16px', fontSize: 16 }}
                    placeholder="ПАО Сбербанк"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <label htmlFor="bankBik" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                      БИК
                    </label>
                    <input
                      type="text"
                      id="bankBik"
                      name="bankBik"
                      value={formData.bankBik}
                      onChange={handleChange}
                      className="input"
                      style={{ width: '100%', padding: '12px 16px', fontSize: 16 }}
                      placeholder="044525..."
                    />
                  </div>

                  <div>
                    <label htmlFor="bankCorAccount" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                      Корр. счёт
                    </label>
                    <input
                      type="text"
                      id="bankCorAccount"
                      name="bankCorAccount"
                      value={formData.bankCorAccount}
                      onChange={handleChange}
                      className="input"
                      style={{ width: '100%', padding: '12px 16px', fontSize: 16 }}
                      placeholder="30101810..."
                    />
                  </div>
                </div>

                <div style={{ marginTop: 20, padding: 20, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--ring)' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="acceptOffer"
                      checked={formData.acceptOffer}
                      onChange={handleChange}
                      style={{ marginTop: 3, marginRight: 10 }}
                    />
                    <span style={{ fontSize: 14 }}>
                      Я принимаю условия{' '}
                      <Link href="/documents/seller-offer.md" target="_blank" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
                        агентской оферты
                      </Link>
                      {' '}и даю согласие на обработку персональных данных
                    </span>
                  </label>
                </div>

                <div style={{ display: 'flex', gap: 15, marginTop: 10 }}>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn btn-ghost"
                  >
                    Назад
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !formData.acceptOffer}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                  </button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--muted)', marginTop: 20 }}>
                Уже есть аккаунт?{' '}
                <Link href="/seller/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                  Войти
                </Link>
              </div>
            )}
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href="/" style={{ color: 'var(--muted)', fontSize: 14 }}>
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  )
}
