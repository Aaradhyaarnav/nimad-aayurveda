import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { byId, inr, type ProductId } from '@/data/site'
import { useCart } from '@/store/cart'

type Dosha = 'vata' | 'pitta' | 'kapha'
const Q: { q: string; hi: string; a: [string, Dosha][] }[] = [
  { q: 'Your skin, most days?', hi: 'आपकी त्वचा', a: [['Dry, rough, tight', 'vata'], ['Warm, sensitive, reddens easily', 'pitta'], ['Oily, thick, smooth', 'kapha']] },
  { q: 'Your hair?', hi: 'आपके बाल', a: [['Dry, frizzy, split ends', 'vata'], ['Early greying or thinning', 'pitta'], ['Oily, heavy, dandruff', 'kapha']] },
  { q: 'Your body runs…', hi: 'शरीर का तापमान', a: [['Cold hands and feet', 'vata'], ['Warm, I sweat easily', 'pitta'], ['Steady, slow to warm up', 'kapha']] },
  { q: 'Your sleep?', hi: 'नींद', a: [['Light, I wake up often', 'vata'], ['Short but sound', 'pitta'], ['Long and deep', 'kapha']] },
  { q: 'Under stress you…', hi: 'तनाव में', a: [['Worry and overthink', 'vata'], ['Get irritated, quickly', 'pitta'], ['Go quiet and slow', 'kapha']] },
]

const RESULT: Record<Dosha, { hi: string; el: string; line: string; tips: string[]; kit: ProductId[] }> = {
  vata: {
    hi: 'वात', el: 'Air + Space',
    line: 'Dryness is your pattern: skin that feels tight, hair that frizzes. You need oil and warmth.',
    tips: ['Warm oil massage, twice a week', 'Warm, fresh food with a little ghee', 'Sleep on time; cover your hair on the bike'],
    kit: ['oil', 'shatghritam'],
  },
  pitta: {
    hi: 'पित्त', el: 'Fire + Water',
    line: 'Heat is your pattern: sensitive skin, early greys, a quick temper on hot days. You need cooling.',
    tips: ['Oil 45 minutes to an hour before washing', 'Avoid very hot water on the scalp', 'Soaked munakka in the morning'],
    kit: ['facewash', 'oil'],
  },
  kapha: {
    hi: 'कफ', el: 'Earth + Water',
    line: 'Heaviness is your pattern: oily skin, a sticky scalp, slow mornings. You need lightness and a deep clean.',
    tips: ['Triphala in water, from Ajay’s notebook', 'Light, warm meals', 'Wash oil out well; don’t leave it overnight'],
    kit: ['soap', 'facewash'],
  },
}

export default function Prakriti() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Dosha[]>([])
  const { addMany } = useCart()
  const done = answers.length === Q.length
  const result = useMemo<Dosha | null>(() => {
    if (!done) return null
    const c = { vata: 0, pitta: 0, kapha: 0 }
    answers.forEach((a) => c[a]++)
    return (Object.keys(c) as Dosha[]).sort((a, b) => c[b] - c[a])[0]
  }, [answers, done])
  const choose = (d: Dosha) => { setAnswers((a) => [...a.slice(0, step), d]); setStep((s) => s + 1) }
  const reset = () => { setAnswers([]); setStep(0) }
  const r = result ? RESULT[result] : null
  const kitTotal = r ? r.kit.reduce((s, id) => s + (byId(id).price ?? 0), 0) : 0

  return (
    <section id="prakriti" data-nav="dark" className="relative overflow-hidden bg-khadiya px-5 py-[9vh] md:px-10 md:py-[16vh]">
      <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="t-mono text-[11px] text-geru">07 · Know your Prakriti · प्रकृति परीक्षण</p>
          <h2 className="t-display mt-4 text-[clamp(48px,7vw,120px)] text-ink">Vata, Pitta or <em className="text-geru">Kapha?</em></h2>
          <p className="mt-6 max-w-md text-ink/70">
            Ajay’s most-watched videos explain one idea: hair fall and skin trouble look different for every body type. Five questions, thirty seconds, and a ritual made for you.
          </p>
          <div className="mt-10 flex gap-6">
            {(['vata', 'pitta', 'kapha'] as Dosha[]).map((d) => (
              <div key={d} className={`transition-opacity duration-500 ${result && result !== d ? 'opacity-25' : ''}`}>
                <p className="t-deva text-5xl text-geru md:text-6xl">{RESULT[d].hi}</p>
                <p className="t-mono text-[10px] text-ink/50">{RESULT[d].el}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-sm text-[11px] text-ink/45">A simple guide based on traditional Ayurvedic ideas, not a medical diagnosis.</p>
        </div>

        <div className="relative min-h-[520px] rounded-[28px] bg-geru p-6 text-khadiya md:p-10">
          <div className="mb-8 flex gap-1.5">
            {Q.map((_, i) => <span key={i} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i < answers.length ? 'bg-khadiya' : 'bg-khadiya/20'}`} />)}
          </div>
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                <p className="t-mono text-[11px] text-khadiya/70">Question {step + 1} of {Q.length} · {Q[step].hi}</p>
                <p className="t-display mt-3 text-[clamp(36px,4vw,60px)]">{Q[step].q}</p>
                <div className="mt-8 space-y-3">
                  {Q[step].a.map(([label, d]) => (
                    <button key={label} onClick={() => choose(d)} data-cursor="Pick" className="group flex w-full items-center justify-between rounded-2xl border border-khadiya/25 px-5 py-4 text-left text-lg transition hover:bg-khadiya hover:text-geru">
                      {label}<span className="translate-x-[-6px] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">→</span>
                    </button>
                  ))}
                </div>
                {step > 0 && <button onClick={() => setStep((s) => s - 1)} className="mt-6 text-sm text-khadiya/70 underline-offset-4 hover:underline">← Back</button>}
              </motion.div>
            ) : r && result ? (
              <motion.div key="r" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
                <p className="t-mono text-[11px] text-khadiya/70">Your dominant Prakriti</p>
                <p className="t-deva mt-2 text-[96px] leading-none md:text-[128px]">{r.hi}</p>
                <p className="t-accent text-3xl">{result[0].toUpperCase() + result.slice(1)} · {r.el}</p>
                <p className="mt-4 max-w-lg text-khadiya/85">{r.line}</p>
                <ul className="mt-5 space-y-1.5 font-hand text-lg">
                  {r.tips.map((t) => <li key={t}>— {t}</li>)}
                </ul>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {r.kit.map((id) => {
                    const p = byId(id)
                    return (
                      <div key={id} className="flex items-center gap-3 rounded-2xl bg-khadiya/10 p-3">
                        <img src={p.photo} alt="" className="size-14 rounded-xl object-cover" />
                        <div><p className="text-sm font-medium">{p.name}</p><p className="font-mono text-xs opacity-75">{p.price ? inr(p.price) : ''}</p></div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button onClick={() => addMany(r.kit)} className="rounded-full bg-khadiya px-6 py-3 text-[14px] font-medium text-geru" data-cursor="Add">Add my ritual kit · {inr(kitTotal)}</button>
                  <button onClick={reset} className="text-sm text-khadiya/75 underline underline-offset-4">Take it again</button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
