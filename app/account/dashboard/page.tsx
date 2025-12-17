'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/app/_components/Navbar'
import BigFooter from '@/app/_components/BigFooter'

interface ReferralStats {
  referralCode: string
  referralsCount: number
  referralUrl: string
}

interface User {
  id: string
  email: string
  name: string | null
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/account/referral')
      if (!response.ok) {
        router.push('/login?callbackUrl=/account/dashboard')
        return
      }
      const data = await response.json()
      setStats(data)
      setUser({ id: data.userId, email: data.email, name: data.name })
      setLoading(false)
    } catch (error) {
      router.push('/login?callbackUrl=/account/dashboard')
    }
  }

  const fetchReferralStats = async () => {
    try {
      const response = await fetch('/api/account/referral')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch referral stats:', error)
    }
  }

  const copyReferralLink = () => {
    if (stats?.referralUrl) {
      navigator.clipboard.writeText(stats.referralUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
        <Navbar />
        <div className="section">
          <div className="container text-center">
            <div className="lead">Загрузка...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Navbar />

      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          <h1 className="font-display" style={{ fontSize: '32px', marginBottom: 32 }}>
            Личный кабинет
          </h1>

          <div style={{ display: 'grid', gap: 24 }}>
            {/* User Info Card */}
            <div className="tile" style={{ padding: 32 }}>
              <h2 className="font-display" style={{ fontSize: '24px', marginBottom: 20 }}>
                Информация о профиле
              </h2>
              <div style={{ display: 'grid', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 4 }}>Имя</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{user.name || 'Не указано'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 4 }}>Email</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{user.email}</div>
                </div>
              </div>
            </div>

            {/* Referral Card */}
            {stats && (
              <div className="tile" style={{ padding: 32 }}>
                <h2 className="font-display" style={{ fontSize: '24px', marginBottom: 20 }}>
                  Реферальная программа
                </h2>
                <div style={{ display: 'grid', gap: 20 }}>
                  <div>
                    <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>
                      Ваш реферальный код
                    </div>
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '8px 16px',
                        background: 'var(--surface)',
                        border: '2px solid var(--accent)',
                        borderRadius: 12,
                        fontSize: 20,
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        color: 'var(--accent)',
                      }}
                    >
                      {stats.referralCode}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>
                      Ваша реферальная ссылка
                    </div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <input
                        type="text"
                        readOnly
                        value={stats.referralUrl}
                        style={{
                          flex: 1,
                          padding: '12px 16px',
                          background: 'var(--surface)',
                          border: '1px solid var(--border)',
                          borderRadius: 12,
                          fontSize: 14,
                          color: 'var(--text)',
                        }}
                      />
                      <button onClick={copyReferralLink} className="btn btn-primary" style={{ fontSize: 14 }}>
                        {copied ? '✓ Скопировано' : 'Копировать'}
                      </button>
                    </div>
                  </div>

                  <div className="pill" style={{ padding: 16, background: 'rgba(var(--accent-rgb), 0.1)' }}>
                    <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 4 }}>
                      Приглашено друзей
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent)' }}>
                      {stats.referralsCount}
                    </div>
                  </div>

                  <div className="lead" style={{ fontSize: 14, padding: 16, background: 'var(--surface)', borderRadius: 12 }}>
                    🎁 Пригласите друзей и получите +1 дополнительный шанс на iPhone за каждую первую покупку друга!
                  </div>
                </div>
              </div>
            )}

            {/* Orders Card */}
            <div className="tile" style={{ padding: 32 }}>
              <h2 className="font-display" style={{ fontSize: '24px', marginBottom: 20 }}>
                Мои заказы
              </h2>
              <div className="lead" style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                У вас пока нет заказов
              </div>
              <Link href="/catalog" className="btn btn-primary" style={{ width: '100%', fontSize: 16, padding: '14px 24px' }}>
                Перейти в каталог
              </Link>
            </div>
          </div>
        </div>
      </section>

      <BigFooter />
    </div>
  )
}
