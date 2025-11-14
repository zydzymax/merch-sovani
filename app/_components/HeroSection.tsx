import Image from 'next/image'

export default function HeroSection(){
  return (
    <section className="relative mx-auto max-w-[1280px] px-4 md:px-10 py-8 md:py-16">
      <div className="relative rounded-[32px] md:rounded-[40px] bg-[#14151b] shadow-[0_20px_60px_rgba(0,0,0,.35)] overflow-hidden">
        <div style={{position:'relative',width:'100%',aspectRatio:'16/9',minHeight:320}}>
          <Image
            src="/images/hero сцена.png"
            alt="Премиальная сцена с брелоком-активатором участия в розыгрыше iPhone"
            width={2560}
            height={1440}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1280px"
            style={{width:'100%',height:'100%',objectFit:'cover'}}
            className="select-none"
          />
        </div>
        <div style={{padding:'32px 24px',textAlign:'center'}} className="md:p-12">
          <h1 className="font-display text-[32px] md:text-[56px]">Купи брелок — выиграй iPhone!</h1>
          <p className="lead mt-3 md:mt-4 text-[16px] md:text-[18px] text-neutral-300">
            Каждый брелок = 1 шанс выиграть iPhone 17 Pro Max. Розыгрыш каждую неделю.
          </p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginTop:24}} className="md:mt-8">
            <a className="btn btn-primary" href="#keychain">Купить брелок</a>
            <a className="btn btn-ghost" href="/promo">Условия акции</a>
          </div>
        </div>
      </div>
    </section>
  )
}
