import Image from 'next/image'

export default function GrandPrize(){
  return (
    <section className="section">
      <div className="container">
        <div className="tile" style={{padding:0,overflow:'hidden'}}>
          <Image
            src="/images/Большой блок «Главные призы».png"
            alt="Главные призы: 5 iPhone 17 Pro Max еженедельно"
            width={1200}
            height={600}
            sizes="(max-width:768px) 100vw, 1200px"
            style={{width:'100%',height:'auto',borderRadius:28}}
          />
        </div>
      </div>
    </section>
  )
}
