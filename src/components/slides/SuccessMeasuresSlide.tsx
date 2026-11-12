'use client'

import SlideHeader from '@/components/ui/SlideHeader'
import InfoCard from '@/components/ui/InfoCard'

const METRICS: { title: string; body: string; delay: 1 | 2 | 3 | 4 }[] = [
  { title: 'Incidents served', body: 'Was an eligible vehicle available?', delay: 1 },
  { title: 'Within 10 minutes', body: 'Did the modelled response meet the P0 target?', delay: 2 },
  { title: 'Response distribution', body: 'Mean, median, tail and worst response among served incidents.', delay: 3 },
  { title: 'Movement burden', body: 'Relocations, return-to-base movements and travel minutes.', delay: 4 },
]

export default function SuccessMeasuresSlide() {
  return (
    <div className="flex items-start justify-center h-full px-8 pt-4 overflow-y-auto dashboard-scroll">
      <div className="max-w-5xl w-full">
        <SlideHeader
          eyebrow="Evaluation"
          title="Service, response and burden, measured together"
          lede="An excellent average can mislead if a method serves only a few incidents. Every results slide here shows coverage and response together."
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {METRICS.map((m, i) => (
            <InfoCard key={m.title} index={String(i + 1).padStart(2, '0')} title={m.title} delay={m.delay}>
              {m.body}
            </InfoCard>
          ))}
        </div>

        <div className="mt-6 p-4 border border-border/50 bg-card/10 animate-fade-in-up-delay-4">
          <p className="text-base text-muted-foreground font-serif">
            <strong className="text-foreground font-sans">Solver energy is a diagnostic,</strong>{' '}
            not a KPI. It shows convergence, not service quality.
          </p>
        </div>
      </div>
    </div>
  )
}
