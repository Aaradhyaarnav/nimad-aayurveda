import { useCallback, useEffect, useState } from 'react'
import { CartProvider } from '@/store/cart'
import { ScrollTrigger, startSmoothScroll } from '@/lib/motion'
import Preloader from '@/components/Preloader'
import { Cursor, FilterDefs, Nav } from '@/components/Chrome'
import CartDrawer from '@/components/CartDrawer'
import Hero from '@/sections/Hero'
import { Manifesto, Walk, WalkGallery } from '@/sections/Story'
import Herbs from '@/sections/Herbs'
import Products from '@/sections/Products'
import RitualWheel from '@/sections/RitualWheel'
import Shelf from '@/sections/Shelf'
import { startTilt } from '@/lib/device'
import BagFab from '@/components/BagFab'
import { GheeRitual, OilRitual } from '@/sections/Rituals'
import Prakriti from '@/sections/Prakriti'
import Founder, { Recognition } from '@/sections/Founder'
import Footer from '@/sections/Footer'

export default function App() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    startSmoothScroll()
    startTilt()
    const r = () => ScrollTrigger.refresh()
    document.fonts?.ready.then(r)
    window.addEventListener('load', r)
    return () => window.removeEventListener('load', r)
  }, [])
  const done = useCallback(() => { setReady(true); ScrollTrigger.refresh() }, [])

  return (
    <CartProvider>
      <FilterDefs />
      <Preloader onDone={done} />
      <Nav />
      <main>
        <Hero ready={ready} />
        <RitualWheel />
        <Manifesto />
        <Walk />
        <WalkGallery />
        <Herbs />
        <Products />
        <Shelf />
        <GheeRitual />
        <OilRitual />
        <Prakriti />
        <Founder />
        <Recognition />
      </main>
      <Footer />
      <CartDrawer />
      <BagFab />
      <Cursor />
      <div className="grain" aria-hidden />
    </CartProvider>
  )
}
