import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth/getUser'

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user || user.role !== 'SELLER') {
    redirect('/auth/seller-login?callbackUrl=/seller')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--ring)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 70 }}>
            <Link href="/seller" style={{ fontSize: 24, fontWeight: 700 }}>
              Кабинет продавца
            </Link>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)' }}>{user.email}</span>
              <Link href="/api/auth/logout" className="btn btn-ghost">
                Выход
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', maxWidth: 1400, margin: '0 auto', width: '100%' }}>
        {/* Sidebar */}
        <aside style={{ width: 250, background: 'var(--surface)', borderRight: '1px solid var(--ring)', padding: '20px 0' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link href="/seller" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
              📊 Главная
            </Link>
            <Link href="/seller/products" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
              🛍️ Мои товары
            </Link>
            <Link href="/seller/orders" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
              📦 Заказы
            </Link>
            <Link href="/seller/payouts" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
              💰 Выплаты
            </Link>
            <Link href="/seller/settings" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
              ⚙️ Настройки
            </Link>
            <Link href="/documents/seller-offer.md" target="_blank" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
              📄 Оферта
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, padding: 40 }}>
          {children}
        </main>
      </div>
    </div>
  )
}
