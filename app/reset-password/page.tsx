'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/app/_components/Navbar'
import BigFooter from '@/app/_components/BigFooter'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)
  const [tokenError, setTokenError] = useState('')

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false)
        setTokenError('Ссылка для сброса пароля недействительна')
        return
      }

      try {
        const response = await fetch(`/api/auth/reset-password?token=${token}`)
        const data = await response.json()

        if (data.valid) {
          setTokenValid(true)
        } else {
          setTokenValid(false)
          setTokenError(data.error || 'Ссылка для сброса пароля недействительна')
        }
      } catch (err) {
        setTokenValid(false)
        setTokenError('Ошибка проверки ссылки')
      }
    }

    validateToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Пароли не совпадают')
      return
    }

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Произошла ошибка')
        setLoading(false)
        return
      }

      setSuccess(true)
    } catch (err) {
      setError('Произошла ошибка при сбросе пароля')
    } finally {
      setLoading(false)
    }
  }

  // Loading state while validating token
  if (tokenValid === null) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
        <Navbar />
        <section className="section">
          <div className="container" style={{ maxWidth: 480, textAlign: 'center' }}>
            <div style={{ padding: 40 }}>
              <p>Проверка ссылки...</p>
            </div>
          </div>
        </section>
        <BigFooter />
      </div>
    )
  }

  // Invalid token
  if (!tokenValid) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
        <Navbar />
        <section className="section">
          <div className="container" style={{ maxWidth: 480 }}>
            <div className="tile" style={{ padding: 40, textAlign: 'center' }}>
              <div style={{
                width: 64,
                height: 64,
                background: 'rgba(255, 59, 48, 0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                fontSize: 32,
                color: '#ff3b30'
              }}>
                ✕
              </div>
              <h2 style={{ fontSize: 20, marginBottom: 16 }}>Ссылка недействительна</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
                {tokenError}
              </p>
              <Link
                href="/forgot-password"
                className="btn btn-primary"
                style={{ display: 'inline-block' }}
              >
                Запросить новую ссылку
              </Link>
            </div>
          </div>
        </section>
        <BigFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Navbar />

      <section className="section">
        <div className="container" style={{ maxWidth: 480 }}>
          <h1 className="font-display text-center" style={{ fontSize: '32px', marginBottom: 32 }}>
            Новый пароль
          </h1>

          <div className="tile" style={{ padding: 40 }}>
            {success ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 64,
                  height: 64,
                  background: 'rgba(76, 175, 80, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  fontSize: 32,
                  color: '#4caf50'
                }}>
                  ✓
                </div>
                <h2 style={{ fontSize: 20, marginBottom: 16 }}>Пароль изменён</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
                  Ваш пароль был успешно изменён. Теперь вы можете войти с новым паролем.
                </p>
                <Link
                  href="/login"
                  className="btn btn-primary"
                  style={{ display: 'inline-block' }}
                >
                  Войти в аккаунт
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>
                  Придумайте новый надёжный пароль для вашего аккаунта.
                </p>

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
                  <label htmlFor="password" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                    Новый пароль
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Минимум 6 символов"
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
                  <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                    Подтвердите пароль
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Повторите пароль"
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
                  {loading ? 'Сохранение...' : 'Сохранить пароль'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <BigFooter />
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
        <Navbar />
        <section className="section">
          <div className="container" style={{ maxWidth: 480, textAlign: 'center' }}>
            <p>Загрузка...</p>
          </div>
        </section>
        <BigFooter />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
