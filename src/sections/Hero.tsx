import { useEffect, useLayoutEffect, useRef } from 'react'
import Mandana from '@/components/Mandana'
import FrameSequence, { SEQ, type FrameSequenceHandle } from '@/components/FrameSequence'
import { byId, inr } from '@/data/site'
import { gsap, reduced } from '@/lib/motion'
import { buzz, useTiltParallax } from '@/lib/device'
import { smoothstep } from '@/lib/stage'
import { useCart } from '@/store/cart'

/**
 * Hero — one idea, told in four beats while the page is pinned.
 *   0  Title:  प्रकृति शरणम् गच्छामि, the jar in front of it.
 *   1  "100×"  washed in cold water      (jar slides aside, lid lifts)
 *   2  "10,000" rotations, with mantra    (counter runs)
 *   3  Lid closes. "Choose the Sacred."   (jar returns to centre, CTA)
 * Every size is expressed in min(vw, svh) so it composes on any screen:
 * short laptop windows, ultrawide, tablets and phones.
 */
const BEATS = [
  { n: '100×', hi: 'शत-धौत', en: 'Washed one hundred times in cold water, by hand.' },
  { n: '10,000', hi: 'आवर्तन', en: 'Slow rotations, with mantra, until it turns to silk.' },
]

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const seq = useRef<FrameSequenceHandle>(null)
  const nums = useRef<(HTMLSpanElement | null)[]>([])
  const jarTilt = useTiltParallax<HTMLDivElement>(10)
  const { add, setOpen } = useCart()
  const jar = byId('shatghritam')

  useLayoutEffect(() => {
    const el = root.current!
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add({ wide: '(min-aspect-ratio: 5/4)', tall: '(max-aspect-ratio: 5/4)' }, (c) => {
        const wide = c.conditions!.wide
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: el, start: 'top top', end: '+=240%', pin: '.hero-pin', scrub: 0.8,
            onUpdate: (s) => {
              const p = s.progress
              seq.current?.setProgress(smoothstep(0.12, 0.34, p) * (1 - smoothstep(0.7, 0.9, p)))
              const a = smoothstep(0.2, 0.36, p), b = smoothstep(0.46, 0.62, p)
              if (nums.current[0]) nums.current[0].innerHTML = `${Math.round(a * 100)}<span style="font-family:'Inter Tight';font-weight:300;font-size:.7em;margin-left:.04em">×</span>`
              if (nums.current[1]) nums.current[1].textContent = Math.round(b * 10000).toLocaleString('en-IN')
            },
          },
        })
        // beat 0 → 1: title lifts away, jar slides aside (or up on tall screens)
        tl.to('.h-title', { yPercent: -30, opacity: 0, duration: 0.14 }, 0.06)
          .to('.h-foot', { y: 30, opacity: 0, duration: 0.1 }, 0.06)
          .to('.h-jar', wide ? { xPercent: 52, scale: 1.08, duration: 0.14 } : { yPercent: 16, scale: 0.92, duration: 0.14 }, 0.08)
          .fromTo('.h-beat-0', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.08 }, 0.16)
          .to('.h-beat-0', { opacity: 0, y: -40, duration: 0.08 }, 0.4)
          .fromTo('.h-beat-1', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.08 }, 0.44)
          .to('.h-beat-1', { opacity: 0, y: -40, duration: 0.08 }, 0.66)
          // beat 3: jar returns to centre, lid closes, final line + CTA
          .to('.h-jar', { xPercent: 0, yPercent: 0, scale: 1, duration: 0.16 }, 0.66)
          .fromTo('.h-end', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.1 }, 0.8)
          .to('.h-halo', { rotate: 90, duration: 1 }, 0)
          .to('.h-glow', { opacity: 1.0, scale: 1.15, duration: 0.3 }, 0.1)
          .to('.h-glow', { opacity: 0.7, scale: 1, duration: 0.3 }, 0.7)
          .to('.h-progress', { scaleX: 1, duration: 1 }, 0)
      })
    }, el)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!ready || reduced) return
    // explicit start AND end values, reverted on cleanup: safe under StrictMode double-effects
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
      <div className="hero-pin relative h-svh w-full overflow-hidden bg-[#7c0a14]">
        {/* colour grade: deep wall, warm ember light behind the jar, dark vignette */}
        <div className="geru-wall absolute inset-0 opacity-90" />
        <div className="h-glow pointer-events-none absolute left-1/2 top-[54%] aspect-square w-[min(120vw,150svh)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70" style={{ background: 'radial-gradient(closest-side, rgba(255,150,90,.42), rgba(215,25,42,.18) 45%, transparent 70%)' }} />
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(130% 95% at 50% 45%, transparent 45%, rgba(26,2,6,.72) 100%)' }} />
        <div className="h-halo pointer-events-none absolute left-1/2 top-[54%] aspect-square w-[min(92vw,96svh)] -translate-x-1/2 -translate-y-1/2 text-[#ffd39a]/[0.13]">
          <div className="h-halo-in h-full w-full"><Mandana size={700} rings={5} seed={4} strokeWidth={1} className="h-full w-full" /></div>
        </div>

        {/* title — one centred line on wide screens, two lines on tall ones */}
        <h1 className="h-title absolute inset-x-0 top-[calc(76px+3svh)] z-[1] px-4 text-center" aria-label="Prakriti sharanam gacchami — I take refuge in Nature">
          <span className="t-mono mb-[1.2svh] block text-[clamp(9px,1.4svh,11px)] text-khadiya/60">Est. Bakaner · Nimad · Madhya Pradesh</span>
          <span className="block overflow-hidden pb-[0.15em]">
            <span className="h-title-line t-deva block text-[min(12.5vw,9.5svh)] leading-[1.22] [@media(min-aspect-ratio:5/4)]:text-[min(8.4vw,12.5svh)]" style={{ background: 'linear-gradient(180deg,#fff7ea 35%,#f3c98b 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              प्रकृति शरणम् <br className="[@media(min-aspect-ratio:5/4)]:hidden" />गच्छामि
            </span>
          </span>
        </h1>

        {/* jar */}
        <div ref={jarTilt} className="absolute inset-x-0 bottom-[max(14svh,92px)] top-[calc(76px+29svh)] z-[2] flex items-end justify-center [@media(min-aspect-ratio:5/4)]:top-[calc(76px+22svh)] [@media(min-aspect-ratio:5/4)]:bottom-[max(11svh,70px)]">
          <div className="h-jar relative h-full max-h-[min(100%,110vw)] aspect-[788/937] origin-bottom">
            <div className="h-jar-in relative h-full w-full">
              <div className="absolute inset-x-[12%] bottom-[2%] h-[7%] rounded-[50%] bg-black/55 blur-2xl" />
              <FrameSequence ref={seq} name="shatghritam-open" frames={SEQ['shatghritam-open']} loop={false} priority fallback="/img/renders/shatghritam.webp" className="h-full w-full" />
            </div>
          </div>
        </div>

        {/* beats 1 & 2: one large number at a time */}
        {BEATS.map((b, i) => (
          <div key={b.n} className={`h-beat-${i} pointer-events-none absolute inset-x-0 top-[calc(76px+2svh)] z-[3] px-6 text-center opacity-0 [@media(min-aspect-ratio:5/4)]:inset-x-auto [@media(min-aspect-ratio:5/4)]:left-[7vw] [@media(min-aspect-ratio:5/4)]:top-1/2 [@media(min-aspect-ratio:5/4)]:w-[40vw] [@media(min-aspect-ratio:5/4)]:-translate-y-1/2 [@media(min-aspect-ratio:5/4)]:px-0 [@media(min-aspect-ratio:5/4)]:text-left`}>
            <p className="t-deva mb-[1.2svh] text-[min(7vw,6.5svh)] leading-[1.35] text-[#ffd39a]">{b.hi}</p>
            <span ref={(n) => { nums.current[i] = n }} className="block font-display text-[min(19vw,16svh)] font-semibold leading-[0.95] tabular-nums tracking-[-0.04em]">{i ? '0' : '0'}</span>
            <p className="mx-auto mt-[1.5svh] max-w-[30ch] text-[clamp(13px,2svh,17px)] leading-snug text-khadiya/80 [@media(min-aspect-ratio:5/4)]:mx-0">{b.en}</p>
          </div>
        ))}

        {/* final beat: CTA */}
        <div className="h-end absolute inset-x-0 bottom-[max(4svh,22px)] z-[3] flex flex-col items-center gap-[1.6svh] px-5 text-center opacity-0">
          <p className="t-display text-[min(7.4vw,5.6svh)] leading-[1.05]">Light. Silky. <em className="text-[#ffd39a]">Sacred.</em></p>
          <button data-cursor="Add" onClick={addJar} className="pointer-events-auto rounded-full bg-khadiya px-7 py-[min(1.8svh,14px)] text-[14px] font-medium text-geru shadow-[0_10px_30px_-10px_rgba(0,0,0,.6)] transition hover:bg-white active:scale-95">
            Add Shatghritam · {inr(jar.price!)}
          </button>
        </div>

        {/* opening footer: headline left, product right */}
        <div className="h-foot absolute inset-x-0 bottom-0 z-[3] flex items-end justify-between gap-4 px-5 pb-[max(3.2svh,18px)] md:px-10">
          <p className="t-display hidden max-w-[16ch] text-[clamp(22px,min(2.6vw,4.6svh),44px)] leading-[1.05] sm:block">
            Skip the chemicals. Choose the <em className="text-[#ffd39a]">Sacred.</em>
          </p>
          <button data-cursor="Add" onClick={addJar} className="group flex w-full items-center justify-between gap-4 rounded-full border border-khadiya/25 bg-black/15 py-2 pl-5 pr-2 text-left backdrop-blur-sm transition hover:border-khadiya/60 sm:w-auto">
            <span className="leading-tight">
              <span className="t-accent block text-[17px]">Shatghritam</span>
              <span className="t-mono text-[9.5px] text-khadiya/70">Shat Dhauta Ghrita · {inr(jar.price!)}</span>
            </span>
            <span className="grid size-10 place-items-center rounded-full bg-khadiya text-lg text-geru transition group-hover:rotate-90">+</span>
          </button>
        </div>

        {/* scroll progress */}
        <div className="absolute inset-x-0 bottom-0 z-[4] h-[2px] bg-khadiya/10"><div className="h-progress h-full origin-left scale-x-0 bg-[#ffd39a]" /></div>
      </div>
    </section>
  )
}
