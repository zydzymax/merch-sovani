import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'

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
                    <h3 className="font-bold text-lg">Вы участвуете в розыгрыше!</h3>
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

                <p className="text-sm text-gray-700 mb-2">
                  📧 Код участия также отправлен на ваш email: <strong>{order.email}</strong>
                </p>
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
