'use client'
import {useEffect,useState} from 'react'
import Image from 'next/image'

function Capsule({v,label}:{v:number;label:string}){
  return(
    <div style={{textAlign:'center'}}>
      <div className="font-display" style={{fontSize:48,lineHeight:1}}>{String(v).padStart(2,'0')}</div>
      <div style={{opacity:.9,fontSize:14}}>{label}</div>
    </div>
  )
}

export default function Countdown({target}:{target:string}){
  const [t,setT]=useState({d:0,h:0,m:0,s:0})

  useEffect(()=>{
    const end=new Date(target).getTime()
    const id=setInterval(()=>{
      const now=Date.now()
      let diff=Math.max(0,end-now)
      const d=Math.floor(diff/86400000)
      diff-=d*86400000
      const h=Math.floor(diff/3600000)
      diff-=h*3600000
      const m=Math.floor(diff/60000)
      diff-=m*60000
      const s=Math.floor(diff/1000)
      setT({d,h,m,s})
    },1000)
    return()=>clearInterval(id)
  },[target])

  return(
    <section aria-label="Обратный отсчёт" style={{position:'relative',color:'#fff',padding:'56px 0',minHeight:360,overflow:'hidden'}}>
      <Image
        src="/images/Фон для блока-таймера.png"
        alt="Фон таймера обратного отсчёта"
        fill
        sizes="100vw"
        style={{objectFit:'cover',zIndex:0}}
      />
      <div className="container" style={{position:'relative',zIndex:1,textAlign:'center'}}>
        <div className="font-display" style={{fontSize:'32px',marginBottom:24}}>До следующего розыгрыша</div>
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(4,1fr)',
          gap:24,
          maxWidth:760,
          margin:'0 auto'
        }}>
          <Capsule v={t.d} label="Дней"/>
          <Capsule v={t.h} label="Часов"/>
          <Capsule v={t.m} label="Минут"/>
          <Capsule v={t.s} label="Секунд"/>
        </div>
        <a
          className="btn"
          style={{marginTop:28,background:'#fff',color:'#000',fontWeight:700}}
          href="/draws"
        >
          Список участников
        </a>
      </div>
    </section>
  )
}
