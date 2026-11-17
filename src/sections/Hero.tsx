import { useEffect, useLayoutEffect, useRef } from 'react'
import Mandana from '@/components/Mandana'
import FrameSequence, { SEQ, type FrameSequenceHandle } from '@/components/FrameSequence'
import { byId, inr } from '@/data/site'
import { gsap, reduced } from '@/lib/motion'
import { buzz, useTiltParallax } from '@/lib/device'
import { smoothstep } from '@/lib/stage'
import { useCart } from '@/store/cart'

/**
 * Hero — one idea, four beats, pinned while you scroll.
 * Three layouts by screen SHAPE (not just width):
 *   wide   ≥ 8:5   laptops/desktops — jar fills the height, words in the corners, beats on the left
 *   medium 5:4–8:5 small laptops, landscape tablets — same, with the CTA centred under the jar
 *   tall   < 5:4   phones, portrait tablets — two-line title, jar centre, beats & CTA at the bottom
 * The opening frames keep ~36% transparent headroom above the jar for the lid, so the canvas is
 * sized from the jar BODY (64% of the frame) and the empty headroom simply rises behind the title.
 */
const BODY = 0.64

const BEATS = [
  { hi: 'शत-धौत', en: 'Washed one hundred times in cold water, by hand.' },
  { hi: 'आवर्तन', en: 'Slow rotations, with mantra, until it turns to silk.' },
]

const CSS = `
.hero-pin{--nav:64px;--jt:23svh;--jb:3svh}
@media (max-aspect-ratio:8/5){.hero-pin{--jb:15svh}}
@media (max-aspect-ratio:5/4){.hero-pin{--jt:27svh;--jb:16svh}}
.h-jarwrap{position:absolute;left:0;right:0;bottom:var(--jb);display:flex;justify-content:center;z-index:2;pointer-events:none}
.h-jar{height:min(calc((100svh - var(--nav) - var(--jt) - var(--jb)) / ${BODY}), 150vw);aspect-ratio:788/937;transform-origin:50% 100%}
.h-title-size{font-size:min(6vw,9.6svh)}
@media (max-aspect-ratio:5/4){.h-title-size{font-size:min(11.5vw,8.4svh)}}
`

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const seq = useRef<FrameSequenceHandle>(null)
  const nums = useRef<(HTMLSpanElement | null)[]>([])
  const jarTilt = useTiltParallax<HTMLDivElement>(8)
  const { add, setOpen } = useCart()
  const jar = byId('shatghritam')

  useLayoutEffect(() => {
    const el = root.current!
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add({ wide: '(min-aspect-ratio: 8/5)', medium: '(min-aspect-ratio: 5/4) and (max-aspect-ratio: 8/5)', tall: '(max-aspect-ratio: 5/4)' }, (c) => {
        const { wide, medium } = c.conditions as { wide: boolean; medium: boolean; tall: boolean }
        const side = wide || medium
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: el, start: 'top top', end: '+=240%', pin: '.hero-pin', scrub: 0.8,
            onUpdate: (s) => {
              const p = s.progress
              seq.current?.setProgress(smoothstep(0.12, 0.34, p) * (1 - smoothstep(0.7, 0.9, p)))
              const a = smoothstep(0.2, 0.36, p), b = smoothstep(0.46, 0.62, p)
              if (nums.current[0]) nums.current[0].innerHTML = `${Math.round(a * 100)}<span style="font-family:'Inter Tight';font-weight:300;font-size:.62em;margin-left:.04em">×</span>`
              if (nums.current[1]) nums.current[1].textContent = Math.round(b * 10000).toLocaleString('en-IN')
            },
          },
        })
        tl.to('.h-title', { yPercent: -30, opacity: 0, duration: 0.12 }, 0.05)
          .to('.h-foot', { y: 30, opacity: 0, duration: 0.1 }, 0.05)
          .to('.h-jar', side ? { xPercent: wide ? 30 : 26, scale: 0.8, duration: 0.14 } : { yPercent: -30, scale: 0.62, duration: 0.14 }, 0.08)
          .fromTo('.h-beat-0', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.08 }, 0.16)
          .to('.h-beat-0', { opacity: 0, y: -40, duration: 0.08 }, 0.4)
          .fromTo('.h-beat-1', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.08 }, 0.44)
          .to('.h-beat-1', { opacity: 0, y: -40, duration: 0.08 }, 0.66)
          .to('.h-jar', { xPercent: 0, yPercent: side ? -10 : -12, scale: side ? 0.84 : 0.82, duration: 0.16 }, 0.68)
          .fromTo('.h-end', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.1 }, 0.82)
          .to('.h-halo', { rotate: 90, duration: 1 }, 0)
          .to('.h-progress', { scaleX: 1, duration: 1 }, 0)
      })
    }, el)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!ready || reduced) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.fromTo('.h-title-line', { yPercent: 105 }, { yPercent: 0, duration: 1.6, ease: 'expo.out', stagger: 0.1 })
        .fromTo('.h-jar-in', { y: 70, opacity: 0, scale: 0.94 }, { y: 0, opacity: 1, scale: 1, duration: 1.7, ease: 'expo.out' }, 0.25)
        .fromTo('.h-halo-in', { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 2, ease: 'expo.out' }, 0.2)
        .fromTo('.h-foot > *', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.08 }, 0.8)
    }, root)
    return () => ctx.revert()
  }, [ready])

  const addJar = () => { add(jar.id); buzz(12); setOpen(true) }

  return (
    <section id="top" ref={root} className="relative text-khadiya">
      <style>{CSS}</style>
      <div className="hero-pin relative h-svh w-full overflow-hidden bg-[#7c0a14]">
        {/* colour grade */}
        <div className="geru-wall absolute inset-0 opacity-90" />
        <div className="pointer-events-none absolute left-1/2 top-[60%] aspect-square w-[min(130vw,160svh)] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(255,150,90,.40), rgba(215,25,42,.16) 48%, transparent 72%)' }} />
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(130% 95% at 50% 50%, transparent 45%, rgba(26,2,6,.74) 100%)' }} />
        <div className="h-halo pointer-events-none absolute left-1/2 top-[58%] aspect-square w-[min(118vw,118svh)] -translate-x-1/2 -translate-y-1/2 text-[#ffd39a]/[0.15]">
          <div className="h-halo-in h-full w-full"><Mandana size={800} rings={7} seed={4} strokeWidth={0.9} className="h-full w-full" /></div>
        </div>

        {/* title */}
        <h1 className="h-title absolute inset-x-0 top-[calc(var(--nav)+2svh)] z-[1] px-4 text-center" aria-label="Prakriti sharanam gacchami — I take refuge in Nature">
          <span className="t-mono mb-[0.8svh] block text-[clamp(9px,1.4svh,11px)] text-khadiya/60">Est. Bakaner · Nimad · Madhya Pradesh</span>
          <span className="block overflow-hidden pb-[0.12em]">
            <span className="h-title-line h-title-size t-deva block leading-[1.22]" style={{ background: 'linear-gradient(180deg,#fff7ea 35%,#f3c98b 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              प्रकृति शरणम् <br className="[@media(min-aspect-ratio:5/4)]:hidden" />गच्छामि
            </span>
          </span>
        </h1>

        {/* jar — sized from its body so it truly fills the screen */}
        <div className="h-jarwrap">
          <div ref={jarTilt}>
            <div className="h-jar relative">
              <div className="h-jar-in relative h-full w-full">
                <div className="absolute inset-x-[18%] bottom-[1.5%] h-[5%] rounded-[50%] bg-black/55 blur-2xl" />
                <FrameSequence ref={seq} name="shatghritam-open" frames={SEQ['shatghritam-open']} loop={false} priority fallback="/img/renders/shatghritam.webp" className="h-full w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* beats: left column on wide/medium, bottom band on tall */}
        {BEATS.map((b, i) => (
          <div key={b.hi} className={`h-beat-${i} pointer-events-none absolute inset-x-0 bottom-[max(4svh,20px)] z-[3] px-6 text-center opacity-0 [@media(min-aspect-ratio:5/4)]:bottom-auto [@media(min-aspect-ratio:5/4)]:left-[7vw] [@media(min-aspect-ratio:5/4)]:right-auto [@media(min-aspect-ratio:5/4)]:top-1/2 [@media(min-aspect-ratio:5/4)]:w-[38vw] [@media(min-aspect-ratio:5/4)]:-translate-y-1/2 [@media(min-aspect-ratio:5/4)]:px-0 [@media(min-aspect-ratio:5/4)]:text-left`}>
            <p className="t-deva mb-[1svh] text-[min(7vw,6svh)] leading-[1.35] text-[#ffd39a]">{b.hi}</p>
            <span ref={(n) => { nums.current[i] = n }} className="block font-display text-[min(18vw,15svh)] font-semibold leading-[0.95] tabular-nums tracking-[-0.04em]">0</span>
            <p className="mx-auto mt-[1.4svh] max-w-[30ch] text-[clamp(13px,2svh,17px)] leading-snug text-khadiya/80 [@media(min-aspect-ratio:5/4)]:mx-0">{b.en}</p>
          </div>
        ))}

        {/* final beat */}
        <div className="h-end absolute inset-x-0 bottom-[max(4svh,22px)] z-[3] flex flex-col items-center gap-[1.4svh] px-5 text-center opacity-0">
          <p className="t-display text-[min(7vw,5.4svh)] leading-[1.05]">Light. Silky. <em className="text-[#ffd39a]">Sacred.</em></p>
          <button data-cursor="Add" onClick={addJar} className="rounded-full bg-khadiya px-7 py-[min(1.8svh,14px)] text-[14px] font-medium text-geru shadow-[0_10px_30px_-10px_rgba(0,0,0,.6)] transition hover:bg-white active:scale-95">
            Add Shatghritam · {inr(jar.price!)}
          </button>
        </div>

        {/* opening footer: corners on wide, centred pill on medium/tall */}
        <div className="h-foot absolute inset-x-0 bottom-0 z-[3] flex items-end justify-center gap-4 px-5 pb-[max(3.2svh,18px)] md:px-10 [@media(min-aspect-ratio:8/5)]:justify-between">
          <p className="t-display hidden max-w-[15ch] text-[clamp(22px,min(2.4vw,4.4svh),42px)] leading-[1.05] [@media(min-aspect-ratio:8/5)]:block">
            Skip the chemicals. Choose the <em className="text-[#ffd39a]">Sacred.</em>
          </p>
          <button data-cursor="Add" onClick={addJar} className="group flex w-full max-w-sm items-center justify-between gap-4 rounded-full border border-khadiya/25 bg-black/20 py-2 pl-5 pr-2 text-left backdrop-blur-sm transition hover:border-khadiya/60 [@media(min-aspect-ratio:5/4)]:w-auto">
            <span className="leading-tight">
              <span className="t-accent block text-[17px]">Shatghritam</span>
              <span className="t-mono text-[9.5px] text-khadiya/70">Shat Dhauta Ghrita · {inr(jar.price!)}</span>
            </span>
            <span className="grid size-10 place-items-center rounded-full bg-khadiya text-lg text-geru transition group-hover:rotate-90">+</span>
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-[4] h-[2px] bg-khadiya/10"><div className="h-progress h-full origin-left scale-x-0 bg-[#ffd39a]" /></div>
      </div>
    </section>
  )
}
