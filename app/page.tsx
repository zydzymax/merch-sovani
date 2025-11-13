import Navbar from './_components/Navbar'
import HeroSection from './_components/HeroSection'
import StickerPacks from './_components/StickerPacks'
import GrandPrize from './_components/GrandPrize'
import Countdown from './_components/Countdown'
import Steps from './_components/Steps'
import SocialLive from './_components/SocialLive'
import Partners from './_components/Partners'
import ContactForm from './_components/ContactForm'
import BigFooter from './_components/BigFooter'

export default function Home() {
  return (
    <>
      <Navbar/>
      <HeroSection/>
      <StickerPacks/>
      <GrandPrize/>
      <Countdown target="2026-01-10T18:00:00+03:00"/>
      <Steps/>
      <SocialLive/>
      <Partners/>
      <ContactForm/>
      <BigFooter/>
    </>
  )
}
