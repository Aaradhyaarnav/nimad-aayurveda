import Backdrop from '@/components/Backdrop'
import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger, SplitText, reduced } from '@/lib/motion'
import { MandanaBorder } from '@/components/Mandana'
import ScrollMorph from '@/components/ui/scroll-morph'

/* ───────────────────────── Manifesto: words fill with ink as you read ───────────────────────── */
export function Manifesto() {
  const root = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reduced) return
      const split = new SplitText('.mf-text', { type: 'words' })
      gsap.fromTo(split.words, { opacity: 0.12 }, {
        opacity: 1, ease: 'none', stagger: 0.05,
        scrollTrigger: { trigger: '.mf-text', start: 'top 78%', end: 'bottom 45%', scrub: true },
      })
      gsap.from('.mf-border path', { strokeDasharray: 400, strokeDashoffset: 400, duration: 2, ease: 'power2.out', scrollTrigger: { trigger: root.current, start: 'top 80%' } })
    }, root)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={root} data-nav="dark" className="khadiya-wall isolate relative overflow-hidden px-5 py-[9vh] md:px-10 md:py-[18vh]">
      <Backdrop tone="light" seed={2} />
      <MandanaBorder className="mf-border mb-8 h-6 w-full text-geru/60 md:mb-16" count={36} />
      <div className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-[220px_1fr]">
        <div className="t-mono text-[11px] text-geru">
          <p>01 · Manifesto</p>
          <p className="mt-2 text-ink/50">घोषणा</p>
        </div>
        <p className="mf-text t-display text-[clamp(34px,5.2vw,86px)] text-ink">
          In Nimad, women draw <em className="text-geru">Mandana</em> in white chalk on red walls, the same patterns their grandmothers drew.
          We make skin and hair care the same way: <em className="text-geru">by hand</em>, from recipes older than the brands on your shelf.
          Ghee washed a hundred times. Oil cooked slow with ten herbs. Ubtan pressed into a bar.
          Nothing your <em className="text-geru">Dadi</em> wouldn&apos;t recognise.
        </p>
      </div>
      <div className="mx-auto mt-20 grid max-w-[1400px] gap-6 border-t border-ink/15 pt-8 md:grid-cols-4">
        {[
          ['100×', 'washes in cold water for every batch of Shatghritam'],
          ['10', 'herbs slow-cooked into Neerbhringadi Tel'],
          ['42%', 'aloe vera gel in the Herbal Facewash'],
          ['0', 'shortcuts. Small batches, from Bakaner'],
        ].map(([n, t]) => (
          <div key={n}>
            <p className="font-display text-6xl text-geru md:text-7xl">{n.replace('×', '')}{n.includes('×') && <span className="font-sans text-[0.7em] font-light">×</span>}</p>
            <p className="mt-2 max-w-[24ch] text-sm text-ink/70">{t}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ───────────────────────── The Walk: horizontal river, 3,500 km ───────────────────────── */
const STOPS = [
  { x: 0.31, name: 'Amarkantak', hi: 'अमरकंटक', note: 'Where Narmada is born' },
  { x: 0.44, name: 'Jabalpur', hi: 'जबलपुर', note: 'Marble rocks, Bhedaghat' },
  { x: 0.57, name: 'Narmadapuram', hi: 'नर्मदापुरम', note: 'Sethani Ghat' },
  { x: 0.7, name: 'Omkareshwar', hi: 'ओंकारेश्वर', note: 'The island shaped like ॐ' },
  { x: 0.8, name: 'Maheshwar', hi: 'महेश्वर', note: 'Nimad. Home.' },
]

const PHOTOS = [
  { src: '/img/walk/fog-road.webp', cap: 'Fog mornings. Wheat fields on both sides.', at: 0.27, r: -3 },
  { src: '/img/walk/chai-stop.webp', cap: 'Chai stop with fellow parikramavasis.', at: 0.39, r: 2 },
  { src: '/img/walk/rapids.webp', cap: 'Resting on the rocks. The river never rests.', at: 0.52, r: -2 },
  { src: '/img/walk/temple.webp', cap: 'A staff, a bag, a temple courtyard.', at: 0.65, r: 3 },
  { src: '/img/walk/ghat-kids.webp', cap: 'The children at the ghat wanted a photo.', at: 0.73, r: -2 },
  { src: '/img/walk/sand-selfie.webp', cap: 'Sand banks, day after day.', at: 0.86, r: 2 },
]

export function Walk() {
  const root = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const track = root.current!.querySelector<HTMLElement>('.walk-track')!
      const dist = () => track.scrollWidth - window.innerWidth
      const tween = gsap.to(track, { x: () => -dist(), ease: 'none' })
      const st = ScrollTrigger.create({ trigger: root.current, start: 'top top', end: () => '+=' + dist(), pin: '.walk-pin', scrub: 1, animation: tween, invalidateOnRefresh: true })
      // river draws as you travel
      const river = root.current!.querySelector<SVGPathElement>('.river')!
      const len = river.getTotalLength()
      gsap.set(river, { strokeDasharray: len, strokeDashoffset: len })
      gsap.to(river, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: () => '+=' + dist(), scrub: true } })
      // counters
      const kms = root.current!.querySelector('.km')!, days = root.current!.querySelector('.days')!, hud = root.current!.querySelector<HTMLElement>('.walk-hud')!
      ScrollTrigger.create({
        trigger: root.current, start: 'top top', end: () => '+=' + dist(), scrub: true,
        onUpdate: (s) => { kms.textContent = Math.round(s.progress * 3500).toLocaleString('en-IN'); days.textContent = String(Math.max(1, Math.round(s.progress * 71))); hud.style.opacity = String(Math.min(1, Math.max(0, (s.progress - (innerWidth < 768 ? 0.3 : 0.24)) / 0.06))) },
      })
      // photos: colour returns near the centre
      gsap.utils.toArray<HTMLElement>('.walk-photo').forEach((ph) => {
        gsap.fromTo(ph, { y: 80, rotate: Number(ph.dataset.r) * 3 }, { y: 0, rotate: Number(ph.dataset.r), ease: 'none', scrollTrigger: { trigger: ph, containerAnimation: tween, start: 'left right', end: 'center center', scrub: true } })
        ScrollTrigger.create({ trigger: ph, containerAnimation: tween, start: 'left 70%', end: 'right 30%', toggleClass: { targets: ph.querySelector('img')!, className: 'is-live' } })
      })
      gsap.utils.toArray<HTMLElement>('.walk-stop').forEach((s) => {
        gsap.from(s, { opacity: 0, y: 30, scrollTrigger: { trigger: s, containerAnimation: tween, start: 'left 85%', end: 'left 60%', scrub: true } })
      })
      return () => st.kill()
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="walk" ref={root} className="relative text-khadiya">
      <div className="walk-pin relative h-svh overflow-hidden bg-geru-deep">
        <div className="absolute inset-0 opacity-60 geru-wall mix-blend-multiply" />
        {/* fixed HUD */}
        <div className="walk-hud pointer-events-none absolute left-5 top-[calc(72px+2svh)] z-20 opacity-0 md:left-10">
          <p className="t-mono text-[10px] text-khadiya/70">Maa Narmada Parikrama · परिक्रमा</p>
          <p className="mt-1 font-mono text-[min(10vw,9svh)] leading-none tabular-nums"><span className="km">0</span><span className="ml-2 text-[0.35em] opacity-70">km</span></p>
          <p className="t-mono mt-1 text-[10px] text-khadiya/70">Day <span className="days">1</span> of 71 · 16 districts · on foot</p>
        </div>
        <div className="walk-track relative flex h-full w-[400vw] items-center md:w-[340vw]">
          {/* intro panel */}
          <div className="relative z-10 flex h-full w-[100vw] shrink-0 flex-col justify-between px-5 pb-[6svh] pt-[calc(72px+2svh)] md:w-[70vw] md:px-10">
            <div>
              <p className="t-mono text-[10px] text-khadiya/70 md:text-[11px]">02 · Maa Narmada Parikrama · परिक्रमा</p>
              <h2 className="t-display mt-[1.5svh] max-w-[15ch] text-[min(10vw,8.5svh)] leading-[1.02]">Before the brand, there was a <em className="text-[#ffd9a0]">walk.</em></h2>
            </div>
            <p className="max-w-md text-[clamp(13px,2.1svh,16px)] leading-relaxed text-khadiya/75">
              Ajay Sen walked around Maa Narmada: 3,500 km in 71 days, through 16 districts, source to sea and back. Along the way he listened to the old ways of the
              Narmada valley. The Nimad Aayurveda is what he carried home.
            </p>
          </div>
          {/* river */}
          <svg className="pointer-events-none absolute inset-x-0 top-1/2 h-[46vh] w-full -translate-y-1/2" viewBox="0 0 3600 400" preserveAspectRatio="none" aria-hidden>
            <path className="river" d="M0 210 C 200 120, 380 300, 600 220 S 980 90, 1200 200 S 1560 330, 1800 210 S 2180 80, 2420 190 S 2760 320, 3000 200 S 3380 120, 3600 210" fill="none" stroke="#faf6ee" strokeWidth="5" strokeLinecap="round" />
            <path d="M0 210 C 200 120, 380 300, 600 220 S 980 90, 1200 200 S 1560 330, 1800 210 S 2180 80, 2420 190 S 2760 320, 3000 200 S 3380 120, 3600 210" fill="none" stroke="#faf6ee" strokeOpacity=".12" strokeWidth="38" strokeLinecap="round" />
          </svg>
          {STOPS.map((s) => (
            <div key={s.name} className="walk-stop absolute top-[calc(50%-4svh)] z-10 -translate-y-full" style={{ left: `${s.x * 100}%` }}>
              <p className="t-deva text-[min(6vw,4.4svh)] leading-[1.2]">{s.hi}</p>
              <p className="t-mono text-[10px] text-khadiya/70">{s.name}</p>
              <p className="font-hand text-[clamp(11px,1.8svh,14px)] text-khadiya/80">{s.note}</p>
              <span className="mt-2 block size-2.5 rounded-full bg-khadiya ring-[6px] ring-khadiya/15" />
            </div>
          ))}
          {PHOTOS.map((p) => (
            <figure key={p.src} className="walk-photo absolute bottom-[5svh] z-10" style={{ left: `${p.at * 100}%` }} data-r={p.r} data-cursor="Look">
              <div className="rounded-[6px] bg-khadiya p-[min(1.2svh,8px)] shadow-[0_30px_60px_-20px_rgba(0,0,0,.7)]">
                <img src={p.src} alt={p.cap} className="duotone h-[min(26svh,42vw)] w-auto max-w-[70vw] rounded-[3px] object-cover" loading="lazy" />
                <figcaption className="mt-[0.8svh] block max-w-[min(26svh,42vw)] font-hand text-[clamp(11px,1.7svh,15px)] leading-tight text-ink">{p.cap}</figcaption>
              </div>
            </figure>
          ))}
          <div className="absolute right-[3vw] top-1/2 z-10 max-w-[min(70vw,320px)] -translate-y-1/2 text-right">
            <p className="t-deva text-[min(11vw,9svh)] leading-[1.2]">नर्मदे हर</p>
            <p className="mt-2 text-sm text-khadiya/70">Every walker greets every other walker with these words. We still do.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Morph gallery (the supplied scroll-morph component) ───────────────────────── */
export function WalkGallery() {
  const imgs = [
    { src: '/img/walk/fog-road.webp', caption: 'Fog road, day one' },
    { src: '/img/products/shatghritam-jar.webp', caption: 'Shatghritam' },
    { src: '/img/walk/rapids.webp', caption: 'Narmada rapids' },
    { src: '/img/products/neerbhringadi-tel.webp', caption: 'Neerbhringadi Tel' },
    { src: '/img/walk/chai-stop.webp', caption: 'Chai stop' },
    { src: '/img/products/facewash-marble.webp', caption: 'Herbal Facewash' },
    { src: '/img/walk/temple.webp', caption: 'Temple courtyard' },
    { src: '/img/products/ubtan-soap.webp', caption: 'Ubtan Soap' },
    { src: '/img/walk/ghat-kids.webp', caption: 'Kids at the ghat' },
    { src: '/img/walk/sand-selfie.webp', caption: 'Sand banks' },
    { src: '/img/products/facewash-poster.webp', caption: 'A new chapter' },
    { src: '/img/walk/rapids.webp', caption: 'Rest, then walk' },
  ]
  return (
    <ScrollMorph
      images={imgs}
      title={<>From the <em className="text-[#ffd9a0]">river</em> to your shelf.</>}
      sub="What the walk taught became what we make. Hover a frame to turn it over."
    />
  )
}
