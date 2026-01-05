'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])

    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'info':
        return 'ℹ'
    }
  }

  const getColor = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.5)', icon: '#22c55e' }
      case 'error':
        return { bg: 'rgba(255, 43, 43, 0.15)', border: 'rgba(255, 43, 43, 0.5)', icon: '#ff2b2b' }
      case 'info':
        return { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.5)', icon: '#3b82f6' }
    }
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          pointerEvents: 'none'
        }}
      >
        {toasts.map((toast) => {
          const colors = getColor(toast.type)
          return (
            <div
              key={toast.id}
              style={{
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: 'var(--radius-md)',
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                minWidth: 280,
                maxWidth: 400,
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                animation: 'slideInRight 0.3s ease',
                pointerEvents: 'auto',
                backdropFilter: 'blur(10px)'
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: colors.icon,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 700,
                  flexShrink: 0
                }}
              >
                {getIcon(toast.type)}
              </span>
              <p style={{ flex: 1, fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>
                {toast.message}
              </p>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 4,
                  fontSize: 16,
                  lineHeight: 1,
                  opacity: 0.6,
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
              >
                ✕
              </button>
            </div>
          )
        })}
      </div>

      <style jsx global>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </ToastContext.Provider>
  )
}

// Global toast function for non-React contexts
let globalShowToast: ((message: string, type?: 'success' | 'error' | 'info') => void) | null = null

export function setGlobalToast(showToast: typeof globalShowToast) {
  globalShowToast = showToast
}

export function toast(message: string, type?: 'success' | 'error' | 'info') {
  if (globalShowToast) {
    globalShowToast(message, type)
  } else {
    console.warn('Toast not initialized')
  }
}
