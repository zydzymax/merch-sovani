'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

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
      // Задержка для лучшего UX
      setTimeout(() => setShow(true), 1000)
    }
  }, [])

  const saveConsent = (consent: CookieConsent) => {
    localStorage.setItem('cookie_consent', JSON.stringify(consent))
    setShow(false)
    setShowSettings(false)

    // Перезагрузка страницы для применения настроек
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
          className="fixed inset-0 bg-black/50 z-[100]"
          onClick={() => setShowSettings(false)}
        />
      )}

      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-christmas-red shadow-2xl z-[101]">
        <div className="container mx-auto max-w-6xl p-6">
          {!showSettings ? (
            // Simple Banner
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🍪</span>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-900">
                      Мы используем cookie
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Для работы сайта и аналитики. Вы можете{' '}
                      <button
                        onClick={() => setShowSettings(true)}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        настроить
                      </button>{' '}
                      предпочтения или принять все. Подробнее в{' '}
                      <Link
                        href="/legal/cookies"
                        className="text-blue-600 hover:underline font-medium"
                        target="_blank"
                      >
                        Политике cookie
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={acceptNecessary}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 transition-colors"
                >
                  Только необходимые
                </button>
                <button
                  onClick={acceptAll}
                  className="px-6 py-3 bg-christmas-red text-white rounded-lg hover:bg-christmas-red/90 font-medium transition-colors shadow-md"
                >
                  Принять все
                </button>
              </div>
            </div>
          ) : (
            // Settings Modal
            <div className="relative">
              <button
                onClick={() => setShowSettings(false)}
                className="absolute right-0 top-0 p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="font-semibold text-xl mb-4 pr-10">
                Настройка cookie
              </h3>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Необходимые */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">Необходимые cookie</h4>
                      <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full text-gray-600">
                        Обязательно
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Обеспечивают базовую функциональность сайта (авторизация,
                      корзина, навигация). Всегда включены.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="mt-1 h-5 w-5"
                  />
                </div>

                {/* Функциональные */}
                <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Функциональные cookie</h4>
                    <p className="text-sm text-gray-600">
                      Запоминают ваши предпочтения (язык, регион, тема
                      оформления).
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.functional}
                    onChange={(e) =>
                      setSettings({ ...settings, functional: e.target.checked })
                    }
                    className="mt-1 h-5 w-5 text-christmas-red"
                  />
                </div>

                {/* Аналитические */}
                <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Аналитические cookie</h4>
                    <p className="text-sm text-gray-600">
                      Анонимная статистика посещаемости для улучшения сайта.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.analytics}
                    onChange={(e) =>
                      setSettings({ ...settings, analytics: e.target.checked })
                    }
                    className="mt-1 h-5 w-5 text-christmas-red"
                  />
                </div>

                {/* Маркетинговые */}
                <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Маркетинговые cookie</h4>
                    <p className="text-sm text-gray-600">
                      Персонализация рекламных предложений и рассылок.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.marketing}
                    onChange={(e) =>
                      setSettings({ ...settings, marketing: e.target.checked })
                    }
                    className="mt-1 h-5 w-5 text-christmas-red"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={acceptNecessary}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Только необходимые
                </button>
                <button
                  onClick={acceptCustom}
                  className="flex-1 px-6 py-3 bg-christmas-red text-white rounded-lg hover:bg-christmas-red/90 font-medium"
                >
                  Сохранить настройки
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
