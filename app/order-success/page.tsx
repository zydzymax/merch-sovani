'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/app/_components/Navbar'
import BigFooter from '@/app/_components/BigFooter'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')
  const [confetti, setConfetti] = useState(true)

  useEffect(() => {
    // Clear cart event
    window.dispatchEvent(new Event('cartUpdated'))

    // Stop confetti after 5 seconds
    const timer = setTimeout(() => setConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <div className="container" style={{ padding: '48px 24px', maxWidth: 700, margin: '0 auto' }}>
        {/* Success Animation */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div
            style={{
              width: 100,
              height: 100,
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              animation: 'scaleIn 0.5s ease',
              boxShadow: '0 0 40px rgba(34, 197, 94, 0.4)'
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ animation: 'checkmark 0.5s ease 0.3s both' }}
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(28px, 5vw, 40px)',
              fontWeight: 700,
              marginBottom: 16,
              animation: 'fadeInUp 0.5s ease 0.2s both'
            }}
          >
            Спасибо за заказ!
          </h1>

          <p
            style={{
              fontSize: 18,
              color: 'var(--text-muted)',
              animation: 'fadeInUp 0.5s ease 0.3s both'
            }}
          >
            Ваш заказ успешно оформлен и принят в обработку
          </p>
        </div>

        {/* Order Details Card */}
        <div
          className="tile"
          style={{
            padding: 32,
            marginBottom: 24,
            animation: 'fadeInUp 0.5s ease 0.4s both'
          }}
        >
          {orderId && (
            <div style={{ marginBottom: 24, textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>
                Номер заказа
              </p>
              <p
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  color: 'var(--accent)',
                  letterSpacing: 1
                }}
              >
                #{orderId.slice(-8).toUpperCase()}
              </p>
            </div>
          )}

          <div
            style={{
              background: 'var(--surface-2)',
              borderRadius: 'var(--radius-md)',
              padding: 20,
              marginBottom: 24
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
              Что дальше?
            </h3>
            <ol style={{ display: 'grid', gap: 12, paddingLeft: 20, margin: 0 }}>
              <li style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                На ваш email отправлено письмо с подтверждением и деталями заказа
              </li>
              <li style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Мы подготовим ваш заказ в течение 1-2 рабочих дней
              </li>
              <li style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Отправка осуществляется Почтой России, трек-номер придёт на email
              </li>
              <li style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Стандартный срок доставки — 5-14 дней в зависимости от региона
              </li>
            </ol>
          </div>

          {/* Promo Notice */}
          <div
            style={{
              background: 'rgba(255, 193, 7, 0.1)',
              border: '1px solid rgba(255, 193, 7, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: 20
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ fontSize: 24 }}>🎁</span>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
                  Участие в розыгрыше
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Если вы приобрели акционный товар или активировали участие в акции, ваш уникальный код участия будет отправлен на email после подтверждения оплаты.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div
          className="tile"
          style={{
            padding: 24,
            marginBottom: 32,
            animation: 'fadeInUp 0.5s ease 0.5s both'
          }}
        >
          <p style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center' }}>
            Есть вопросы? Напишите нам на{' '}
            <a
              href="mailto:support@sovani.ru"
              style={{ color: 'var(--accent)', textDecoration: 'underline' }}
            >
              support@sovani.ru
            </a>
          </p>
        </div>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            animation: 'fadeInUp 0.5s ease 0.6s both'
          }}
        >
          <Link
            href="/catalog"
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '16px 32px',
              textAlign: 'center',
              fontSize: 16
            }}
          >
            Продолжить покупки
          </Link>
          <Link
            href="/"
            className="btn btn-ghost"
            style={{
              width: '100%',
              padding: '14px 32px',
              textAlign: 'center'
            }}
          >
            На главную
          </Link>
        </div>
      </div>

      {/* Confetti Animation */}
      {confetti && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: 100,
            overflow: 'hidden'
          }}
        >
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: 10,
                height: 10,
                background: ['#ff2b2b', '#22c55e', '#eab308', '#3b82f6', '#a855f7'][i % 5],
                borderRadius: i % 2 === 0 ? '50%' : '0',
                left: `${Math.random() * 100}%`,
                top: '-20px',
                animation: `confetti ${2 + Math.random() * 2}s ease-out ${Math.random() * 0.5}s forwards`
              }}
            />
          ))}
        </div>
      )}
    </>
  )
}

function LoadingFallback() {
  return (
    <div className="container" style={{ padding: '48px 24px', maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
      <div style={{
        width: 100,
        height: 100,
        background: 'var(--surface-2)',
        borderRadius: '50%',
        margin: '0 auto 24px',
        animation: 'pulse 2s infinite'
      }} />
      <div style={{ height: 40, background: 'var(--surface-2)', borderRadius: 8, maxWidth: 300, margin: '0 auto 16px' }} />
      <div style={{ height: 20, background: 'var(--surface-2)', borderRadius: 8, maxWidth: 400, margin: '0 auto' }} />
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      <Navbar />

      <Suspense fallback={<LoadingFallback />}>
        <OrderSuccessContent />
      </Suspense>

      <BigFooter />

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.8; }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes checkmark {
          from {
            stroke-dashoffset: 30;
            stroke-dasharray: 30;
          }
          to {
            stroke-dashoffset: 0;
            stroke-dasharray: 30;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
