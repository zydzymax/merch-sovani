'use client'

import { useState, useEffect } from 'react'

export default function SuccessModal({ participatesInPromo }: { participatesInPromo: boolean }) {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Only show modal if user participates in promo
    if (participatesInPromo) {
      // Show modal after a short delay
      const timer = setTimeout(() => {
        setShowModal(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [participatesInPromo])

  if (!showModal || !participatesInPromo) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={() => setShowModal(false)}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'slideIn 0.3s ease-out',
        }}
      >
        {/* Confetti Header */}
        <div className="bg-gradient-to-r from-orange-400 to-pink-500 p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="text-6xl">🎉🎊✨🎁</div>
          </div>
          <div className="relative z-10">
            <div className="text-5xl mb-2">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Поздравляем!
            </h2>
            <p className="text-white text-opacity-90 text-sm">
              Вы участвуете в розыгрыше iPhone!
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-lg font-semibold text-gray-800 mb-2">
              🍀 Желаем вам победы!
            </p>
            <p className="text-gray-600 text-sm">
              Спасибо за покупку! Ваша заявка на участие в розыгрыше принята.
            </p>
          </div>

          {/* Telegram CTA */}
          <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">✈️</span>
              <div className="flex-1">
                <h3 className="font-bold text-base text-gray-800">
                  Подпишитесь на Telegram канал
                </h3>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Там будут приходить все оповещения о розыгрышах, дате проведения и победителях. Не пропустите свой шанс!
            </p>
            <a
              href="https://t.me/+NFNJFoql6xplNzRi"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-blue-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              <span className="inline-flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 4.042-1.362 5.362-.168.557-.5.743-.818.761-.694.033-1.221-.458-1.894-.897-1.056-.688-1.653-1.115-2.678-1.787-1.185-.776-.417-1.204.258-1.901.177-.182 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.441-.752-.244-1.349-.374-1.297-.789.027-.216.324-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.121.099.154.232.17.325.016.094.037.308.021.475z"/>
                </svg>
                Подписаться на канал
              </span>
            </a>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setShowModal(false)}
            className="w-full border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  )
}
