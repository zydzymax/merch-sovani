'use client'

import Image from 'next/image'

export default function HeroShowcaseSticky() {
  return (
    <section className="relative w-full">
      {/* 3-колоночная сетка */}
      <div className="grid grid-cols-1 md:grid-cols-[28%_44%_28%]">
        {/* Левый рейл с фото - STICKY */}
        <div className="relative hidden md:block">
          <div className="sticky top-0 h-screen overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1600&auto=format&fit=crop"
              alt="Мужчина в стильной одежде"
              fill
              className="object-cover"
              priority
              sizes="28vw"
            />
            {/* Мягкий затемняющий градиент к центру */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/10 to-transparent" />
          </div>
        </div>

        {/* Центральная колонка - SCROLLABLE */}
        <div className="relative min-h-screen bg-[#FAF6F1] px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-lg">
            {/* Заголовок */}
            <h1 className="font-serif text-4xl tracking-tight text-[#3A2421] md:text-5xl lg:text-6xl">
              1 покупка = 1 шанс выиграть
            </h1>

            {/* Подзаголовок */}
            <p className="mt-4 text-lg text-[#6b4b45] md:text-xl">
              iPhone 16 Pro Max, Apple Watch, Nintendo Switch и автомобиль
            </p>

            {/* Блок-таймер с фоном автомобиля */}
            <div className="relative mt-8 overflow-hidden rounded-2xl shadow-2xl">
              {/* Фоновое изображение автомобиля */}
              <div className="absolute inset-0">
                <Image
                  src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1600&auto=format&fit=crop"
                  alt="Автомобиль призовой фонд"
                  fill
                  className="object-cover"
                  sizes="44vw"
                />
                {/* Overlay для читаемости */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/40" />
              </div>

              {/* Контент таймера */}
              <div className="relative z-10 px-8 py-10 text-center text-white">
                <p className="text-sm font-medium uppercase tracking-wider opacity-90">
                  До конца акции осталось
                </p>
                <p className="mt-3 font-serif text-5xl font-bold md:text-6xl">71 день</p>
                <p className="mt-2 text-sm opacity-80">Успейте принять участие!</p>
              </div>
            </div>

            {/* Кнопки */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/catalog"
                className="w-full rounded-xl bg-[#9D2A43] px-8 py-4 text-center font-semibold text-white shadow-lg transition hover:bg-[#8a2439] sm:w-auto"
              >
                Начать покупки
              </a>
              <a
                href="/promo"
                className="w-full rounded-xl border-2 border-[#9D2A43] px-8 py-4 text-center font-semibold text-[#9D2A43] transition hover:bg-[#9D2A43]/5 sm:w-auto"
              >
                Узнать больше
              </a>
            </div>

            {/* Подсказка про чекбокс участия */}
            <p className="mt-6 text-center text-xs leading-relaxed text-[#7b5e57]">
              Участие добровольное: отметьте чекбокс в чекауте — получите код участия,
              возврат надлежащего товара будет недоступен.
            </p>

            {/* Дополнительный контент для демонстрации скролла */}
            <div className="mt-16 space-y-6 text-center">
              <div className="rounded-xl bg-white/60 p-6 shadow-sm">
                <h3 className="font-serif text-2xl font-bold text-[#3A2421]">
                  Как это работает?
                </h3>
                <p className="mt-3 text-sm text-[#6b4b45]">
                  Каждая покупка даёт вам шанс выиграть призы. Оформите заказ, поставьте
                  галочку участия при оформлении и получите персональный код.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/60 p-5 shadow-sm">
                  <div className="text-3xl font-bold text-[#9D2A43]">1000+</div>
                  <div className="mt-1 text-xs text-[#6b4b45]">Участников</div>
                </div>
                <div className="rounded-xl bg-white/60 p-5 shadow-sm">
                  <div className="text-3xl font-bold text-[#B76E5C]">50+</div>
                  <div className="mt-1 text-xs text-[#6b4b45]">Призов</div>
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-[#9D2A43]/10 to-[#B76E5C]/10 p-6">
                <p className="text-sm font-medium text-[#3A2421]">
                  🎁 Главный приз — автомобиль стоимостью 2 000 000 ₽
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Правый рейл с фото - STICKY */}
        <div className="relative hidden md:block">
          <div className="sticky top-0 h-screen overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1600&auto=format&fit=crop"
              alt="Девушка в модной одежде"
              fill
              className="object-cover"
              priority
              sizes="28vw"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/20 via-black/10 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
