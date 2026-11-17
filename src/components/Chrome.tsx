import { useEffect, useRef, useState } from 'react'
import { useCart } from '@/store/cart'
import { BRAND } from '@/data/site'
import { gsap, scrollToId } from '@/lib/motion'
import Logo from './Logo'

/* ───────────────────────── Navigation ───────────────────────── */
const LINKS = [
  ['walk', 'Parikrama'],
  ['herbs', 'Herbs'],
  ['products', 'Shop'],
  ['prakriti', 'Prakriti'],
  ['founder', 'Founder'],
] as const

export function Nav() {
  const { count, setOpen, lastAdded } = useCart()
  const bag = useRef<HTMLButtonElement>(null)
  const [dark, setDark] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)

  useEffect(() => {
    if (!lastAdded || !bag.current) return
    gsap.fromTo(bag.current, { scale: 1 }, { scale: 1.18, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' })
  }, [lastAdded])

  // switch nav ink when over light sections
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-nav="dark"]'))
    const check = () => {
      const y = 40
      setDark(els.some((el) => { const r = el.getBoundingClientRect(); return r.top <= y && r.bottom >= y }))
      setScrolled(window.scrollY > 40)
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])

  const ink = dark ? 'text-ink' : 'text-khadiya'
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-[color,background-color,box-shadow] duration-500 ${ink} ${scrolled ? (dark ? 'bg-khadiya/88 shadow-[0_1px_0_rgba(28,11,9,.08)] backdrop-blur-md' : 'bg-[#5a0710]/80 shadow-[0_1px_0_rgba(250,246,238,.08)] backdrop-blur-md') : ''}`}>
      <div className={`mx-auto flex items-center justify-between px-4 transition-[padding] duration-500 md:px-8 ${scrolled ? 'py-2.5 md:py-3' : 'py-4 md:py-5'}`}>
        <button onClick={() => scrollToId('top')} aria-label="The Nimad Aayurveda, back to top" style={{ ['--logo-bg' as string]: dark ? '#faf6ee' : '#b3121f' }}>
          <Logo />
        </button>
        <nav className="hidden items-center gap-1 rounded-full border border-current/20 px-2 py-1.5 backdrop-blur-md md:flex">
          {LINKS.map(([id, label]) => (
            <button key={id} onClick={() => scrollToId(id)} className="rounded-full px-4 py-1.5 text-[13px] tracking-wide transition hover:bg-current/10">
              {label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="hidden rounded-full border border-current/25 px-4 py-2 text-[13px] lg:block">Instagram ↗</a>
          <button id="bag-btn" ref={bag} onClick={() => setOpen(true)} className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium ${dark ? 'bg-geru text-khadiya' : 'bg-khadiya text-geru'}`}>
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
            <span>Bag</span>
            <span className="tabular-nums">{String(count).padStart(2, '0')}</span>
          </button>
          <button className="rounded-full border border-current/30 px-3 py-2 text-[13px] md:hidden" onClick={() => setMenu((m) => !m)} aria-expanded={menu}>Menu</button>
        </div>
      </div>
      {menu && (
        <div className="geru-wall mx-4 flex flex-col rounded-2xl p-3 text-khadiya md:hidden">
          {LINKS.map(([id, label]) => (
            <button key={id} onClick={() => { setMenu(false); scrollToId(id) }} className="border-b border-khadiya/15 px-3 py-3 text-left font-display text-3xl last:border-0">{label}</button>
          ))}
        </div>
      )}
    </header>
  )
}

export { default as Cursor } from './ChakraCursor'

/* ───────────────────────── SVG filter defs (duotone) ───────────────────────── */
export function FilterDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <filter id="duotone-geru" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" />
        <feComponentTransfer>
          <feFuncR type="table" tableValues="0.27 0.98" />
          <feFuncG type="table" tableValues="0.02 0.96" />
          <feFuncB type="table" tableValues="0.05 0.93" />
        </feComponentTransfer>
      </filter>
    </svg>
  )
}
