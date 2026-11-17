'use client'
/**
 * Scroll-morph gallery (from the supplied "scroll-morph-hero"): scatter → line → circle → arc.
 * Rewritten for speed: one ScrollTrigger writes transforms straight to the DOM every frame,
 * so React never re-renders while you scroll. Works the same on phones.
 */
import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { gsap, ScrollTrigger } from '@/lib/motion'
import { isTouch } from '@/lib/device'

export interface MorphImage { src: string; caption: string }

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp = (v: number) => Math.min(1, Math.max(0, v))
const ease = (t: number) => 1 - Math.pow(1 - t, 3)

export default function ScrollMorph({ images, title, sub }: { images: MorphImage[]; title: ReactNode; sub: string }) {
  const section = useRef<HTMLElement>(null)
  const n = images.length

  useLayoutEffect(() => {
    const el = section.current!
    const cards = Array.from(el.querySelectorAll<HTMLElement>('.mc'))
    const titleEl = el.querySelector<HTMLElement>('.mc-title')!
    const introEl = el.querySelector<HTMLElement>('.mc-intro')!
    const scatter = cards.map((_, i) => { const a = (i / cards.length) * Math.PI * 2; const d = 0.28 + Math.random() * 0.2; return { x: Math.cos(a) * innerWidth * d, y: Math.sin(a) * innerHeight * d, r: (Math.random() - 0.5) * 50 } })
    let para = 0, paraT = 0
    const onMove = (e: PointerEvent) => { paraT = ((e.clientX / innerWidth) * 2 - 1) * 50 }
    window.addEventListener('pointermove', onMove, { passive: true })
    let prog = 0, rendered = false

    const render = () => {
      if (rendered && !st.isActive && Math.abs(paraT - para) < 0.5) return
      rendered = true
      para += (paraT - para) * 0.08
      const W = innerWidth, H = innerHeight
      const mobile = W < 768
      const cw = mobile ? 74 : 98
      const p = prog
      const a = ease(clamp(p / 0.12))            // scatter → line
      const b = ease(clamp((p - 0.14) / 0.14))   // line → circle
      const m = ease(clamp((p - 0.32) / 0.25))   // circle → arc
      const rv = clamp((p - 0.58) / 0.42)         // arc slide
      const R = Math.min(Math.min(W, H) * 0.32, 300)
      const ar = Math.min(W, H * 1.5) * (mobile ? 1.35 : 1.1)
      const acy = H * (mobile ? 0.36 : 0.27) + ar - H / 2
      const spread = mobile ? 100 : 120
      cards.forEach((c, i) => {
        const sp = cw + 14
        const line = { x: i * sp - (n * sp) / 2 + sp / 2, y: 0, r: 0 }
        const ca = (i / n) * Math.PI * 2
        const circ = { x: Math.cos(ca) * R, y: Math.sin(ca) * R, r: (ca * 180) / Math.PI + 90 }
        const ang = -90 - spread / 2 + i * (spread / Math.max(1, n - 1)) + (-rv * spread * 0.55 + spread * 0.28)
        const aRad = (ang * Math.PI) / 180
        const arc = { x: Math.cos(aRad) * ar + para, y: Math.sin(aRad) * ar + acy, r: ang + 90 }
        let x = lerp(scatter[i].x, line.x, a), y = lerp(scatter[i].y, line.y, a), r = lerp(scatter[i].r, line.r, a)
        x = lerp(x, circ.x, b); y = lerp(y, circ.y, b); r = lerp(r, circ.r, b)
        x = lerp(x, arc.x, m); y = lerp(y, arc.y, m); r = lerp(r, arc.r, m)
        const s = lerp(0.85, 1, a) * lerp(1, mobile ? 1.35 : 1.7, m)
        c.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${r}deg) scale(${s})`
        c.style.opacity = '1'
        c.classList.toggle('is-live', m > 0.9 && Math.abs(x) < cw * 1.3)
      })
      const t = clamp((m - 0.6) / 0.4)
      titleEl.style.opacity = String(t)
      titleEl.style.transform = `translateY(${(1 - t) * 24}px)`
      introEl.style.opacity = String(Math.max(0, b * b - m * 2.5))
    }

    const st = ScrollTrigger.create({
      trigger: el, start: 'top top', end: isTouch ? '+=150%' : '+=210%', pin: '.morph-pin', scrub: true,
      onUpdate: (s) => { prog = s.progress },
    })
    gsap.ticker.add(render)
    return () => { gsap.ticker.remove(render); st.kill(); window.removeEventListener('pointermove', onMove) }
  }, [n])

  return (
    <section ref={section} className="relative">
      <div className="morph-pin relative h-svh overflow-hidden bg-geru-ink text-khadiya">
        <div className="mc-title pointer-events-none absolute inset-x-0 top-[12vh] z-10 px-5 text-center opacity-0">
          <h2 className="t-display text-[clamp(40px,6.5vw,104px)]">{title}</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-khadiya/70 md:text-base">{sub}</p>
        </div>
        <div className="mc-intro pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
          <p className="t-deva text-[min(7vw,7svh)] leading-[1.3]">नर्मदे हर</p>
          <p className="t-mono mt-3 text-[10px] text-khadiya/60">Keep scrolling</p>
        </div>
        <div className="absolute left-1/2 top-1/2">
          {images.map((img, i) => (
            <figure key={img.src + i} className="mc group absolute -ml-[37px] -mt-[50px] h-[100px] w-[74px] [perspective:900px] md:-ml-[49px] md:-mt-[66px] md:h-[132px] md:w-[98px]" style={{ willChange: 'transform' }} data-cursor="Flip">
              <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-active:[transform:rotateY(180deg)]">
                <div className="absolute inset-0 rounded-[8px] bg-khadiya p-1 shadow-[0_14px_30px_-10px_rgba(0,0,0,.6)] [backface-visibility:hidden]">
                  <img src={img.src} alt={img.caption} className="duotone h-full w-full rounded-[5px] object-cover [.is-live_&]:[filter:none]" draggable={false} loading="lazy" />
                </div>
                <div className="absolute inset-0 flex items-end rounded-[8px] bg-khadiya p-2 text-ink [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <p className="font-hand text-[11px] leading-tight">{img.caption}</p>
                </div>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
