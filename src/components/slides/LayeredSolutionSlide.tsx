'use client'

import { Fragment } from 'react'
import SlideHeader from '@/components/ui/SlideHeader'

const LAYERS: { step: string; title: string; question: string; delay: 1 | 2 | 3 | 4 }[] = [
  { step: '1', title: 'Static FDL Placement', question: 'Where should vehicles wait?', delay: 1 },
  { step: '2', title: 'Staff Work/Rest Scheduling', question: 'When may each vehicle deploy?', delay: 2 },
  { step: '3', title: 'Dynamic Optimisation', question: 'Reposition eligible, non-busy vehicles', delay: 3 },
  { step: '4', title: 'Simulation and Benchmark', question: 'Dispatch incidents and compare outcomes', delay: 4 },
]

export default function LayeredSolutionSlide() {
  return (
    <div className="flex items-start justify-center h-full px-8 pt-4 overflow-y-auto dashboard-scroll">
      <div className="max-w-6xl w-full">
        <SlideHeader
          eyebrow="Solution architecture"
          title="Four layers, each more operationally realistic"
          lede="The layers are deliberately separable. That lets us test whether a result comes from better FDL placement, from the schedule, or from the interaction between them."
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-border">
          {LAYERS.map((l, i) => (
            <Fragment key={l.step}>
              <div className={`p-6 bg-card/30 backdrop-blur-sm animate-fade-in-up-delay-${l.delay} relative ${i > 0 ? 'md:border-l md:border-border' : ''}`}>
                <div className="text-primary text-2xl font-sans font-semibold mb-2">{l.step}</div>
                <h3 className="text-base font-sans font-semibold text-foreground mb-2">{l.title}</h3>
                <p className="text-base text-muted-foreground font-serif leading-relaxed mb-4">{l.question}</p>
                {i < LAYERS.length - 1 && (
                  <div className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 text-primary z-10">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M2 1l8 5-8 5V1z" />
                    </svg>
                  </div>
                )}
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
