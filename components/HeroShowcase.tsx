'use client'

import Image from 'next/image'

export default function HeroShowcase() {
  return (
    <section className="relative w-full">
      {/* 3-колоночная сетка */}
      <div className="grid grid-cols-1 md:grid-cols-[28%_44%_28%]">
        {/* Левый рейл с фото */}
        <div className="relative h-[42vh] md:h-[86vh]">
          <Image
            src="https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop"
            alt="Мужчина в стильной одежде"
            fill
            className="object-cover"
            priority
          />
          {/* Мягкий затемняющий градиент к центру */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/10 to-transparent" />
        </div>

        {/* Центральная колонка */}
        <div className="relative flex h-full items-center justify-center bg-[#FAF6F1] px-6 py-12 md:px-8">
          <div className="mx-auto max-w-md text-center">
            <h1 className="font-serif text-4xl tracking-tight text-[#3A2421] md:text-5xl">
              1 покупка = 1 шанс выиграть
            </h1>
            <p className="mt-3 text-base text-[#6b4b45] md:text-lg">
              iPhone 17 Pro Max, Apple Watch, AR очки и автомобиль
            </p>

            {/* Таймер-плейсхолдер */}
            <div className="mt-6 inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-lg font-semibold text-[#9D2A43] shadow-md">
              До конца акции: 71 день
            </div>

            {/* Кнопки */}
            <div className="mt-8 flex items-center justify-center gap-3">
              <a
                href="/catalog"
                className="rounded-xl bg-[#9D2A43] px-5 py-3 font-medium text-white shadow transition hover:opacity-90"
              >
                Начать покупки
              </a>
              <a
                href="/promo"
                className="rounded-xl border border-[#9D2A43] px-5 py-3 font-medium text-[#9D2A43] transition hover:bg-[#9D2A43]/5"
              >
                Узнать больше
              </a>
            </div>

            {/* Подсказка про чекбокс участия */}
            <p className="mt-4 text-xs text-[#7b5e57]">
              Участие добровольное: отметьте чекбокс в чекауте — получите код участия,
              возврат надлежащего товара будет недоступен.
            </p>
          </div>
        </div>

        {/* Правый рейл с фото */}
        <div className="relative h-[42vh] md:h-[86vh]">
          <Image
            src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop"
            alt="Девушка в модной одежде"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/20 via-black/10 to-transparent" />
        </div>
      </div>
    </section>
  )
}
