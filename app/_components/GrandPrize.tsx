import Image from 'next/image'
import Link from 'next/link'

export default function GrandPrize(){
  return (
    <section className="section">
      <div className="container">
        {/* Главный приз */}
        <div className="tile" style={{padding:40,textAlign:'center'}}>
          <div style={{maxWidth:600,margin:'0 auto'}}>
            <h2 className="font-display text-[32px] md:text-[48px] mb-6" style={{color:'var(--accent)'}}>
              Главный приз
            </h2>
            <h3 className="font-display text-[28px] md:text-[36px] mb-8">
              iPhone 17 Pro Max
            </h3>

            <div style={{position:'relative',width:'100%',maxWidth:400,margin:'0 auto 32px'}}>
              <Image
                src="/images/орнаж.png"
                alt="iPhone 17 Pro Max"
                width={400}
                height={400}
                style={{width:'100%',height:'auto',objectFit:'contain'}}
                loading="lazy"
              />
            </div>

            <p className="lead text-lg md:text-xl mb-6" style={{lineHeight:1.6}}>
              Один победитель получит новый iPhone 17 Pro Max
            </p>

            <div style={{background:'var(--surface)',borderRadius:20,padding:24,marginBottom:24,textAlign:'left'}}>
              <h4 className="font-display text-xl mb-4">Условия участия:</h4>
              <ul style={{display:'grid',gap:12,fontSize:'16px',lineHeight:1.6}}>
                <li>✓ Купите брелок в нашем магазине</li>
                <li>✓ Каждый брелок = 1 шанс на выигрыш</li>
                <li>✓ Чем больше брелоков, тем выше шансы</li>
                <li>✓ Победитель определяется случайным образом</li>
              </ul>
            </div>

            <Link href="/catalog" className="btn btn-primary" style={{fontSize:'18px',padding:'18px 36px',display:'inline-block'}}>
              Купить брелок и участвовать
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
