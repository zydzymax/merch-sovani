import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'
import SuccessModal from './SuccessModal'

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: { payment?: string }
}) {
  const paymentId = searchParams.payment

  let order = null
  let entryCode = null

  if (paymentId) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        order: true,
      },
    })

    order = payment?.order
    entryCode = order?.entryCode
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Success Modal Popup */}
      <SuccessModal participatesInPromo={order?.participatesInPromo || false} />
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Оплата прошла успешно!</h1>
          <p className="text-gray-600">Ваш заказ успешно оформлен</p>
        </div>

        {/* Order Info */}
        {order && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Номер заказа</p>
                <p className="font-mono font-bold">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Сумма</p>
                <p className="font-bold text-xl text-primary">
                  {(order.total / 100).toLocaleString('ru-RU')} ₽
                </p>
              </div>
            </div>

            {order.participatesInPromo && entryCode && (
              <div className="mt-6 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🎉</span>
                  <div>
                    <h3 className="font-bold text-lg">Поздравляем! Вы участвуете в розыгрыше iPhone!</h3>
                    <p className="text-sm text-gray-600">
                      Ваш уникальный код участия в акции
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 mb-4">
                  <p className="text-center font-mono text-3xl font-bold text-primary tracking-wider">
                    {entryCode}
                  </p>
                </div>

                <p className="text-sm text-gray-700 mb-3">
                  📧 Код участия также отправлен на ваш email: <strong>{order.email}</strong>
                </p>

                {/* Telegram Channel Block */}
                <div className="bg-white border-2 border-blue-400 rounded-lg p-4 mb-3">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">✈️</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-base mb-2">Присоединяйтесь к нашему Telegram каналу!</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Там будут приходить все оповещения о розыгрышах, дате проведения и победителях. Не пропустите свой шанс выиграть iPhone!
                      </p>
                      <a
                        href="https://t.me/+NFNJFoql6xplNzRi"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 4.042-1.362 5.362-.168.557-.5.743-.818.761-.694.033-1.221-.458-1.894-.897-1.056-.688-1.653-1.115-2.678-1.787-1.185-.776-.417-1.204.258-1.901.177-.182 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.441-.752-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.121.099.154.232.17.325.016.094.037.308.021.475z"/>
                        </svg>
                        Подписаться на канал
                      </a>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-700">
                  🎁 Следите за розыгрышами на{' '}
                  <Link href="/draws" className="text-primary font-medium hover:underline">
                    странице розыгрышей
                  </Link>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Shipping Info */}
        {order && (
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="font-bold mb-3">📦 Доставка Почтой РФ</h3>
            <p className="text-sm text-gray-700 mb-2">
              Адрес доставки: {order.shippingRegion}, {order.shippingCity}, {order.shippingAddress}
            </p>
            <p className="text-sm text-gray-700">
              Мы отправим вам уведомление о трек-номере на {order.email}
            </p>
          </div>
        )}

        {/* Important Info */}
        {order?.participatesInPromo && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-800">
              ⚠️ <strong>Важно:</strong> Вы участвуете в акции «1 покупка = 1 шанс». Возврат товара
              надлежащего качества по этому заказу невозможен.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/account/dashboard"
            className="flex-1 bg-primary text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Перейти в личный кабинет
          </Link>
          <Link
            href="/catalog"
            className="flex-1 border-2 border-gray-300 text-center px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Продолжить покупки
          </Link>
        </div>
      </div>
    </div>
  )
}
