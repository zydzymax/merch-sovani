export default function Steps(){
  return(
    <section className="section">
      <div className="container">
        <h2 className="font-display" style={{color:'var(--accent)',marginBottom:24}}>Простые шаги к суперпризу</h2>
        <div className="grid grid-2">
          <div className="tile" style={{padding:32}}>
            <h3 className="font-display" style={{fontSize:'28px'}}>Как выиграть?</h3>
            <p className="lead" style={{marginTop:12,fontSize:'18px'}}>
              Купи любой товар из каталога и автоматически получи шанс выиграть крутые призы!
            </p>
            <a className="btn btn-primary" style={{marginTop:20}} href="/catalog">Участвовать</a>
          </div>
          <div className="tile" style={{padding:32}}>
            <h3 className="font-display" style={{fontSize:'28px'}}>Получи шанс выиграть</h3>
            <p className="lead" style={{marginTop:12,fontSize:'18px'}}>
              iPhone 17 Pro Max, Apple Watch Ultra и другие призы от партнёров. Чем больше покупок — тем выше шанс!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
