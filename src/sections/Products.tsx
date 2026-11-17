import { useLayoutEffect, useRef, useState } from 'react'
import { LIVE, inr, type Product } from '@/data/site'
import { gsap, ScrollTrigger, reduced } from '@/lib/motion'
import { useCart } from '@/store/cart'
import FrameSequence, { SEQ } from '@/components/FrameSequence'
import { buzz, shareProduct } from '@/lib/device'
import { flyToBag } from '@/sections/Shelf'

const TABS = [
  ['why', 'Kyun khaas hai', 'Why it’s special'],
  ['for', 'Kiske liye', 'Who it’s for'],
  ['how', 'Kaise lagayein', 'How to use'],
] as const

function Chapter({ p, i }: { p: Product; i: number }) {
  const [tab, setTab] = useState<(typeof TABS)[number][0]>('why')
  const { add } = useCart()
  const list = tab === 'why' ? p.why : tab === 'for' ? p.forWhom : p.howTo
  return (
    <article className="chapter relative grid items-center gap-4 px-5 py-10 md:min-h-svh md:grid-cols-2 md:gap-8 md:px-10 md:py-24" data-tint={p.tint} id={`product-${p.id}`}>
      <div className="relative flex h-[46svh] items-center justify-center md:sticky md:top-0 md:h-svh">
        <span aria-hidden="true" className="t-deva pointer-events-none absolute select-none whitespace-nowrap text-[30vw] leading-none text-ink/[0.05] md:text-[17vw]">{p.hindi.split(' ')[0]}</span>
        <div className="ch-visual relative h-full w-full">
          <span className="absolute inset-x-[30%] bottom-[5%] h-[5%] rounded-[50%] bg-geru-ink/30 blur-xl" />
          <FrameSequence name={p.id} frames={SEQ[p.id as keyof typeof SEQ]} fallback={p.render} draggable autoplay={0.05} className="absolute inset-0 m-auto h-[90%] w-full" />
          <span className="t-mono absolute right-0 top-[8%] rounded-full border border-ink/20 px-3 py-1 text-[9px] text-ink/60">⟲ Drag to turn</span>
        </div>
        <span className="t-mono absolute bottom-6 left-0 text-[10px] text-ink/50">{String(i + 1).padStart(2, '0')} — {p.kicker}</span>
      </div>
      <div className="ch-copy relative max-w-xl">
        <p className="t-mono text-[11px]" style={{ color: p.accent }}>{p.kicker}</p>
        <h3 className="t-display mt-3 text-[clamp(52px,7vw,112px)] text-ink">{p.name}</h3>
        <p className="t-deva mt-1 text-3xl text-geru">{p.hindi}</p>
        {p.hookHindi && <p className="mt-6 font-hindi text-xl text-ink/80">“{p.hookHindi}”</p>}
        <p className="mt-3 t-accent text-3xl leading-tight text-ink">{p.hook}</p>
        <p className="mt-5 text-[15px] leading-relaxed text-ink/75">{p.story}</p>

        <div className="mt-8 flex flex-wrap gap-2">
          {TABS.map(([id, hi, en]) => (
            <button key={id} onClick={() => setTab(id)} className={`rounded-full border px-4 py-2 text-left text-[13px] transition ${tab === id ? 'border-geru bg-geru text-khadiya' : 'border-ink/20 text-ink hover:border-ink/50'}`}>
              <span className="block leading-none">{hi}</span>
              <span className="mt-1 block text-[10px] leading-none opacity-70">{en}</span>
            </button>
          ))}
        </div>
        <ol key={tab} className="mt-6 space-y-3">
          {list.map((x, k) => (
            <li key={x} className="flex gap-4 border-b border-ink/10 pb-3 text-[15px] text-ink" style={{ animation: `rise .7s ${k * 0.07}s both cubic-bezier(.16,1,.3,1)` }}>
              <span className="font-mono text-xs text-geru">{String(k + 1).padStart(2, '0')}</span>{x}
            </li>
          ))}
        </ol>

        <div className="mt-7 flex flex-wrap gap-2">
          {p.ingredients.map((g) => (
            <span key={g.name} className="rounded-full bg-ink/[0.06] px-3 py-1.5 text-[12px] text-ink">
              {g.name}{g.pct && <b className="ml-1.5 font-mono font-medium text-geru">{g.pct}</b>}{g.note && <span className="ml-1.5 text-ink/50">· {g.note}</span>}
            </span>
          ))}
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <p className="font-display text-5xl text-ink">{p.price ? inr(p.price) : ''}</p>
          <div className="text-[12px] leading-tight text-ink/60">{p.size && <p>{p.size}</p>}<p>Incl. taxes · delivery extra</p></div>
          <button data-cursor="Add" onClick={(e) => { add(p.id); buzz([10, 40, 14]); flyToBag(e.currentTarget.closest('article')?.querySelector('.ch-visual') as HTMLElement, p.render) }} className="ml-auto rounded-full bg-geru px-7 py-4 text-[14px] font-medium text-khadiya transition active:scale-95 md:ml-0 md:hover:bg-geru-hot">
            Add to bag
          </button>
          <button onClick={() => shareProduct(p.name, p.hook)} className="grid size-12 place-items-center rounded-full border border-ink/20 text-ink" aria-label={`Share ${p.name}`} data-cursor="Share">↗</button>
        </div>
        {p.fine && <p className="mt-6 max-w-lg text-[11px] leading-relaxed text-ink/45">{p.fine}</p>}
      </div>
    </article>
  )
}

export default function Products() {
  const root = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const chapters = gsap.utils.toArray<HTMLElement>('.chapter')
      chapters.forEach((ch) => {
        ScrollTrigger.create({
          trigger: ch, start: 'top 55%', end: 'bottom 55%',
          onToggle: (s) => s.isActive && gsap.to(root.current, { backgroundColor: ch.dataset.tint, duration: 1.1, ease: 'power2.out' }),
        })
        if (reduced) return
        gsap.fromTo(ch.querySelector('.ch-visual'), { yPercent: 18, rotate: -6, scale: 0.86 }, { yPercent: -10, rotate: 4, scale: 1, ease: 'none', scrollTrigger: { trigger: ch, start: 'top bottom', end: 'bottom top', scrub: true } })
        gsap.from(ch.querySelectorAll('.ch-copy > *'), { y: 40, opacity: 0, duration: 1, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: ch, start: 'top 65%' } })
      })
    }, root)
    return () => ctx.revert()
  }, [])
  return (
    <section id="products" ref={root} data-nav="dark" className="relative" style={{ backgroundColor: LIVE[0].tint }}>
      <style>{`@keyframes rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}`}</style>
      <div className="px-5 pt-[10vh] md:px-10 md:pt-[16vh]">
        <p className="t-mono text-[11px] text-geru">04 · The Rituals · उत्पाद</p>
        <h2 className="t-display mt-4 max-w-[16ch] text-[clamp(48px,8vw,140px)] text-ink">Four things. Made <em className="text-geru">properly.</em></h2>
      </div>
      {LIVE.map((p, i) => <Chapter key={p.id} p={p} i={i} />)}
    </section>
  )
}
