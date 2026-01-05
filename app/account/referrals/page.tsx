'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import LogoutButton from '@/components/LogoutButton'

interface ReferralData {
  code: string
  url: string
  stats: {
    clicks: number
    orders: number
  }
  createdAt: string
}

export default function ReferralsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const fetchReferralData = useCallback(async () => {
    try {
      const res = await fetch('/api/account/referral')

      if (res.status === 401) {
        router.push('/account')
        return
      }

      if (!res.ok) {
        throw new Error('Failed to fetch referral data')
      }

      const data = await res.json()
      setReferralData(data)
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchReferralData()
  }, [fetchReferralData])

  const copyToClipboard = async () => {
    if (!referralData) return

    try {
      await navigator.clipboard.writeText(referralData.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-serif font-bold text-primary">
              GETNWIN
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/catalog" className="hover:text-primary transition-colors">
                Каталог
              </Link>
              <Link href="/promo" className="hover:text-primary transition-colors">
                Акция
              </Link>
              <Link href="/draws" className="hover:text-primary transition-colors">
                Розыгрыши
              </Link>
              <Link href="/account/dashboard" className="hover:text-primary transition-colors">
                Личный кабинет
              </Link>
              <LogoutButton />
            </nav>
          </div>
        </div>
      </header>

      {/* Page content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <Link
            href="/account/dashboard"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Назад в личный кабинет
          </Link>

          {/* Main card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-red-200">
            {/* Header with Christmas theme */}
            <div className="bg-gradient-to-r from-red-600 via-green-600 to-red-600 p-8 text-white text-center">
              <div className="text-5xl mb-3">🎁</div>
              <h1 className="text-3xl font-serif font-bold mb-2">Приведи друга</h1>
              <p className="text-red-100 text-lg">
                Поделись ссылкой с друзьями и получайте бонусы вместе!
              </p>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Загрузка...</p>
              </div>
            ) : error ? (
              <div className="p-8">
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-lg">
                  {error}
                </div>
              </div>
            ) : referralData ? (
              <div className="p-8 space-y-8">
                {/* Referral Link Section */}
                <div>
                  <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">🔗</span>
                    Твоя реферальная ссылка
                  </h2>
                  <div className="bg-gradient-to-br from-red-50 to-green-50 border-2 border-red-200 rounded-xl p-6">
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2 font-medium">Ссылка для друзей:</p>
                      <div className="bg-white rounded-lg p-4 border-2 border-green-200 font-mono text-lg text-gray-800 break-all">
                        {referralData.url}
                      </div>
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="w-full bg-gradient-to-r from-red-600 to-green-600 text-white px-6 py-3 rounded-lg font-bold hover:from-red-700 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                    >
                      {copied ? (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Скопировано!
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Скопировать ссылку
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Statistics Section */}
                <div>
                  <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    Статистика
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6 text-center">
                      <div className="text-4xl mb-2">👥</div>
                      <div className="text-4xl font-bold text-blue-700 mb-2">
                        {referralData.stats.clicks}
                      </div>
                      <div className="text-blue-800 font-semibold">Переходов по ссылке</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-6 text-center">
                      <div className="text-4xl mb-2">🛒</div>
                      <div className="text-4xl font-bold text-green-700 mb-2">
                        {referralData.stats.orders}
                      </div>
                      <div className="text-green-800 font-semibold">Заказов от друзей</div>
                    </div>
                  </div>
                </div>

                {/* How it works */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">❓</span>
                    Как это работает?
                  </h3>
                  <ol className="space-y-3 text-gray-700">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                      <span>Поделись своей реферальной ссылкой с друзьями</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                      <span>Когда друг перейдет по ссылке и сделает заказ, вы оба получите по +1 шансу в розыгрыше призов</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                      <span>Чем больше друзей, тем больше бонусов!</span>
                    </li>
                  </ol>
                </div>

                {/* Bonus info */}
                <div className="bg-gradient-to-r from-red-100 via-yellow-100 to-green-100 border-2 border-red-300 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-3">🎉</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Новогодние бонусы!</h3>
                  <p className="text-gray-700">
                    За каждого приглашенного друга, который сделает заказ, вы и ваш друг КАЖДЫЙ получите +1 шанс в розыгрыше!
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm opacity-80">
            © 2025 GETNWIN. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  )
}
