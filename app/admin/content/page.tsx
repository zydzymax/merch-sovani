'use client'

import { useState, useEffect } from 'react'

export default function AdminContentPage() {
  const [content, setContent] = useState({
    heroTitle: '',
    heroSubtitle: '',
    promoTitle: '',
    promoDescription: '',
    aboutTitle: '',
    aboutText: '',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadContent()
  }, [])

  async function loadContent() {
    try {
      const response = await fetch('/api/admin/content')
      if (response.ok) {
        const data = await response.json()
        setContent(data)
      }
    } catch (error) {
      console.error('Failed to load content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      })

      if (response.ok) {
        setMessage('✅ Контент сохранён успешно')
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
          Управление контентом
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 16 }}>
          Редактирование текстов и заголовков на сайте
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

      {/* Hero Section */}
      <div className="tile" style={{ padding: 32 }}>
        <h2 className="font-display" style={{ fontSize: 24, marginBottom: 20 }}>
          🎯 Главная секция (Hero)
        </h2>

        <div style={{ display: 'grid', gap: 20 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              Заголовок
            </label>
            <input
              type="text"
              value={content.heroTitle}
              onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
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
              Подзаголовок
            </label>
            <input
              type="text"
              value={content.heroSubtitle}
              onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
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

      {/* Promo Section */}
      <div className="tile" style={{ padding: 32 }}>
        <h2 className="font-display" style={{ fontSize: 24, marginBottom: 20 }}>
          🎁 Секция акции
        </h2>

        <div style={{ display: 'grid', gap: 20 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              Заголовок акции
            </label>
            <input
              type="text"
              value={content.promoTitle}
              onChange={(e) => setContent({ ...content, promoTitle: e.target.value })}
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
              Описание акции
            </label>
            <textarea
              value={content.promoDescription}
              onChange={(e) =>
                setContent({ ...content, promoDescription: e.target.value })
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
        </div>
      </div>

      {/* About Section */}
      <div className="tile" style={{ padding: 32 }}>
        <h2 className="font-display" style={{ fontSize: 24, marginBottom: 20 }}>
          ℹ️ Секция &ldquo;О нас&rdquo;
        </h2>

        <div style={{ display: 'grid', gap: 20 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              Заголовок
            </label>
            <input
              type="text"
              value={content.aboutTitle}
              onChange={(e) => setContent({ ...content, aboutTitle: e.target.value })}
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
              Текст
            </label>
            <textarea
              value={content.aboutText}
              onChange={(e) => setContent({ ...content, aboutText: e.target.value })}
              rows={5}
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
          {saving ? 'Сохранение...' : '💾 Сохранить изменения'}
        </button>
      </div>
    </div>
  )
}
