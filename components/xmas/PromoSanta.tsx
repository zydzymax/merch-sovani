'use client'

import Image from 'next/image'
import Link from 'next/link'

export function PromoSanta() {
  return (
    <section className="py-20 bg-brand-cream relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-red/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* LEFT: Santa (Nikita Minchenko blogger) */}
          <div className="relative order-2 md:order-1">
            <div className="relative h-[450px] md:h-[550px]">
              <Image
                src="/assets/xmas/dedmoroz-blogger.png"
                alt="Дед Мороз - блогер Никита Минченко"
                fill
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* RIGHT: Promo Text (WITHOUT TICKETS) */}
          <div className="order-1 md:order-2">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-brand-dark mb-6">
              Новогодний дроп от Минченко × SoVAni
            </h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <span className="text-brand-gold text-2xl mt-1">✓</span>
                <div>
                  <p className="text-lg text-brand-dark/90 font-medium">
                    Футболка оверсайз, эмалевый значок, стикер, шеврон
                  </p>
                  <p className="text-sm text-brand-dark/60 mt-1">
                    Уникальная коллекция от популярного блогера — каждая покупка даёт +2 шанса
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-brand-gold text-2xl mt-1">✓</span>
                <div>
                  <p className="text-lg text-brand-dark/90 font-medium">
                    Пижама SoVAni — культовый комфорт
                  </p>
                  <p className="text-sm text-brand-dark/60 mt-1">
                    Премиальное качество для идеального отдыха — даёт +3 шанса на победу
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-brand-gold text-2xl mt-1">✓</span>
                <div>
                  <p className="text-lg text-brand-dark/90 font-medium">
                    Аксессуары и мерч
                  </p>
                  <p className="text-sm text-brand-dark/60 mt-1">
                    Значки, стикеры, шевроны — каждая покупка даёт +1 шанс
                  </p>
                </div>
              </div>
            </div>

            <Link href="/catalog">
              <button className="px-10 py-4 bg-brand-red hover:bg-brand-red/90 text-white font-bold text-lg rounded-full shadow-xl hover:scale-105 transition-all">
                Смотреть каталог
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
