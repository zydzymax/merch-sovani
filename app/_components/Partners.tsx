export default function Partners(){
  const partners = [
    {name:'Apple',logo:'/images/partners/apple.svg'},
    {name:'Samsung',logo:'/images/partners/samsung.svg'},
    {name:'Wildberries',logo:'/images/partners/wb.svg'},
    {name:'Ozon',logo:'/images/partners/ozon.svg'},
    {name:'Yandex',logo:'/images/partners/yandex.svg'},
    {name:'МТС',logo:'/images/partners/mts.svg'},
  ]

  return(
    <section className="section">
      <div className="container">
        <h2 className="font-display">
          <span style={{color:'var(--accent)'}}>Партнёры</span> Магазин
        </h2>
        <div className="grid grid-4" style={{marginTop:24}}>
          {partners.map((partner)=>(
            <div
              key={partner.name}
              className="card"
              style={{
                padding:24,
                display:'grid',
                placeItems:'center',
                minHeight:100
              }}
            >
              <div style={{
                fontSize:18,
                fontWeight:700,
                color:'var(--muted)',
                textAlign:'center'
              }}>
                {partner.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
