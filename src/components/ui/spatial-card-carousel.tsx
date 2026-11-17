'use client'
/**
 * Spatial card carousel, adapted from the supplied component for The Nimad:
 * - Nimad palette, no demo items (items are required)
 * - wheel hijacking removed (it fights page scrolling); drag, keys, click and autoplay kept
 */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'

export interface SpatialCardItem {
  id: string
  title: string
  subtitle?: string
  renderContent: (active: boolean) => React.ReactNode
}

interface Slot { xPct: number; yPct: number; zPx: number; scale: number; rotateX: number; rotateY: number; rotateZ: number; opacity: number; zIndex: number; blur: number }

const SLOTS: Slot[] = [
  { xPct: 0, yPct: 0, zPx: 0, scale: 1, rotateX: 0, rotateY: 0, rotateZ: 0, opacity: 1, zIndex: 40, blur: 0 },
  { xPct: -78, yPct: -44, zPx: -80, scale: 0.42, rotateX: 7, rotateY: 15, rotateZ: -4, opacity: 0.94, zIndex: 24, blur: 0 },
  { xPct: -68, yPct: 48, zPx: -60, scale: 0.44, rotateX: -6, rotateY: 13, rotateZ: 4, opacity: 0.96, zIndex: 28, blur: 0 },
  { xPct: 92, yPct: 8, zPx: -95, scale: 0.42, rotateX: 4, rotateY: -16, rotateZ: 3, opacity: 0.92, zIndex: 22, blur: 0 },
  { xPct: 82, yPct: -46, zPx: -140, scale: 0.36, rotateX: 9, rotateY: -14, rotateZ: 5, opacity: 0.88, zIndex: 18, blur: 0.25 },
  { xPct: -108, yPct: 6, zPx: -180, scale: 0.34, rotateX: -5, rotateY: 20, rotateZ: -5, opacity: 0.82, zIndex: 14, blur: 0.4 },
  { xPct: 72, yPct: 50, zPx: -115, scale: 0.38, rotateX: -7, rotateY: -13, rotateZ: -3, opacity: 0.9, zIndex: 20, blur: 0.2 },
  { xPct: -22, yPct: -58, zPx: -240, scale: 0.28, rotateX: 11, rotateY: 8, rotateZ: -2, opacity: 0.72, zIndex: 10, blur: 0.7 },
  { xPct: 16, yPct: 58, zPx: -220, scale: 0.28, rotateX: -9, rotateY: -8, rotateZ: 3, opacity: 0.75, zIndex: 12, blur: 0.55 },
  { xPct: 112, yPct: -16, zPx: -270, scale: 0.26, rotateX: 6, rotateY: -20, rotateZ: 7, opacity: 0.68, zIndex: 8, blur: 0.85 },
]

function slotFor(offset: number, total: number): Slot {
  if (offset < SLOTS.length) return SLOTS[offset]
  const a = (offset / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2
  return { xPct: Math.cos(a) * 102, yPct: Math.sin(a) * 54, zPx: -240, scale: 0.26, rotateX: 6, rotateY: Math.cos(a) * -18, rotateZ: Math.sin(a) * 5, opacity: 0.6, zIndex: 6, blur: 0.9 }
}

const coarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
const SPRING = { type: 'spring' as const, stiffness: 118, damping: 25, mass: 1.02 }

export function SpatialCardCarousel({
  items, autoPlay = true, interval = 2800, onActiveChange, className = '', ariaLabel = 'Herbs carousel',
}: {
  items: SpatialCardItem[]; autoPlay?: boolean; interval?: number; onActiveChange?: (i: number) => void; className?: string; ariaLabel?: string
}) {
  const reduce = useReducedMotion()
  const total = items.length
  const [active, setActive] = useState(0)
  const [hover, setHover] = useState(false)
  const [tick, setTick] = useState(0)
  const stageRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; y: number } | null>(null)
  const dragged = useRef(false)

  const rx = useMotionValue(0), ry = useMotionValue(0)
  const sy = useSpring(rx, { stiffness: 120, damping: 24 }), sx = useSpring(ry, { stiffness: 120, damping: 24 })
  const rotY = useTransform(sy, [-0.5, 0.5], [-6, 6]), rotX = useTransform(sx, [-0.5, 0.5], [5, -5])

  const step = useCallback((d: number) => { setActive((p) => (((p + d) % total) + total) % total); setTick((t) => t + 1) }, [total])
  useEffect(() => { onActiveChange?.(active) }, [active, onActiveChange])
  useEffect(() => {
    if (!autoPlay || hover || total < 2) return
    const id = window.setInterval(() => setActive((p) => (p + 1) % total), Math.max(900, interval))
    return () => window.clearInterval(id)
  }, [autoPlay, hover, interval, total, tick])

  return (
    <div
      ref={stageRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      data-slide=""
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1) }}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => { setHover(false); drag.current = null; rx.set(0); ry.set(0) }}
      onPointerDown={(e) => { drag.current = { x: e.clientX, y: e.clientY }; dragged.current = false }}
      onPointerMove={(e) => {
        if (drag.current && Math.hypot(e.clientX - drag.current.x, e.clientY - drag.current.y) > 8) dragged.current = true
        if (reduce || !stageRef.current) return
        const r = stageRef.current.getBoundingClientRect()
        rx.set((e.clientX - r.left) / r.width - 0.5); ry.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onPointerUp={(e) => {
        if (!drag.current) return
        const dx = e.clientX - drag.current.x
        drag.current = null
        if (Math.abs(dx) >= 36) step(dx < 0 ? 1 : -1)
      }}
      className={`relative flex w-full touch-pan-y select-none items-center justify-center overflow-hidden focus-visible:outline-none ${className}`}
      style={{ perspective: '1500px' }}
      data-cursor="Drag"
    >
      <div className="sr-only" aria-live="polite">{`${items[active].title} (${active + 1} of ${total})`}</div>
      <motion.div className="relative flex h-full w-full items-center justify-center" style={{ transformStyle: 'preserve-3d', rotateX: reduce ? 0 : rotX, rotateY: reduce ? 0 : rotY }}>
        {items.map((item, idx) => {
          const offset = (idx - active + total) % total
          const hero = offset === 0
          const s = slotFor(offset, total)
          return (
            <motion.button
              key={item.id}
              type="button"
              aria-label={hero ? `${item.title} (active)` : `Show ${item.title}`}
              onClick={() => { if (dragged.current) return; if (hero) step(1); else { setActive(idx); setTick((t) => t + 1) } }}
              initial={false}
              animate={reduce ? { x: `${s.xPct}%`, y: `${s.yPct}%`, scale: s.scale, opacity: s.opacity } : { x: `${s.xPct}%`, y: `${s.yPct}%`, z: s.zPx, scale: s.scale, rotateX: s.rotateX, rotateY: s.rotateY, rotateZ: s.rotateZ, opacity: s.opacity }}
              transition={reduce ? { duration: 0.25 } : { ...SPRING, opacity: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
              whileHover={!hero && !reduce ? { scale: s.scale * 1.08, opacity: 1 } : undefined}
              style={{ zIndex: s.zIndex, filter: s.blur && !coarse ? `blur(${s.blur}px)` : undefined, transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}
              className={`absolute aspect-[4/5] w-[230px] overflow-hidden rounded-[18px] border border-ink/10 text-left shadow-[0_30px_70px_-18px_rgba(42,5,8,0.45)] sm:w-[290px] md:w-[330px] ${hero ? 'ring-1 ring-geru/30' : ''}`}
            >
              <motion.div className="h-full w-full" animate={reduce || hero || coarse ? { y: 0 } : { y: [0, idx % 2 ? 5 : -5, 0] }} transition={reduce || hero ? { duration: 0.4 } : { duration: 5 + (idx % 3) * 0.9, repeat: Infinity, ease: 'easeInOut' }}>
                {item.renderContent(hero)}
              </motion.div>
            </motion.button>
          )
        })}
      </motion.div>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        <button onClick={() => step(-1)} className="grid size-11 place-items-center rounded-full border border-ink/20 bg-khadiya/80 backdrop-blur" aria-label="Previous">←</button>
        <button onClick={() => step(1)} className="grid size-11 place-items-center rounded-full bg-geru text-khadiya" aria-label="Next">→</button>
      </div>
    </div>
  )
}

export default SpatialCardCarousel
