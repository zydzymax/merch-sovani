import Link from 'next/link'

interface HeroProps {
  title: string
  subtitle?: string
  ctaPrimary?: { text: string; href: string }
  ctaSecondary?: { text: string; href: string }
}

export default function Hero({ title, subtitle, ctaPrimary, ctaSecondary }: HeroProps) {
  return (
    <section className="section hero" style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      background: 'radial-gradient(circle at 30% 50%, rgba(229,42,39,0.15), transparent 50%), var(--bg)',
    }}>
      <div className="container" style={{ textAlign: 'center', zIndex: 1 }}>
        <h1 className="font-display fade-up" style={{
          fontSize: 'var(--h1)',
          marginBottom: 'var(--gap-3)',
          textTransform: 'uppercase',
          maxWidth: '900px',
          marginInline: 'auto',
        }}>
          {title}
        </h1>

        {subtitle && (
          <p className="lead" style={{
            fontSize: 'var(--lead)',
            color: 'var(--muted)',
            marginBottom: 'var(--gap-4)',
            maxWidth: '600px',
            marginInline: 'auto',
          }}>
            {subtitle}
          </p>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: 'var(--gap-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
          {ctaPrimary && (
            <Link href={ctaPrimary.href} className="btn-pill">
              {ctaPrimary.text}
            </Link>
          )}
          {ctaSecondary && (
            <Link href={ctaSecondary.href} className="btn-pill btn-ghost">
              {ctaSecondary.text}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
