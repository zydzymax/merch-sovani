'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface CookieConsent {
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
  timestamp: string
}

export default function CookieBanner() {
  const [show, setShow] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState<CookieConsent>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
    timestamp: new Date().toISOString(),
  })

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) {
      setTimeout(() => setShow(true), 1000)
    }
  }, [])

  const saveConsent = (consent: CookieConsent) => {
    localStorage.setItem('cookie_consent', JSON.stringify(consent))
    setShow(false)
    setShowSettings(false)
    window.location.reload()
  }

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    })
  }

  const acceptNecessary = () => {
    saveConsent({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    })
  }

  const acceptCustom = () => {
    saveConsent({
      ...settings,
      timestamp: new Date().toISOString(),
    })
  }

  if (!show) return null

  return (
    <>
      {/* Overlay */}
      {showSettings && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 100
          }}
          onClick={() => setShowSettings(false)}
        />
      )}

      {/* Cookie Banner */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--surface)',
          borderTop: '2px solid var(--accent)',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.3)',
          zIndex: 101
        }}
      >
        <div className="container" style={{ padding: '24px' }}>
          {!showSettings ? (
            // Simple Banner
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16
            }} className="cookie-banner-content">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <span style={{ fontSize: 32 }}>🍪</span>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, color: 'var(--text)' }}>
                    Мы используем cookie
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    Для работы сайта и аналитики. Вы можете{' '}
                    <button
                      onClick={() => setShowSettings(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent)',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        fontWeight: 600,
                        padding: 0
                      }}
                    >
                      настроить
                    </button>{' '}
                    предпочтения или принять все. Подробнее в{' '}
                    <Link
                      href="/legal/cookies"
                      style={{ color: 'var(--accent)', textDecoration: 'underline', fontWeight: 600 }}
                      target="_blank"
                    >
                      Политике cookie
                    </Link>
                    .
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }} className="cookie-buttons">
                <button
                  onClick={acceptNecessary}
                  className="btn btn-ghost"
                  style={{ padding: '12px 24px' }}
                >
                  Только необходимые
                </button>
                <button
                  onClick={acceptAll}
                  className="btn btn-primary"
                  style={{ padding: '12px 24px' }}
                >
                  Принять все
                </button>
              </div>
            </div>
          ) : (
            // Settings Modal
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowSettings(false)}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 8,
                  fontSize: 20
                }}
              >
                ✕
              </button>

              <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 20, paddingRight: 40, color: 'var(--text)' }}>
                Настройка cookie
              </h3>

              <div style={{ display: 'grid', gap: 12, maxHeight: '50vh', overflowY: 'auto' }}>
                {/* Necessary */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  padding: 16,
                  background: 'var(--surface-2)',
                  borderRadius: 'var(--radius-md)',
                  gap: 16
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <h4 style={{ fontWeight: 600, color: 'var(--text)' }}>Необходимые cookie</h4>
                      <span style={{
                        fontSize: 11,
                        padding: '2px 8px',
                        background: 'var(--ring)',
                        borderRadius: 'var(--pill)',
                        color: 'var(--text-muted)'
                      }}>
                        Обязательно
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      Обеспечивают базовую функциональность сайта. Всегда включены.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    style={{ width: 20, height: 20, marginTop: 4, opacity: 0.5 }}
                  />
                </div>

                {/* Functional */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  padding: 16,
                  border: '1px solid var(--ring)',
                  borderRadius: 'var(--radius-md)',
                  gap: 16
                }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 600, marginBottom: 4, color: 'var(--text)' }}>Функциональные cookie</h4>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      Запоминают ваши предпочтения (язык, регион).
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.functional}
                    onChange={(e) => setSettings({ ...settings, functional: e.target.checked })}
                    style={{ width: 20, height: 20, marginTop: 4, accentColor: 'var(--accent)' }}
                  />
                </div>

                {/* Analytics */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  padding: 16,
                  border: '1px solid var(--ring)',
                  borderRadius: 'var(--radius-md)',
                  gap: 16
                }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 600, marginBottom: 4, color: 'var(--text)' }}>Аналитические cookie</h4>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      Анонимная статистика для улучшения сайта.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.analytics}
                    onChange={(e) => setSettings({ ...settings, analytics: e.target.checked })}
                    style={{ width: 20, height: 20, marginTop: 4, accentColor: 'var(--accent)' }}
                  />
                </div>

                {/* Marketing */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  padding: 16,
                  border: '1px solid var(--ring)',
                  borderRadius: 'var(--radius-md)',
                  gap: 16
                }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 600, marginBottom: 4, color: 'var(--text)' }}>Маркетинговые cookie</h4>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      Персонализация рекламных предложений.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.marketing}
                    onChange={(e) => setSettings({ ...settings, marketing: e.target.checked })}
                    style={{ width: 20, height: 20, marginTop: 4, accentColor: 'var(--accent)' }}
                  />
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: 12,
                marginTop: 20,
                paddingTop: 20,
                borderTop: '1px solid var(--ring)'
              }}>
                <button
                  onClick={acceptNecessary}
                  className="btn btn-ghost"
                  style={{ padding: '12px 24px' }}
                >
                  Только необходимые
                </button>
                <button
                  onClick={acceptCustom}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '12px 24px' }}
                >
                  Сохранить настройки
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @media (min-width: 768px) {
          .cookie-banner-content {
            flex-direction: row !important;
            align-items: center;
            justify-content: space-between;
          }
          .cookie-buttons {
            flex-shrink: 0;
          }
        }
      `}</style>
    </>
  )
}
