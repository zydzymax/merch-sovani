import Image from 'next/image'

export default function BigFooter(){
  return(
    <footer className="section safe-bottom">
      <div className="container tile" style={{padding:36}}>
        <div style={{marginBottom:20}}>
          <Image
            src="/images/лого SoVAni.png"
            alt="SOVANI"
            width={200}
            height={66}
            style={{height:56,width:'auto'}}
          />
        </div>
        <div style={{
          display:'grid',
          gap:24,
          gridTemplateColumns:'1fr',
          marginBottom:24
        }} className="footer-grid">
          <div className="lead" style={{fontSize:16}}>
            Премиальная одежда и честные розыгрыши. Покупай стильные вещи и выигрывай суперпризы!
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
                <a className="btn-link" href="/docs/rules" style={{fontSize:14}}>
                  Правила акции
                </a>
              </li>
              <li>
                <a className="btn-link" href="/winners" style={{fontSize:14}}>
                  Победители
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
            <div style={{fontWeight:700,marginBottom:12,fontSize:16}}>Доставка</div>
            <div className="lead" style={{fontSize:14}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                <span style={{fontSize:18}}>📦</span>
                <span>Доставка СДЭК по всей России</span>
              </div>
              <div style={{opacity:0.8,marginBottom:8}}>Срок доставки: 2-7 дней</div>
              <a
                href="/docs/delivery"
                className="btn-link"
                style={{fontSize:14}}
              >
                Подробнее о доставке →
              </a>
            </div>
          </div>
          <div>
            <div style={{fontWeight:700,marginBottom:12,fontSize:16}}>Контакты</div>
            <div className="lead" style={{fontSize:14}}>
              <div>Email: shop@sovani.info</div>
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
            © 2025 SoVAni. Все права защищены.
          </div>
          <div style={{opacity:.65,fontSize:12}}>
            <strong>Оператор площадки (Агент):</strong> ИП Гладких Виталий Олегович, ИНН 381705889083, ОГРНИП 325774600805724
          </div>
          <div style={{opacity:.65,fontSize:12}}>
            <strong>Организатор акции:</strong> ООО «ФЛАЙТ», ИНН 5403087589, ОГРН 1255400011261
          </div>
        </div>
      </div>
    </footer>
  )
}
