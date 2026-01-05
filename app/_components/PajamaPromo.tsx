'use client'

import Image from 'next/image'

const OZON_LINK = 'https://www.ozon.ru/product/pizhama-sovani-moda-i-stil-1483568693/?at=k2toz3wprTzp1WgotWqx3v1FQ5xXypTGYon34ugloQlO'

export default function PajamaPromo() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <a
          href={OZON_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="tile"
          style={{
            display: 'block',
            padding: 0,
            overflow: 'hidden',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            minHeight: 500,
            background: '#1a1a2e',
          }} className="pajama-grid">
            {/* Content */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '32px',
              background: '#1a1a2e',
            }}>
              <div style={{ maxWidth: 400 }}>
                <div style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#e94560',
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                }}>
                  Эксклюзив на Ozon
                </div>
                <h2 className="font-display" style={{
                  fontSize: 'clamp(24px, 5vw, 40px)',
                  fontWeight: 800,
                  color: '#fff',
                  marginBottom: 12,
                }}>
                  Пижама SoVAni
                </h2>
                <p style={{
                  fontSize: 'clamp(13px, 2.5vw, 16px)',
                  color: 'rgba(255,255,255,0.85)',
                  marginBottom: 20,
                  lineHeight: 1.6,
                }}>
                  Культовый комфорт и премиальное качество для идеального отдыха
                </p>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#e94560',
                  color: '#fff',
                  padding: '12px 24px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 700,
                }}>
                  Купить на Ozon
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7V17"/>
                  </svg>
                </span>
              </div>
            </div>

            {/* Image - full pajama */}
            <div style={{
              position: 'relative',
              minHeight: 500,
              background: '#1a1a2e',
            }} className="pajama-image">
              <Image
                src="/assets/xmas/sovani-pajama.jpg"
                alt="Пижама SoVAni"
                fill
                style={{ objectFit: 'contain', objectPosition: 'center center' }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </a>
      </div>

      <style jsx global>{`
        .pajama-grid {
          position: relative;
        }
        @media (max-width: 768px) {
          .pajama-grid {
            grid-template-columns: 1fr !important;
            min-height: auto !important;
          }
          .pajama-image {
            min-height: 400px !important;
            order: -1;
          }
        }
      `}</style>
    </section>
  )
}
