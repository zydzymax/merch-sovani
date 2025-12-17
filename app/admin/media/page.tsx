'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

type MediaFile = {
  name: string
  path: string
  size: number
  modified: string
  type: string
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'images' | 'other'>('all')

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/media')
      if (!response.ok) throw new Error('Failed to fetch media')

      const data = await response.json()
      setMedia(data.files || [])
    } catch (error) {
      console.error('Error fetching media:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const formData = new FormData()
      Array.from(files).forEach((file) => {
        formData.append('files', file)
      })

      const response = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to upload files')

      fetchMedia()
    } catch (error) {
      console.error('Error uploading files:', error)
      alert('Не удалось загрузить файлы')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (path: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот файл?')) return

    try {
      const response = await fetch('/api/admin/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      })

      if (!response.ok) throw new Error('Failed to delete file')

      fetchMedia()
    } catch (error) {
      console.error('Error deleting file:', error)
      alert('Не удалось удалить файл')
    }
  }

  const copyToClipboard = (path: string) => {
    navigator.clipboard.writeText(path)
    alert('Путь скопирован в буфер обмена')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const filteredMedia = media.filter((file) => {
    if (filter === 'all') return true
    if (filter === 'images') return file.type.startsWith('image/')
    return !file.type.startsWith('image/')
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 className="font-display" style={{ fontSize: '32px', margin: 0 }}>
          🖼️ Медиа
        </h1>
        <div style={{ fontSize: 14, color: 'var(--muted)' }}>
          Всего файлов: {media.length}
        </div>
      </div>

      {/* Upload and Filter */}
      <div className="tile" style={{ padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Upload Button */}
          <div>
            <label
              className="btn"
              style={{
                background: 'var(--accent)',
                color: '#fff',
                cursor: uploading ? 'not-allowed' : 'pointer',
                opacity: uploading ? 0.7 : 1,
              }}
            >
              {uploading ? 'Загрузка...' : '📤 Загрузить файлы'}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {/* Filter */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setFilter('all')}
              className="btn"
              style={{
                background: filter === 'all' ? 'var(--accent)' : 'var(--surface-2)',
                color: '#fff',
                fontSize: 14,
                padding: '8px 16px',
              }}
            >
              Все
            </button>
            <button
              onClick={() => setFilter('images')}
              className="btn"
              style={{
                background: filter === 'images' ? 'var(--accent)' : 'var(--surface-2)',
                color: '#fff',
                fontSize: 14,
                padding: '8px 16px',
              }}
            >
              Изображения
            </button>
            <button
              onClick={() => setFilter('other')}
              className="btn"
              style={{
                background: filter === 'other' ? 'var(--accent)' : 'var(--surface-2)',
                color: '#fff',
                fontSize: 14,
                padding: '8px 16px',
              }}
            >
              Другое
            </button>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="tile" style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
          Загрузка...
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="tile" style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
          Файлы не найдены
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {filteredMedia.map((file) => (
            <div
              key={file.path}
              className="tile"
              style={{
                padding: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              {/* Preview */}
              <div
                style={{
                  width: '100%',
                  height: 180,
                  borderRadius: 8,
                  background: 'var(--surface-2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {file.type.startsWith('image/') ? (
                  <Image
                    src={file.path}
                    alt={file.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ fontSize: 48, opacity: 0.3 }}>📄</div>
                )}
              </div>

              {/* File Info */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    marginBottom: 4,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={file.name}
                >
                  {file.name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {formatFileSize(file.size)}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                  {new Date(file.modified).toLocaleDateString('ru-RU')}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => copyToClipboard(file.path)}
                  className="btn"
                  style={{
                    flex: 1,
                    background: 'var(--surface-2)',
                    color: '#fff',
                    fontSize: 12,
                    padding: '6px 12px',
                  }}
                >
                  📋 Копировать
                </button>
                <button
                  onClick={() => handleDelete(file.path)}
                  className="btn btn-ghost"
                  style={{
                    fontSize: 12,
                    padding: '6px 12px',
                    color: '#ff3b30',
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
