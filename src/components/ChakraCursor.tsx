import { useEffect, useRef, useState } from 'react'

/**
 * Chakra cursor: a 12-spoke wheel with a lotus rim that *rolls* with your movement.
 * Variants: default · link (spokes bloom) · labelled (red disc, label orbits on a circle)
 * · rotate (arrows) · pressed (compress + petal burst). On touch screens every tap
 * blooms a small spinning chakra with petals instead.
 */
type Variant = 'default' | 'link' | 'label' | 'rotate' | 'hidden'

const PETAL_COLORS = ['#ffd9a0', '#faf6ee', '#d7192a', '#c9a24b']

interface Particle { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number; rot: number; vr: number; c: string; kind: 'petal' | 'ring' }

export default function ChakraCursor() {
  const wrap = useRef<HTMLDivElement>(null)
  const wheel = useRef<SVGGElement>(null)
  const cv = useRef<HTMLCanvasElement>(null)
  const [variant, setVariant] = useState<Variant>('default')
  const [label, setLabel] = useState('')
  const fine = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

  useEffect(() => {
    const canvas = cv.current!
    const ctx = canvas.getContext('2d')!
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const size = () => { canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr }
    size()
    window.addEventListener('resize', size)

    const parts: Particle[] = []
    const trail: { x: number; y: number; t: number }[] = []
    const pos = { x: innerWidth / 2, y: innerHeight / 2, tx: innerWidth / 2, ty: innerHeight / 2, rot: 0, scale: 1, ts: 1 }
    let raf = 0, running = false, lastMove = 0

    const burst = (x: number, y: number, n: number, ring: boolean) => {
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + Math.random() * 0.4, sp = (ring ? 70 : 120) + Math.random() * (ring ? 110 : 220)
        parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60, life: 0, max: 0.7 + Math.random() * 0.5, r: 3 + Math.random() * 4, rot: a, vr: (Math.random() - 0.5) * 10, c: PETAL_COLORS[i % PETAL_COLORS.length], kind: 'petal' })
      }
      if (ring) parts.push({ x, y, vx: 0, vy: 0, life: 0, max: 0.65, r: 6, rot: 0, vr: 6, c: '#faf6ee', kind: 'ring' })
      wake()
    }

    const drawChakra = (x: number, y: number, r: number, rot: number, alpha: number) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = alpha
      ctx.strokeStyle = '#faf6ee'; ctx.lineWidth = 1.6 * dpr
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke()
      for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * 0.2, Math.sin(a) * r * 0.2); ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); ctx.stroke() }
      ctx.restore()
    }

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = 1 / 60
      // cursor follow
      if (fine && wrap.current) {
        const dx = pos.tx - pos.x
        pos.x += dx * 0.28; pos.y += (pos.ty - pos.y) * 0.28
        pos.rot += dx * 0.9 + 0.25 // rolls like a wheel, always turning a little
        pos.scale += (pos.ts - pos.scale) * 0.2
        wrap.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
        if (wheel.current) wheel.current.style.transform = `rotate(${pos.rot}deg) scale(${pos.scale})`
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // trail: a fading saffron comet
      if (fine) {
        trail.push({ x: pos.x, y: pos.y, t: now })
        while (trail.length && now - trail[0].t > 260) trail.shift()
        for (let i = 1; i < trail.length; i++) {
          const a = i / trail.length
          ctx.strokeStyle = `rgba(255, 196, 120, ${a * 0.55})`
          ctx.lineWidth = a * 3 * dpr
          ctx.beginPath(); ctx.moveTo(trail[i - 1].x * dpr, trail[i - 1].y * dpr); ctx.lineTo(trail[i].x * dpr, trail[i].y * dpr); ctx.stroke()
        }
      }
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]
        p.life += dt
        if (p.life > p.max) { parts.splice(i, 1); continue }
        const k = p.life / p.max
        if (p.kind === 'ring') {
          drawChakra(p.x * dpr, p.y * dpr, (14 + k * 46) * dpr, p.rot += p.vr * dt, 1 - k)
          continue
        }
        p.vy += 420 * dt; p.vx *= 0.97
        p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt
        ctx.save(); ctx.translate(p.x * dpr, p.y * dpr); ctx.rotate(p.rot); ctx.globalAlpha = 1 - k
        ctx.fillStyle = p.c
        ctx.beginPath(); ctx.ellipse(0, 0, p.r * dpr * 1.8, p.r * dpr * 0.8, 0, 0, Math.PI * 2); ctx.fill()
        ctx.restore()
      }
      // sleep when idle to save battery
      if (!parts.length && now - lastMove > 400) { cancelAnimationFrame(raf); running = false }
    }
    const wake = () => { lastMove = performance.now(); if (!running) { running = true; raf = requestAnimationFrame(tick) } }

    const classify = (t: HTMLElement | null) => {
      const el = t?.closest<HTMLElement>('[data-cursor],a,button,input,textarea,select,label')
      if (!el) { setVariant('default'); setLabel(''); return }
      if (el.matches('input,textarea,select')) { setVariant('hidden'); return }
      const l = el.dataset.cursor
      if (l && /rotate|drag|turn/i.test(l)) { setVariant('rotate'); setLabel(l); return }
      if (l && l.length > 1) { setVariant('label'); setLabel(l); return }
      setVariant('link'); setLabel('')
    }
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      pos.tx = e.clientX; pos.ty = e.clientY
      classify(e.target as HTMLElement)
      wake()
    }
    // touch: bloom only on a genuine TAP of something tappable — never while scrolling
    let tap: { x: number; y: number; t: number; el: Element | null } | null = null
    const down = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') { pos.ts = 0.78; burst(e.clientX, e.clientY, 10, false); return }
      tap = { x: e.clientX, y: e.clientY, t: performance.now(), el: (e.target as Element)?.closest?.('a,button,[data-cursor]') ?? null }
    }
    const up = (e: PointerEvent) => {
      pos.ts = 1
      if (e.pointerType === 'mouse' || !tap) return
      const moved = Math.hypot(e.clientX - tap.x, e.clientY - tap.y)
      if (tap.el && moved < 10 && performance.now() - tap.t < 350) burst(e.clientX, e.clientY, 6, true)
      tap = null
    }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down, { passive: true })
    window.addEventListener('pointerup', up, { passive: true })
    if (fine) document.documentElement.classList.add('has-cursor')
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', size)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [fine])

  const R = variant === 'label' ? 46 : variant === 'link' ? 26 : variant === 'rotate' ? 34 : 15
  return (
    <>
      <canvas ref={cv} className="pointer-events-none fixed inset-0 z-[96] h-full w-full" aria-hidden />
      {fine && (
        <div ref={wrap} className="pointer-events-none fixed left-0 top-0 z-[97]" aria-hidden style={{ opacity: variant === 'hidden' ? 0 : 1, transition: 'opacity .2s' }}>
          <svg width="140" height="140" viewBox="-70 -70 140 140" className="-ml-[70px] -mt-[70px] overflow-visible" style={{ mixBlendMode: variant === 'label' ? 'normal' : 'difference' }}>
            <defs><path id="cc-path" d="M -38 0 a 38 38 0 1 1 76 0 a 38 38 0 1 1 -76 0" /></defs>
            <g ref={wheel}>
              <circle r={R} fill={variant === 'label' ? '#b3121f' : 'none'} stroke="#faf6ee" strokeWidth={variant === 'label' ? 0 : 1.6} style={{ transition: 'r .45s cubic-bezier(.16,1,.3,1)' }} />
              {/* 12 spokes */}
              {Array.from({ length: 12 }).map((_, i) => (
                <line key={i} x1="0" y1={-R * 0.22} x2="0" y2={-R * (variant === 'link' ? 1.25 : 0.96)} stroke="#faf6ee" strokeWidth={variant === 'label' ? 1 : 1.4} strokeOpacity={variant === 'label' ? 0.35 : 1} transform={`rotate(${i * 30})`} style={{ transition: 'all .45s cubic-bezier(.16,1,.3,1)' }} />
              ))}
              {/* lotus rim petals, bloom on links */}
              {variant !== 'default' && Array.from({ length: 12 }).map((_, i) => (
                <path key={`p${i}`} d={`M0 ${-R} q 5 -9 0 -16 q -5 7 0 16z`} fill="#faf6ee" fillOpacity={variant === 'label' ? 0.9 : 0.85} transform={`rotate(${i * 30 + 15})`} style={{ animation: 'ccBloom .5s cubic-bezier(.16,1,.3,1) both', animationDelay: `${i * 18}ms` }} />
              ))}
              <circle r={variant === 'label' ? 0 : 2.6} fill="#faf6ee" />
              {variant === 'label' && (
                <text fontSize="10.5" fontFamily="JetBrains Mono, monospace" letterSpacing="3" fill="#faf6ee">
                  <textPath href="#cc-path">{`${label.toUpperCase()} · `.repeat(Math.max(2, Math.ceil(14 / (label.length + 3))))}</textPath>
                </text>
              )}
            </g>
            {variant === 'rotate' && <text textAnchor="middle" dy="5" fontSize="14" fill="#faf6ee">⟲ ⟳</text>}
            {variant === 'label' && <text textAnchor="middle" dy="5" fontSize="15" fill="#faf6ee" fontFamily="Tillana, serif" fontWeight="800">{label === 'Add' ? '+' : '•'}</text>}
          </svg>
          <style>{`@keyframes ccBloom{from{opacity:0;transform-box:fill-box;transform-origin:center bottom;transform:scale(0)}to{opacity:1}}`}</style>
        </div>
      )}
    </>
  )
}
