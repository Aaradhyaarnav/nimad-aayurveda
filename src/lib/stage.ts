/** Mutable, render-free shared state between the DOM hero and the WebGL stage. */
export const stage = {
  progress: 0, // hero scroll progress 0..1
  active: 0, // index into LIVE products
  pointerX: 0, // -1..1
  pointerY: 0,
  intro: 0, // 0 → 1 once the preloader opens
}

export const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const damp = (a: number, b: number, lambda: number, dt: number) => lerp(a, b, 1 - Math.exp(-lambda * dt))
