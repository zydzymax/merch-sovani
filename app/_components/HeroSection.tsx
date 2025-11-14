import Image from 'next/image'

export default function HeroSection(){
  return (
    <section className="section">
      <div className="container tile" style={{padding:0,overflow:'hidden'}}>
        <div style={{position:'relative',width:'100%',aspectRatio:'16/9',minHeight:420}}>
          <Image
            src="/images/Hero (обложка).png"
            alt="Промо-обложка розыгрыша: брелок и главные призы"
            width={1920}
            height={1080}
            priority
            sizes="(max-width:768px) 100vw, (max-width:1200px) 100vw, 1200px"
            style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:28}}
          />
        </div>
        <div style={{padding:'48px 32px',textAlign:'center'}}>
          <h1 className="font-display">Купи брелок — выиграй iPhone!</h1>
          <p className="lead" style={{marginTop:12}}>Каждый брелок = 1 шанс выиграть iPhone 17 Pro Max. Розыгрыш каждую неделю.</p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginTop:20}}>
            <a className="btn btn-primary" href="#keychain">Купить брелок</a>
            <a className="btn btn-ghost" href="/promo">Условия акции</a>
          </div>
        </div>
      </div>
    </section>
  )
}
