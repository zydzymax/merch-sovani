import { prisma } from '@/lib/db/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDrawsPage() {
  const draws = await prisma.draw.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      prize: true,
      _count: {
        select: { entries: true },
      },
    },
  })

  const stats = {
    total: draws.length,
    upcoming: draws.filter((d) => d.status === 'UPCOMING').length,
    active: draws.filter((d) => d.status === 'ACTIVE').length,
    completed: draws.filter((d) => d.status === 'COMPLETED').length,
  }

  return (
    <div style={{ display: 'grid', gap: 32 }}>
      <div>
        <h1 className="font-display" style={{ fontSize: 40, marginBottom: 8 }}>
          Розыгрыши
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 16 }}>
          Всего розыгрышей: {draws.length}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
        <div className="tile" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{stats.active}</div>
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>Активных</div>
        </div>
        <div className="tile" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{stats.upcoming}</div>
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>Предстоящих</div>
        </div>
        <div className="tile" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{stats.completed}</div>
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>Завершено</div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 16, padding: '20px 0' }}>
        <div style={{ padding: 15, background: 'var(--surface)', borderRadius: 8, fontSize: 14, color: 'var(--muted)' }}>
          Управление розыгрышами находится в разработке. Розыгрыши создаются автоматически через API.
        </div>
      </div>

      {/* Draws List */}
      <div className="tile" style={{ padding: 32 }}>
        {draws.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎁</div>
            <p style={{ fontSize: 18 }}>Розыгрышей пока нет</p>
            <p style={{ fontSize: 14, marginTop: 8 }}>Розыгрыши создаются автоматически через API</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--ring)' }}>
                  <th style={{ padding: 12, textAlign: 'left', fontSize: 14 }}>Название</th>
                  <th style={{ padding: 12, textAlign: 'left', fontSize: 14 }}>Призы</th>
                  <th style={{ padding: 12, textAlign: 'left', fontSize: 14 }}>Участников</th>
                  <th style={{ padding: 12, textAlign: 'left', fontSize: 14 }}>Статус</th>
                  <th style={{ padding: 12, textAlign: 'left', fontSize: 14 }}>Дата розыгрыша</th>
                </tr>
              </thead>
              <tbody>
                {draws.map((draw) => (
                  <tr key={draw.id} style={{ borderBottom: '1px solid var(--ring)' }}>
                    <td style={{ padding: 12, fontSize: 14, fontWeight: 600 }}>
                      {draw.name}
                    </td>
                    <td style={{ padding: 12, fontSize: 14 }}>
                      {draw.prize?.name || '—'}
                    </td>
                    <td style={{ padding: 12, fontSize: 14 }}>
                      {draw._count.entries}
                    </td>
                    <td style={{ padding: 12, fontSize: 14 }}>
                      <span
                        style={{
                          padding: '4px 12px',
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 600,
                          background:
                            draw.status === 'ACTIVE'
                              ? '#00C853'
                              : draw.status === 'COMPLETED'
                              ? '#7C4DFF'
                              : 'var(--surface)',
                          color: draw.status === 'ACTIVE' || draw.status === 'COMPLETED' ? '#fff' : 'inherit',
                        }}
                      >
                        {draw.status}
                      </span>
                    </td>
                    <td style={{ padding: 12, fontSize: 14, color: 'var(--muted)' }}>
                      {draw.endsAt ? new Date(draw.endsAt).toLocaleDateString('ru-RU') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
