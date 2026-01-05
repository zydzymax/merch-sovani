'use client'
import { useState } from 'react'

export default function ContactForm(){
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      message: formData.get('message'),
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Произошла ошибка')
        setLoading(false)
        return
      }

      setSuccess(true)
      e.currentTarget.reset()
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError('Не удалось отправить сообщение. Попробуйте позже.')
    } finally {
      setLoading(false)
    }
  }

  return(
    <section aria-label="Остались вопросы?" className="safe-bottom" style={{background:'var(--accent)',padding:'56px 0',color:'#fff'}}>
      <div className="container">
        <div style={{display:'flex',alignItems:'center',gap:20,marginBottom:20,flexWrap:'wrap',justifyContent:'center'}}>
          <h2 className="font-display contact-form-title" style={{textTransform:'uppercase',fontSize:'36px',margin:0,textAlign:'center'}}>
            Остались вопросы?
          </h2>
        </div>
        <form onSubmit={handleSubmit} style={{display:'grid',gap:14,maxWidth:'100%',width:'100%'}} className="contact-form">
          {error && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(255, 59, 48, 0.9)',
              borderRadius: 12,
              color: '#fff',
              fontSize: 14,
            }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(52, 211, 153, 0.9)',
              borderRadius: 12,
              color: '#fff',
              fontSize: 14,
            }}>
              ✓ Спасибо! Мы свяжемся с вами в ближайшее время.
            </div>
          )}
          <input
            type="text"
            name="name"
            placeholder="Ваше имя"
            required
            disabled={loading}
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
            name="phone"
            placeholder="+7 (___) ___-__-__"
            required
            disabled={loading}
            style={{
              borderRadius:14,
              padding:'16px 18px',
              border:'none',
              color:'#000',
              fontSize:16
            }}
          />
          <textarea
            name="message"
            placeholder="Ваш вопрос"
            rows={4}
            required
            disabled={loading}
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
            disabled={loading}
            style={{
              background:'var(--surface-2)',
              color:'#fff',
              fontSize:16,
              padding:'18px 32px',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Отправка...' : 'Отправить'}
          </button>
        </form>
      </div>
    </section>
  )
}
