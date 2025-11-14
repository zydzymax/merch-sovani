import Image from 'next/image'

export default function Steps(){
  return(
    <section className="section">
      <div className="container">
        <h2 className="font-display" style={{color:'var(--accent)',marginBottom:24}}>Простые шаги к iPhone</h2>

        <div style={{marginBottom:40}}>
          <Image
            src="/images/Баннер «Как это работает».png"
            alt="Как это работает: пошаговая инструкция участия в розыгрыше"
            width={1200}
            height={400}
            sizes="(max-width:768px) 100vw, 1200px"
            style={{width:'100%',height:'auto',borderRadius:28}}
          />
        </div>

        <div className="grid grid-2">
          <div className="tile" style={{padding:32}}>
            <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:16}}>
              <Image
                src="/images/Иконка «Электронный чек : подтверждение».png"
                alt="Электронный чек подтверждения"
                width={64}
                height={64}
                style={{width:64,height:64}}
              />
              <h3 className="font-display" style={{fontSize:'28px'}}>Как выиграть?</h3>
            </div>
            <p className="lead" style={{marginTop:12,fontSize:'18px'}}>
              Купи брелок за 1 999 ₽ и автоматически участвуй в розыгрыше. Чем больше брелков — тем выше шанс!
            </p>
            <a className="btn btn-primary" style={{marginTop:20}} href="#keychain">Купить брелок</a>
          </div>
          <div className="tile" style={{padding:32}}>
            <h3 className="font-display" style={{fontSize:'28px'}}>Еженедельные розыгрыши</h3>
            <p className="lead" style={{marginTop:12,fontSize:'18px'}}>
              Каждую неделю разыгрываем 1 iPhone 17 Pro Max в прямом эфире. Всего 5 призов за 5 недель акции!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
