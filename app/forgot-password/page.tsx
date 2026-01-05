'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/app/_components/Navbar'
import BigFooter from '@/app/_components/BigFooter'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Произошла ошибка')
        setLoading(false)
        return
      }

      setSuccess(true)
    } catch (err) {
      setError('Произошла ошибка при отправке запроса')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Navbar />

      <section className="section">
        <div className="container" style={{ maxWidth: 480 }}>
          <h1 className="font-display text-center" style={{ fontSize: '32px', marginBottom: 32 }}>
            Восстановление пароля
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
                  fontSize: 32
                }}>
                  ✓
                </div>
                <h2 style={{ fontSize: 20, marginBottom: 16 }}>Письмо отправлено</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
                  Если аккаунт с указанным email существует, вы получите письмо с инструкциями по сбросу пароля.
                </p>
                <Link
                  href="/login"
                  className="btn btn-ghost"
                  style={{ display: 'inline-block' }}
                >
                  Вернуться ко входу
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>
                  Введите email, указанный при регистрации. Мы отправим вам ссылку для сброса пароля.
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
                  <label htmlFor="email" style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
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
                  {loading ? 'Отправка...' : 'Отправить ссылку'}
                </button>

                <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
                  Вспомнили пароль?{' '}
                  <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                    Войти
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <BigFooter />
    </div>
  )
}
