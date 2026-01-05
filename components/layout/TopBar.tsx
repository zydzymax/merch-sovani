import Image from 'next/image'

export default function TopBar() {
  return (
    <div className="relative w-full h-16 md:h-20 bg-gradient-to-r from-primary via-accent to-primary overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/ui/top-bar.svg"
          alt="Promotional banner"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>
      {/* Адаптивный текстовый fallback для мобильных */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 text-center">
        <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-semibold drop-shadow-lg">
          <span className="hidden md:inline">✨ Новогодняя акция: 1 покупка = 1 шанс выиграть iPhone 17 Pro! ✨</span>
          <span className="md:hidden">🎁 1 покупка = 1 шанс!</span>
        </p>
      </div>
    </div>
  )
}
