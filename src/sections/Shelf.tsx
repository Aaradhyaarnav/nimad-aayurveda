import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import FrameSequence, { SEQ } from '@/components/FrameSequence'
import { BRAND, PRODUCTS, inr, waLink, type Product } from '@/data/site'
import { gsap, reduced } from '@/lib/motion'
import { buzz, isTouch } from '@/lib/device'
import { useCart } from '@/store/cart'

/**
 * "Nimad ka aala" — the arched wall niches of a Nimad home, carved into the red wall.
 * Products sit inside; the active niche lights its diya and the product turns.
 * Add-to-bag flies the product into the bag. Coming-soon niches are closed wooden doors.
 */

/** Fly a product picture from `from` into the bag button along an arc. */
export function flyToBag(from: HTMLElement | null, src?: string) {
  const bag = document.getElementById('bag-btn')
  if (!from || !bag || !src || reduced) return
  const a = from.getBoundingClientRect(), b = bag.getBoundingClientRect()
  const img = document.createElement('img')
  img.src = src
  Object.assign(img.style, { position: 'fixed', left: `${a.left + a.width / 2 - 60}px`, top: `${a.top + a.height / 2 - 75}px`, width: '120px', height: '150px', objectFit: 'contain', zIndex: '99', pointerEvents: 'none', filter: 'drop-shadow(0 18px 24px rgba(0,0,0,.35))' })
  document.body.appendChild(img)
  const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2)
  const p = { t: 0 }
  gsap.to(p, {
    t: 1, duration: 0.95, ease: 'power2.in',
    onUpdate: () => {
      const t = p.t, arc = -Math.sin(t * Math.PI) * 160
      img.style.transform = `translate(${dx * t}px, ${dy * t + arc}px) scale(${1 - t * 0.82}) rotate(${t * 220}deg)`
      img.style.opacity = String(1 - Math.max(0, t - 0.85) * 6)
    },
    onComplete: () => img.remove(),
  })
}

function Arch({ className = '' }: { className?: string }) {
  // mandana-style chalk border around a niche
  return (
    <svg viewBox="0 0 300 420" preserveAspectRatio="none" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden>
      <path className="arch-line" d="M10 418 V150 A140 140 0 0 1 290 150 V418" strokeWidth="2.2" />
      <path className="arch-line" d="M24 418 V154 A126 126 0 0 1 276 154 V418" strokeWidth="1" strokeDasharray="2 7" />
      {Array.from({ length: 9 }).map((_, i) => {
        const a = Math.PI - (i / 8) * Math.PI
        const x = 150 + Math.cos(a) * 154, y = 150 - Math.sin(a) * 154
        return <circle key={i} cx={x} cy={y} r="3.2" fill="currentColor" />
      })}
      <path d="M150 -2 l8 12 l-8 12 l-8 -12z" fill="currentColor" />
    </svg>
  )
}

function Niche({ p, active, onActive }: { p: Product; active: boolean; onActive: () => void }) {
  const soon = p.status === 'soon'
  const visual = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const { add } = useCart()

  return (
    <article
      onPointerEnter={() => !isTouch && onActive()}
      onClick={onActive}
      className={`niche group relative w-[74vw] shrink-0 snap-center sm:w-[300px] md:w-auto ${active ? 'is-active' : ''}`}
      data-id={p.id}
    >
      <div className="relative aspect-[300/420] text-khadiya">
        {/* carved hole */}
        <div className="niche-hole absolute inset-[10px] overflow-hidden" style={{ borderRadius: '50% 50% 4px 4px / 34% 34% 4px 4px', background: 'radial-gradient(120% 80% at 50% 10%, #5a0910 0%, #2a0508 70%)', boxShadow: 'inset 0 24px 40px rgba(0,0,0,.65), inset 0 -10px 30px rgba(0,0,0,.4)' }}>
          {/* diya glow */}
          <div className={`absolute inset-x-0 bottom-0 h-2/3 transition-opacity duration-700 ${active ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'radial-gradient(60% 55% at 50% 100%, rgba(255,170,80,.45), transparent 70%)' }} />
          {/* ledge */}
          <div className="absolute inset-x-0 bottom-0 h-[13%] bg-gradient-to-b from-[#7a2a1c] to-[#4a1208]" />
          {soon ? (
            <div className="absolute inset-0 [perspective:900px]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="t-deva text-4xl">{p.hindi}</p>
                  <a href={waLink(`🙏 Namaste ${BRAND.name}! ${p.id === 'shampoo' ? 'Shampoo' : 'Naya product'} launch hone par mujhe batana.`)} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="mt-3 inline-block rounded-full bg-khadiya px-4 py-2 text-[12px] text-geru">Notify me</a>
                </div>
              </div>
              {/* carved wooden doors */}
              {[0, 1].map((side) => (
                <div
                  key={side}
                  className="absolute inset-y-0 w-1/2 border border-black/30 transition-transform duration-[1200ms] ease-[var(--ease-silk)]"
                  style={{
                    [side ? 'right' : 'left']: 0,
                    transformOrigin: side ? 'right center' : 'left center',
                    transform: open || active ? `rotateY(${side ? 105 : -105}deg)` : 'none',
                    background: 'repeating-linear-gradient(90deg,#6b3a1d 0 6px,#5c3017 6px 12px), #6b3a1d',
                    boxShadow: 'inset 0 0 0 6px rgba(0,0,0,.18)',
                  }}
                  onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); buzz(15) }}
                >
                  <span className="absolute top-1/2 size-3 -translate-y-1/2 rounded-full bg-[#c9a24b] shadow" style={{ [side ? 'left' : 'right']: 8 }} />
                  <span className="t-deva absolute inset-x-0 top-[30%] text-center text-xl text-[#e8c88a]/80">{side ? 'आएगा' : 'जल्द'}</span>
                </div>
              ))}
            </div>
          ) : (
            <div ref={visual} className="niche-product absolute inset-x-[1%] bottom-[8%] top-[9%]">
              <span className="absolute inset-x-[22%] bottom-[1%] h-[6%] rounded-[50%] bg-black/55 blur-md" />
              <FrameSequence name={p.id} frames={SEQ[p.id as keyof typeof SEQ]} fallback={p.render} autoplay={active ? 0.24 : 0.06} draggable className="h-full w-full" />
            </div>
          )}
        </div>
        <Arch className={`transition-colors duration-500 ${active ? 'text-[#ffd9a0]' : 'text-khadiya/70'}`} />
      </div>
      {/* label plate */}
      <div className="mt-4 flex flex-col gap-3 px-2 text-khadiya">
        <div>
          <p className="t-accent text-[24px] leading-none">{p.name}</p>
          <p className="mt-1 text-[12px] text-khadiya/65">{soon ? p.kicker : `${p.size ?? p.kicker}`}</p>
        </div>
        {!soon && (
          <button
            data-cursor="Add"
            onClick={(e) => { e.stopPropagation(); add(p.id); buzz([10, 40, 14]); flyToBag(visual.current, p.render ?? p.photo) }}
            className="flex w-full items-center justify-between gap-2 rounded-full bg-khadiya py-2 pl-4 pr-2 text-geru transition active:scale-95"
          >
            <span className="font-mono text-[13px]">{inr(p.price ?? 0)}</span><span className="ml-auto text-[12px]">Add to bag</span>
            <span className="grid size-7 place-items-center rounded-full bg-geru text-khadiya">+</span>
          </button>
        )}
      </div>
    </article>
  )
}

export default function Shelf() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<string>(PRODUCTS[0].id)

  // reveal: niches carve open, products rise, arches draw
  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 70%' } })
      tl.from('.shelf-title .ch', { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.04 })
        .from('.niche-hole', { clipPath: 'inset(100% 0 0 0)', duration: 1.2, ease: 'expo.inOut', stagger: 0.1 }, 0.1)
        .from('.niche-product', { yPercent: 40, opacity: 0, duration: 1.2, ease: 'back.out(1.6)', stagger: 0.1 }, 0.5)
        .from('.arch-line', { strokeDasharray: 1200, strokeDashoffset: 1200, duration: 1.6, ease: 'power2.out', stagger: 0.03 }, 0.3)
    }, root)
    return () => ctx.revert()
  }, [])

  // phones: the niche in the middle of the swipe track becomes active
  useEffect(() => {
    if (!isTouch || !track.current) return
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { const id = (e.target as HTMLElement).dataset.id!; setActive(id); buzz(6) }
    }), { root: track.current, threshold: 0.75 })
    track.current.querySelectorAll('.niche').forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])

  const title = 'Nimad ka aala'
  return (
    <section ref={root} id="shelf" className="geru-wall relative overflow-hidden py-[9vh] text-khadiya md:py-[14vh]">
      <div className="px-5 md:px-10">
        <p className="t-mono text-[10px] text-khadiya/70 md:text-[11px]">The full shelf · आला</p>
        <h3 className="shelf-title t-display mt-3 overflow-hidden text-[clamp(48px,8vw,140px)] leading-none">
          {title.split('').map((c, i) => <span key={i} className="ch inline-block">{c === ' ' ? ' ' : c}</span>)}
        </h3>
        <p className="mt-4 max-w-md text-[14px] text-khadiya/75 md:text-[15px]">
          Every Nimad home has an aala, a little arched niche in the wall for the things that matter. This is ours.
          {isTouch ? ' Swipe, and drag a product to turn it.' : ' Hover a niche; drag a product to turn it.'}
        </p>
      </div>
      <div ref={track} data-slide="" className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[13vw] pb-4 [scrollbar-width:none] md:grid md:grid-cols-4 md:gap-x-8 md:gap-y-14 md:overflow-visible md:px-10 xl:px-[8vw]">
        {PRODUCTS.map((p) => <Niche key={p.id} p={p} active={active === p.id} onActive={() => setActive(p.id)} />)}
      </div>
    </section>
  )
}
