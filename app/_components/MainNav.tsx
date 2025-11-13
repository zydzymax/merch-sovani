'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function MainNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      transition: 'all 0.3s ease',
      ...(scrolled ? {
        backdropFilter: 'blur(8px)',
        background: 'rgba(15,15,18,.85)',
        borderBottom: '1px solid var(--ring)',
      } : {
        background: 'transparent',
      })
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBlock: '20px',
      }}>
        <Link href="/" className="font-display" style={{
          fontSize: '20px',
          fontWeight: 700,
          textTransform: 'uppercase',
        }}>
          SoVAni
        </Link>

        <nav style={{ display: 'flex', gap: '32px' }}>
          <Link href="/catalog" className="font-display nav-link">Каталог</Link>
          <Link href="/draws" className="font-display nav-link">Призы</Link>
          <Link href="/promo" className="font-display nav-link">Условия</Link>
        </nav>
      </div>
    </header>
  )
}
