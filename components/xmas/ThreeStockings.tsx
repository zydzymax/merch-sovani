import Image from 'next/image'

export function ThreeStockings() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="relative">
            <div className="relative h-[400px] md:h-[500px]">
              <Image
                src="/assets/xmas/stockings-prizes.png"
                alt="Три носка с призами: iPhone, Apple Watch, XREAL Air 2 Ultra"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="text-center md:text-left">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#B4002D] mb-6">
              Шансы выбирают призы
            </h2>
            <p className="text-xl text-[#281A12]/80 leading-relaxed mb-4">
              1 покупка = N шансов по правилам акции
            </p>
            <p className="text-lg text-[#281A12]/70 mb-8">
              Чем больше покупок — тем больше шансов выиграть премиальные гаджеты
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📱</span>
                <span className="text-lg font-semibold text-[#281A12]">iPhone 17 Pro</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">⌚</span>
                <span className="text-lg font-semibold text-[#281A12]">Apple Watch Ultra</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">🥽</span>
                <span className="text-lg font-semibold text-[#281A12]">XREAL Air 2 Ultra</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
