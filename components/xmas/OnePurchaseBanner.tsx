'use client'

import { useEffect, useState } from 'react'

export function OnePurchaseBanner() {
  const [daysLeft, setDaysLeft] = useState(71)

  useEffect(() => {
    const endDate = new Date('2025-12-31T23:59:59')
    const updateDays = () => {
      const now = new Date()
      const difference = endDate.getTime() - now.getTime()
      if (difference > 0) {
        setDaysLeft(Math.floor(difference / (1000 * 60 * 60 * 24)))
      }
    }
    updateDays()
    const interval = setInterval(updateDays, 3600000) // Update every hour
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-12 bg-brand-cream">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl border-2 border-brand-gold shadow-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* LEFT: Main message */}
            <div className="text-center md:text-left">
              <h3 className="font-serif text-3xl md:text-4xl font-bold text-brand-red mb-2">
                1 покупка = 1 шанс
              </h3>
              <p className="text-lg text-brand-dark/70">
                Больше покупок — больше шансов
              </p>
            </div>

            {/* RIGHT: Timer */}
            <div className="text-center">
              <p className="text-sm text-brand-dark/60 mb-2 font-medium">
                До конца акции:
              </p>
              <div className="inline-block bg-brand-red text-white px-6 py-3 rounded-full">
                <span className="font-serif text-3xl font-bold">{daysLeft}</span>
                <span className="text-lg ml-2">дней</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
