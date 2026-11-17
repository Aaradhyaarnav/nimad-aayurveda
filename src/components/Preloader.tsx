import { useEffect, useRef, useState } from 'react'
import { animate, svg, stagger } from 'animejs'
import Mandana from './Mandana'
import { gsap, lockScroll, reduced } from '@/lib/motion'
import { stage } from '@/lib/stage'

/** Red wall → white mandana draws itself → km counter → the wall opens like doors. */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const [km, setKm] = useState(0)

  useEffect(() => {
    lockScroll(true)
    const el = root.current!
    const finish = () => {
      const tl = gsap.timeline({
        onComplete: () => {
          lockScroll(false)
          onDone()
        },
      })
      tl.to(el.querySelector('.pl-center'), { scale: 1.6, opacity: 0, duration: 0.9, ease: 'expo.in' })
        .to(el.querySelectorAll('.pl-door'), { xPercent: (i) => (i === 0 ? -101 : 101), duration: 1.25, ease: 'expo.inOut' }, '-=0.35')
        .to(stage, { intro: 1, duration: 1.6, ease: 'expo.out' }, '-=0.9')
        .set(el, { display: 'none' })
    }
    if (reduced) { stage.intro = 1; finish(); return }

    const paths = svg.createDrawable(el.querySelectorAll('[data-draw]'))
    animate(paths, { draw: ['0 0', '0 1'], duration: 1500, delay: stagger(9), ease: 'inOutQuart' })
    const counter = { v: 0 }
    const a = animate(counter, {
      v: 3500, duration: 2600, ease: 'inOutExpo',
      onUpdate: () => setKm(Math.round(counter.v)),
      onComplete: finish,
    })
    return () => { a.pause() }
  }, [onDone])

  return (
    <div ref={root} className="fixed inset-0 z-[100] text-khadiya" aria-hidden>
      <div className="pl-door geru-wall absolute inset-y-0 left-0 w-1/2" />
      <div className="pl-door geru-wall absolute inset-y-0 right-0 w-1/2" style={{ backgroundPosition: '-50vw 0' }} />
      <div className="pl-center absolute inset-0 flex flex-col items-center justify-center">
        <Mandana size={600} rings={4} className="w-[min(62vmin,520px)] text-khadiya" strokeWidth={1.6} />
        <div className="mt-8 flex items-baseline gap-3">
          <span className="t-mono text-[11px] opacity-70">Maa Narmada Parikrama</span>
          <span className="font-mono text-2xl tabular-nums">{km.toLocaleString('en-IN').padStart(5, '0')}</span>
          <span className="t-mono text-[11px] opacity-70">km</span>
        </div>
      </div>
    </div>
  )
}
