import { forwardRef, useEffect, useImperativeHandle, useRef, type PointerEvent as RPE } from 'react'
import { buzz } from '@/lib/device'

/**
 * Blender-rendered frame sequence drawn to a canvas.
 * - `setProgress(p)` scrubs it (scroll-driven)
 * - `draggable` lets people swipe / drag to rotate a turntable, with inertia
 * - `autoplay` spins slowly while visible
 * Falls back to a still image until frames load (or if they don't exist yet).
 */
export interface FrameSequenceHandle { setProgress: (p: number) => void }

interface Props {
  name: string
  frames: number
  fallback?: string
  className?: string
  draggable?: boolean
  autoplay?: number // revolutions per second (0 = off)
  loop?: boolean
  priority?: boolean
}

const cache = new Map<string, HTMLImageElement[]>()

function load(name: string, frames: number, priority: boolean) {
  const key = `${name}:${frames}`
  if (cache.has(key)) return cache.get(key)!
  const imgs = Array.from({ length: frames }, (_, i) => {
    const im = new Image()
    im.decoding = 'async'
    if ('fetchPriority' in im) (im as HTMLImageElement & { fetchPriority: string }).fetchPriority = priority && i < 4 ? 'high' : 'low'
    im.src = `/seq/${name}/${String(i).padStart(3, '0')}.webp`
    return im
  })
  cache.set(key, imgs)
  return imgs
}

const FrameSequence = forwardRef<FrameSequenceHandle, Props>(function FrameSequence(
  { name, frames, fallback, className = '', draggable = false, autoplay = 0, loop = true, priority = false },
  ref,
) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const fb = useRef<HTMLImageElement>(null)
  const state = useRef({ p: 0, base: 0, spin: 0, target: 0, vel: 0, drawn: -1, visible: false, ready: false, dragging: false, lastX: 0, imgs: [] as HTMLImageElement[] })

  useImperativeHandle(ref, () => ({ setProgress: (p) => { state.current.base = p } }), [])

  useEffect(() => {
    const st = state.current
    const cv = canvas.current!
    let started = false
    const io = new IntersectionObserver(([e]) => {
      st.visible = e.isIntersecting
      if (e.isIntersecting && !started) { started = true; st.imgs = load(name, frames, priority) }
    }, { rootMargin: '400px' })
    io.observe(cv)

    const ctx = cv.getContext('2d')!
    const size = () => {
      const r = cv.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      cv.width = Math.max(1, Math.round(r.width * dpr))
      cv.height = Math.max(1, Math.round(r.height * dpr))
      st.drawn = -1
    }
    size()
    const ro = new ResizeObserver(size)
    ro.observe(cv)

    let raf = 0, last = performance.now(), lastFrame = -1
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!st.visible || !st.imgs.length) return
      // scroll (base) + autoplay/drag/inertia (spin) are independent layers, so nothing ever "freezes"
      if (autoplay && !st.dragging) st.spin += autoplay * dt
      if (!st.dragging) { st.spin += st.vel * dt; st.vel *= Math.pow(0.04, dt) }
      st.target = st.base + (loop ? st.spin : 0)
      st.p += (st.target - st.p) * Math.min(1, dt * 12)
      const p = loop ? ((st.p % 1) + 1) % 1 : Math.min(1, Math.max(0, st.p))
      let idx = Math.min(frames - 1, Math.floor(p * frames))
      // find the nearest loaded frame
      let im = st.imgs[idx]
      if (!im.complete || !im.naturalWidth) {
        for (let k = 1; k < frames; k++) {
          const a = st.imgs[(idx - k + frames) % frames]
          if (a.complete && a.naturalWidth) { im = a; idx = (idx - k + frames) % frames; break }
        }
      }
      if (!im.complete || !im.naturalWidth) return
      if (!st.ready) { st.ready = true; cv.style.opacity = '1'; if (fb.current) fb.current.style.opacity = '0' }
      if (idx === st.drawn) return
      if (draggable && idx !== lastFrame && idx % Math.round(frames / 6) === 0 && st.dragging) buzz(4)
      lastFrame = idx
      st.drawn = idx
      const s = Math.min(cv.width / im.naturalWidth, cv.height / im.naturalHeight)
      const w = im.naturalWidth * s, h = im.naturalHeight * s
      ctx.clearRect(0, 0, cv.width, cv.height)
      ctx.drawImage(im, (cv.width - w) / 2, (cv.height - h) / 2, w, h)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect() }
  }, [name, frames, autoplay, loop, draggable, priority])

  const down = (e: RPE) => {
    if (!draggable) return
    const st = state.current
    st.dragging = true; st.lastX = e.clientX; st.vel = 0
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  const move = (e: RPE) => {
    const st = state.current
    if (!st.dragging) return
    const dx = e.clientX - st.lastX
    st.lastX = e.clientX
    const d = dx / 420
    st.spin += d
    st.vel = d * 60
  }
  const up = () => { state.current.dragging = false }

  return (
    <div
      className={`relative ${draggable ? 'cursor-grab touch-pan-y active:cursor-grabbing' : ''} ${className}`}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
      data-cursor={draggable ? 'Rotate' : undefined}
    >
      {fallback && <img ref={fb} src={fallback} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-contain transition-opacity duration-500" draggable={false} />}
      <canvas ref={canvas} className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500" />
    </div>
  )
})

export default FrameSequence

/** sequence registry: name → frame count */
export const SEQ = {
  shatghritam: 30,
  'shatghritam-open': 24,
  oil: 30,
  facewash: 30,
  soap: 30,
} as const
