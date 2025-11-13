import Image from 'next/image'

type Pack={
  title:string
  price:string
  img:{src:string;alt:string;width:number;height:number}
  perks?:string[]
  href:string
  note?:string
}

const packs:Pack[]=[
  {
    title:'Толстовка серая',
    price:'3499 ₽',
    img:{src:'/images/products/hoodie-gray.jpg',alt:'Толстовка серая',width:400,height:400},
    href:'/catalog',
    note:'🎁 +5 шансов'
  },
  {
    title:'Толстовка красная LIMITED',
    price:'5999 ₽',
    img:{src:'/images/products/hoodie-red.jpg',alt:'Толстовка красная',width:400,height:400},
    href:'/catalog',
    note:'🎁 +15 шансов',
    perks:['Лимитированная серия','Увеличенный шанс']
  },
  {
    title:'Комплект одежды VIP',
    price:'12999 ₽',
    img:{src:'/images/products/set-vip.jpg',alt:'Комплект VIP',width:400,height:400},
    href:'/catalog',
    note:'🎁 +50 шансов',
    perks:['Эксклюзивный дизайн','Максимальный шанс']
  },
]

export default function StickerPacks(){
  return(
    <section className="section">
      <div className="container">
        <h2 className="font-display">Выбери свой товар</h2>
        <div className="grid grid-3" style={{marginTop:24}}>
          {packs.map(p=>(
            <article key={p.title} className="tile" style={{padding:20}}>
              <div style={{position:'relative',width:'100%',aspectRatio:'1/1',borderRadius:14,overflow:'hidden',background:'var(--surface)'}}>
                <Image
                  src={p.img.src}
                  alt={p.img.alt}
                  width={p.img.width}
                  height={p.img.height}
                  style={{objectFit:'cover',width:'100%',height:'100%'}}
                />
              </div>
              <h3 className="font-display" style={{marginTop:16,fontSize:'22px'}}>{p.title}</h3>
              <div style={{marginTop:8,fontWeight:700,fontSize:'20px'}}>{p.price}</div>
              {p.note && <div className="lead" style={{marginTop:6,fontSize:'16px'}}>{p.note}</div>}
              {p.perks && (
                <ul style={{marginTop:10,paddingLeft:20,listStyleType:'disc'}}>
                  {p.perks.map(x=><li key={x} className="lead" style={{fontSize:'14px'}}>{x}</li>)}
                </ul>
              )}
              <div style={{display:'flex',gap:10,marginTop:16,flexWrap:'wrap'}}>
                <a className="btn btn-primary" href={p.href}>Купить</a>
                <a className="btn btn-ghost" href="/catalog">Смотреть ещё</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
