import Image from 'next/image'

export default function StickerPacks(){
  return(
    <section id="keychain" className="section">
      <div className="container">
        <h2 className="font-display">Участвуй в розыгрыше</h2>
        <p className="lead" style={{marginTop:8,textAlign:'center',maxWidth:640,marginInline:'auto'}}>
          Купи брелок SOVANI и автоматически участвуй в розыгрыше iPhone 17 Pro Max. Чем больше брелков — тем выше шанс!
        </p>
        <div style={{display:'flex',justifyContent:'center',marginTop:32}}>
          <article className="tile" style={{padding:32,maxWidth:480,width:'100%'}}>
            <div style={{position:'relative',width:'100%',aspectRatio:'1/1',borderRadius:20,overflow:'hidden',background:'var(--surface)'}}>
              <Image
                src="/images/products/keychain.jpg"
                alt="Брелок SOVANI"
                width={480}
                height={480}
                style={{objectFit:'cover',width:'100%',height:'100%'}}
              />
            </div>
            <h3 className="font-display" style={{marginTop:20,fontSize:'28px',textAlign:'center'}}>Брелок SOVANI</h3>
            <div style={{marginTop:12,fontWeight:700,fontSize:'32px',textAlign:'center',color:'var(--accent)'}}>999 ₽</div>
            <div className="lead" style={{marginTop:8,fontSize:'18px',textAlign:'center'}}>🎁 1 брелок = 1 шанс на iPhone</div>
            <div style={{display:'flex',flexDirection:'column',gap:12,marginTop:24}}>
              <a className="btn btn-primary" style={{fontSize:'16px',padding:'18px 32px'}} href="/catalog">Купить брелок</a>
              <a className="btn btn-ghost" href="/catalog">Смотреть другие товары</a>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
