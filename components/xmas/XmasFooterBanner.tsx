import Image from 'next/image'

export function XmasFooterBanner() {
  return (
    <section className="py-10 md:py-16 bg-[#FAF3E7]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.10)]">
          <Image
            src="/assets/xmas/footer_greeting.png"
            alt="Счастливого Нового года и светлого Рождества"
            width={1440}
            height={600}
            className="w-full h-auto block"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1440px) 100vw, 1440px"
          />
        </div>
      </div>
    </section>
  )
}
