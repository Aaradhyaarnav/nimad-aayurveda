import Mandana from '@/components/Mandana'
import { useLayoutEffect, useRef, useState, type TouchEvent } from 'react'
import FrameSequence, { SEQ, type FrameSequenceHandle } from '@/components/FrameSequence'
import { LIVE, byId, inr, type Product } from '@/data/site'
import { gsap, ScrollTrigger, getLenis } from '@/lib/motion'
import { buzz, isTouch, shareProduct } from '@/lib/device'
import { useCart } from '@/store/cart'

/**
 * "Four rituals from Nimad" — a chakra-shaped wheel. Scroll (or swipe / tap / arrows)
 * turns the wheel; the product at 12 o'clock comes alive, rotating on its own axis.
 */
const ITEMS: (Product | 'soon')[] = [...LIVE, 'soon']

export default function RitualWheel() {
  const root = useRef<HTMLElement>(null)
  const wheel = useRef<HTMLDivElement>(null)
  const ring = useRef<SVGGElement>(null)
  const focus = useRef<HTMLDivElement>(null)
  const seqs = useRef<(FrameSequenceHandle | null)[]>([])
  const st = useRef<ScrollTrigger | null>(null)
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)
  const { add, setOpen } = useCart()
  const n = ITEMS.length
  const STEP = isTouch ? 44 : 34 // degrees between products

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.rw-item')
      const pin = root.current!.querySelector<HTMLElement>('.rw-pin')!
      const hub = root.current!.querySelector<HTMLElement>('.rw-hub')!
      let pos = 0, W = 0, H = 0, R = 0, cx = 0, cy = 0, base = 0, desk = false
      const measure = () => {
        W = pin.clientWidth; H = pin.clientHeight; desk = W >= 900 && W > H
        if (desk) { R = Math.min(Math.max(H * 0.66, W * 0.38), 700); cx = W * 0.66 + R; cy = H * 0.52; base = 180 }
        else { R = Math.min(W * 1.05, H * 0.6); cx = W / 2; cy = H * 0.64 + R; base = -90 }
        hub.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
        hub.style.setProperty('--r', `${R}px`)
        pin.style.setProperty('--gx', desk ? '66%' : '50%')
        pin.style.setProperty('--gy', desk ? '52%' : '64%')
        const ih = desk ? Math.min(H * 0.46, 400) : Math.min(H * 0.42, 360)
        items.forEach((el) => { el.style.height = `${ih}px`; el.style.width = `${ih * 0.8}px`; el.style.marginLeft = `${-ih * 0.4}px`; el.style.marginTop = `${-ih / 2}px` })
        layout()
      }
      const layout = () => {
        const rot = -pos * STEP
        if (ring.current) ring.current.style.transform = `rotate(${rot}deg)`
        if (focus.current) focus.current.style.transform = `translate(-50%, -50%) rotate(${-rot * 1.5}deg)`
        if (wheel.current) wheel.current.style.transform = `rotate(${rot}deg)`
        items.forEach((el, i) => {
          const th = ((base + (i - pos) * STEP) * Math.PI) / 180
          const d = Math.abs(i - pos), k = Math.max(0, 1 - d)
          el.style.transform = `translate3d(${cx + Math.cos(th) * R}px, ${cy + Math.sin(th) * R}px, 0) scale(${0.46 + 0.54 * k})`
          el.style.opacity = String(0.3 + 0.7 * k)
          el.style.zIndex = String(Math.round(k * 10))
          seqs.current[i]?.setProgress(pos * 0.5 + i * 0.25)
        })
        const a = Math.round(pos)
        if (a !== activeRef.current) { activeRef.current = a; setActive(a); buzz(10) }
      }
      measure()
      const ro = new ResizeObserver(measure); ro.observe(pin)
      st.current = ScrollTrigger.create({
        trigger: root.current, start: 'top top', end: isTouch ? '+=230%' : '+=300%', pin: '.rw-pin', scrub: 0.6,
        snap: { snapTo: 1 / (n - 1), duration: { min: 0.25, max: 0.6 }, ease: 'power2.inOut', delay: 0.05 },
        onUpdate: (s) => { pos = s.progress * (n - 1); layout() },
      })
      return () => ro.disconnect()
    }, root)
    return () => ctx.revert()
  }, [n, STEP])

  const goTo = (i: number) => {
    const s = st.current
    if (!s) return
    const y = s.start + (i / (n - 1)) * (s.end - s.start)
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(y, { duration: 1.1 })
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }

  // swipe left/right on phones turns the wheel
  const touch = useRef<{ x: number; y: number } | null>(null)
  const onTouchStart = (e: TouchEvent) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY } }
  const onTouchEnd = (e: TouchEvent) => {
    if (!touch.current) return
    const dx = e.changedTouches[0].clientX - touch.current.x, dy = e.changedTouches[0].clientY - touch.current.y
    touch.current = null
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) goTo(Math.max(0, Math.min(n - 1, activeRef.current + (dx < 0 ? 1 : -1))))
  }

  const cur = ITEMS[active]
  const p = cur === 'soon' ? byId('shampoo') : cur

  return (
    <section ref={root} id="rituals" className="relative text-khadiya">
      <div className="rw-pin relative h-svh overflow-hidden bg-geru-deep" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="geru-wall absolute inset-0 opacity-70 mix-blend-multiply" />
        <div className="absolute inset-0 transition-[background] duration-1000" style={{ background: `radial-gradient(55% 55% at var(--gx, 50%) var(--gy, 78%), ${p.accent}55, transparent 70%)` }} />

        {/* detailed chakra at the active spot — behind every product as it arrives */}
        <div ref={focus} className="pointer-events-none absolute aspect-square w-[min(118vw,96svh)] text-[#ffd39a]/[0.24] [@media(min-aspect-ratio:5/4)]:w-[min(64vw,104svh)]" style={{ left: 'var(--gx, 50%)', top: 'var(--gy, 64%)', transform: 'translate(-50%, -50%)', willChange: 'transform' }}>
          <Mandana size={800} rings={8} seed={7} strokeWidth={0.8} className="h-full w-full" />
        </div>
        <div className="pointer-events-none absolute aspect-square w-[min(70vw,56svh)] rounded-full border border-[#ffd39a]/15" style={{ left: 'var(--gx, 50%)', top: 'var(--gy, 64%)', transform: 'translate(-50%, -50%)', boxShadow: 'inset 0 0 80px rgba(255,170,100,.12)' }} />

        {/* info */}
        <div className="relative z-20 mx-auto flex max-w-3xl flex-col items-center px-5 pt-[12svh] text-center min-[900px]:mx-0 min-[900px]:h-full min-[900px]:max-w-[44vw] min-[900px]:items-start min-[900px]:justify-center min-[900px]:pl-[6vw] min-[900px]:pt-0 min-[900px]:text-left">
          <p className="t-mono text-[10px] text-khadiya/70 md:text-[11px]">The collection · चार अनुष्ठान · {String(active + 1).padStart(2, '0')}/{String(n).padStart(2, '0')}</p>
          <div key={p.id} className="rw-info">
            <p className="t-deva mt-3 text-[clamp(54px,9vw,132px)] leading-[1.05]" style={{ animation: 'rwIn .9s cubic-bezier(.16,1,.3,1) both' }}>{p.hindi.split(' ')[0]}</p>
            <p className="t-display mt-1 text-[clamp(26px,3.4vw,52px)]" style={{ animation: 'rwIn .9s .06s cubic-bezier(.16,1,.3,1) both' }}>{p.name}</p>
            <p className="mx-auto mt-3 max-w-md min-[900px]:mx-0 text-[14px] text-khadiya/80 md:text-[15px]" style={{ animation: 'rwIn .9s .12s cubic-bezier(.16,1,.3,1) both' }}>{p.hook}</p>
            <div className="mt-5 flex items-center justify-center gap-2 min-[900px]:justify-start" style={{ animation: 'rwIn .9s .18s cubic-bezier(.16,1,.3,1) both' }}>
              {cur === 'soon' ? (
                <span className="rounded-full border border-khadiya/40 px-5 py-3 text-[13px]">Coming soon · जल्द</span>
              ) : (
                <>
                  <button data-cursor="Add" onClick={() => { add(p.id); buzz(12); setOpen(true) }} className="rounded-full bg-khadiya px-6 py-3 text-[14px] font-medium text-geru active:scale-95">
                    Add · {inr(p.price ?? 0)}
                  </button>
                  <button onClick={() => document.getElementById(`product-${p.id}`)?.scrollIntoView({ behavior: 'smooth' })} className="rounded-full border border-khadiya/40 px-5 py-3 text-[13px]">Details</button>
                  {isTouch && <button onClick={() => shareProduct(p.name, p.hook)} className="grid size-11 place-items-center rounded-full border border-khadiya/40" aria-label="Share">↗</button>}
                </>
              )}
            </div>
          </div>
        </div>

        {/* the wheel (a chakra): ring + spokes rotate around the hub; products ride the rim */}
        <div className="rw-hub pointer-events-none absolute left-0 top-0 size-0 [--r:400px]">
          <svg viewBox="-500 -500 1000 1000" className="absolute left-1/2 top-1/2 h-[calc(var(--r)*2.36)] w-[calc(var(--r)*2.36)] -translate-x-1/2 -translate-y-1/2 text-khadiya" aria-hidden>
            <defs><path id="rw-arc" d="M -455 0 a 455 455 0 1 1 910 0 a 455 455 0 1 1 -910 0" /></defs>
            <g ref={ring} style={{ transformOrigin: 'center', willChange: 'transform' }}>
              <circle r="470" fill="none" stroke="currentColor" strokeOpacity=".2" strokeWidth="1" />
              <circle r="424" fill="none" stroke="currentColor" strokeOpacity=".7" strokeWidth="2" />
              {Array.from({ length: 72 }).map((_, i) => (
                <line key={i} x1="0" y1={-424} x2="0" y2={i % 6 ? -432 : -446} stroke="currentColor" strokeOpacity=".55" strokeWidth={i % 6 ? 1 : 2} transform={`rotate(${i * 5})`} />
              ))}
              <text fontFamily="JetBrains Mono, monospace" fontSize="15" letterSpacing="6" fill="currentColor" fillOpacity=".65">
                <textPath href="#rw-arc">{'FOUR RITUALS FROM NIMAD · प्रकृति शरणम् गच्छामि · HANDMADE IN BAKANER · नर्मदे हर · '.repeat(2)}</textPath>
              </text>
            </g>
          </svg>
          <div ref={wheel} className="absolute left-0 top-0 size-0" style={{ willChange: 'transform' }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="absolute left-0 top-0 h-px w-[calc(var(--r)*0.82)] origin-left bg-gradient-to-r from-khadiya/0 via-khadiya/25 to-khadiya/0" style={{ transform: `rotate(${i * 30}deg)` }} />
            ))}
            <span className="absolute left-0 top-0 size-[calc(var(--r)*0.3)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-khadiya/40" />
            <span className="absolute left-0 top-0 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-khadiya" />
          </div>
        </div>
        {ITEMS.map((it, i) => (
          <button
            key={it === 'soon' ? 'soon' : it.id}
            onClick={() => goTo(i)}
            className="rw-item absolute left-0 top-0 z-10 origin-center"
            style={{ willChange: 'transform, opacity' }}
            aria-label={it === 'soon' ? 'Herbal Shampoo, coming soon' : `Show ${it.name}`}
            data-cursor="Turn"
          >
            {it === 'soon' ? (
              <div className="flex h-full w-full flex-col items-center justify-center">
                <svg viewBox="0 0 120 220" className="h-[78%] text-khadiya/60" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 7"><rect x="28" y="60" width="64" height="150" rx="18" /><rect x="44" y="22" width="32" height="38" rx="6" /></svg>
                <span className="t-deva -mt-[45%] text-3xl">जल्द</span>
              </div>
            ) : (
              <>
                <span className="absolute inset-x-[18%] bottom-[3%] h-[7%] rounded-[50%] bg-black/45 blur-lg" />
                <FrameSequence ref={(h) => { seqs.current[i] = h }} name={it.id} frames={SEQ[it.id as keyof typeof SEQ]} fallback={it.render} autoplay={0.07} className="h-full w-full" />
              </>
            )}
          </button>
        ))}

        {/* controls */}
        <div className="absolute inset-x-0 bottom-5 z-20 flex items-center justify-center gap-3 min-[900px]:inset-x-auto min-[900px]:left-[6vw] min-[900px]:bottom-10">
          <button onClick={() => goTo(Math.max(0, active - 1))} className="grid size-11 place-items-center rounded-full border border-khadiya/40 active:scale-90" aria-label="Previous ritual">←</button>
          <div className="flex gap-1.5">{ITEMS.map((_, i) => <span key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? 'w-6 bg-khadiya' : 'w-1.5 bg-khadiya/40'}`} />)}</div>
          <button onClick={() => goTo(Math.min(n - 1, active + 1))} className="grid size-11 place-items-center rounded-full bg-khadiya text-geru active:scale-90" aria-label="Next ritual">→</button>
        </div>
        <p className="t-mono absolute bottom-20 left-1/2 -translate-x-1/2 text-[9px] text-khadiya/50 md:hidden">Swipe to turn the wheel</p>
        <style>{`@keyframes rwIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}`}</style>
      </div>
    </section>
  )
}
