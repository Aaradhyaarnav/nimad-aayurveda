import Mandana, { MandanaBorder } from './Mandana'

/**
 * Rich section backdrop: two large mandana medallions bleeding off opposite corners,
 * a soft light wash and fine chalk borders — the same visual language on every wall.
 * `tone="light"` for khadiya (white) walls, `tone="dark"` for geru (red) walls.
 */
export default function Backdrop({ tone = 'light', seed = 1, flip = false, borders = true }: { tone?: 'light' | 'dark'; seed?: number; flip?: boolean; borders?: boolean }) {
  const ink = tone === 'light' ? 'text-geru/[0.075]' : 'text-[#ffd39a]/[0.11]'
  const wash = tone === 'light'
    ? 'radial-gradient(60% 50% at 85% 10%, rgba(201,162,75,.12), transparent 70%), radial-gradient(55% 45% at 10% 95%, rgba(179,18,31,.07), transparent 70%)'
    : 'radial-gradient(60% 50% at 80% 15%, rgba(255,150,90,.18), transparent 70%), radial-gradient(70% 60% at 50% 120%, rgba(20,0,4,.5), transparent 65%)'
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0" style={{ background: wash }} />
      <div className={`absolute ${flip ? '-left-[22vmin] -top-[22vmin]' : '-right-[22vmin] -top-[22vmin]'} aspect-square w-[78vmin] ${ink}`}>
        <Mandana size={800} rings={7} seed={seed} strokeWidth={0.8} className="h-full w-full" />
      </div>
      <div className={`absolute ${flip ? '-bottom-[26vmin] -right-[26vmin]' : '-bottom-[26vmin] -left-[26vmin]'} aspect-square w-[64vmin] ${ink}`}>
        <Mandana size={700} rings={6} seed={seed + 2} strokeWidth={0.8} className="h-full w-full" />
      </div>
      {borders && (
        <>
          <MandanaBorder className={`absolute inset-x-0 top-3 h-3 w-full ${tone === 'light' ? 'text-geru/15' : 'text-khadiya/15'}`} count={48} />
          <MandanaBorder className={`absolute inset-x-0 bottom-3 h-3 w-full ${tone === 'light' ? 'text-geru/15' : 'text-khadiya/15'}`} count={48} />
        </>
      )}
    </div>
  )
}
