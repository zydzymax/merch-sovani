import Image from 'next/image'

export default function BigFooter(){
  return(
    <footer className="section safe-bottom">
      <div className="container tile" style={{padding:36}}>
        <div style={{marginBottom:20}}>
          <Image
            src="/images/лого SoVAni.png"
            alt="SOVANI"
            width={160}
            height={53}
            style={{height:40,width:'auto'}}
          />
        </div>
        <div style={{
          display:'grid',
          gap:32,
          gridTemplateColumns:'2fr 1fr 1fr',
          marginBottom:24
        }}>
          <div className="lead" style={{fontSize:16}}>
            Премиальная одежда и честные розыгрыши. Покупай стильные вещи и выигрывай суперпризы!
          </div>
          <div>
            <div style={{fontWeight:700,marginBottom:12,fontSize:16}}>Документы</div>
            <ul style={{listStyle:'none',padding:0,margin:0,display:'grid',gap:8}}>
              <li>
                <a className="btn-link" href="/legal/offer" style={{fontSize:14}}>
                  Публичная оферта
                </a>
              </li>
              <li>
                <a className="btn-link" href="/legal/privacy" style={{fontSize:14}}>
                  Политика конфиденциальности
                </a>
              </li>
              <li>
                <a className="btn-link" href="/legal/promo-rules" style={{fontSize:14}}>
                  Правила розыгрыша
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div style={{fontWeight:700,marginBottom:12,fontSize:16}}>Контакты</div>
            <div className="lead" style={{fontSize:14}}>
              <div>Email: hello@sovani.ru</div>
              <div style={{marginTop:6}}>Тел: +7 (999) 123-45-67</div>
            </div>
          </div>
        </div>
        <div
          className="lead"
          style={{
            opacity:.7,
            paddingTop:20,
            borderTop:'1px solid var(--ring)',
            fontSize:13
          }}
        >
          © 2025 SoVAni. Все права защищены. ИНН 1234567890, ОГРНИП 1234567890123
        </div>
      </div>
    </footer>
  )
}
