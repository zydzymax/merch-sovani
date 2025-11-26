import Image from 'next/image'

export default function SocialLive(){
  return(
    <section className="section">
      <div className="container">
        <div className="tile" style={{padding:0,overflow:'hidden'}}>
          <Image
            src="/images/Соц-превью «Прямой эфир».webp"
            alt="Прямые эфиры розыгрышей в социальных сетях"
            width={1200}
            height={600}
            sizes="(max-width:768px) 100vw, 1200px"
            style={{width:'100%',height:'auto',borderRadius:28}}
          />
        </div>
        <div className="tile" style={{padding:32,marginTop:24}}>
          <div className="font-display" style={{fontSize:32,lineHeight:1.2}}>
            Результаты розыгрыша в Instagram*
          </div>
          <p className="lead" style={{marginTop:12,fontSize:'18px'}}>
            Следи за результатами розыгрыша в нашем канале Instagram*:
          </p>
          <div style={{display:'flex',gap:12,marginTop:20,flexWrap:'wrap'}}>
            <a className="btn btn-primary" href="https://instagram.com/sovani.official" target="_blank" rel="noopener noreferrer">
              Instagram*
            </a>
          </div>
          <p className="lead" style={{marginTop:16,fontSize:'12px',opacity:0.7}}>
            * Instagram принадлежит Meta Platforms Inc., признанной экстремистской организацией в РФ. Деятельность запрещена на территории РФ.
          </p>
        </div>
      </div>
    </section>
  )
}
