'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/app/_components/Navbar'
import BigFooter from '@/app/_components/BigFooter'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const callbackUrl = searchParams.get('callbackUrl') || '/account/dashboard'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Неверный email или пароль')
        setLoading(false)
        return
      }

      // Redirect to callback URL or account page
      window.location.href = callbackUrl
    } catch (err: any) {
      setError('Произошла ошибка при входе')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Navbar />

      <section className="section">
        <div className="container" style={{ maxWidth: 480 }}>
          <h1 className="font-display text-center" style={{ fontSize: '32px', marginBottom: 32 }}>
            Вход в аккаунт
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
                <label htmlFor="email" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  Email
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
                <label htmlFor="password" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  Пароль
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={formData.password}
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

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ marginTop: 8, padding: '14px 24px', fontSize: 16 }}
              >
                {loading ? 'Вход...' : 'Войти'}
              </button>

              <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
                Нет аккаунта?{' '}
                <Link href="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                  Зарегистрироваться
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <LoginForm />
    </Suspense>
  )
}
