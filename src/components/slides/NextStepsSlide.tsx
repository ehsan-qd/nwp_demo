'use client'

import SlideHeader from '@/components/ui/SlideHeader'

const COLUMNS: { title: string; items: string[]; delay: 1 | 2 | 3 }[] = [
  {
    title: 'Demonstrated',
    delay: 1,
    items: [
      'Static placement showed material potential.',
      'Work/rest rules integrated into dynamic placement.',
      'Both formulations run end to end with auditable decisions.',
    ],
  },
  {
    title: 'Validate',
    delay: 2,
    items: [
      'Test unseen days, seasons and demand levels.',
      'Compare methods on aligned objectives and cadence.',
      'Reduce relocation while preserving service.',
    ],
  },
  {
    title: 'Prepare for trial',
    delay: 3,
    items: [
      'Agree service targets and acceptance criteria with NWP.',
      'Include shift handovers and travel downtime.',
      'Build a reproducible pipeline for field evaluation.',
    ],
  },
]

export default function NextStepsSlide() {
  return (
    <div className="flex items-start justify-center h-full px-8 pt-4 overflow-y-auto dashboard-scroll">
      <div className="max-w-[1400px] w-full my-auto py-6 text-center">
        <SlideHeader
          eyebrow="Conclusion"
          title="Promising results. Validate before trial."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {COLUMNS.map((c) => (
            <div key={c.title} className={`border border-border px-7 py-8 bg-card/30 backdrop-blur-sm animate-fade-in-up-delay-${c.delay}`}>
              <h3 className="text-[30px] font-sans font-semibold text-primary mb-6">{c.title}</h3>
              <ul className="space-y-5 text-[28px] font-serif text-muted-foreground leading-relaxed">
                {c.items.map((item) => (
                  <li key={item} className="text-center">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-primary/40 pt-6 text-[30px] text-foreground font-sans font-semibold leading-relaxed max-w-5xl mx-auto animate-fade-in-up-delay-3">
          Next: build the evidence for field evaluation.
        </div>
      </div>
    </div>
  )
}
