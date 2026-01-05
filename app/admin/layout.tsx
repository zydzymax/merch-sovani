import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth/getUser'

export const metadata = {
  title: 'Админ-панель - Магазин',
  description: 'Управление магазином Магазин',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check admin authentication
  const user = await getUser()
  if (!user || user.role !== 'ADMIN') {
    redirect('/auth/admin-login?callbackUrl=/admin')
  }

  const navLinks = [
    { href: '/admin', label: 'Статистика', icon: '📊' },
    { href: '/admin/orders', label: 'Заказы', icon: '📦' },
    { href: '/admin/products', label: 'Товары', icon: '🛍️' },
    { href: '/admin/content', label: 'Контент', icon: '📝' },
    { href: '/admin/media', label: 'Медиа', icon: '🖼️' },
    { href: '/admin/draws', label: 'Розыгрыши', icon: '🎁' },
    { href: '/admin/users', label: 'Пользователи', icon: '👥' },
    { href: '/admin/settings', label: 'Настройки', icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Admin Header */}
      <header
        style={{
          background: 'var(--surface)',
          borderBottom: '1px solid var(--ring)',
          padding: '16px 0',
        }}
      >
        <div className="container" style={{ maxWidth: 1400 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/admin" style={{ fontSize: 24, fontWeight: 700 }}>
              ⚡ Админ-панель Магазин
            </Link>
            <Link href="/" className="btn btn-ghost" style={{ fontSize: 14 }}>
              ← На сайт
            </Link>
          </div>
        </div>
      </header>

      <div className="container" style={{ maxWidth: 1400, paddingTop: 32, paddingBottom: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 32 }}>
          {/* Sidebar Navigation */}
          <aside>
            <nav
              className="tile"
              style={{
                padding: 20,
                position: 'sticky',
                top: 32,
              }}
            >
              <div style={{ display: 'grid', gap: 8 }}>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="btn btn-ghost"
                    style={{
                      justifyContent: 'flex-start',
                      padding: '12px 16px',
                      fontSize: 15,
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ marginRight: 10 }}>{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main>{children}</main>
        </div>
      </div>
    </div>
  )
}
