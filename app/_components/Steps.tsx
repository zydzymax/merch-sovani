export default function Steps(){
  return(
    <section className="section">
      <div className="container">
        <h2 className="font-display" style={{color:'var(--accent)',marginBottom:24}}>Простые шаги к iPhone</h2>
        <div className="grid grid-2">
          <div className="tile" style={{padding:32}}>
            <h3 className="font-display" style={{fontSize:'28px'}}>Как выиграть?</h3>
            <p className="lead" style={{marginTop:12,fontSize:'18px'}}>
              Купи брелок SOVANI за 999 ₽ и автоматически участвуй в розыгрыше. Чем больше брелков — тем выше шанс!
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
