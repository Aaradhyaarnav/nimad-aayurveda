import { useMemo } from 'react'

/**
 * Procedural Mandana: the white-chalk floor/wall art of Nimad & Malwa.
 * Built from concentric rings of petals, dots, chevrons and a lotus core.
 * Every stroke carries `data-draw` so anime.js / GSAP can draw it in.
 */
interface Props {
  size?: number
  rings?: number
  className?: string
  stroke?: string
  strokeWidth?: number
  seed?: number
}

const TAU = Math.PI * 2

export default function Mandana({ size = 600, rings = 5, className, stroke = 'currentColor', strokeWidth = 2, seed = 1 }: Props) {
  const c = size / 2
  const paths = useMemo(() => {
    const out: { d: string; w?: number; dot?: boolean }[] = []
    const R = c * 0.96
    // lotus core
    const corePetals = 8
    for (let i = 0; i < corePetals; i++) {
      const a = (i / corePetals) * TAU
      const r1 = R * 0.06, r2 = R * 0.2
      const x1 = c + Math.cos(a) * r1, y1 = c + Math.sin(a) * r1
      const x2 = c + Math.cos(a) * r2, y2 = c + Math.sin(a) * r2
      const s = 0.42
      const cx1 = c + Math.cos(a - s) * r2 * 0.75, cy1 = c + Math.sin(a - s) * r2 * 0.75
      const cx2 = c + Math.cos(a + s) * r2 * 0.75, cy2 = c + Math.sin(a + s) * r2 * 0.75
      out.push({ d: `M${x1} ${y1} Q${cx1} ${cy1} ${x2} ${y2} Q${cx2} ${cy2} ${x1} ${y1}` })
    }
    out.push({ d: circle(c, c, R * 0.05) })
    // rings
    const ringStep = (R * 0.78) / rings
    for (let k = 0; k < rings; k++) {
      const r = R * 0.24 + k * ringStep
      out.push({ d: circle(c, c, r) })
      const kind = (k + seed) % 4
      const n = 8 * (k + 2)
      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU + (k % 2 ? Math.PI / n : 0)
        const rOut = r + ringStep * 0.82
        if (kind === 0) {
          // petal arches
          const a2 = ((i + 1) / n) * TAU + (k % 2 ? Math.PI / n : 0)
          const xm = c + Math.cos((a + a2) / 2) * rOut, ym = c + Math.sin((a + a2) / 2) * rOut
          out.push({ d: `M${c + Math.cos(a) * r} ${c + Math.sin(a) * r} Q${xm} ${ym} ${c + Math.cos(a2) * r} ${c + Math.sin(a2) * r}` })
        } else if (kind === 1) {
          // leaf petals
          const s = (Math.PI / n) * 0.8
          const x1 = c + Math.cos(a) * r, y1 = c + Math.sin(a) * r
          const x2 = c + Math.cos(a) * rOut, y2 = c + Math.sin(a) * rOut
          const rm = (r + rOut) / 2
          out.push({ d: `M${x1} ${y1} Q${c + Math.cos(a - s) * rm} ${c + Math.sin(a - s) * rm} ${x2} ${y2} Q${c + Math.cos(a + s) * rm} ${c + Math.sin(a + s) * rm} ${x1} ${y1}` })
        } else if (kind === 2) {
          // chevrons
          const s = (Math.PI / n) * 0.9
          const rm = r + ringStep * 0.55
          out.push({ d: `M${c + Math.cos(a - s) * r} ${c + Math.sin(a - s) * r} L${c + Math.cos(a) * rm} ${c + Math.sin(a) * rm} L${c + Math.cos(a + s) * r} ${c + Math.sin(a + s) * r}` })
        } else {
          // dots
          const rm = r + ringStep * 0.45
          out.push({ d: circle(c + Math.cos(a) * rm, c + Math.sin(a) * rm, Math.max(2, ringStep * 0.09)), dot: true })
        }
      }
    }
    out.push({ d: circle(c, c, R), w: strokeWidth * 1.4 })
    return out
  }, [c, rings, seed, strokeWidth])

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className={className} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {paths.map((p, i) => (
        <path key={i} d={p.d} data-draw="" strokeWidth={p.w} fill={p.dot ? stroke : 'none'} fillOpacity={p.dot ? 0.95 : 0} />
      ))}
    </svg>
  )
}

function circle(cx: number, cy: number, r: number) {
  return `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0`
}

/** A horizontal mandana border (used as section dividers). */
export function MandanaBorder({ className, count = 24 }: { className?: string; count?: number }) {
  const w = count * 40
  return (
    <svg viewBox={`0 0 ${w} 40`} className={className} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden preserveAspectRatio="none">
      <path data-draw="" d={`M0 20 H${w}`} />
      {Array.from({ length: count }).map((_, i) => (
        <g key={i}>
          <path data-draw="" d={`M${i * 40 + 6} 20 Q${i * 40 + 20} 2 ${i * 40 + 34} 20 Q${i * 40 + 20} 38 ${i * 40 + 6} 20`} />
          <circle cx={i * 40 + 20} cy={20} r={2.4} fill="currentColor" />
        </g>
      ))}
    </svg>
  )
}
