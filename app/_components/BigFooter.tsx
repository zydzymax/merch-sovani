export default function BigFooter(){
  return(
    <footer className="section safe-bottom">
      <div className="container tile" style={{padding:36}}>
        <div style={{marginBottom:20}}>
          <span className="font-display" style={{fontSize:24,fontWeight:700,color:'var(--text)'}}>
            GETNWIN
          </span>
        </div>
        <div style={{
          display:'grid',
          gap:24,
          gridTemplateColumns:'1fr',
          marginBottom:24
        }} className="footer-grid">
          <div className="lead" style={{fontSize:16}}>
            Премиальные брелоки и аксессуары. Качественные товары с доставкой по всей России.
          </div>
          <div>
            <div style={{fontWeight:700,marginBottom:12,fontSize:16}}>Документы</div>
            <ul style={{listStyle:'none',padding:0,margin:0,display:'grid',gap:8}}>
              <li>
                <a className="btn-link" href="/docs/user-agreement" style={{fontSize:14}}>
                  Пользовательское соглашение
                </a>
              </li>
              <li>
                <a className="btn-link" href="/docs/offer" style={{fontSize:14}}>
                  Публичная оферта
                </a>
              </li>
              <li>
                <a className="btn-link" href="/docs/privacy" style={{fontSize:14}}>
                  Политика конфиденциальности
                </a>
              </li>
              <li>
                <a className="btn-link" href="/docs/cookies" style={{fontSize:14}}>
                  Политика cookies
                </a>
              </li>
              <li>
                <a className="btn-link" href="/docs/delivery" style={{fontSize:14}}>
                  Доставка
                </a>
              </li>
              <li>
                <a className="btn-link" href="/docs/payment" style={{fontSize:14}}>
                  Оплата
                </a>
              </li>
              <li>
                <a className="btn-link" href="/legal" style={{fontSize:14}}>
                  Реквизиты
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div style={{fontWeight:700,marginBottom:12,fontSize:16}}>Информация</div>
            <ul style={{listStyle:'none',padding:0,margin:0,display:'grid',gap:8}}>
              <li>
                <a className="btn-link" href="/legal/returns" style={{fontSize:14}}>
                  Возврат товара
                </a>
              </li>
              <li>
                <a className="btn-link" href="/contacts" style={{fontSize:14}}>
                  Контакты
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div style={{fontWeight:700,marginBottom:12,fontSize:16}}>Контакты</div>
            <div className="lead" style={{fontSize:14}}>
              <div>Email: shop@getnwin.ru</div>
              <div style={{marginTop:6}}>Тел: +7 (993) 898-13-01</div>
            </div>
          </div>
        </div>
        <div
          className="lead"
          style={{
            paddingTop:20,
            borderTop:'1px solid var(--ring)',
            fontSize:13,
            display:'grid',
            gap:12
          }}
        >
          <div style={{opacity:.7}}>
            © 2025 GETNWIN. Все права защищены.
          </div>
          <div style={{opacity:.65,fontSize:12}}>
            <strong>Продавец:</strong> ИП Гладких Виталий Олегович, ИНН 381705889083, ОГРНИП 325774600805724
          </div>
        </div>
      </div>
    </footer>
  )
}
