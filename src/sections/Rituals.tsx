import { useLayoutEffect, useRef } from 'react'
import Mandana from '@/components/Mandana'
import { gsap, ScrollTrigger, reduced } from '@/lib/motion'
import { scrollToId } from '@/lib/motion'
import { isTouch } from '@/lib/device'

const GHEE_STEPS = [
  { n: '01', hi: 'शुद्ध घी', t: 'Pure A2 Gir cow ghee', d: 'It starts with one ingredient. Desi ghee from Gir cows, nothing added.' },
  { n: '02', hi: 'ठंडा पानी', t: 'Cold water, by hand', d: 'Ghee and cold water are worked together in a vessel by hand, turning and pressing.' },
  { n: '03', hi: 'शत-धौत', t: 'Drain. Repeat. A hundred times.', d: 'The water is drained and replaced, again and again. One hundred washes in all.' },
  { n: '04', hi: 'मंत्र', t: '10,000 rotations, with mantra', d: 'Slow, counted rotations, with mantra chanting through the process.' },
  { n: '05', hi: 'हल्का, रेशमी', t: 'Light as cream', d: 'The heavy ghee becomes a silky, non-greasy cream that the skin drinks in.' },
]

/* ───────────────────────── Shat Dhauta: pinned, counter 1 → 100 ───────────────────────── */
export function GheeRitual() {
  const root = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>('.gr-step')
      const counter = root.current!.querySelector('.gr-count')!
      const ripples = gsap.utils.toArray<SVGCircleElement>('.gr-ripple')
      ScrollTrigger.create({
        trigger: root.current, start: 'top top', end: isTouch ? '+=170%' : '+=260%', pin: '.gr-pin', scrub: true,
        onUpdate: (s) => {
          const p = s.progress
          counter.textContent = String(Math.max(1, Math.round(p * 100))).padStart(3, '0')
          const k = Math.min(steps.length - 1, Math.floor(p * steps.length))
          steps.forEach((el, i) => el.classList.toggle('is-on', i === k))
        },
      })
      if (!reduced) {
        ripples.forEach((r, i) => gsap.fromTo(r, { attr: { r: 20 }, opacity: 0.9 }, { attr: { r: 300 }, opacity: 0, duration: 4, repeat: -1, delay: i * 1, ease: 'sine.out' }))
        gsap.fromTo('.gr-photo', { scale: 0.7, rotate: -40 }, { scale: 1.08, rotate: 40, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: '+=260%', scrub: true } })
        gsap.to('.gr-mandana', { rotate: 360, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: '+=300%', scrub: true } })
      }
    }, root)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={root} className="relative text-khadiya">
      <div className="gr-pin geru-wall relative grid h-svh overflow-hidden md:grid-cols-2">
        <div className="relative flex items-center justify-center">
          <Mandana size={700} rings={5} seed={3} className="gr-mandana absolute w-[min(110vw,820px)] text-khadiya/15" strokeWidth={1} />
          <svg viewBox="-320 -320 640 640" className="absolute w-[min(90vw,640px)]" aria-hidden>
            {[0, 1, 2, 3].map((i) => <circle key={i} className="gr-ripple" cx="0" cy="0" r="20" fill="none" stroke="#faf6ee" strokeWidth="1.5" />)}
          </svg>
          <img src="/img/herbs/ghee.webp" alt="" className="gr-photo absolute size-[min(56vw,330px)] rounded-full object-cover opacity-50 mix-blend-luminosity" />
          <div className="relative text-center">
            <p className="t-mono text-[11px] text-khadiya/70">Wash no.</p>
            <p className="gr-count font-mono text-[clamp(110px,20vw,280px)] leading-none tabular-nums">001</p>
            <p className="t-deva text-3xl">शत-धौत घृत</p>
          </div>
        </div>
        <div className="relative flex flex-col justify-center px-4 pb-16 md:px-10 md:pb-0">
          <p className="t-mono text-[11px] text-khadiya/70">05 · The making of Shatghritam</p>
          <h2 className="t-display mt-4 text-[clamp(44px,6vw,100px)]">Washed a hundred times. <em className="text-[#ffd9a0]">Counted.</em></h2>
          <div className="relative mt-10 h-[200px] md:h-[220px]">
            {GHEE_STEPS.map((s) => (
              <div key={s.n} className="gr-step absolute inset-0 translate-y-6 opacity-0 transition-all duration-700 ease-[var(--ease-silk)] [&.is-on]:translate-y-0 [&.is-on]:opacity-100">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-sm text-[#ffd9a0]">{s.n}</span>
                  <span className="t-deva text-4xl">{s.hi}</span>
                </div>
                <p className="mt-3 font-display text-4xl">{s.t}</p>
                <p className="mt-3 max-w-md text-khadiya/80">{s.d}</p>
              </div>
            ))}
          </div>
          <button onClick={() => scrollToId('product-shatghritam')} className="mt-6 self-start rounded-full border border-khadiya/40 px-5 py-3 text-[13px] hover:bg-khadiya hover:text-geru">See Shatghritam →</button>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Oil ritual: three steps with a 7-minute dial ───────────────────────── */
export function OilRitual() {
  const root = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const arc = root.current!.querySelector<SVGCircleElement>('.dial-arc')!
      const len = 2 * Math.PI * 140
      gsap.set(arc, { strokeDasharray: len, strokeDashoffset: len })
      const min = root.current!.querySelector('.dial-min')!
      gsap.to(arc, {
        strokeDashoffset: 0, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top 60%', end: 'bottom 60%', scrub: true, onUpdate: (s) => { min.textContent = String(Math.round(s.progress * 7)) } },
      })
      gsap.from('.or-step', { y: 60, opacity: 0, stagger: 0.15, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 65%' } })
    }, root)
    return () => ctx.revert()
  }, [])
  const steps = [
    { hi: 'हल्का गर्म करें', en: 'Warm it lightly', d: 'Just lukewarm. Comfortable on the fingertips, never hot.' },
    { hi: '5–7 मिनट मालिश', en: 'Massage 5 to 7 minutes', d: 'Fingertips, small circles, from the hairline to the crown.' },
    { hi: 'फिर शैम्पू करें', en: 'Then shampoo', d: 'Wash it out. Twice a week is plenty.' },
  ]
  return (
    <section ref={root} data-nav="dark" className="khadiya-wall relative px-5 py-[8vh] md:px-10 md:py-[16vh]">
      <div className="mx-auto grid max-w-[1400px] items-center gap-8 md:grid-cols-[1fr_1.2fr] md:gap-14">
        <div className="relative mx-auto aspect-square w-[72vw] max-w-[420px] md:w-full">
          <svg viewBox="-160 -160 320 320" className="h-full w-full -rotate-90" aria-hidden>
            <circle r="140" fill="none" stroke="#1c0b09" strokeOpacity=".08" strokeWidth="14" />
            <circle className="dial-arc" r="140" fill="none" stroke="#c27a32" strokeWidth="14" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="font-mono text-[120px] leading-none text-ink tabular-nums"><span className="dial-min">0</span></p>
            <p className="t-mono text-[11px] text-ink/60">minutes of massage</p>
            <p className="t-deva mt-2 text-2xl text-[#a85a1c]">नीरभृंगादी तेल</p>
          </div>
        </div>
        <div>
          <p className="t-mono text-[11px] text-geru">06 · The oil ritual · उपयोग</p>
          <h2 className="t-display mt-4 text-[clamp(44px,6vw,100px)] text-ink">Seven minutes, <em className="text-geru">twice a week.</em></h2>
          <div className="mt-10 space-y-6">
            {steps.map((s, i) => (
              <div key={s.en} className="or-step grid grid-cols-[48px_1fr] gap-4 border-t border-ink/15 pt-5">
                <span className="font-mono text-sm text-geru">0{i + 1}</span>
                <div>
                  <p className="t-deva text-3xl text-ink">{s.hi}</p>
                  <p className="t-accent text-2xl text-ink/80">{s.en}</p>
                  <p className="mt-1 text-sm text-ink/60">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => scrollToId('product-oil')} className="mt-8 rounded-full bg-ink px-6 py-3 text-[13px] text-khadiya">Shop Neerbhringadi Tel →</button>
        </div>
      </div>
    </section>
  )
}
