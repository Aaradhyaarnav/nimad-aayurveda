import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { BRAND, byId, inr, type ProductId, waLink } from '@/data/site'

export interface Line { id: ProductId; qty: number }
export interface Customer { name: string; phone: string; address: string; pincode: string; note: string }

interface CartCtx {
  lines: Line[]
  count: number
  subtotal: number
  open: boolean
  setOpen: (v: boolean) => void
  add: (id: ProductId, qty?: number) => void
  addMany: (ids: ProductId[]) => void
  setQty: (id: ProductId, qty: number) => void
  remove: (id: ProductId) => void
  clear: () => void
  lastAdded: { id: ProductId; t: number } | null
  orderMessage: (c: Customer) => string
  orderLink: (c: Customer) => string
}

const Ctx = createContext<CartCtx | null>(null)
const KEY = 'nimad-cart-v1'

function load(): Line[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Line[]
    return parsed.filter((l) => byId(l.id)?.status === 'live' && l.qty > 0)
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>(load)
  const [open, setOpen] = useState(false)
  const [lastAdded, setLastAdded] = useState<CartCtx['lastAdded']>(null)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(lines)) } catch { /* private mode */ }
  }, [lines])

  const add = useCallback((id: ProductId, qty = 1) => {
    setLines((ls) => {
      const hit = ls.find((l) => l.id === id)
      return hit ? ls.map((l) => (l.id === id ? { ...l, qty: Math.min(20, l.qty + qty) } : l)) : [...ls, { id, qty }]
    })
    setLastAdded({ id, t: Date.now() })
  }, [])
  const addMany = useCallback((ids: ProductId[]) => { ids.forEach((id) => add(id, 1)); setOpen(true) }, [add])
  const setQty = useCallback((id: ProductId, qty: number) => {
    setLines((ls) => (qty <= 0 ? ls.filter((l) => l.id !== id) : ls.map((l) => (l.id === id ? { ...l, qty: Math.min(20, qty) } : l))))
  }, [])
  const remove = useCallback((id: ProductId) => setLines((ls) => ls.filter((l) => l.id !== id)), [])
  const clear = useCallback(() => setLines([]), [])

  const count = lines.reduce((s, l) => s + l.qty, 0)
  const subtotal = lines.reduce((s, l) => s + (byId(l.id).price ?? 0) * l.qty, 0)

  const orderMessage = useCallback(
    (c: Customer) => {
      const items = lines
        .map((l) => {
          const p = byId(l.id)
          const each = p.price ?? 0
          return `• ${l.qty} × ${p.name}${p.size ? ` (${p.size})` : ''} = ${inr(each * l.qty)}`
        })
        .join('\n')
      return [
        `🙏 Namaste ${BRAND.name}!`,
        '',
        'Mujhe ye order karna hai:',
        items,
        '',
        `*Subtotal: ${inr(subtotal)}*`,
        `(${BRAND.deliveryNote})`,
        '',
        `Naam: ${c.name}`,
        `Phone: ${c.phone}`,
        `Pata: ${c.address}`,
        `Pincode: ${c.pincode}`,
        c.note ? `Note: ${c.note}` : '',
        '',
        'प्रकृति शरणम् गच्छामि 🌿',
      ]
        .filter((x, i, a) => !(x === '' && a[i - 1] === ''))
        .join('\n')
    },
    [lines, subtotal],
  )
  const orderLink = useCallback((c: Customer) => waLink(orderMessage(c)), [orderMessage])

  const value = useMemo(
    () => ({ lines, count, subtotal, open, setOpen, add, addMany, setQty, remove, clear, lastAdded, orderMessage, orderLink }),
    [lines, count, subtotal, open, add, addMany, setQty, remove, clear, lastAdded, orderMessage, orderLink],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCart outside CartProvider')
  return c
}
