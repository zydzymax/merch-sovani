export default function HeroSection(){
  return (
    <section className="section">
      <div className="container tile" style={{padding:'48px 32px',textAlign:'center'}}>
        <h1 className="font-display">Розыгрыш с призами + стильный мерч</h1>
        <p className="lead" style={{marginTop:12}}>Покупай одежду — получай шанс на суперприз. Прямой эфир 10.01.2026.</p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginTop:20}}>
          <a className="btn btn-primary" href="/catalog">Смотреть каталог</a>
          <a className="btn btn-ghost" href="/promo">Условия акции</a>
        </div>
      </div>
    </section>
  )
}
