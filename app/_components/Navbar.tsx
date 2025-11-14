import Image from 'next/image'

export default function Navbar(){
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <a href="/" style={{display:'flex',alignItems:'center'}}>
          <Image
            src="/images/лого SoVAni.png"
            alt="SOVANI"
            width={120}
            height={40}
            style={{height:32,width:'auto'}}
          />
        </a>
        <nav style={{display:'flex',gap:14,flexWrap:'wrap'}}>
          <a className="btn-ghost btn" href="/catalog">Каталог</a>
          <a className="btn-ghost btn" href="/draws">Призы</a>
          <a className="btn-ghost btn" href="/promo">Условия</a>
        </nav>
      </div>
    </header>
  )
}
