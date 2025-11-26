'use client'

import { useState, useEffect } from 'react'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    cdekClientId: '',
    cdekClientSecret: '',
    cdekTestMode: true,
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    contactPhone: '',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setMessage('✅ Настройки сохранены успешно')
      } else {
        setMessage('❌ Ошибка при сохранении')
      }
    } catch (error) {
      setMessage('❌ Ошибка при сохранении')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div style={{ padding: 40 }}>Загрузка...</div>
  }

  return (
    <div style={{ display: 'grid', gap: 32 }}>
      <div>
        <h1 className="font-display" style={{ fontSize: 40, marginBottom: 8 }}>
          Настройки
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 16 }}>
          Управление настройками сайта и интеграциями
        </p>
      </div>

      {message && (
        <div
          className="tile"
          style={{
            padding: 16,
            background: message.includes('✅') ? '#00C853' : '#F44336',
            color: '#fff',
          }}
        >
          {message}
        </div>
      )}

      {/* CDEK Settings */}
      <div className="tile" style={{ padding: 32 }}>
        <h2 className="font-display" style={{ fontSize: 24, marginBottom: 20 }}>
          🚚 Настройки СДЭК
        </h2>

        <div style={{ display: 'grid', gap: 20 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              Client ID (Account)
            </label>
            <input
              type="text"
              value={settings.cdekClientId}
              onChange={(e) =>
                setSettings({ ...settings, cdekClientId: e.target.value })
              }
              placeholder="Введите Client ID из личного кабинета СДЭК"
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                border: '1px solid var(--ring)',
                background: 'var(--surface)',
                color: 'var(--text)',
                fontSize: 14,
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              Client Secret (Secure password)
            </label>
            <input
              type="password"
              value={settings.cdekClientSecret}
              onChange={(e) =>
                setSettings({ ...settings, cdekClientSecret: e.target.value })
              }
              placeholder="Введите Secure password из личного кабинета СДЭК"
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                border: '1px solid var(--ring)',
                background: 'var(--surface)',
                color: 'var(--text)',
                fontSize: 14,
              }}
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.cdekTestMode}
                onChange={(e) =>
                  setSettings({ ...settings, cdekTestMode: e.target.checked })
                }
                style={{ width: 20, height: 20 }}
              />
              <span style={{ fontSize: 14 }}>Тестовый режим (использовать тестовый API)</span>
            </label>
          </div>

          <div
            style={{
              padding: 16,
              background: 'var(--surface)',
              borderRadius: 8,
              fontSize: 13,
              color: 'var(--muted)',
            }}
          >
            <strong>Инструкция:</strong>
            <ol style={{ paddingLeft: 20, marginTop: 8 }}>
              <li>Зарегистрируйтесь в личном кабинете СДЭК</li>
              <li>Получите Client ID и Secret в разделе &ldquo;Интеграция&rdquo;</li>
              <li>Вставьте их в поля выше</li>
              <li>Для тестирования используйте тестовый режим</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Site Settings */}
      <div className="tile" style={{ padding: 32 }}>
        <h2 className="font-display" style={{ fontSize: 24, marginBottom: 20 }}>
          🌐 Настройки сайта
        </h2>

        <div style={{ display: 'grid', gap: 20 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              Название сайта
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                border: '1px solid var(--ring)',
                background: 'var(--surface)',
                color: 'var(--text)',
                fontSize: 14,
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              Описание сайта
            </label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) =>
                setSettings({ ...settings, siteDescription: e.target.value })
              }
              rows={3}
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                border: '1px solid var(--ring)',
                background: 'var(--surface)',
                color: 'var(--text)',
                fontSize: 14,
                resize: 'vertical',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              Email для связи
            </label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) =>
                setSettings({ ...settings, contactEmail: e.target.value })
              }
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                border: '1px solid var(--ring)',
                background: 'var(--surface)',
                color: 'var(--text)',
                fontSize: 14,
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              Телефон для связи
            </label>
            <input
              type="tel"
              value={settings.contactPhone}
              onChange={(e) =>
                setSettings({ ...settings, contactPhone: e.target.value })
              }
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                border: '1px solid var(--ring)',
                background: 'var(--surface)',
                color: 'var(--text)',
                fontSize: 14,
              }}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary"
          style={{ minWidth: 200 }}
        >
          {saving ? 'Сохранение...' : '💾 Сохранить настройки'}
        </button>
      </div>
    </div>
  )
}
