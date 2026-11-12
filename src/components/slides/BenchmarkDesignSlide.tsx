'use client'

import SlideHeader from '@/components/ui/SlideHeader'
import { Footnote } from '@/components/ui/Callout'

const STATS: [string, string][] = [
  ['24h', 'Monday 08:00 to Tuesday 08:00'],
  ['13', 'observed P0 incidents'],
  ['15', 'response vehicles'],
  ['28', 'wards, 10 min target'],
]

type Row = {
  method: string
  served: string
  within: string
  mean: string
  relocations: string
  best?: boolean
}

const STATIC_ROWS: Row[] = [
  { method: 'Home-station baseline', served: '13/13', within: '4/13', mean: '11.06 min', relocations: '0' },
  { method: 'Static constrained FDL baseline', served: '13/13', within: '8/13', mean: '6.36 min', relocations: '0', best: true },
]

export default function BenchmarkDesignSlide() {
  return (
    <div className="flex items-start justify-center h-full px-8 pt-4 overflow-y-auto dashboard-scroll">
      <div className="max-w-6xl w-full h-full flex flex-col">
        <SlideHeader
          eyebrow="Benchmark design"
          title="One 24-hour scenario, benchmarked against two static baselines"
          lede="Every candidate method sees the same incidents, fleet and travel matrix. The two static baselines below set the reference points before four scheduled methods are compared on the next page."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {STATS.map(([v, l], i) => (
            <div key={l} className={`border border-border p-5 bg-card/30 backdrop-blur-sm animate-fade-in-up-delay-${Math.min(i + 1, 4)}`}>
              <div className="text-3xl font-sans font-semibold text-primary">{v}</div>
              <div className="text-xs text-muted-foreground font-sans mt-1.5">{l}</div>
            </div>
          ))}
        </div>

        <div className="border border-border bg-card/20 backdrop-blur-sm animate-fade-in-up-delay-3 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-[12px] text-muted-foreground font-sans uppercase tracking-wider">
                <th className="text-left px-4 py-3">Static baseline</th>
                <th className="text-center px-2 py-3">Served</th>
                <th className="text-center px-2 py-3">Within 10 min</th>
                <th className="text-center px-2 py-3">Mean response</th>
                <th className="text-right px-4 py-3">Relocations</th>
              </tr>
            </thead>
            <tbody>
              {STATIC_ROWS.map((r) => (
                <tr
                  key={r.method}
                  className={`border-b border-border/30 last:border-0 ${r.best ? 'bg-primary/10' : ''}`}
                >
                  <td className={`px-4 py-2.5 font-sans text-sm ${r.best ? 'text-primary font-semibold' : 'text-foreground'}`}>
                    {r.method}
                  </td>
                  <td className="px-2 py-2.5 text-center font-mono text-sm text-muted-foreground">{r.served}</td>
                  <td className="px-2 py-2.5 text-center font-mono text-sm text-muted-foreground">{r.within}</td>
                  <td className="px-2 py-2.5 text-center font-mono text-sm text-muted-foreground">{r.mean}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-sm text-muted-foreground">{r.relocations}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-muted-foreground font-serif mt-3 max-w-3xl animate-fade-in-up-delay-3">
          Static, in-sample references: no relocation or scheduling; not directly comparable to full-day dynamic runs.
        </p>

        <ul className="space-y-1.5 mt-6 text-base font-serif text-muted-foreground animate-fade-in-up-delay-4">
          <li className="flex gap-2"><span className="text-primary shrink-0">&#9632;</span> Travel times proxy response.</li>
          <li className="flex gap-2"><span className="text-primary shrink-0">&#9632;</span> Shared service, response and movement metrics.</li>
        </ul>

        <Footnote>
          Exploratory only; no statistical validation or general superiority claim.
        </Footnote>
      </div>
    </div>
  )
}
