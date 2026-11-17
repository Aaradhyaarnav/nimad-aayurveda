import { useLayoutEffect, useRef } from 'react'
import Mandana from '@/components/Mandana'
import { BRAND, LIVE, waLink } from '@/data/site'
import { gsap, reduced, scrollToId } from '@/lib/motion'

export default function Footer() {
  const root = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.from('.ft-letter', { yPercent: 105, duration: 1.4, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: '.ft-word', start: 'top 92%' } })
      gsap.to('.ft-mandana', { rotate: 90, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: true } })
    }, root)
    return () => ctx.revert()
  }, [])
  return (
    <footer ref={root} className="geru-wall relative overflow-hidden px-4 pt-24 text-khadiya md:px-10">
      <Mandana size={800} rings={6} seed={1} className="ft-mandana pointer-events-none absolute -right-[20vw] -top-[10vw] w-[70vw] text-khadiya/10" strokeWidth={1} />
      <div className="relative mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="t-deva text-[clamp(40px,5vw,80px)]">नर्मदे हर 🙏</p>
          <p className="t-display mt-2 text-[clamp(36px,4vw,64px)]">Questions? Ask us on <em className="text-[#ffd9a0]">WhatsApp.</em></p>
          <a href={waLink(`🙏 Namaste ${BRAND.name}! Mujhe ek sawaal poochhna hai:`)} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-3 rounded-full bg-khadiya px-7 py-4 text-[15px] font-medium text-geru transition hover:bg-white" data-cursor="Chat">
            Chat with Ajay · {BRAND.phoneDisplay}
          </a>
        </div>
        <div className="space-y-2 text-[15px]">
          <p className="t-mono mb-4 text-[10px] text-khadiya/60">Shop</p>
          {LIVE.map((p) => <button key={p.id} onClick={() => scrollToId(`product-${p.id}`)} className="block text-left hover:text-[#ffd9a0]">{p.name}</button>)}
          <p className="text-khadiya/50">Herbal Shampoo · soon</p>
        </div>
        <div className="space-y-2 text-[15px]">
          <p className="t-mono mb-4 text-[10px] text-khadiya/60">Reach us</p>
          <a className="block hover:text-[#ffd9a0]" href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
          <a className="block hover:text-[#ffd9a0]" href={`tel:+${BRAND.whatsapp}`}>{BRAND.phoneDisplay}</a>
          <a className="block hover:text-[#ffd9a0]" href={BRAND.instagram} target="_blank" rel="noreferrer">Instagram ↗</a>
          <p className="pt-2 text-khadiya/70">{BRAND.name}<br />{BRAND.address}</p>
        </div>
      </div>
      <div className="ft-word relative mt-16 flex justify-center overflow-hidden md:mt-24" aria-label="The Nimad">
        {'The Nimad'.split('').map((ch, i) => (
          <span key={i} className="ft-letter t-deva inline-block text-[clamp(72px,19vw,330px)] leading-[1.15]">{ch === ' ' ? ' ' : ch}</span>
        ))}
      </div>
      <div className="relative flex flex-col justify-between gap-2 border-t border-khadiya/20 py-6 text-[11px] text-khadiya/60 md:flex-row">
        <p>© {new Date().getFullYear()} {BRAND.name}. {BRAND.tagline}</p>
        <p>Products are cosmetics, not medicines. Patch test before first use. Consult a doctor for any skin condition.</p>
      </div>
    </footer>
  )
}
