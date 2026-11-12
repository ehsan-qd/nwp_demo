'use client'

import { useState } from 'react'
import SlideHeader from '@/components/ui/SlideHeader'
import MapEmbed from '@/components/ui/MapEmbed'

const ANIMATIONS = [
  {
    key: 'a1-orbit',
    label: 'Approach 1 scheduled &middot; Orbit / QUBO',
    src: '/maps/10_approach1_scheduled_orbit_qubo_animation.html',
  },
  {
    key: 'a1-pdit',
    label: 'Approach 1 scheduled &middot; categorical p-dit',
    src: '/maps/12_approach1_scheduled_pdit_animation.html',
  },
  {
    key: 'a2-pdit-scheduled',
    label: 'Approach 2 scheduled &middot; p-dit',
    src: '/maps/13_approach2_scheduled_pdit_animation.html',
  },
]

const ANNOTATIONS = [
  'Scheduled deployed count for the hour',
  'Available, busy and resting vehicle counts',
  'FDL relocation lines',
  'Dispatch line to an incident',
  'Scheduled return-to-base movement',
]

export default function DynamicOutputSlide() {
  const [active, setActive] = useState(ANIMATIONS[0].key)
  const current = ANIMATIONS.find((a) => a.key === active)!

  return (
    <div className="flex items-start justify-center h-full px-8 pt-4 overflow-y-auto dashboard-scroll">
      <div className="max-w-6xl w-full">
        <SlideHeader
          eyebrow="Auditable output"
          title="An auditable vehicle timeline, not just a solver state"
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          <div className="animate-fade-in-up-delay-1">
            <div className="flex gap-2 mb-3">
              {ANIMATIONS.map((a) => (
                <button
                  key={a.key}
                  onClick={() => setActive(a.key)}
                  className={`px-3 py-1.5 text-xs font-sans uppercase tracking-wider border transition-colors ${
                    active === a.key
                      ? 'border-primary text-primary bg-primary/10'
                      : 'border-border text-muted-foreground hover:text-foreground'
                  }`}
                  dangerouslySetInnerHTML={{ __html: a.label }}
                />
              ))}
            </div>
            <MapEmbed
              src={current.src}
              title={current.label.replace('&middot;', '/')}
              height={430}
              caption="Live rolling-horizon simulation output. Use the animation controls inside the frame to step through the day."
            />
          </div>

          <div className="space-y-4 animate-fade-in-up-delay-2">
            <div className="border border-border p-4 bg-card/30">
              <div className="text-[13px] text-muted-foreground font-sans uppercase tracking-widest mb-3">
                What to read on the frame
              </div>
              <ol className="space-y-2 text-base font-serif text-muted-foreground">
                {ANNOTATIONS.map((a, i) => (
                  <li key={a} className="flex gap-2">
                    <span className="text-primary font-sans font-semibold shrink-0">{i + 1}.</span>
                    {a}
                  </li>
                ))}
              </ol>
            </div>
            <div className="border-l-2 border-primary pl-4 py-1 text-sm text-muted-foreground font-serif leading-relaxed">
              Every reoptimisation records the proposed move, the final gated move, travel minutes and vehicle state.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
