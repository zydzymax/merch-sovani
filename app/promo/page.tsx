import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db/prisma'
import { HowToWin } from '@/components/xmas/HowToWin'

export default async function PromoPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-brand-red via-brand-dark to-brand-forest py-20 overflow-hidden">
        <div className="absolute inset-0 bg-snowflakes opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-brand-cream mb-6 animate-float">
              Новогодний Розыгрыш Призов
            </h1>
            <p className="text-2xl md:text-3xl text-brand-gold font-bold mb-4">
              1 покупка = 1 шанс на победу!
            </p>
            <p className="text-xl text-brand-cream/90 mb-8 max-w-3xl mx-auto">
              Покупай стильную одежду и выигрывай iPhone 17 Pro, Apple Watch Ultra
              или AR-очки XREAL Air 2 Ultra
            </p>
            <Link href="/catalog">
              <button className="px-12 py-4 bg-brand-gold hover:bg-brand-gold/90 text-brand-dark font-bold text-lg rounded-full shadow-2xl hover:scale-105 transition-transform">
                Участвовать в розыгрыше
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Prize Cards */}
      <section id="prizes" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-center text-brand-dark mb-4">
            Призовой фонд
          </h2>
          <p className="text-center text-xl text-brand-dark/70 mb-16">
            Три главных приза для победителей
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Prize 1 - iPhone */}
            <div className="bg-brand-cream rounded-2xl p-8 border-4 border-brand-gold/30 hover:border-brand-gold transition-all hover:scale-105 shadow-lg">
              <div className="bg-white rounded-xl p-6 mb-6 aspect-square flex items-center justify-center">
                <div className="text-8xl">📱</div>
              </div>
              <h3 className="font-serif text-2xl font-bold text-brand-dark mb-2">
                iPhone 17 Pro
              </h3>
              <p className="text-brand-dark/70 mb-4">
                Флагманский смартфон Apple последнего поколения
              </p>
              <div className="text-brand-red font-bold text-xl">
                1-й приз
              </div>
            </div>

            {/* Prize 2 - Apple Watch */}
            <div className="bg-brand-cream rounded-2xl p-8 border-4 border-brand-gold/30 hover:border-brand-gold transition-all hover:scale-105 shadow-lg">
              <div className="bg-white rounded-xl p-6 mb-6 aspect-square flex items-center justify-center">
                <div className="text-8xl">⌚</div>
              </div>
              <h3 className="font-serif text-2xl font-bold text-brand-dark mb-2">
                Apple Watch Ultra
              </h3>
              <p className="text-brand-dark/70 mb-4">
                Премиальные умные часы для активного образа жизни
              </p>
              <div className="text-brand-red font-bold text-xl">
                2-й приз
              </div>
            </div>

            {/* Prize 3 - AR Glasses */}
            <div className="bg-brand-cream rounded-2xl p-8 border-4 border-brand-gold/30 hover:border-brand-gold transition-all hover:scale-105 shadow-lg">
              <div className="bg-white rounded-xl p-6 mb-6 aspect-square flex items-center justify-center">
                <div className="text-8xl">🥽</div>
              </div>
              <h3 className="font-serif text-2xl font-bold text-brand-dark mb-2">
                XREAL Air 2 Ultra
              </h3>
              <p className="text-brand-dark/70 mb-4">
                AR-очки с поддержкой дополненной реальности
              </p>
              <div className="text-brand-red font-bold text-xl">
                3-й приз
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How To Win */}
      <HowToWin />

      {/* Rules Section */}
      <section id="rules" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-center text-brand-dark mb-16">
            Правила участия
          </h2>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-brand-cream/50 rounded-xl p-6 border-2 border-brand-gold/20">
              <h3 className="font-bold text-xl text-brand-dark mb-3">
                📅 Сроки проведения акции
              </h3>
              <p className="text-brand-dark/80">
                Акция проводится с 1 ноября 2025 года по 31 декабря 2025 года.
                Розыгрыш призов состоится 31 декабря 2025 года в прямом эфире.
              </p>
            </div>

            <div className="bg-brand-cream/50 rounded-xl p-6 border-2 border-brand-gold/20">
              <h3 className="font-bold text-xl text-brand-dark mb-3">
                🎯 Условия участия
              </h3>
              <ul className="space-y-2 text-brand-dark/80">
                <li className="flex items-start gap-2">
                  <span className="text-brand-gold mt-1">•</span>
                  <span>Каждая покупка = 1 уникальный код участия</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-gold mt-1">•</span>
                  <span>Минимальная сумма покупки — 1000 ₽</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-gold mt-1">•</span>
                  <span>При оформлении заказа необходимо поставить галочку «Участвовать в розыгрыше»</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-gold mt-1">•</span>
                  <span>Товары, купленные с участием в акции, не подлежат возврату</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-gold mt-1">•</span>
                  <span>Количество участий не ограничено — покупай больше и увеличивай свои шансы!</span>
                </li>
              </ul>
            </div>

            <div className="bg-brand-cream/50 rounded-xl p-6 border-2 border-brand-gold/20">
              <h3 className="font-bold text-xl text-brand-dark mb-3">
                🎁 Определение победителей
              </h3>
              <p className="text-brand-dark/80 mb-3">
                Розыгрыш будет проведён 31 декабря 2025 года в 20:00 по московскому времени
                в прямом эфире с использованием генератора случайных чисел.
              </p>
              <p className="text-brand-dark/80">
                Победители будут уведомлены по электронной почте и телефону в течение 24 часов после розыгрыша.
              </p>
            </div>

            <div className="bg-brand-cream/50 rounded-xl p-6 border-2 border-brand-gold/20">
              <h3 className="font-bold text-xl text-brand-dark mb-3">
                📦 Получение призов
              </h3>
              <p className="text-brand-dark/80">
                Призы вручаются в течение 14 дней после розыгрыша.
                Доставка призов осуществляется бесплатно в любую точку России.
              </p>
            </div>

            <div className="bg-brand-cream/50 rounded-xl p-6 border-2 border-brand-gold/20">
              <h3 className="font-bold text-xl text-brand-dark mb-3">
                ⚖️ Юридическая информация
              </h3>
              <p className="text-brand-dark/80">
                Полные правила проведения акции доступны в разделе{' '}
                <Link href="/legal/promo-rules" className="text-brand-red hover:underline font-semibold">
                  Правила розыгрыша
                </Link>.
                Участвуя в акции, вы соглашаетесь с{' '}
                <Link href="/legal/offer" className="text-brand-red hover:underline font-semibold">
                  публичной офертой
                </Link>
                {' '}и{' '}
                <Link href="/legal/privacy" className="text-brand-red hover:underline font-semibold">
                  политикой обработки персональных данных
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-brand-cream/30">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-center text-brand-dark mb-16">
            Частые вопросы
          </h2>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: 'Могу ли я вернуть товар, если я участвую в розыгрыше?',
                a: 'Нет, товары, приобретённые с участием в акции, не подлежат возврату. Это условие необходимо для честного проведения розыгрыша.',
              },
              {
                q: 'Сколько раз я могу участвовать?',
                a: 'Количество участий не ограничено! Каждая новая покупка даёт вам дополнительный шанс на победу.',
              },
              {
                q: 'Когда я узнаю результаты розыгрыша?',
                a: 'Розыгрыш состоится 31 декабря 2025 года в 20:00 МСК в прямом эфире. Победители будут уведомлены в течение 24 часов.',
              },
              {
                q: 'Как я получу приз, если выиграю?',
                a: 'Мы свяжемся с вами по электронной почте и телефону. Приз будет доставлен бесплатно в течение 14 дней.',
              },
              {
                q: 'Можно ли передать приз другому человеку?',
                a: 'Да, призы можно передавать третьим лицам. Главное — это ваша победа!',
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="bg-white rounded-xl p-6 border-2 border-brand-gold/20 hover:border-brand-gold/40 transition-all cursor-pointer group"
              >
                <summary className="font-bold text-lg text-brand-dark list-none flex items-center justify-between">
                  <span>{faq.q}</span>
                  <span className="text-brand-gold group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-brand-dark/70 leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-brand-forest to-brand-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-snowflakes opacity-5" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-brand-cream mb-6">
            Готов попробовать свою удачу?
          </h2>
          <p className="text-xl text-brand-cream/90 mb-8 max-w-2xl mx-auto">
            Выбери стильную одежду из нашей коллекции и автоматически участвуй в розыгрыше премиальных гаджетов
          </p>
          <Link href="/catalog">
            <button className="px-12 py-4 bg-brand-gold hover:bg-brand-gold/90 text-brand-dark font-bold text-lg rounded-full shadow-2xl hover:scale-105 transition-transform">
              Перейти в каталог
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}
