'use client'

import { Fragment } from 'react'
import SlideHeader from '@/components/ui/SlideHeader'

const STEPS: { value: string; title: string; body: string; delay: 1 | 2 | 3 | 4 }[] = [
  { value: '112', title: 'Generate valid patterns', body: 'Deployment and rest rules enforced up front.', delay: 1 },
  { value: 'QUBO', title: 'One pattern per vehicle', body: 'Match hourly deployed count to historical demand.', delay: 2 },
  { value: '3', title: 'Orbit seeds, then polish', body: 'Solved and locally polished on the same objective.', delay: 3 },
  { value: '&#177;2', title: 'Validate tolerance', body: 'Reject candidates outside the hourly gap tolerance.', delay: 4 },
]

export default function SchedulingOptimisationSlide() {
  return (
    <div className="flex items-start justify-center h-full px-8 pt-4 overflow-y-auto dashboard-scroll">
      <div className="max-w-6xl w-full">
        <SlideHeader
          eyebrow="Scheduling optimisation"
          title="Orbit picks one work/rest pattern per vehicle"
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.title} className={`border border-border p-6 bg-card/30 backdrop-blur-sm animate-fade-in-up-delay-${s.delay} relative`}>
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-primary/30 z-10">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M2 1l8 5-8 5V1z" />
                  </svg>
                </div>
              )}
              <div
                className="text-2xl font-sans font-semibold text-primary mb-2"
                dangerouslySetInnerHTML={{ __html: s.value }}
              />
              <h3 className="text-base font-sans font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="text-base text-muted-foreground font-serif leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="border border-border p-5 bg-card/20 backdrop-blur-sm animate-fade-in-up-delay-4">
          <div className="text-xs text-muted-foreground font-sans uppercase tracking-widest mb-3">
            Final step
          </div>
          <div className="flex flex-wrap items-center gap-3 text-base font-serif text-muted-foreground">
            {['Simulate four shortlisted schedules', 'Best candidate chosen by operational outcome'].map((step, i, arr) => (
              <Fragment key={step}>
                <span className="px-3 py-1.5 border border-border/60 text-foreground/90">{step}</span>
                {i < arr.length - 1 && <span className="text-primary">&#8594;</span>}
              </Fragment>
            ))}
          </div>
          <p className="text-sm text-muted-foreground font-serif mt-4">
            Equations are in Appendix C.
          </p>
        </div>
      </div>
    </div>
  )
}
