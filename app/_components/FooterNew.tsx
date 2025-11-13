import Link from 'next/link'

export default function FooterNew() {
  return (
    <footer style={{
      background: 'var(--surface)',
      borderTop: '1px solid var(--ring)',
      paddingBlock: 'var(--gap-5)',
    }}>
      <div className="container">
        {/* Main Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'var(--gap-4)',
          marginBottom: 'var(--gap-4)',
        }}>
          {/* Brand Column */}
          <div>
            <h3 className="font-display" style={{
              fontSize: '20px',
              marginBottom: 'var(--gap-2)',
            }}>
              SoVAni
            </h3>
            <p style={{
              fontSize: '14px',
              color: 'var(--muted)',
              lineHeight: 1.6,
            }}>
              Премиальная одежда с новогодним настроением. Участвуй в розыгрышах и выигрывай крутые призы!
            </p>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="font-display" style={{
              fontSize: '14px',
              textTransform: 'uppercase',
              marginBottom: 'var(--gap-2)',
            }}>
              Покупателям
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: 'var(--gap-1)' }}>
                <Link href="/catalog" className="footer-link">Каталог товаров</Link>
              </li>
              <li style={{ marginBottom: 'var(--gap-1)' }}>
                <Link href="/promo" className="footer-link">Новогодняя акция</Link>
              </li>
              <li style={{ marginBottom: 'var(--gap-1)' }}>
                <Link href="/draws" className="footer-link">Розыгрыши призов</Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="font-display" style={{
              fontSize: '14px',
              textTransform: 'uppercase',
              marginBottom: 'var(--gap-2)',
            }}>
              Документы
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: 'var(--gap-1)' }}>
                <Link href="/legal/privacy" className="footer-link">Политика конфиденциальности</Link>
              </li>
              <li style={{ marginBottom: 'var(--gap-1)' }}>
                <Link href="/legal/offer" className="footer-link">Публичная оферта</Link>
              </li>
              <li style={{ marginBottom: 'var(--gap-1)' }}>
                <Link href="/legal/promo-rules" className="footer-link">Правила розыгрыша</Link>
              </li>
            </ul>
          </div>

          {/* Contacts Column */}
          <div>
            <h4 className="font-display" style={{
              fontSize: '14px',
              textTransform: 'uppercase',
              marginBottom: 'var(--gap-2)',
            }}>
              Контакты
            </h4>
            <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: 'var(--gap-1)' }}>
              Email: hello@sovani.ru
            </p>
            <p style={{ fontSize: '14px', color: 'var(--muted)' }}>
              Тел: +7 (999) 123-45-67
            </p>
          </div>
        </div>

        {/* Bottom Bar - Legal info */}
        <div style={{
          borderTop: '1px solid var(--ring)',
          paddingTop: 'var(--gap-3)',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '14px',
            color: 'var(--muted)',
            marginBottom: 'var(--gap-1)',
          }}>
            © 2025 SoVAni. Все права защищены.
          </p>
          <p style={{
            fontSize: '12px',
            color: 'var(--muted)',
          }}>
            ИНН: 1234567890 | ОГРНИП: 1234567890123
          </p>
        </div>
      </div>
    </footer>
  )
}
