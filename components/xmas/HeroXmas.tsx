'use client'

import Image from 'next/image'
import Link from 'next/link'

export function HeroXmas() {
  return (
    <section className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 mt-2 md:mt-4">
      {/* Плашка-референс: только одно фоновое изображение */}
      <div className="relative overflow-hidden rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] min-h-[44vh] md:min-h-[56vh]">
        {/* Фон — баннер сверху */}
        <Image
          src="/assets/xmas/banner_top.png"
          alt="Новогодняя акция"
          fill
          priority
          className="object-cover"
          sizes="(max-width:768px) 100vw, 1440px"
        />

        {/* Центр-правый оверлей с текстом и кнопками */}
        <div className="absolute inset-0 flex items-center justify-center md:justify-end p-4 sm:p-8">
          <div className="max-w-[640px] text-center md:text-right drop-shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
            <h1 className="font-serif font-black text-[#B4002D] text-3xl sm:text-4xl md:text-5xl leading-tight">
              1 покупка = 1 шанс выиграть
            </h1>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-[#281A12]/85">
              Чем больше покупок — тем больше шансов на iPhone 17 Pro, Apple Watch Ultra и XREAL Air 2 Ultra
            </p>

            <div className="mt-5 sm:mt-6 flex gap-3 justify-center md:justify-end">
              <Link href="/catalog" className="inline-block">
                <button className="h-11 px-5 sm:h-12 sm:px-6 bg-[#B4002D] hover:bg-[#9a0023] text-white font-semibold rounded-full shadow-md transition-all hover:scale-[1.02]">
                  Начать покупки
                </button>
              </Link>
              <Link href="#catalog" className="inline-block">
                <button className="h-11 px-5 sm:h-12 sm:px-6 border-2 border-[#E8C16A] text-[#281A12] font-semibold rounded-full hover:bg-[#E8C16A]/20 transition-all hover:scale-[1.02]">
                  К товарам ↓
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Санта — лёгкий вылет за край, без «оторванности» */}
        <div className="pointer-events-none absolute right-[2%] bottom-0 w-[240px] sm:w-[300px] md:w-[360px] lg:w-[420px]">
          <Image
            src="/assets/xmas/dedmoroz-blogger.png"
            alt="Дед Мороз — Минченко"
            width={420}
            height={600}
            className="drop-shadow-[0_12px_35px_rgba(0,0,0,0.25)]"
          />
        </div>
      </div>

      {/* Мобильная ссылка-якорь сразу под героем */}
      <div className="mt-3 flex md:hidden justify-center">
        <a href="#catalog" className="text-[#B4002D] underline underline-offset-4">К товарам ↓</a>
      </div>
    </section>
  )
}
