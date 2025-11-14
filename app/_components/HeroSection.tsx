export default function HeroSection(){
  return (
    <section className="section">
      <div className="container tile" style={{padding:'48px 32px',textAlign:'center'}}>
        <h1 className="font-display">Купи брелок — выиграй iPhone!</h1>
        <p className="lead" style={{marginTop:12}}>Каждый брелок = 1 шанс выиграть iPhone 17 Pro Max. Розыгрыш каждую неделю.</p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginTop:20}}>
          <a className="btn btn-primary" href="#keychain">Купить брелок</a>
          <a className="btn btn-ghost" href="/promo">Условия акции</a>
        </div>
      </div>
    </section>
  )
}
