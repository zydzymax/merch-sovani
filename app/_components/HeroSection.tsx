import Image from 'next/image'

export default function HeroSection(){
  return (
    <section className="relative mx-auto max-w-[1280px] px-6 md:px-10 py-8 md:py-14">
      {/* Карточка-капсула с фоном */}
      <div className="relative overflow-hidden rounded-[28px] md:rounded-[32px] bg-[#14151b] shadow-[0_20px_60px_rgba(0,0,0,.35)]">
        {/* Фон hero */}
        <div className="relative w-full min-h-[480px] sm:min-h-[520px] md:min-h-[640px]">
          {/* Hero background image */}
          <Image
            src="/images/hero.webp"
            alt="Главная сцена розыгрыша: брелоки и призы"
            fill
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 90vw, 1280px"
            className="object-cover object-center"
          />

          {/* Темная маска для читаемости текста */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 to-black/35 sm:from-black/35 sm:to-black/25" />
        </div>

        {/* Слой с текстом и кнопками */}
        <div className="pointer-events-none absolute inset-0 flex items-center">
          <div className="pointer-events-auto w-full px-5 sm:px-10">
            <div className="max-w-[840px]">
              <h1 className="font-[var(--font-display,Unbounded)] text-white text-3xl leading-tight sm:text-4xl md:text-5xl md:leading-[1.1]">
                Купи брелок — <span className="whitespace-nowrap">выиграй iPhone</span>!
              </h1>
              <p className="mt-3 md:mt-4 text-base sm:text-lg text-white/85 font-[var(--font-body,Montserrat)]">
                Каждый брелок = 1 шанс выиграть iPhone 17 Pro Max. Один главный приз!
              </p>

              {/* Кнопки */}
              <div className="mt-6 md:mt-8 flex flex-wrap gap-3">
                <a
                  href="/catalog"
                  className="inline-flex items-center justify-center rounded-full px-6 md:px-7 py-3 md:py-3.5 text-white font-semibold text-sm md:text-base bg-[var(--theme-primary,#ff2b2b)] hover:opacity-95 transition"
                >
                  КУПИТЬ БРЕЛОК
                </a>
                <a
                  href="/docs/rules"
                  className="inline-flex items-center justify-center rounded-full px-6 md:px-7 py-3 md:py-3.5 text-white/90 font-semibold text-sm md:text-base border border-white/15 bg-white/5 backdrop-blur hover:bg-white/7 transition"
                >
                  УСЛОВИЯ АКЦИИ
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
