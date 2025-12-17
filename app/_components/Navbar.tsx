'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'

interface User {
  id: string
  email: string
  name: string | null
  role: string
}

export default function Navbar(){
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [cartCount, setCartCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Fetch cart data to get item count
  const fetchCart = useCallback(async () => {
    try {
      const response = await fetch('/api/cart/get')
      if (response.ok) {
        const data = await response.json()
        // Fixed: use data.items instead of data.cart
        const count = data.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0
        setCartCount(count)
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error)
    }
  }, [])

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          if (data.authenticated) {
            setUser(data.user)
            setIsAuthenticated(true)
          }
        }
      } catch (error) {
        console.error('Failed to check auth:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
    fetchCart()

    // Listen for cart updates from other components
    const handleCartUpdate = () => {
      fetchCart()
    }
    window.addEventListener('cartUpdated', handleCartUpdate)

    // Refresh cart count every 30 seconds (reduced from 10)
    const interval = setInterval(fetchCart, 30000)

    return () => {
      clearInterval(interval)
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [fetchCart])

  const navLinks = [
    { href: '/catalog', label: 'Каталог' },
    { href: '/draws', label: 'Призы' },
    { href: '/promo', label: 'Условия' },
  ]

  return (
    <>
      <header className="navbar theme-surface">
        <div className="container nav-inner" style={{justifyContent:'space-between',alignItems:'center'}}>
          <a href="/" style={{display:'flex',alignItems:'center'}}>
            <Image
              src="/images/лого SoVAni.png"
              alt="SOVANI"
              width={320}
              height={106}
              className="navbar-logo"
              style={{height:96,width:'auto',maxHeight:96}}
            />
          </a>

          {/* Desktop Navigation */}
          <div className="desktop-nav" style={{display:'flex',gap:16,alignItems:'center'}}>
            <nav style={{display:'flex',gap:10,alignItems:'center'}}>
              {navLinks.map(link => (
                <a key={link.href} className="btn-ghost btn" style={{fontSize:'13px',padding:'12px 18px'}} href={link.href}>
                  {link.label}
                </a>
              ))}

              {/* Cart Icon */}
              <Link
                href="/cart"
                className="btn-ghost btn"
                aria-label={`Корзина${cartCount > 0 ? ` (${cartCount})` : ''}`}
                style={{
                  fontSize:'13px',
                  padding:'12px 18px',
                  position:'relative',
                  display:'flex',
                  alignItems:'center',
                  gap:6
                }}
              >
                <span aria-hidden="true" style={{fontSize:'18px'}}>🛒</span>
                {cartCount > 0 && (
                  <span style={{
                    position:'absolute',
                    top:6,
                    right:6,
                    background:'var(--accent)',
                    color:'#fff',
                    fontSize:'11px',
                    fontWeight:700,
                    borderRadius:'50%',
                    width:18,
                    height:18,
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    lineHeight:1
                  }}>
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {!loading && (
                <>
                  {isAuthenticated ? (
                    <>
                      <Link href="/account/dashboard" className="btn-ghost btn" style={{fontSize:'13px',padding:'12px 18px'}}>
                        Кабинет
                      </Link>
                      <a
                        href="/api/auth/logout"
                        className="btn-ghost btn"
                        style={{fontSize:'13px',padding:'12px 18px'}}
                      >
                        Выход
                      </a>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="btn-ghost btn" style={{fontSize:'13px',padding:'12px 18px'}}>
                        Вход
                      </Link>
                      <Link href="/register" className="btn btn-primary" style={{fontSize:'13px',padding:'12px 18px'}}>
                        Регистрация
                      </Link>
                    </>
                  )}
                </>
              )}
            </nav>
          </div>

          {/* Mobile Menu Button + Cart */}
          <div className="mobile-nav-buttons" style={{display:'none',alignItems:'center',gap:8}}>
            {/* Cart Icon Mobile */}
            <Link
              href="/cart"
              className="btn-ghost btn"
              aria-label={`Корзина${cartCount > 0 ? ` (${cartCount})` : ''}`}
              style={{
                padding:'10px',
                position:'relative',
                display:'flex',
                alignItems:'center'
              }}
            >
              <span aria-hidden="true" style={{fontSize:'22px'}}>🛒</span>
              {cartCount > 0 && (
                <span style={{
                  position:'absolute',
                  top:2,
                  right:2,
                  background:'var(--accent)',
                  color:'#fff',
                  fontSize:'10px',
                  fontWeight:700,
                  borderRadius:'50%',
                  width:16,
                  height:16,
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  lineHeight:1
                }}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={mobileMenuOpen}
              style={{
                background:'transparent',
                border:'none',
                cursor:'pointer',
                padding:10,
                display:'flex',
                flexDirection:'column',
                gap:5,
                justifyContent:'center'
              }}
            >
              <span style={{
                width:24,
                height:2,
                background:'var(--text)',
                borderRadius:2,
                transition:'all 0.3s ease',
                transform: mobileMenuOpen ? 'rotate(45deg) translateY(7px)' : 'none'
              }} />
              <span style={{
                width:24,
                height:2,
                background:'var(--text)',
                borderRadius:2,
                transition:'all 0.3s ease',
                opacity: mobileMenuOpen ? 0 : 1
              }} />
              <span style={{
                width:24,
                height:2,
                background:'var(--text)',
                borderRadius:2,
                transition:'all 0.3s ease',
                transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none'
              }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-overlay"
          style={{
            position:'fixed',
            top:0,
            left:0,
            right:0,
            bottom:0,
            background:'rgba(0,0,0,0.5)',
            zIndex:99,
            animation:'fadeIn 0.2s ease'
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <nav
        className="mobile-menu"
        style={{
          position:'fixed',
          top:0,
          right:0,
          bottom:0,
          width:'280px',
          maxWidth:'85vw',
          background:'var(--surface)',
          zIndex:100,
          padding:'80px 24px 24px',
          transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition:'transform 0.3s ease',
          overflowY:'auto',
          display:'none'
        }}
      >
        <div style={{display:'grid',gap:8}}>
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="btn btn-ghost"
              style={{
                justifyContent:'flex-start',
                padding:'14px 16px',
                fontSize:16
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}

          <div style={{height:1,background:'var(--ring)',margin:'8px 0'}} />

          {!loading && (
            <>
              {isAuthenticated ? (
                <>
                  <Link
                    href="/account/dashboard"
                    className="btn btn-ghost"
                    style={{justifyContent:'flex-start',padding:'14px 16px',fontSize:16}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Личный кабинет
                  </Link>
                  <a
                    href="/api/auth/logout"
                    className="btn btn-ghost"
                    style={{justifyContent:'flex-start',padding:'14px 16px',fontSize:16}}
                  >
                    Выход
                  </a>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="btn btn-ghost"
                    style={{justifyContent:'flex-start',padding:'14px 16px',fontSize:16}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Вход
                  </Link>
                  <Link
                    href="/register"
                    className="btn btn-primary"
                    style={{justifyContent:'center',padding:'14px 16px',fontSize:16,marginTop:8}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Регистрация
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </nav>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 900px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav-buttons {
            display: flex !important;
          }
          .mobile-menu {
            display: block !important;
          }
        }
      `}</style>
    </>
  )
}
