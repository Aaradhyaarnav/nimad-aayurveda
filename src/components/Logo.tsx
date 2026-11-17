/**
 * The Nimad Aayurveda lockup.
 * Emblem: a ghee drop rising from a three-petal lotus inside a ring of 16 mandana dots.
 * Wordmark: Amita calligraphy, with a hairline and tracked "Aayurveda" beneath.
 */
export function Emblem({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" aria-hidden>
      <circle cx="24" cy="24" r="22.5" strokeWidth="1" opacity=".55" />
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2
        return <circle key={i} cx={24 + Math.cos(a) * 19} cy={24 + Math.sin(a) * 19} r={i % 2 ? 0.7 : 1.15} fill="currentColor" stroke="none" />
      })}
      {/* ghee drop */}
      <path d="M24 9.5c3.6 5 6.4 8.6 6.4 12.2a6.4 6.4 0 0 1-12.8 0c0-3.6 2.8-7.2 6.4-12.2Z" fill="currentColor" stroke="none" />
      <path d="M21.6 21.2c.4-1.6 1.3-3 2.3-4.3" stroke="var(--logo-bg, #b3121f)" strokeWidth="1.1" strokeLinecap="round" />
      {/* lotus */}
      <path d="M24 37.5c-2.6-2.2-3.4-5-2.4-8 2.2 1.2 3 3.6 2.4 8Zm0 0c2.6-2.2 3.4-5 2.4-8-2.2 1.2-3 3.6-2.4 8Z" fill="currentColor" stroke="none" />
      <path d="M24 37.5c-4.6.4-8-1.4-9.6-4.6 3.6-.6 6.8.8 9.6 4.6Zm0 0c4.6.4 8-1.4 9.6-4.6-3.6-.6-6.8.8-9.6 4.6Z" fill="currentColor" stroke="none" opacity=".85" />
      <path d="M15.5 39.5h17" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

export default function Logo({ className = '', compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={`group inline-flex items-center gap-2.5 ${className}`}>
      <Emblem className="size-10 shrink-0 transition-transform duration-[900ms] ease-[var(--ease-silk)] group-hover:rotate-[360deg]" />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-[Amita] text-[25px] font-bold leading-[1.05] tracking-[0.005em]">The Nimad</span>
          <span className="mt-1 flex items-center gap-1.5">
            <span className="h-px w-4 bg-current opacity-60" />
            <span className="font-mono text-[8.5px] uppercase tracking-[0.42em] opacity-80">Aayurveda</span>
          </span>
        </span>
      )}
    </span>
  )
}
