import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'
import { getPayment } from '@/lib/payments/yookassa'

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string; payment?: string }
}) {
  const orderNumber = searchParams.order
  const paymentId = searchParams.payment

  let order = null
  let paymentStatus = 'pending'

  // Look up by order number (YooKassa flow)
  if (orderNumber) {
    order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        payments: true
      }
    })

    // Check YooKassa payment status
    if (order?.payments?.[0]?.transactionId) {
      try {
        const yooPayment = await getPayment(order.payments[0].transactionId)
        paymentStatus = yooPayment.status

        // Update local payment status if succeeded
        if (yooPayment.status === 'succeeded' && order.payments[0].status === 'PENDING') {
          await prisma.$transaction([
            prisma.payment.update({
              where: { id: order.payments[0].id },
              data: { status: 'SUCCEEDED' }
            }),
            prisma.order.update({
              where: { id: order.id },
              data: { status: 'PAID' }
            })
          ])
        }
      } catch (e) {
        console.error('Failed to verify YooKassa payment:', e)
      }
    }
  }
  // Legacy: look up by payment ID (mock flow)
  else if (paymentId) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        order: true,
      },
    })
    order = payment?.order
    paymentStatus = payment?.status === 'SUCCEEDED' ? 'succeeded' : 'pending'
  }

  const isSuccess = paymentStatus === 'succeeded'
  const isPending = paymentStatus === 'pending' || paymentStatus === 'waiting_for_capture'

  // Get promo codes from order metadata
  const orderMetadata = order?.metadata as { allEntryCodes?: string[] } | null
  const promoCodes = orderMetadata?.allEntryCodes || (order?.entryCode ? [order.entryCode] : [])
  const hasPromoCodes = order?.participatesInPromo && promoCodes.length > 0

  // Bot link for notifications
  const botLink = order?.orderNumber
    ? `https://t.me/getnwin_bot?start=${order.orderNumber}`
    : 'https://t.me/getnwin_bot'

  const channelLink = 'https://t.me/+NFNJFoql6xplNzRi'

  return (
    <div className="min-h-screen bg-[#0f0f12] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-[#1a1b22] rounded-2xl shadow-2xl p-8 border border-white/5">
        {/* Status Icon */}
        <div className="text-center mb-8">
          {isSuccess ? (
            <>
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-green-400"
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
              <h1 className="text-3xl font-bold text-white mb-2">Оплата прошла успешно!</h1>
              <p className="text-gray-400">Ваш заказ успешно оформлен</p>
            </>
          ) : isPending ? (
            <>
              <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-yellow-400 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Обработка платежа...</h1>
              <p className="text-gray-400">Пожалуйста, подождите. Страница обновится автоматически.</p>
              <meta httpEquiv="refresh" content="5" />
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Оплата отменена</h1>
              <p className="text-gray-400">К сожалению, платеж не был завершён</p>
            </>
          )}
        </div>

        {/* Order Info */}
        {order && (
          <div className="bg-[#14151b] rounded-xl p-6 mb-6 border border-white/5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Номер заказа</p>
                <p className="font-mono font-bold text-white">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Сумма</p>
                <p className="font-bold text-xl text-[#ff2b2b]">
                  {(order.total / 100).toLocaleString('ru-RU')} ₽
                </p>
              </div>
            </div>

            {/* Receipt info */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-sm text-gray-400">
                📧 Электронный чек отправлен на: <strong className="text-white">{order.email}</strong>
              </p>
            </div>
          </div>
        )}

        {/* PROMO CODES - Show immediately! */}
        {hasPromoCodes && isSuccess && (
          <div className="bg-gradient-to-r from-orange-600 to-amber-500 rounded-xl p-6 mb-6 text-white">
            <div className="text-center">
              <span className="text-5xl mb-3 block">🎫</span>
              <h3 className="text-xl font-bold mb-2">
                {promoCodes.length === 1
                  ? 'Твой номер для розыгрыша iPhone!'
                  : `Твои ${promoCodes.length} номеров для розыгрыша iPhone!`}
              </h3>
              <p className="text-sm opacity-90 mb-4">
                Сохрани {promoCodes.length === 1 ? 'его' : 'их'} — каждый код это шанс выиграть!
              </p>

              <div className="bg-white/20 backdrop-blur rounded-lg p-4 space-y-2">
                {promoCodes.map((code) => (
                  <div
                    key={code}
                    className="bg-white text-orange-600 font-mono font-bold text-lg px-4 py-2 rounded-lg"
                  >
                    {code}
                  </div>
                ))}
              </div>

              <p className="text-xs opacity-75 mt-3">
                Коды также отправлены на вашу почту
              </p>
            </div>
          </div>
        )}

        {/* Shipping Info */}
        {order && (
          <div className="bg-[#14151b] rounded-xl p-6 mb-6 border border-blue-500/20">
            <h3 className="font-bold mb-3 text-white">📦 Доставка СДЭК</h3>
            <p className="text-sm text-gray-400 mb-2">
              Адрес доставки: <span className="text-gray-300">{order.shippingRegion}, {order.shippingCity}, {order.shippingAddress}</span>
            </p>
            <p className="text-sm text-gray-400">
              Мы отправим вам уведомление о трек-номере на <span className="text-gray-300">{order.email}</span>
            </p>
          </div>
        )}

        {/* Telegram Bot - for notifications */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl p-5 mb-4 text-white">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🤖</span>
            <div className="flex-1">
              <h4 className="font-bold text-lg mb-1">Получай уведомления в Telegram!</h4>
              <p className="text-sm opacity-90 mb-3">
                Статус доставки, результаты розыгрыша — всё в боте
              </p>
              <a
                href={botLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-green-600 px-5 py-2.5 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 4.042-1.362 5.362-.168.557-.5.743-.818.761-.694.033-1.221-.458-1.894-.897-1.056-.688-1.653-1.115-2.678-1.787-1.185-.776-.417-1.204.258-1.901.177-.182 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.441-.752-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.121.099.154.232.17.325.016.094.037.308.021.475z"/>
                </svg>
                Подключить бота
              </a>
            </div>
          </div>
        </div>

        {/* Telegram Channel */}
        <div className="bg-gradient-to-r from-[#0088cc] to-[#00a0dc] rounded-xl p-5 mb-6 text-white">
          <div className="flex items-start gap-3">
            <span className="text-3xl">📢</span>
            <div className="flex-1">
              <h4 className="font-bold text-lg mb-1">Подпишись на канал!</h4>
              <p className="text-sm opacity-90 mb-3">
                Там объявим победителя розыгрыша
              </p>
              <a
                href={channelLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-[#0088cc] px-5 py-2.5 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 4.042-1.362 5.362-.168.557-.5.743-.818.761-.694.033-1.221-.458-1.894-.897-1.056-.688-1.653-1.115-2.678-1.787-1.185-.776-.417-1.204.258-1.901.177-.182 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.441-.752-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.121.099.154.232.17.325.016.094.037.308.021.475z"/>
                </svg>
                Подписаться на канал
              </a>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/account/dashboard"
            className="flex-1 bg-[#ff2b2b] text-white text-center px-6 py-3 rounded-xl font-semibold hover:bg-[#ff3f3f] transition-colors"
          >
            Перейти в личный кабинет
          </Link>
          <Link
            href="/catalog"
            className="flex-1 border-2 border-white/20 text-white text-center px-6 py-3 rounded-xl font-semibold hover:bg-white/5 transition-colors"
          >
            Продолжить покупки
          </Link>
        </div>
      </div>
    </div>
  )
}
