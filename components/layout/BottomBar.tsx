import Image from 'next/image'

export default function BottomBar() {
  return (
    <div className="sticky bottom-0 w-full h-12 md:h-16 bg-gradient-to-r from-primary via-green-700 to-primary overflow-hidden z-40">
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/ui/bottom-bar.svg"
          alt="Promotion info"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>
      {/* Адаптивный текстовый fallback */}
      <div className="relative z-10 flex items-center justify-center h-full px-4 text-center">
        <p className="text-white text-xs sm:text-sm md:text-base font-medium drop-shadow-lg">
          <span className="hidden sm:inline">🎁 Каждая покупка участвует в еженедельных розыгрышах призов 🎄</span>
          <span className="sm:hidden">🎁 Еженедельные розыгрыши!</span>
        </p>
      </div>
    </div>
  )
}
