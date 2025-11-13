export default function SocialLive(){
  return(
    <section className="section">
      <div className="container tile" style={{padding:32}}>
        <div className="font-display" style={{fontSize:32,lineHeight:1.2}}>
          Следи за розыгрышем — 10.01.2026, прямой эфир
        </div>
        <p className="lead" style={{marginTop:12,fontSize:'18px'}}>
          Больше контента и новостей о розыгрыше в наших соцсетях:
        </p>
        <div style={{display:'flex',gap:12,marginTop:20,flexWrap:'wrap'}}>
          <a className="btn btn-ghost" href="https://t.me/sovani_official" target="_blank" rel="noopener noreferrer">
            Telegram
          </a>
          <a className="btn btn-ghost" href="https://youtube.com/@sovani" target="_blank" rel="noopener noreferrer">
            YouTube
          </a>
          <a className="btn btn-ghost" href="https://vk.com/sovani" target="_blank" rel="noopener noreferrer">
            VK
          </a>
        </div>
      </div>
    </section>
  )
}
