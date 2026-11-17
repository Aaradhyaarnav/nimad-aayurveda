import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BRAND, LIVE, byId, inr } from '@/data/site'
import { lockScroll } from '@/lib/motion'
import { useCart, type Customer } from '@/store/cart'

const EMPTY: Customer = { name: '', phone: '', address: '', pincode: '', note: '' }
const KEY = 'nimad-customer-v1'

export default function CartDrawer() {
  const { open, setOpen, lines, subtotal, setQty, remove, add, orderLink, orderMessage, count } = useCart()
  const [step, setStep] = useState<'bag' | 'details'>('bag')
  const [c, setC] = useState<Customer>(() => {
    try { return { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') } } catch { return EMPTY }
  })
  const [tried, setTried] = useState(false)
  const sheet = typeof window !== 'undefined' && window.innerWidth < 768

  useEffect(() => { lockScroll(open); if (!open) setStep('bag') }, [open])
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify({ ...c, note: '' })) } catch { /* ignore */ } }, [c])
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [setOpen])

  const valid = c.name.trim().length > 1 && /^[6-9]\d{9}$/.test(c.phone.replace(/\D/g, '').slice(-10)) && c.address.trim().length > 6 && /^\d{6}$/.test(c.pincode.trim())
  const suggestions = LIVE.filter((p) => !lines.some((l) => l.id === p.id)).slice(0, 2)

  const send = () => {
    setTried(true)
    if (!valid) return
    window.open(orderLink(c), '_blank', 'noopener')
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="veil" className="fixed inset-0 z-[80] bg-geru-ink/50 backdrop-blur-[3px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.aside
            key="drawer"
            role="dialog" aria-modal="true" aria-label="Your bag"
            className={sheet
              ? 'fixed inset-x-0 bottom-0 z-[81] flex h-[90svh] flex-col rounded-t-[28px] bg-khadiya text-ink shadow-2xl'
              : 'fixed inset-y-0 right-0 z-[81] flex w-full max-w-[480px] flex-col bg-khadiya text-ink shadow-2xl'}
            initial={sheet ? { y: '100%' } : { x: '100%' }} animate={sheet ? { y: 0 } : { x: 0 }} exit={sheet ? { y: '100%' } : { x: '100%' }}
            transition={{ duration: sheet ? 0.55 : 0.75, ease: [0.76, 0, 0.24, 1] }}
            drag={sheet ? 'y' : false} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => { if (info.offset.y > 120 || info.velocity.y > 600) setOpen(false) }}
            data-lenis-prevent
          >
            {sheet && <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-ink/20" aria-hidden />}
            <header className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <div>
                <p className="font-display text-3xl leading-none">{step === 'bag' ? 'Your bag' : 'Delivery details'}</p>
                <p className="t-mono mt-1 text-[10px] text-ink/50">{step === 'bag' ? `${count} item${count === 1 ? '' : 's'} · आपका थैला` : 'Step 2 of 2 · Order on WhatsApp'}</p>
              </div>
              <button onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-full border border-ink/15 hover:bg-ink hover:text-khadiya" aria-label="Close bag">✕</button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="t-deva text-6xl text-geru">खाली</p>
                  <p className="mt-2 t-accent text-2xl">Your bag is empty.</p>
                  <p className="mt-2 max-w-xs text-sm text-ink/60">Start with Shatghritam, the ghee washed a hundred times.</p>
                  <button onClick={() => { add('shatghritam') }} className="mt-6 rounded-full bg-geru px-6 py-3 text-sm text-khadiya">Add Shatghritam · {inr(byId('shatghritam').price!)}</button>
                </div>
              ) : step === 'bag' ? (
                <>
                  <ul className="space-y-4">
                    {lines.map((l) => {
                      const p = byId(l.id)
                      return (
                        <motion.li layout key={l.id} className="flex gap-4 rounded-2xl p-3" style={{ background: p.tint }}>
                          <img src={p.photo} alt="" className="size-20 rounded-xl object-cover" />
                          <div className="flex flex-1 flex-col justify-between">
                            <div className="flex justify-between gap-2">
                              <div>
                                <p className="font-medium leading-tight">{p.name}</p>
                                <p className="text-xs text-ink/60">{p.size ?? p.kicker}</p>
                              </div>
                              <button onClick={() => remove(l.id)} className="text-xs text-ink/50 hover:text-geru">Remove</button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center rounded-full bg-khadiya">
                                <button onClick={() => setQty(l.id, l.qty - 1)} className="grid size-8 place-items-center" aria-label="Decrease">−</button>
                                <span className="w-6 text-center font-mono text-sm tabular-nums">{l.qty}</span>
                                <button onClick={() => setQty(l.id, l.qty + 1)} className="grid size-8 place-items-center" aria-label="Increase">+</button>
                              </div>
                              <span className="font-mono">{inr((p.price ?? 0) * l.qty)}</span>
                            </div>
                          </div>
                        </motion.li>
                      )
                    })}
                  </ul>
                  {suggestions.length > 0 && (
                    <div className="mt-8">
                      <p className="t-mono text-[10px] text-ink/50">Pairs well with</p>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        {suggestions.map((p) => (
                          <button key={p.id} onClick={() => add(p.id)} className="rounded-2xl border border-ink/10 p-3 text-left transition hover:border-geru">
                            <img src={p.photo} alt="" className="aspect-square w-full rounded-xl object-cover" />
                            <p className="mt-2 text-sm font-medium leading-tight">{p.name}</p>
                            <p className="font-mono text-xs text-ink/60">+ {inr(p.price ?? 0)}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); send() }}>
                  {([
                    ['name', 'Naam · Full name', 'text', 'name'],
                    ['phone', 'Phone (WhatsApp)', 'tel', 'tel'],
                    ['address', 'Pata · Full address', 'textarea', 'street-address'],
                    ['pincode', 'Pincode', 'text', 'postal-code'],
                    ['note', 'Note (optional)', 'text', 'off'],
                  ] as const).map(([k, label, type, ac]) => {
                    const bad = tried && k !== 'note' && !(
                      k === 'name' ? c.name.trim().length > 1
                        : k === 'phone' ? /^[6-9]\d{9}$/.test(c.phone.replace(/\D/g, '').slice(-10))
                          : k === 'address' ? c.address.trim().length > 6
                            : /^\d{6}$/.test(c.pincode.trim()))
                    const cls = `mt-1 w-full rounded-xl border bg-white/60 px-4 py-3 text-[15px] outline-none transition focus:border-geru ${bad ? 'border-geru' : 'border-ink/15'}`
                    return (
                      <label key={k} className="block">
                        <span className="t-mono text-[10px] text-ink/60">{label}</span>
                        {type === 'textarea'
                          ? <textarea rows={3} autoComplete={ac} className={cls} value={c[k]} onChange={(e) => setC({ ...c, [k]: e.target.value })} />
                          : <input type={type} inputMode={k === 'phone' || k === 'pincode' ? 'numeric' : undefined} autoComplete={ac} className={cls} value={c[k]} onChange={(e) => setC({ ...c, [k]: e.target.value })} />}
                        {bad && <span className="mt-1 block text-xs text-geru">{k === 'phone' ? 'Enter a 10-digit Indian mobile number' : k === 'pincode' ? 'Enter a 6-digit pincode' : 'Please fill this in'}</span>}
                      </label>
                    )
                  })}
                  <details className="rounded-xl bg-ink/[0.04] p-4 text-sm">
                    <summary className="cursor-pointer text-ink/70">Preview the WhatsApp message</summary>
                    <pre className="mt-3 whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-ink/80">{orderMessage(c)}</pre>
                  </details>
                </form>
              )}
            </div>

            {lines.length > 0 && (
              <footer className="border-t border-ink/10 px-6 py-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-ink/60">Subtotal</span>
                  <span className="font-display text-4xl">{inr(subtotal)}</span>
                </div>
                <p className="mt-1 text-xs text-ink/50">{BRAND.deliveryNote}. Payment details are shared on WhatsApp.</p>
                {step === 'bag' ? (
                  <button onClick={() => setStep('details')} className="mt-4 w-full rounded-full bg-geru py-4 text-[15px] font-medium text-khadiya transition hover:bg-geru-hot">Continue →</button>
                ) : (
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => setStep('bag')} className="rounded-full border border-ink/20 px-5 py-4 text-sm">←</button>
                    <button onClick={send} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#1f7a4d] py-4 text-[15px] font-medium text-white transition hover:bg-[#186640]">
                      <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.1-.2-.2-.4-.3Z" /></svg>
                      Order on WhatsApp
                    </button>
                  </div>
                )}
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
