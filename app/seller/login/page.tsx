'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function SellerLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const callbackUrl = searchParams.get('callbackUrl') || '/seller'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Неверный email или пароль')
        setLoading(false)
        return
      }

      // После успешного входа проверим роль пользователя
      const response = await fetch('/api/auth/session')
      const session = await response.json()

      if (session?.user?.role !== 'SELLER') {
        setError('У вас нет доступа к личному кабинету продавца')
        setLoading(false)
        return
      }

      router.push(callbackUrl)
      router.refresh()
    } catch (err: any) {
      setError('Произошла ошибка при входе')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ maxWidth: 480, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 className="font-display" style={{ fontSize: 32, marginBottom: 12 }}>
            Вход для продавцов
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 16 }}>
            Войдите в личный кабинет продавца
          </p>
        </div>

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
                className="input"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: 16,
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
                className="input"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: 16,
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

            <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--muted)' }}>
              Хотите стать продавцом?{' '}
              <Link href="/seller/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                Зарегистрироваться
              </Link>
            </div>

            <div style={{ textAlign: 'center', fontSize: 14, marginTop: 10 }}>
              <Link href="/" style={{ color: 'var(--muted)' }}>
                ← Вернуться на главную
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function SellerLoginPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <SellerLoginForm />
    </Suspense>
  )
}
