'use client'

import { useEffect, useState } from 'react'

export default function SellerSettingsPage() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    inn: '',
    ogrn: '',
    legalAddress: '',
    bankAccount: '',
    bankName: '',
    bankBik: '',
    bankCorAccount: '',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    try {
      const response = await fetch('/api/seller/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/seller/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })

      if (response.ok) {
        setMessage('Настройки успешно сохранены')
      } else {
        setMessage('Ошибка при сохранении')
      }
    } catch (error) {
      console.error('Failed to save profile:', error)
      setMessage('Ошибка при сохранении')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div>Загрузка...</div>
  }

  return (
    <div>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 30 }}>
        Настройки
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="tile" style={{ padding: 30, marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>
            Основная информация
          </h2>

          <div style={{ display: 'grid', gap: 20, maxWidth: 600 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>
                Email
              </label>
              <input
                type="email"
                className="input"
                value={profile.email}
                disabled
                style={{ background: 'var(--ring)', cursor: 'not-allowed' }}
              />
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 5 }}>
                Email нельзя изменить
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>
                Имя
              </label>
              <input
                type="text"
                className="input"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>
                Телефон
              </label>
              <input
                type="tel"
                className="input"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="tile" style={{ padding: 30, marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>
            Юридическая информация
          </h2>

          <div style={{ display: 'grid', gap: 20, maxWidth: 600 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>
                Название компании (ИП/ООО)
              </label>
              <input
                type="text"
                className="input"
                value={profile.companyName}
                onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>
                  ИНН
                </label>
                <input
                  type="text"
                  className="input"
                  value={profile.inn}
                  onChange={(e) => setProfile({ ...profile, inn: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>
                  ОГРН/ОГРНИП
                </label>
                <input
                  type="text"
                  className="input"
                  value={profile.ogrn}
                  onChange={(e) => setProfile({ ...profile, ogrn: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>
                Юридический адрес
              </label>
              <input
                type="text"
                className="input"
                value={profile.legalAddress}
                onChange={(e) => setProfile({ ...profile, legalAddress: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="tile" style={{ padding: 30, marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>
            Банковские реквизиты
          </h2>

          <div style={{ display: 'grid', gap: 20, maxWidth: 600 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>
                Расчётный счёт
              </label>
              <input
                type="text"
                className="input"
                value={profile.bankAccount}
                onChange={(e) => setProfile({ ...profile, bankAccount: e.target.value })}
                placeholder="40702810..."
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>
                Название банка
              </label>
              <input
                type="text"
                className="input"
                value={profile.bankName}
                onChange={(e) => setProfile({ ...profile, bankName: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>
                  БИК
                </label>
                <input
                  type="text"
                  className="input"
                  value={profile.bankBik}
                  onChange={(e) => setProfile({ ...profile, bankBik: e.target.value })}
                  placeholder="044525..."
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>
                  Корреспондентский счёт
                </label>
                <input
                  type="text"
                  className="input"
                  value={profile.bankCorAccount}
                  onChange={(e) => setProfile({ ...profile, bankCorAccount: e.target.value })}
                  placeholder="30101810..."
                />
              </div>
            </div>

            <div style={{ padding: 15, background: 'var(--info)20', borderRadius: 8, fontSize: 13, color: 'var(--muted)' }}>
              Банковские реквизиты необходимы для получения выплат. Убедитесь, что все данные введены корректно.
            </div>
          </div>
        </div>

        {message && (
          <div style={{
            padding: 15,
            marginBottom: 20,
            borderRadius: 8,
            background: message.includes('успешно') ? 'var(--success)20' : 'var(--error)20',
            color: message.includes('успешно') ? 'var(--success)' : 'var(--error)',
          }}>
            {message}
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </form>
    </div>
  )
}
