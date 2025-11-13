export default function Navbar(){
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <a href="/" className="font-display" style={{fontSize:22}}>SOVANI</a>
        <nav style={{display:'flex',gap:14,flexWrap:'wrap'}}>
          <a className="btn-ghost btn" href="/catalog">Каталог</a>
          <a className="btn-ghost btn" href="/draws">Призы</a>
          <a className="btn-ghost btn" href="/promo">Условия</a>
        </nav>
      </div>
    </header>
  )
}
