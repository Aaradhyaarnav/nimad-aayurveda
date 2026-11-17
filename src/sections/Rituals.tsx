import Backdrop from '@/components/Backdrop'
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
      const n = GHEE_STEPS.length
      const counter = root.current!.querySelector('.gr-count')!
      const ripples = gsap.utils.toArray<SVGCircleElement>('.gr-ripple')
      ScrollTrigger.create({
        trigger: root.current, start: 'top top', end: isTouch ? '+=170%' : '+=260%', pin: '.gr-pin', scrub: true,
        onUpdate: (s) => {
          const p = s.progress
          counter.textContent = String(Math.max(1, Math.round(p * 100))).padStart(3, '0')
          const k = Math.min(n - 1, Math.floor(p * n))
          steps.forEach((el, i) => el.classList.toggle('is-on', i % n === k))
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
      <div className="gr-pin geru-wall relative flex h-svh flex-col overflow-hidden px-5 pb-[3svh] pt-[calc(64px+2svh)] md:px-10 [@media(min-aspect-ratio:5/4)]:grid [@media(min-aspect-ratio:5/4)]:grid-cols-[1fr_1fr] [@media(min-aspect-ratio:5/4)]:items-center [@media(min-aspect-ratio:5/4)]:gap-[4vw]">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(70% 60% at 30% 55%, rgba(255,150,90,.25), transparent 70%), radial-gradient(120% 90% at 50% 50%, transparent 50%, rgba(26,2,6,.6) 100%)' }} />

        {/* heading — top on phones, right column on wide screens */}
        <div className="relative z-10 shrink-0 text-center [@media(min-aspect-ratio:5/4)]:order-2 [@media(min-aspect-ratio:5/4)]:text-left">
          <p className="t-mono text-[clamp(9px,1.4svh,11px)] text-khadiya/70">05 · The making of Shatghritam</p>
          <h2 className="t-display mt-[1svh] text-[min(9vw,5.6svh)] leading-[1.02] [@media(min-aspect-ratio:5/4)]:text-[min(5vw,8.5svh)]">Washed a hundred times. <em className="text-[#ffd9a0]">Counted.</em></h2>
          {/* steps (wide screens: under the heading) */}
          <div className="relative mt-[3svh] hidden h-[26svh] [@media(min-aspect-ratio:5/4)]:block">
            {GHEE_STEPS.map((s) => (
              <div key={s.n} className="gr-step absolute inset-0 translate-y-6 opacity-0 transition-all duration-700 ease-[var(--ease-silk)] [&.is-on]:translate-y-0 [&.is-on]:opacity-100">
                <div className="flex items-baseline gap-4"><span className="font-mono text-[clamp(11px,1.6svh,14px)] text-[#ffd9a0]">{s.n}</span><span className="t-deva text-[min(3vw,5svh)] leading-[1.3]">{s.hi}</span></div>
                <p className="mt-[0.8svh] font-display text-[min(2.4vw,4.2svh)] leading-[1.1]">{s.t}</p>
                <p className="mt-[1svh] max-w-md text-[clamp(13px,2svh,16px)] text-khadiya/80">{s.d}</p>
              </div>
            ))}
          </div>
          <button onClick={() => scrollToId('product-shatghritam')} className="mt-[2svh] hidden rounded-full border border-khadiya/40 px-5 py-[min(1.6svh,12px)] text-[13px] transition hover:bg-khadiya hover:text-geru [@media(min-aspect-ratio:5/4)]:inline-block">See Shatghritam →</button>
        </div>

        {/* the counter visual — always a perfect square, centred in its space */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center [@media(min-aspect-ratio:5/4)]:order-1 [@media(min-aspect-ratio:5/4)]:h-full">
          <div className="relative aspect-square h-[min(100%,88vw)] max-h-[74svh] [@media(min-aspect-ratio:5/4)]:h-auto [@media(min-aspect-ratio:5/4)]:w-[min(100%,74svh)]">
            <Mandana size={800} rings={7} seed={3} className="gr-mandana absolute inset-[-8%] text-khadiya/[0.16]" strokeWidth={0.9} />
            <svg viewBox="-320 -320 640 640" className="absolute inset-0 h-full w-full" aria-hidden>
              {[0, 1, 2, 3].map((i) => <circle key={i} className="gr-ripple" cx="0" cy="0" r="20" fill="none" stroke="#faf6ee" strokeWidth="1.5" />)}
            </svg>
            <img src="/img/herbs/ghee.webp" alt="" className="gr-photo absolute inset-[18%] h-[64%] w-[64%] rounded-full object-cover opacity-55 mix-blend-luminosity" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="t-mono text-[clamp(9px,1.4svh,11px)] text-khadiya/70">Wash no.</p>
              <p className="gr-count font-mono text-[min(22vw,15svh)] leading-none tabular-nums">001</p>
              <p className="t-deva text-[min(6vw,4svh)] leading-[1.3]">शत-धौत घृत</p>
            </div>
          </div>
        </div>

        {/* steps on phones: a fixed band under the visual */}
        <div className="relative h-[19svh] shrink-0 text-center [@media(min-aspect-ratio:5/4)]:hidden">
          {GHEE_STEPS.map((s) => (
            <div key={s.n} className="gr-step absolute inset-0 translate-y-4 opacity-0 transition-all duration-700 ease-[var(--ease-silk)] [&.is-on]:translate-y-0 [&.is-on]:opacity-100">
              <p className="t-deva text-[min(7vw,4.2svh)] leading-[1.3]"><span className="mr-2 font-mono text-[11px] text-[#ffd9a0]">{s.n}</span>{s.hi}</p>
              <p className="font-display text-[min(6vw,3.2svh)] leading-[1.15]">{s.t}</p>
              <p className="mx-auto mt-[0.6svh] max-w-[34ch] text-[clamp(12px,1.8svh,14px)] text-khadiya/80">{s.d}</p>
            </div>
          ))}
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
    <section ref={root} data-nav="dark" className="khadiya-wall isolate relative overflow-hidden px-5 py-[8vh] md:px-10 md:py-[16vh]">
      <Backdrop tone="light" seed={7} flip />
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
