'use client'

import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Navbar(){
  const { data: session, status } = useSession()
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    // Fetch cart data to get item count
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart/get')
        if (response.ok) {
          const data = await response.json()
          const count = data.cart?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0
          setCartCount(count)
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error)
      }
    }

    fetchCart()

    // Refresh cart count every 10 seconds
    const interval = setInterval(fetchCart, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="navbar theme-surface">
      <div className="container nav-inner" style={{justifyContent:'space-between',flexWrap:'wrap'}}>
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
        <div style={{display:'flex',gap:16,alignItems:'center',flexWrap:'wrap'}}>
          <nav style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center'}}>
            <a className="btn-ghost btn" style={{fontSize:'13px',padding:'12px 18px'}} href="/catalog">Каталог</a>
            <a className="btn-ghost btn" style={{fontSize:'13px',padding:'12px 18px'}} href="/draws">Призы</a>
            <a className="btn-ghost btn" style={{fontSize:'13px',padding:'12px 18px'}} href="/promo">Условия</a>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="btn-ghost btn"
              style={{
                fontSize:'13px',
                padding:'12px 18px',
                position:'relative',
                display:'flex',
                alignItems:'center',
                gap:6
              }}
            >
              <span style={{fontSize:'18px'}}>🛒</span>
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

            {status === 'authenticated' ? (
              <>
                <Link href="/account/dashboard" className="btn-ghost btn" style={{fontSize:'13px',padding:'12px 18px'}}>
                  Кабинет
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="btn-ghost btn"
                  style={{fontSize:'13px',padding:'12px 18px'}}
                >
                  Выход
                </button>
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
          </nav>
        </div>
      </div>
    </header>
  )
}
