'use client'

import Image from 'next/image'

export function DecorStrip() {
  const decorItems = [
    { icon: '/assets/xmas/svg/candy-cane.svg', alt: 'Леденец' },
    { icon: '/assets/xmas/svg/gingerbread.svg', alt: 'Пряник' },
    { icon: '/assets/xmas/svg/pinecone.svg', alt: 'Шишка' },
    { icon: '/assets/xmas/svg/star.svg', alt: 'Звезда' },
    { icon: '/assets/xmas/svg/ornament.svg', alt: 'Шар' },
  ]

  return (
    <div className="relative bg-brand-forest py-12 overflow-hidden border-y-4 border-brand-gold/30">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-snowflakes opacity-5" />

      <div className="relative z-10">
        <div className="flex items-center justify-center gap-8 md:gap-16 animate-float">
          {/* Repeat pattern twice for visual richness */}
          {[...decorItems, ...decorItems, ...decorItems].map((item, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 opacity-70 hover:opacity-100 transition-opacity"
              style={{
                animationDelay: `${idx * 0.3}s`,
              }}
            >
              <Image
                src={item.icon}
                alt={item.alt}
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Decorative borders */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent" />
    </div>
  )
}
