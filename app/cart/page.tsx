'use client'

import Link from 'next/link'

export default function CartPage() {
  const cartItems: any[] = []

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <div className="container" style={{ padding: '48px 24px' }}>
        <h1 className="font-display" style={{ fontSize: '40px', fontWeight: 700, marginBottom: 32 }}>Корзина</h1>

        <div className="tile" style={{ padding: 48, textAlign: 'center' }}>
          <p className="lead" style={{ fontSize: 20, marginBottom: 24, color: 'var(--text-muted)' }}>Ваша корзина пуста</p>
          <Link
            href="/catalog"
            className="btn btn-primary"
            style={{ display: 'inline-block', padding: '14px 32px' }}
          >
            Перейти в каталог
          </Link>
        </div>
      </div>
    </div>
  )
}
