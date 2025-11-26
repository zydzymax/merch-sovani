import Image from 'next/image'

export default function WeeklyGiveaways(){
  return (
    <section className="relative mx-auto max-w-[1280px] px-4 md:px-10 py-8 md:py-16">
      <h2 className="font-display text-[28px] md:text-[40px] mb-8 md:mb-12 text-center">
        Главный приз — iPhone 17 Pro Max
      </h2>
      <div className="rounded-[24px] md:rounded-[28px] theme-card overflow-hidden" style={{padding:40,textAlign:'center'}}>
        <Image
          src="/images/орнаж.png"
          alt="Главный приз iPhone 17 Pro Max"
          width={400}
          height={400}
          sizes="(max-width: 768px) 100vw, 400px"
          style={{width:'100%',maxWidth:400,height:'auto',margin:'0 auto'}}
          className="w-full h-auto select-none"
        />
        <h3 className="font-display text-[24px] md:text-[32px] mt-6" style={{color:'var(--accent)'}}>
          iPhone 17 Pro Max
        </h3>
        <p className="lead text-lg mt-4">
          Один победитель получит новейший смартфон Apple
        </p>
      </div>
    </section>
  )
}
