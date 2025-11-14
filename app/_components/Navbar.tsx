import Image from 'next/image'
import dynamic from 'next/dynamic'

const ThemeToggle = dynamic(() => import('./ThemeToggle'), { ssr: false })

export default function Navbar(){
  return (
    <header className="navbar theme-surface">
      <div className="container nav-inner" style={{justifyContent:'space-between',flexWrap:'wrap'}}>
        <a href="/" style={{display:'flex',alignItems:'center'}}>
          <Image
            src="/images/лого SoVAni.png"
            alt="SOVANI"
            width={160}
            height={53}
            style={{height:48,width:'auto'}}
          />
        </a>
        <div style={{display:'flex',gap:16,alignItems:'center',flexWrap:'wrap'}}>
          <nav style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center'}}>
            <a className="btn-ghost btn" style={{fontSize:'13px',padding:'12px 18px'}} href="/catalog">Каталог</a>
            <a className="btn-ghost btn" style={{fontSize:'13px',padding:'12px 18px'}} href="/draws">Призы</a>
            <a className="btn-ghost btn" style={{fontSize:'13px',padding:'12px 18px'}} href="/promo">Условия</a>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
