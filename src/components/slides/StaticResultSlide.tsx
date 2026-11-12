'use client'

import SlideHeader from '@/components/ui/SlideHeader'
import { Footnote } from '@/components/ui/Callout'

const ROWS = [
  { label: 'Weighted response', before: '8.07 min', after: '4.82 min', delta: '3.25 min lower' },
  { label: 'P0 demand within 10 min', before: '58.8%', after: '75.6%', delta: '+16.8 pp' },
  { label: 'Wards within 10 min', before: '39.3%', after: '64.3%', delta: '+25.0 pp' },
  { label: 'Worst ward response', before: '23.95 min', after: '18.82 min', delta: '5.13 min lower' },
]

export default function StaticResultSlide() {
  return (
    <div className="flex items-start justify-center h-full px-8 pt-4 overflow-y-auto dashboard-scroll">
      <div className="max-w-6xl w-full h-full flex flex-col">
        <SlideHeader
          eyebrow="Static result"
          title="Every modelled static coverage measure improved"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
          <div className="border border-border bg-card/20 backdrop-blur-sm animate-fade-in-up-delay-1 divide-y divide-border/40">
            {ROWS.map((r) => (
              <div key={r.label} className="grid grid-cols-[1fr_auto] items-center gap-3 px-5 py-4">
                <div>
                  <div className="text-sm font-sans font-semibold text-foreground">{r.label}</div>
                  <div className="text-sm text-muted-foreground font-serif mt-0.5">
                    {r.before} <span className="text-primary">&#8594;</span> {r.after}
                  </div>
                </div>
                <div className="text-sm font-sans font-semibold text-primary text-right whitespace-nowrap">{r.delta}</div>
              </div>
            ))}
          </div>

          <div className="animate-fade-in-up-delay-2 space-y-6">
            <div className="border-l-2 border-primary pl-5 py-1 text-lg text-foreground/90 font-serif leading-relaxed">
              <strong className="font-sans text-foreground">The strongest evidence of potential value</strong>{' '}
              came from the constrained static experiment.
            </div>
            <div className="border border-border p-6 bg-primary/5">
              <div className="text-5xl font-sans font-semibold text-primary">75.6%</div>
              <h3 className="text-base font-sans font-semibold text-foreground mt-3 mb-1">
                of historical P0 demand modelled within ten minutes
              </h3>
              <p className="text-base text-muted-foreground font-serif">
                up from 58.8% when vehicles are held at their home stations
              </p>
            </div>
          </div>
        </div>

        <Footnote>
          Modelled, weighted, in-sample; travel time is the response proxy. Demonstrates potential, not guaranteed
          savings. Evidence: outputs/04_1_summary_metrics.csv
        </Footnote>
      </div>
    </div>
  )
}
