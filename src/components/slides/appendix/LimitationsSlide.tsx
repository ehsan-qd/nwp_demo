'use client'

import SlideHeader from '@/components/ui/SlideHeader'

const LIMITATIONS = [
  'Thirteen incidents in one day.',
  'Travel matrix rather than live routing.',
  'Simplified sixty-minute scene time in several runs.',
  'Schedule repeated every eight hours.',
  'Candidate schedule selected on the evaluation scenario.',
  'Different formulations still need stronger objective and cadence parity.',
]

export default function LimitationsSlide() {
  return (
    <div className="flex items-start justify-center h-full px-8 pt-4 overflow-y-auto dashboard-scroll">
      <div className="max-w-4xl w-full">
        <SlideHeader eyebrow="Appendix F" title="Limitations" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up-delay-1">
          {LIMITATIONS.map((l, i) => (
            <div key={l} className="border border-border p-5 bg-card/30 flex gap-4 items-start">
              <span className="text-primary font-sans font-semibold text-lg shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <p className="text-base text-muted-foreground font-serif leading-relaxed">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
