import Backdrop from '@/components/Backdrop'
import { useLayoutEffect, useRef } from 'react'
import { BRAND } from '@/data/site'
import { gsap, ScrollTrigger, reduced } from '@/lib/motion'
import { isTouch } from '@/lib/device'

/* ───────────────────────── Founder's notebook: ruled pages that turn as you scroll ───────────────────────── */
const PAGES = [
  {
    title: 'Hair Fall · बाल झड़ना',
    lines: ['1. पेट खराब (digestion)', '2. पानी का TDS (hard water)', '3. मानसिक तनाव (stress)', '4. विटामिन की कमी — B12, D3, Iron', '', 'वात → milk + ghee', 'पित्त → मुनक्के', 'कफ → पानी में त्रिफला'],
    foot: 'This page got 7,000+ likes. People want the why.',
  },
  {
    title: 'पित्त प्रकृति',
    lines: ['पहचान: गर्मी, गुस्सा, जलन, एसिडिटी', 'बाल जल्दी सफ़ेद, पतले', '', 'तेल: नहाने से 45 मिनट–1 घंटा पहले', 'सामान्य या ताज़े पानी से धोएं', 'हफ़्ते में 2 बार काफ़ी है'],
    foot: 'Know your body before you buy anything.',
  },
  {
    title: 'शत-धौत घृत',
    lines: ['गाय का घी + ठंडा पानी', '100 बार धोना', 'भारीपन जाता है', 'हल्का, रेशमी, non-greasy', '', 'होंठ, हाथ-पैर, सर्दी की रूखी त्वचा', 'रात को सोने से पहले best'],
    foot: 'The recipe is old. We only refuse to cut corners.',
  },
]

export default function Founder() {
  const root = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const pages = gsap.utils.toArray<HTMLElement>('.nb-page')
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: isTouch ? '+=150%' : '+=220%', pin: '.nb-pin', scrub: 1 } })
      pages.slice(0, -1).forEach((pg, i) => {
        // turn the page away and let it vanish before it can cover the text column
        tl.to(pg, { rotateY: -115, ease: 'power2.in', duration: 1 }, i * 1.1)
        tl.to(pg, { autoAlpha: 0, duration: 0.35, ease: 'none' }, i * 1.1 + 0.6)
      })
      if (!reduced) gsap.from('.nb-photo', { rotate: -14, y: 120, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 60%' } })
      return () => ScrollTrigger.refresh()
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="founder" ref={root} data-nav="dark" className="relative">
      <div className="nb-pin khadiya-wall isolate relative grid h-svh grid-rows-[auto_1fr] items-center gap-4 overflow-hidden px-5 pb-6 pt-20 md:grid-cols-[0.9fr_1.1fr] md:grid-rows-1 md:gap-10 md:px-10 md:pt-0">
        <Backdrop tone="light" seed={11} flip borders={false} />
        <div className="relative z-10">
          <p className="t-mono text-[11px] text-geru">08 · The founder · संस्थापक</p>
          <h2 className="t-display mt-2 text-[clamp(34px,6vw,104px)] text-ink md:mt-4">Ajay Sen writes it <em className="text-geru">by hand</em> first.</h2>
          <p className="mt-6 hidden max-w-md text-ink/70 md:block">
            Before a product, there is a notebook page. Ajay explains Vata, Pitta and Kapha in plain Hindi, one handwritten page at a time, to an audience that keeps asking for more.
            The same honesty goes into every bottle.
          </p>
          <div className="mt-4 flex items-center gap-4 md:mt-8 md:gap-5">
            <figure className="nb-photo w-20 rotate-[-4deg] md:w-36 rounded-[4px] bg-white p-2 pb-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,.45)] md:w-44">
              <img src="/img/walk/temple.webp" alt="Ajay Sen during the Narmada Parikrama" className="duotone is-live aspect-[3/4] w-full object-cover" />
              <figcaption className="mt-1 text-center font-hand text-sm text-ink">Ajay, on the parikrama</figcaption>
            </figure>
            <div>
              <p className="font-hand text-3xl text-ink">Ajay Sen</p>
              <p className="t-mono text-[10px] text-ink/50">Founder · || शिव कृपा ||</p>
              <a href={BRAND.founderInstagram} target="_blank" rel="noreferrer" className="mt-3 inline-block rounded-full border border-ink/25 px-4 py-2 text-[12px] text-ink hover:bg-ink hover:text-khadiya">@ajayy_19sen ↗</a>
            </div>
          </div>
        </div>

        <div className="relative mx-auto h-full max-h-[62vh] min-h-[340px] w-[min(92vw,520px)] [perspective:2200px]">
          {PAGES.map((pg, i) => (
            <div
              key={pg.title}
              data-slide="" className="nb-page absolute inset-0 origin-left rounded-r-[10px] rounded-l-[3px] bg-[#fdfcf7] p-7 pl-14 shadow-[0_30px_70px_-25px_rgba(28,11,9,.45)] [backface-visibility:hidden] [transform-style:preserve-3d]"
              style={{
                zIndex: PAGES.length - i,
                backgroundImage: 'linear-gradient(transparent 31px, rgba(60,90,200,.22) 32px)',
                backgroundSize: '100% 32px',
                backgroundPositionY: '58px',
              }}
            >
              <span className="absolute inset-y-0 left-10 w-px bg-geru/40" />
              <span className="absolute left-3 top-6 flex flex-col gap-[26px]">{Array.from({ length: 12 }).map((_, k) => <i key={k} className="block size-3 rounded-full bg-ink/80 shadow-inner" />)}</span>
              <p className="font-hand text-[26px] font-bold leading-[32px] text-[#1f3aa0] underline decoration-1 underline-offset-4">{pg.title}</p>
              <div className="mt-[22px] font-hand text-[20px] leading-[32px] text-[#1f3aa0]">
                {pg.lines.map((l, k) => <p key={k} className="min-h-[32px]">{l}</p>)}
              </div>
              <p className="absolute bottom-6 right-7 max-w-[70%] rotate-[-2deg] text-right font-hand text-[17px] leading-tight text-geru">{pg.foot}</p>
              <span className="t-mono absolute right-6 top-6 text-[10px] text-ink/40">p. {i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Recognition marquee ───────────────────────── */
export function Recognition() {
  const items = [
    'Recognised by Dr. Hiralal Alawa, MLA, Manawar',
    'SAGE University Startup Spark 2.0 · Idea Pitch',
    'Handmade in Bakaner, Nimad',
    'Aatmanirbhar Madhya Pradesh',
    'नर्मदे हर',
    '3,500 km on foot',
  ]
  const row = [...items, ...items]
  return (
    <section className="geru-wall relative overflow-hidden py-10 text-khadiya">
      <div className="marquee flex w-max gap-12 whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-12 t-accent text-[clamp(32px,4vw,64px)]">
            {t}
            <svg viewBox="0 0 40 40" className="size-8 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden><circle cx="20" cy="20" r="12" /><path d="M20 4v32M4 20h32" /><circle cx="20" cy="20" r="3" fill="currentColor" /></svg>
          </span>
        ))}
      </div>
    </section>
  )
}
