import Image from 'next/image'

export default function StickerPacks(){
  return(
    <section id="keychain" className="section">
      <div className="container">
        <h2 className="font-display" style={{textAlign:'center'}}>Хит продаж</h2>
        <p className="lead" style={{marginTop:8,textAlign:'center',maxWidth:640,marginInline:'auto'}}>
          Премиальный брелок-смартфон премиум — стильный аксессуар для вашей сумки или ключей.
        </p>
        <div style={{display:'flex',justifyContent:'center',marginTop:32}}>
          <article className="tile" style={{padding:32,maxWidth:480,width:'100%'}}>
            <div style={{position:'relative',width:'100%',aspectRatio:'1/1',borderRadius:20,overflow:'hidden',background:'var(--surface)'}}>
              <Image
                src="/images/Товар — основной кадр (галерея 1).webp"
                alt="Брелок-смартфон премиум"
                width={800}
                height={800}
                sizes="(max-width:768px) 100vw, 480px"
                style={{objectFit:'cover',width:'100%',height:'100%'}}
              />
            </div>
            <h3 className="font-display" style={{marginTop:20,fontSize:'28px',textAlign:'center'}}>Брелок</h3>
            <div style={{marginTop:12,fontWeight:700,fontSize:'32px',textAlign:'center',color:'var(--accent)'}}>1 999 ₽</div>
            <div className="lead" style={{marginTop:8,fontSize:'18px',textAlign:'center'}}>Премиум качество • Доставка СДЭК</div>
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
