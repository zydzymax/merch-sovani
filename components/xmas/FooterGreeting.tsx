'use client'

import Image from 'next/image'

export function FooterGreeting() {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* LEFT: Candy canes and pine cone composition */}
            <div className="relative h-64 flex items-center justify-center md:justify-start">
              {/* Candy canes crossed */}
              <div className="relative w-56 h-56">
                <Image
                  src="/assets/xmas/леденцы.png"
                  alt="Леденцы крест-накрест"
                  fill
                  className="object-contain"
                  sizes="224px"
                />
              </div>
              {/* Pine cone */}
              <div className="absolute bottom-4 right-8 w-32 h-32">
                <Image
                  src="/assets/xmas/шишка.png"
                  alt="Шишка"
                  fill
                  className="object-contain"
                  sizes="128px"
                />
              </div>
            </div>

            {/* RIGHT: Happy New Year greeting from image */}
            <div className="relative h-64 flex items-center justify-center md:justify-end">
              <div className="relative w-full max-w-md h-48">
                <Image
                  src="/assets/xmas/счастливого нг.png"
                  alt="Счастливого Нового года"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 448px"
                />
              </div>
            </div>
          </div>

          {/* Gold divider line */}
          <div className="mt-12">
            <hr className="border-t-2 border-brand-gold/30" />
          </div>
        </div>
      </div>
    </section>
  )
}
