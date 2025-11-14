import Image from 'next/image'

export default function WeeklyGiveaways(){
  return (
    <section className="relative mx-auto max-w-[1280px] px-4 md:px-10 py-8 md:py-16">
      <h2 className="font-display text-[28px] md:text-[40px] mb-8 md:mb-12 text-center">
        Еженедельные розыгрыши — 5 недель
      </h2>
      <div className="rounded-[24px] md:rounded-[28px] theme-card overflow-hidden">
        <Image
          src="/images/сетка 5 плиток.png"
          alt="Таймлайн из пяти недель розыгрышей — визуальные капсулы с силуэтами смартфонов"
          width={1920}
          height={1080}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1280px"
          style={{width:'100%',height:'auto'}}
          className="w-full h-auto select-none"
        />
      </div>
    </section>
  )
}
