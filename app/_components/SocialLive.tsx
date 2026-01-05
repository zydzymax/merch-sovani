import Image from 'next/image'

export default function SocialLive(){
  return(
    <section className="section">
      <div className="container">
        <div className="tile" style={{padding:0,overflow:'hidden'}}>
          <Image
            src="/images/Соц-превью «Прямой эфир».webp"
            alt="Новинки в социальных сетях"
            width={1200}
            height={600}
            sizes="(max-width:768px) 100vw, 1200px"
            style={{width:'100%',height:'auto',borderRadius:28}}
          />
        </div>
        <div className="tile" style={{padding:32,marginTop:24}}>
          <div className="font-display" style={{fontSize:32,lineHeight:1.2}}>
            Мы в социальных сетях
          </div>
          <p className="lead" style={{marginTop:12,fontSize:'18px'}}>
            Подписывайтесь на нас, чтобы следить за новинками и новостями:
          </p>
          <div style={{display:'flex',gap:12,marginTop:20,flexWrap:'wrap'}}>
            <a className="btn btn-primary" href="https://t.me/+NFNJFoql6xplNzRi" target="_blank" rel="noopener noreferrer">
              Telegram
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
