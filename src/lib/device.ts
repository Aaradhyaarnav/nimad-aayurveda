import { useEffect, useRef } from 'react'

export const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

/** Tiny haptic tick on phones that support it (Android Chrome). */
export function buzz(pattern: number | number[] = 8) {
  try { navigator.vibrate?.(pattern) } catch { /* unsupported */ }
}

/** Shared device tilt (-1..1), from gyroscope on phones or the pointer on desktop. */
export const tilt = { x: 0, y: 0 }
let started = false

export function startTilt() {
  if (started || typeof window === 'undefined') return
  started = true
  const onOrient = (e: DeviceOrientationEvent) => {
    if (e.gamma == null || e.beta == null) return
    tilt.x = Math.max(-1, Math.min(1, e.gamma / 30))
    tilt.y = Math.max(-1, Math.min(1, (e.beta - 45) / 30))
  }
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    tilt.x = (e.clientX / window.innerWidth) * 2 - 1
    tilt.y = (e.clientY / window.innerHeight) * 2 - 1
  }
  window.addEventListener('pointermove', onMove, { passive: true })
  type IOS = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> }
  const DOE = (window as unknown as { DeviceOrientationEvent?: IOS }).DeviceOrientationEvent
  if (!DOE) return
  if (typeof DOE.requestPermission === 'function') {
    // iOS: needs a user gesture; ask on the first tap
    const ask = () => {
      DOE.requestPermission!().then((s) => s === 'granted' && window.addEventListener('deviceorientation', onOrient)).catch(() => {})
      window.removeEventListener('touchend', ask)
    }
    window.addEventListener('touchend', ask, { once: true })
  } else {
    window.addEventListener('deviceorientation', onOrient)
  }
}

/** Applies a damped parallax transform from `tilt` to an element every frame. */
export function useTiltParallax<T extends HTMLElement>(strength = 12, enabled = true) {
  const ref = useRef<T>(null)
  useEffect(() => {
    if (!enabled) return
    startTilt()
    let raf = 0, x = 0, y = 0
    const loop = () => {
      x += (tilt.x - x) * 0.08
      y += (tilt.y - y) * 0.08
      if (ref.current) ref.current.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [strength, enabled])
  return ref
}

export async function shareProduct(title: string, text: string) {
  const url = location.href.split('#')[0]
  try {
    if (navigator.share) { await navigator.share({ title, text, url }); return true }
    await navigator.clipboard.writeText(`${title} · ${text} ${url}`)
    return true
  } catch { return false }
}
