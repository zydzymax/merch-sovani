'use client'

import Image from 'next/image'

export default function HeroShowcaseSticky() {
  return (
    <section className="relative w-full">
      {/* 3-колоночная сетка */}
      <div className="grid grid-cols-1 md:grid-cols-[28%_44%_28%]">
        {/* Левый рейл с фото - STICKY - Елка с подарками */}
        <div className="relative hidden md:block">
          <div className="sticky top-0 h-screen overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1512389142860-9c449e58a543?q=80&w=1600"
              alt="Новогодняя елка с подарками"
              fill
              className="object-cover"
              priority
              sizes="28vw"
            />
            {/* Мягкий затемняющий градиент к центру */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-transparent" />
          </div>
        </div>

        {/* Центральная колонка - SCROLLABLE - НОВОГОДНЯЯ ТЕМАТИКА */}
        <div className="relative min-h-screen bg-gradient-to-br from-[#FAF6F1] via-[#FFF8F0] to-[#F5E6D3] px-6 py-16 md:px-10 md:py-24">
          <div className="mx-auto max-w-lg">
            {/* Заголовок с новогодними эмодзи */}
            <div className="text-center mb-4">
              <span className="text-4xl">🎄</span>
              <span className="mx-2 text-4xl">✨</span>
              <span className="text-4xl">🎁</span>
            </div>

            {/* Заголовок */}
            <h1 className="font-serif text-4xl tracking-tight text-christmas-red md:text-5xl lg:text-6xl">
              1 покупка = 1 шанс выиграть новогодние призы
            </h1>

            {/* Подзаголовок */}
            <p className="mt-4 text-lg text-christmas-green md:text-xl font-semibold">
              iPhone 17 Pro Max, Apple Watch, AR очки Xreal One
            </p>

            {/* Блок-таймер с новогодним фоном */}
            <div className="relative mt-8 overflow-hidden rounded-2xl shadow-2xl ring-4 ring-christmas-gold/30">
              {/* Новогоднее изображение с подарками */}
              <div className="absolute inset-0">
                <Image
                  src="https://images.unsplash.com/photo-1512389142860-9c449e58a543?q=80&w=1600&auto=format&fit=crop"
                  alt="Автомобиль призовой фонд"
                  fill
                  className="object-cover"
                  sizes="44vw"
                />
                {/* Overlay для читаемости с новогодним градиентом */}
                <div className="absolute inset-0 bg-gradient-to-br from-christmas-red/70 via-christmas-green/60 to-christmas-gold/50" />
              </div>

              {/* Контент таймера */}
              <div className="relative z-10 px-8 py-10 text-center text-white">
                <p className="text-sm font-medium uppercase tracking-wider opacity-90 flex items-center justify-center gap-2">
                  <span>🎅</span>
                  <span>До конца новогодней акции осталось</span>
                  <span>🎅</span>
                </p>
                <p className="mt-3 font-serif text-5xl font-bold md:text-6xl drop-shadow-lg">71 день</p>
                <p className="mt-2 text-sm opacity-80">Успейте принять участие в новогоднем розыгрыше!</p>
              </div>
            </div>

            {/* Кнопки с новогодними цветами */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/catalog"
                className="w-full rounded-xl bg-christmas-red px-8 py-4 text-center font-semibold text-white shadow-lg transition hover:bg-christmas-red/90 hover:shadow-xl hover:scale-105 sm:w-auto"
              >
                🎁 Начать покупки
              </a>
              <a
                href="/promo"
                className="w-full rounded-xl border-2 border-christmas-green bg-christmas-green/5 px-8 py-4 text-center font-semibold text-christmas-green transition hover:bg-christmas-green hover:text-white sm:w-auto"
              >
                🎄 Узнать больше
              </a>
            </div>

            {/* Подсказка про чекбокс участия */}
            <p className="mt-6 text-center text-xs leading-relaxed text-[#7b5e57]">
              Участие добровольное: отметьте чекбокс в чекауте — получите код участия,
              возврат надлежащего товара будет недоступен.
            </p>

            {/* Дополнительный контент для демонстрации скролла */}
            <div className="mt-16 space-y-6 text-center">
              <div className="rounded-xl bg-white/80 p-6 shadow-lg ring-2 ring-christmas-gold/20">
                <h3 className="font-serif text-2xl font-bold text-christmas-red flex items-center justify-center gap-2">
                  <span>🎅</span>
                  <span>Как это работает?</span>
                  <span>🎅</span>
                </h3>
                <p className="mt-3 text-sm text-christmas-green">
                  Каждая покупка даёт вам шанс выиграть новогодние призы. Оформите заказ, поставьте
                  галочку участия при оформлении и получите персональный код.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/80 p-5 shadow-lg ring-2 ring-christmas-red/20">
                  <div className="text-3xl font-bold text-christmas-red">Еженедельно</div>
                  <div className="mt-1 text-xs text-christmas-green">🎁 Розыгрыш призов</div>
                </div>
                <div className="rounded-xl bg-white/80 p-5 shadow-lg ring-2 ring-christmas-green/20">
                  <div className="text-3xl font-bold text-christmas-green">4</div>
                  <div className="mt-1 text-xs text-christmas-red">🎄 Приза в розыгрыше</div>
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-christmas-red/15 via-christmas-gold/15 to-christmas-green/15 p-6 shadow-md">
                <p className="text-sm font-medium text-christmas-red flex items-center justify-center gap-2">
                  <span>🎁</span>
                  <span>Призы на общую сумму 240 000 ₽</span>
                  <span>🎁</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Правый рейл с фото - STICKY - Новогодние украшения */}
        <div className="relative hidden md:block">
          <div className="sticky top-0 h-screen overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=80&w=1600"
              alt="Новогодние украшения"
              fill
              className="object-cover"
              priority
              sizes="28vw"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/5 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
