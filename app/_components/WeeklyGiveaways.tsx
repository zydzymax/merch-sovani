import Image from 'next/image'

export default function WeeklyGiveaways(){
  return (
    <section className="section">
      <div className="container">
        <h2 className="font-display" style={{marginBottom:32,textAlign:'center'}}>
          Еженедельные розыгрыши — 5 недель
        </h2>
        <div className="tile" style={{padding:0,overflow:'hidden'}}>
          <Image
            src="/images/Сетка «Еженедельные розыгрыши — 5 недель».png"
            alt="График еженедельных розыгрышей на 5 недель"
            width={1200}
            height={600}
            sizes="(max-width:768px) 100vw, 1200px"
            style={{width:'100%',height:'auto',borderRadius:28}}
          />
        </div>
      </div>
    </section>
  )
}
