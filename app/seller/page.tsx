'use client'

import { useEffect, useState } from 'react'

export default function SellerDashboardPage() {
  const [stats, setStats] = useState({
    balance: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingPayouts: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      const response = await fetch('/api/seller/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Загрузка...</div>
  }

  return (
    <div>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 30 }}>
        Главная панель
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 40 }}>
        <div className="tile" style={{ padding: 30 }}>
          <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 8 }}>
            Доступно к выводу
          </div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>
            {(stats.balance / 100).toFixed(2)} ₽
          </div>
        </div>

        <div className="tile" style={{ padding: 30 }}>
          <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 8 }}>
            Всего заказов
          </div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>
            {stats.totalOrders}
          </div>
        </div>

        <div className="tile" style={{ padding: 30 }}>
          <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 8 }}>
            Товаров в каталоге
          </div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>
            {stats.totalProducts}
          </div>
        </div>

        <div className="tile" style={{ padding: 30 }}>
          <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 8 }}>
            Ожидают выплаты
          </div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>
            {stats.pendingPayouts}
          </div>
        </div>
      </div>

      <div className="tile" style={{ padding: 30 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>
          Быстрые действия
        </h2>
        <div style={{ display: 'flex', gap: 15, flexWrap: 'wrap' }}>
          <a href="/seller/products" className="btn btn-primary">
            Добавить товар
          </a>
          <a href="/seller/payouts" className="btn btn-secondary">
            Запросить выплату
          </a>
          <a href="/seller/orders" className="btn btn-ghost">
            Посмотреть заказы
          </a>
        </div>
      </div>
    </div>
  )
}
