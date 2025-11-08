'use client'

import Image from 'next/image'

export function HowToWin() {
  const steps = [
    {
      number: 1,
      title: 'Выбери товар',
      description: 'Выбери понравившуюся вещь из нашей коллекции и добавь в корзину',
      icon: '🛍️',
    },
    {
      number: 2,
      title: 'Оформи заказ',
      description: 'При оформлении заказа поставь галочку "Участвовать в розыгрыше"',
      icon: '✅',
    },
    {
      number: 3,
      title: 'Получи шанс',
      description: 'Каждая покупка = 1 шанс выиграть iPhone, Apple Watch или AR-очки',
      icon: '🎁',
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-brand-cream to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-brand-dark mb-4">
            Как Участвовать
          </h2>
          <p className="text-xl text-brand-dark/70 max-w-2xl mx-auto">
            Всего три простых шага отделяют тебя от шанса выиграть премиальный гаджет
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, idx) => (
            <div key={step.number} className="relative group">
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/4 -right-4 w-8 h-0.5 bg-brand-gold/30 z-0" />
              )}

              {/* Card */}
              <div className="relative bg-white rounded-2xl p-8 border-4 border-brand-gold/20 hover:border-brand-gold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl">
                {/* Number badge */}
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-brand-red rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="font-serif text-3xl font-bold text-brand-cream">{step.number}</span>
                </div>

                {/* Icon */}
                <div className="text-6xl mb-6 text-center mt-4">{step.icon}</div>

                {/* Content */}
                <h3 className="font-serif text-2xl font-bold text-brand-dark mb-4 text-center">
                  {step.title}
                </h3>
                <p className="text-brand-dark/70 text-center leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-brand-gold/10 rounded-2xl px-8 py-6 border-2 border-brand-gold/30">
            <p className="text-brand-dark font-semibold text-lg">
              🎯 Чем больше покупок — тем выше шансы на победу!
            </p>
            <p className="text-brand-dark/70 mt-2">
              Розыгрыш состоится 31 декабря 2025 года
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
