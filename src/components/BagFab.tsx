import { useEffect, useRef, useState } from 'react'
import { useCart } from '@/store/cart'
import { gsap } from '@/lib/motion'
import { buzz } from '@/lib/device'

/** Thumb-reachable bag button for phones; appears once you leave the hero. */
export default function BagFab() {
  const { count, subtotal, setOpen, lastAdded } = useCart()
  const [show, setShow] = useState(false)
  const el = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 1.2)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => {
    if (lastAdded && el.current) gsap.fromTo(el.current, { scale: 1 }, { scale: 1.15, yoyo: true, repeat: 1, duration: 0.16 })
  }, [lastAdded])
  return (
    <button
      ref={el}
      onClick={() => { buzz(8); setOpen(true) }}
      className={`fixed bottom-4 right-4 z-[60] flex items-center gap-3 rounded-full bg-geru py-2 pl-2 pr-5 text-khadiya shadow-[0_14px_40px_-10px_rgba(42,5,8,.7)] transition-all duration-500 md:hidden ${show && count > 0 ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-24 opacity-0'}`}
      aria-label={`Open bag, ${count} items`}
    >
      <span className="grid size-10 place-items-center rounded-full bg-khadiya font-mono text-sm text-geru">{count}</span>
      <span className="text-left leading-tight"><span className="block text-[13px] font-medium">View bag</span><span className="font-mono text-[11px] opacity-80">₹{subtotal.toLocaleString('en-IN')}</span></span>
    </button>
  )
}
