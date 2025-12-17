'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/app/_components/Navbar'
import BigFooter from '@/app/_components/BigFooter'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [agreedToPolicy, setAgreedToPolicy] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!agreedToPolicy) {
      setError('Необходимо согласиться с политикой обработки персональных данных')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают')
      setLoading(false)
      return
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>\/])[A-Za-z\d@$!%*?&#^()_+\-=[\]{};':"\\|,.<>\/]{12,}$/
    if (!passwordRegex.test(formData.password)) {
      setError('Пароль должен содержать минимум 12 символов, включая заглавные и строчные буквы, цифры и специальные символы')
      setLoading(false)
      return
    }

    try {
      // Register user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка регистрации')
      }

      // Registration API already sets auth_token cookie, just redirect
      window.location.href = '/account/dashboard'
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Navbar />

      <section className="section">
        <div className="container" style={{ maxWidth: 480 }}>
          <h1 className="font-display text-center" style={{ fontSize: '32px', marginBottom: 32 }}>
            Регистрация
          </h1>

          <div className="tile" style={{ padding: 40 }}>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>
              {error && (
                <div
                  style={{
                    padding: '12px 16px',
                    background: 'rgba(255, 59, 48, 0.1)',
                    border: '1px solid rgba(255, 59, 48, 0.3)',
                    borderRadius: 12,
                    color: '#ff3b30',
                    fontSize: 14,
                  }}
                >
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  Имя *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="pill"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: 16,
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    color: 'var(--text)',
                  }}
                />
              </div>

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
                  className="pill"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: 16,
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    color: 'var(--text)',
                  }}
                />
              </div>

              <div>
                <label htmlFor="phone" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  Телефон
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+7 (999) 123-45-67"
                  className="pill"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: 16,
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    color: 'var(--text)',
                  }}
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
                  minLength={12}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Мин. 12 символов, буквы A-z, цифры, символы"
                  className="pill"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: 16,
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    color: 'var(--text)',
                  }}
                />
                <small style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginTop: 4 }}>
                  Используйте заглавные и строчные буквы, цифры и специальные символы (@, !, #, $ и т.д.)
                </small>
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
                  minLength={12}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pill"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: 16,
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    color: 'var(--text)',
                  }}
                />
              </div>

              <div style={{ marginTop: 10 }}>
                <label style={{ display: 'flex', alignItems: 'start', cursor: 'pointer', gap: 12 }}>
                  <input
                    type="checkbox"
                    checked={agreedToPolicy}
                    onChange={(e) => setAgreedToPolicy(e.target.checked)}
                    style={{
                      width: 20,
                      height: 20,
                      marginTop: 2,
                      cursor: 'pointer',
                      accentColor: 'var(--accent)',
                    }}
                  />
                  <span style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--text)' }}>
                    Я согласен(а) с{' '}
                    <Link
                      href="/docs/privacy"
                      target="_blank"
                      style={{ color: 'var(--accent)', textDecoration: 'underline' }}
                    >
                      политикой обработки персональных данных
                    </Link>
                    {' '}и{' '}
                    <Link
                      href="/docs/user-agreement"
                      target="_blank"
                      style={{ color: 'var(--accent)', textDecoration: 'underline' }}
                    >
                      пользовательским соглашением
                    </Link>
                    {' '}*
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !agreedToPolicy}
                className="btn btn-primary"
                style={{
                  marginTop: 8,
                  padding: '14px 24px',
                  fontSize: 16,
                  opacity: (!agreedToPolicy && !loading) ? 0.5 : 1,
                  cursor: (!agreedToPolicy && !loading) ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Регистрация...' : 'Зарегистрироваться'}
              </button>

              <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
                Уже есть аккаунт?{' '}
                <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                  Войти
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>

      <BigFooter />
    </div>
  )
}
