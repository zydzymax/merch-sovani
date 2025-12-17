'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type UserRole = 'ALL' | 'CUSTOMER' | 'SELLER' | 'ADMIN'

type User = {
  id: string
  email: string
  name: string | null
  phone: string | null
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN'
  emailVerified: Date | null
  companyName: string | null
  inn: string | null
  ogrn: string | null
  referralCode: string | null
  createdAt: string
  updatedAt: string
  _count: {
    orders: number
    sellerProducts: number
    referralsFrom: number
  }
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [roleFilter, setRoleFilter] = useState<UserRole>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(0)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        role: roleFilter,
        search: searchQuery,
        page: page.toString(),
        limit: '50',
      })

      const response = await fetch(`/api/admin/users?${params}`)
      if (!response.ok) throw new Error('Failed to fetch users')

      const data = await response.json()
      setUsers(data.users)
      setTotal(data.pagination.total)
      setPages(data.pagination.pages)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [roleFilter, page])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchUsers()
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return

    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete user')

      fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Не удалось удалить пользователя')
    }
  }

  const handleExportExcel = async () => {
    setExporting(true)
    try {
      const response = await fetch('/api/admin/users/export')
      if (!response.ok) throw new Error('Failed to export users')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `users_${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error exporting users:', error)
      alert('Не удалось экспортировать пользователей')
    } finally {
      setExporting(false)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return '#ff3b30'
      case 'SELLER':
        return '#ff8534'
      case 'CUSTOMER':
        return '#34c759'
      default:
        return '#999'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Админ'
      case 'SELLER':
        return 'Продавец'
      case 'CUSTOMER':
        return 'Покупатель'
      default:
        return role
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: '32px', margin: 0 }}>
            👥 Пользователи
          </h1>
          <div style={{ fontSize: 14, color: 'var(--muted)', marginTop: 4 }}>
            Всего: {total}
          </div>
        </div>
        <button
          onClick={handleExportExcel}
          disabled={exporting || total === 0}
          className="btn"
          style={{
            background: 'var(--accent)',
            color: '#fff',
            opacity: exporting || total === 0 ? 0.5 : 1,
            cursor: exporting || total === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          {exporting ? 'Экспорт...' : '📊 Экспорт в Excel'}
        </button>
      </div>

      {/* Filters */}
      <div className="tile" style={{ padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Role Filter */}
          <div style={{ display: 'flex', gap: 8 }}>
            {(['ALL', 'CUSTOMER', 'SELLER', 'ADMIN'] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => {
                  setRoleFilter(role)
                  setPage(1)
                }}
                className="btn"
                style={{
                  background: roleFilter === role ? 'var(--accent)' : 'var(--surface-2)',
                  color: '#fff',
                  fontSize: 14,
                  padding: '8px 16px',
                }}
              >
                {role === 'ALL' ? 'Все' : getRoleLabel(role)}
              </button>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', gap: 8, maxWidth: 400 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по email, имени, телефону, ИНН..."
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--ring)',
                background: 'var(--surface)',
                color: 'var(--text)',
                fontSize: 14,
              }}
            />
            <button type="submit" className="btn" style={{ background: 'var(--accent)', color: '#fff', padding: '8px 16px' }}>
              Найти
            </button>
          </form>
        </div>
      </div>

      {/* Users Table */}
      <div className="tile" style={{ overflow: 'auto' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
            Загрузка...
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
            Пользователи не найдены
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--ring)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>
                  Email
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>
                  Имя / Компания
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>
                  Телефон
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>
                  Роль
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>
                  ИНН / ОГРН
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>
                  Заказы
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>
                  Товары
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>
                  Дата регистрации
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--ring)' }}>
                  <td style={{ padding: '12px 16px', fontSize: 14 }}>
                    <div>{user.email}</div>
                    {user.emailVerified && (
                      <div style={{ fontSize: 12, color: '#34c759', marginTop: 2 }}>✓ Подтверждён</div>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 14 }}>
                    {user.companyName || user.name || '—'}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 14 }}>
                    {user.phone || '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        background: getRoleBadgeColor(user.role),
                        color: '#fff',
                      }}
                    >
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 14 }}>
                    {user.inn ? (
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>ИНН: {user.inn}</div>
                        {user.ogrn && <div style={{ fontSize: 12, color: 'var(--muted)' }}>ОГРН: {user.ogrn}</div>}
                      </div>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: 14 }}>
                    {user._count.orders}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: 14 }}>
                    {user._count.sellerProducts}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 14, color: 'var(--muted)' }}>
                    {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="btn btn-ghost"
                      style={{
                        padding: '6px 12px',
                        fontSize: 13,
                        color: '#ff3b30',
                      }}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="btn"
            style={{
              background: 'var(--surface-2)',
              color: '#fff',
              opacity: page === 1 ? 0.5 : 1,
              cursor: page === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            ← Назад
          </button>
          <div style={{ padding: '8px 16px', fontSize: 14, color: 'var(--muted)' }}>
            Страница {page} из {pages}
          </div>
          <button
            onClick={() => setPage(Math.min(pages, page + 1))}
            disabled={page === pages}
            className="btn"
            style={{
              background: 'var(--surface-2)',
              color: '#fff',
              opacity: page === pages ? 0.5 : 1,
              cursor: page === pages ? 'not-allowed' : 'pointer',
            }}
          >
            Вперёд →
          </button>
        </div>
      )}
    </div>
  )
}
