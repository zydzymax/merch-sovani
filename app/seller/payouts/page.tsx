'use client'

import { useEffect, useState } from 'react'

export default function SellerPayoutsPage() {
  const [balance, setBalance] = useState(0)
  const [payouts, setPayouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [amount, setAmount] = useState('')
  const [requesting, setRequesting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [balanceRes, payoutsRes] = await Promise.all([
        fetch('/api/seller/balance'),
        fetch('/api/seller/payouts'),
      ])

      if (balanceRes.ok) {
        const balanceData = await balanceRes.json()
        setBalance(balanceData.balance)
      }

      if (payoutsRes.ok) {
        const payoutsData = await payoutsRes.json()
        setPayouts(payoutsData)
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleRequestPayout(e: React.FormEvent) {
    e.preventDefault()

    const amountInCents = Math.round(parseFloat(amount) * 100)

    if (amountInCents <= 0) {
      alert('Укажите корректную сумму')
      return
    }

    if (amountInCents > balance) {
      alert('Недостаточно средств')
      return
    }

    setRequesting(true)

    try {
      const response = await fetch('/api/seller/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountInCents }),
      })

      if (response.ok) {
        setShowForm(false)
        setAmount('')
        loadData()
        alert('Заявка на выплату успешно создана')
      } else {
        const error = await response.json()
        alert(error.error || 'Ошибка при создании заявки')
      }
    } catch (error) {
      console.error('Failed to request payout:', error)
      alert('Ошибка при создании заявки')
    } finally {
      setRequesting(false)
    }
  }

  function getStatusLabel(status: string) {
    const labels: Record<string, string> = {
      PENDING: 'Ожидает обработки',
      PROCESSING: 'В обработке',
      COMPLETED: 'Выполнена',
      REJECTED: 'Отклонена',
    }
    return labels[status] || status
  }

  function getStatusColor(status: string) {
    const colors: Record<string, string> = {
      PENDING: 'var(--warning)',
      PROCESSING: 'var(--info)',
      COMPLETED: 'var(--success)',
      REJECTED: 'var(--muted)',
    }
    return colors[status] || 'var(--muted)'
  }

  if (loading) {
    return <div>Загрузка...</div>
  }

  return (
    <div>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 30 }}>
        Выплаты
      </h1>

      <div className="tile" style={{ padding: 30, marginBottom: 30 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 8 }}>
              Доступно к выводу
            </div>
            <div style={{ fontSize: 36, fontWeight: 700 }}>
              {(balance / 100).toFixed(2)} ₽
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
            disabled={balance <= 0}
          >
            Запросить выплату
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleRequestPayout} style={{ marginTop: 30, paddingTop: 30, borderTop: '1px solid var(--ring)' }}>
            <div style={{ maxWidth: 400 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>
                Сумма к выводу (₽)
              </label>
              <input
                type="number"
                className="input"
                required
                step="0.01"
                max={(balance / 100).toFixed(2)}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 8, marginBottom: 20 }}>
                Средства будут переведены на указанный в настройках банковский счёт в течение 15 рабочих дней.
              </div>
              <div style={{ display: 'flex', gap: 15 }}>
                <button type="submit" className="btn btn-primary" disabled={requesting}>
                  {requesting ? 'Обработка...' : 'Отправить заявку'}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowForm(false)}
                >
                  Отмена
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>
        История выплат
      </h2>

      {payouts.length === 0 ? (
        <div className="tile" style={{ padding: 60, textAlign: 'center' }}>
          <p style={{ fontSize: 16, color: 'var(--muted)' }}>
            У вас пока нет заявок на выплату
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 15 }}>
          {payouts.map((payout: any) => (
            <div key={payout.id} className="tile" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 5 }}>
                    {(payout.amount / 100).toFixed(2)} ₽
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                    Создана: {new Date(payout.createdAt).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  {payout.completedAt && (
                    <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                      Выполнена: {new Date(payout.completedAt).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  )}
                  {payout.rejectReason && (
                    <div style={{ fontSize: 13, color: 'var(--error)', marginTop: 5 }}>
                      Причина отказа: {payout.rejectReason}
                    </div>
                  )}
                </div>
                <div style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  background: getStatusColor(payout.status) + '20',
                  color: getStatusColor(payout.status),
                }}>
                  {getStatusLabel(payout.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
