import Backdrop from '@/components/Backdrop'
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import SpatialCardCarousel, { type SpatialCardItem } from '@/components/ui/spatial-card-carousel'
import { gsap, SplitText, reduced } from '@/lib/motion'

interface Herb { slug: string; en: string; hi: string; in: string; note: string; tone: string }

export const HERBS: Herb[] = [
  { slug: 'ghee', en: 'A2 Gir Cow Ghee', hi: 'गौ घृत', in: 'Shatghritam', note: 'Washed 100 times until it turns light as cream.', tone: '#f0dca4' },
  { slug: 'bhringraj', en: 'Bhringraj', hi: 'भृंगराज', in: 'Neerbhringadi Tel', note: 'The "king of hair" in every Ayurvedic text.', tone: '#cfd8b4' },
  { slug: 'aloe', en: 'Aloe Vera', hi: 'घृतकुमारी', in: 'Facewash · Tel', note: '42% of our facewash. Cool, clear, calming.', tone: '#d6e3c3' },
  { slug: 'neem', en: 'Neem', hi: 'नीम', in: 'Facewash · Tel · Soap', note: 'Nimad’s village pharmacy, growing on every street.', tone: '#c3cf9e' },
  { slug: 'amla', en: 'Amla', hi: 'आँवला', in: 'Neerbhringadi Tel', note: 'Fruit and leaf both go into the oil.', tone: '#dfe5b8' },
  { slug: 'haldi', en: 'Haldi', hi: 'हल्दी', in: 'Facewash', note: 'The first thing every Indian kitchen reaches for.', tone: '#f3d27c' },
  { slug: 'chandan', en: 'Chandan', hi: 'चंदन', in: 'Facewash · Soap', note: 'Cooling sandalwood, for skin and for the mind.', tone: '#ecd3b0' },
  { slug: 'rose', en: 'Rose Water', hi: 'गुलाब जल', in: 'Facewash', note: '12% rose water and real rose petal extract.', tone: '#f2c9c6' },
  { slug: 'multani', en: 'Multani Mitti', hi: 'मुल्तानी मिट्टी', in: 'Ubtan Soap', note: 'Fuller’s earth: grandma’s answer to oily skin.', tone: '#e3d2b0' },
  { slug: 'besan', en: 'Besan', hi: 'बेसन', in: 'Ubtan Soap', note: 'The base of every haldi-ceremony ubtan.', tone: '#efd99a' },
  { slug: 'goatmilk', en: 'Goat Milk', hi: 'बकरी का दूध', in: 'Ubtan Soap', note: 'Soft, creamy lather that leaves skin smooth.', tone: '#f4ede0' },
  { slug: 'kalonji', en: 'Kalonji', hi: 'कलौंजी', in: 'Neerbhringadi Tel', note: 'Black seed, cooked slowly into the oil.', tone: '#d9d2c4' },
  { slug: 'nirgundi', en: 'Nirgundi', hi: 'निर्गुंडी', in: 'Neerbhringadi Tel', note: 'A hardy hedge shrub of the region, slow-cooked into the oil.', tone: '#c9d3bd' },
  { slug: 'methi', en: 'Methi Dana', hi: 'मेथी दाना', in: 'Neerbhringadi Tel', note: 'Fenugreek seeds, a hair-care classic.', tone: '#ecdcae' },
  { slug: 'kadipatta', en: 'Kadipatta', hi: 'कढ़ी पत्ता', in: 'Neerbhringadi Tel', note: 'Curry leaves, straight from the courtyard tree.', tone: '#c6d6a8' },
  { slug: 'kalatil', en: 'Kala Til', hi: 'काला तिल', in: 'Neerbhringadi Tel', note: 'Black sesame, the classic Ayurvedic oil base.', tone: '#d4cdbf' },
  { slug: 'cucumber', en: 'Cucumber', hi: 'खीरा', in: 'Facewash', note: 'Fresh, watery coolness.', tone: '#d7e8c8' },
  { slug: 'greentea', en: 'Green Tea', hi: 'हरी चाय', in: 'Facewash', note: '4.5% green tea extract.', tone: '#d2e0b4' },
]

function HerbCard({ h, active }: { h: Herb; active: boolean }) {
  const [hasImg, setHasImg] = useState(true)
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden p-5" style={{ background: h.tone }}>
      {hasImg && (
        <img src={`/img/herbs/${h.slug}.webp`} alt={h.en} onError={() => setHasImg(false)} className="absolute inset-0 h-full w-full object-cover" draggable={false} loading="lazy" />
      )}
      {hasImg && <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />}
      {!hasImg && (
        <svg viewBox="0 0 200 250" className="absolute -right-10 top-6 h-[85%] text-ink/15" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
          <path d="M100 250 C104 170 96 100 130 10" />
          {Array.from({ length: 9 }).map((_, i) => {
            const y = 220 - i * 22, s = i % 2 ? 1 : -1
            return <path key={i} d={`M${102 + i * 2} ${y} q${s * 40} -8 ${s * 52} -36 q${-s * 34} 6 ${-s * 52} 36z`} />
          })}
        </svg>
      )}
      <p className={`t-mono relative text-[10px] transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-0'} ${hasImg ? 'text-khadiya/80' : 'text-ink/60'}`}>Used in · {h.in}</p>
      <div className={`relative transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-0'} ${hasImg ? 'text-khadiya' : 'text-ink'}`}>
        <p className="t-deva text-[44px] leading-none md:text-[54px]">{h.hi}</p>
        <p className="mt-1 t-accent text-3xl">{h.en}</p>
        <p className={`mt-2 text-[13px] leading-snug transition-opacity duration-500 ${active ? 'opacity-90' : 'opacity-0'}`}>{h.note}</p>
      </div>
    </div>
  )
}

export default function Herbs() {
  const root = useRef<HTMLElement>(null)
  const [idx, setIdx] = useState(0)
  const items: SpatialCardItem[] = useMemo(
    () => HERBS.map((h) => ({ id: h.slug, title: h.en, subtitle: h.hi, renderContent: (active: boolean) => <HerbCard h={h} active={active} /> })),
    [],
  )
  const onActive = useCallback((i: number) => setIdx(i), [])
  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const split = new SplitText('.herbs-title', { type: 'lines,words', linesClass: 'split-line' })
      gsap.from(split.words, { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: root.current, start: 'top 70%' } })
    }, root)
    return () => ctx.revert()
  }, [])
  const h = HERBS[idx]
  return (
    <section id="herbs" ref={root} data-nav="dark" className="khadiya-wall isolate relative overflow-hidden px-5 pb-10 pt-[9vh] md:px-10 md:pb-16 md:pt-[16vh]">
      <Backdrop tone="light" seed={5} flip />
      <div className="mx-auto grid max-w-[1400px] items-end gap-8 md:grid-cols-[1fr_auto]">
        <div>
          <p className="t-mono text-[11px] text-geru">03 · Nimad ki jadi-booti · जड़ी-बूटी</p>
          <h2 className="herbs-title t-display mt-4 text-[clamp(44px,7vw,120px)] text-ink">Eighteen ingredients.<br />Not one you can&apos;t <em className="text-geru">pronounce.</em></h2>
        </div>
        <div className="text-right">
          <p className="font-mono text-6xl text-geru tabular-nums">{String(idx + 1).padStart(2, '0')}<span className="text-2xl text-ink/30">/{HERBS.length}</span></p>
          <p className="t-deva text-2xl text-ink">{h.hi}</p>
        </div>
      </div>
      <SpatialCardCarousel items={items} onActiveChange={onActive} className="mx-auto mt-6 h-[620px] max-w-[1400px] md:h-[720px]" ariaLabel="Ingredients" />
    </section>
  )
}
