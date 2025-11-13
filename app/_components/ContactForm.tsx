'use client'

export default function ContactForm(){
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    alert('Спасибо! Мы свяжемся с вами в ближайшее время.')
  }

  return(
    <section aria-label="Остались вопросы?" style={{background:'var(--accent)',padding:'56px 0',color:'#fff'}}>
      <div className="container">
        <h2 className="font-display" style={{textTransform:'uppercase',fontSize:'36px',marginBottom:20}}>
          Остались вопросы?
        </h2>
        <form onSubmit={handleSubmit} style={{display:'grid',gap:14,maxWidth:720}}>
          <input
            type="text"
            placeholder="Ваше имя"
            required
            style={{
              borderRadius:14,
              padding:'16px 18px',
              border:'none',
              color:'#000',
              fontSize:16
            }}
          />
          <input
            type="tel"
            placeholder="+7 (___) ___-__-__"
            required
            style={{
              borderRadius:14,
              padding:'16px 18px',
              border:'none',
              color:'#000',
              fontSize:16
            }}
          />
          <textarea
            placeholder="Ваш вопрос"
            rows={4}
            required
            style={{
              borderRadius:14,
              padding:'16px 18px',
              border:'none',
              color:'#000',
              fontSize:16,
              resize:'vertical'
            }}
          />
          <label style={{
            display:'flex',
            gap:12,
            alignItems:'flex-start',
            color:'#000',
            background:'#fff',
            padding:'12px 14px',
            borderRadius:12,
            fontSize:14
          }}>
            <input type="checkbox" required style={{marginTop:3}}/>
            <span>
              Нажимая «Отправить», я даю согласие на{' '}
              <a href="/legal/privacy" style={{color:'#000',textDecoration:'underline'}}>
                обработку персональных данных
              </a>
            </span>
          </label>
          <button
            className="btn"
            type="submit"
            style={{
              background:'var(--surface-2)',
              color:'#fff',
              fontSize:16,
              padding:'18px 32px'
            }}
          >
            Отправить
          </button>
        </form>
      </div>
    </section>
  )
}
