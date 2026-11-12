'use client'

import SlideHeader from '@/components/ui/SlideHeader'

const DEFS: [string, string][] = [
  ['Served rate', 'Share of incidents for which an eligible vehicle was available and dispatched.'],
  ['Within-target rate, all incidents', 'Share of all incidents, served or not, meeting the ten-minute target.'],
  ['Within-target rate, served incidents', 'Share of served incidents meeting the ten-minute target.'],
  ['Response percentiles', 'Mean, median, p90, p95 and maximum response among served incidents.'],
  ['Relocation', 'A vehicle move to a new FDL, not in response to a dispatch.'],
  ['Return-to-base movement', 'A vehicle move back to its home station under the schedule.'],
]

export default function BenchmarkDefinitionsSlide() {
  return (
    <div className="flex items-start justify-center h-full px-8 pt-4 overflow-y-auto dashboard-scroll">
      <div className="max-w-5xl w-full">
        <SlideHeader eyebrow="Appendix E" title="Benchmark definitions" />

        <div className="border border-border bg-card/20 backdrop-blur-sm divide-y divide-border/40 animate-fade-in-up-delay-1">
          {DEFS.map(([term, def]) => (
            <div key={term} className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-2 md:gap-6 px-6 py-4">
              <div className="text-sm font-sans font-semibold text-primary">{term}</div>
              <p className="text-base text-muted-foreground font-serif leading-relaxed">{def}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
