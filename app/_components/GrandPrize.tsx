import Image from 'next/image'

export default function GrandPrize(){
  return (
    <section className="section">
      <div className="container">
        <div className="tile" style={{
          padding:32,
          display:'grid',
          gap:24,
          gridTemplateColumns:'1.1fr .9fr',
          alignItems:'center'
        }}>
          <div>
            <div className="font-display" style={{fontSize:'38px',lineHeight:1.1}}>5 iPhone 17 Pro Max</div>
            <p className="lead" style={{marginTop:12,fontSize:'18px'}}>
              Каждую неделю разыгрываем 1 iPhone 17 Pro Max среди всех участников. Успей купить брелок!
            </p>
            <a className="btn btn-primary" style={{marginTop:20}} href="/draws">Смотреть победителей</a>
          </div>
          <div style={{position:'relative',width:'100%',aspectRatio:'16/10',borderRadius:20,overflow:'hidden',background:'var(--surface)'}}>
            <Image
              src="/images/prizes/iphone.jpg"
              alt="Главный приз iPhone 17 Pro Max"
              width={720}
              height={480}
              style={{objectFit:'cover',width:'100%',height:'100%'}}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
