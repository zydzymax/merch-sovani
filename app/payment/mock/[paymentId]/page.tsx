'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function MockPaymentPage() {
  const router = useRouter()
  const params = useParams()
  const paymentId = params.paymentId as string
  const [processing, setProcessing] = useState(false)

  const handlePayment = async (status: 'succeeded' | 'failed') => {
    setProcessing(true)

    try {
      const response = await fetch('/api/payment/callback/mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId,
          status,
        }),
      })

      if (response.ok) {
        if (status === 'succeeded') {
          router.push(`/payment/success?payment=${paymentId}`)
        } else {
          router.push(`/payment/failed?payment=${paymentId}`)
        }
      } else {
        alert('Ошибка обработки платежа')
        setProcessing(false)
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Произошла ошибка')
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-accent/20 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-serif font-bold mb-2">Mock Payment Gateway</h1>
          <p className="text-muted-foreground">Тестовая страница оплаты</p>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
            ℹ️ Это демо-страница. В продакшене здесь будет ЮKassa.
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handlePayment('succeeded')}
            disabled={processing}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {processing ? 'Обработка...' : '✓ Успешная оплата'}
          </button>

          <button
            onClick={() => handlePayment('failed')}
            disabled={processing}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {processing ? 'Обработка...' : '✗ Ошибка оплаты'}
          </button>

          <Link
            href="/"
            className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors mt-6"
          >
            Отменить и вернуться на главную
          </Link>
        </div>

        <div className="mt-8 p-4 bg-muted/50 rounded text-xs space-y-2">
          <p>
            <strong>Payment ID:</strong> <code className="bg-white px-1 py-0.5">{paymentId}</code>
          </p>
          <p className="text-muted-foreground">
            Для реальных платежей настройте ЮKassa в .env и установите PAYMENT_PROVIDER=yukassa
          </p>
        </div>
      </div>
    </div>
  )
}
