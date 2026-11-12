'use client'

import SlideHeader from '@/components/ui/SlideHeader'
import MapEmbed from '@/components/ui/MapEmbed'

export default function OperationalProblemSlide() {
  return (
    <div className="flex items-start justify-center h-full px-8 pt-4 overflow-y-auto dashboard-scroll">
      <div className="max-w-6xl w-full">
        <SlideHeader
          eyebrow="The operational question"
          title="Not only where to deploy, but when and how"
          lede="A useful solution must jointly acknowledge geography, demand, availability and live vehicle state."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-3 animate-fade-in-up-delay-1">
            <div className="flex gap-3 text-base font-serif text-muted-foreground">
              <span className="text-primary shrink-0">&#9632;</span>
              15 vehicles, five central stations.
            </div>
            <div className="flex gap-3 text-base font-serif text-muted-foreground">
              <span className="text-primary shrink-0">&#9632;</span>
              28 wards; travel times and P0 demand vary sharply.
            </div>
            <div className="flex gap-3 text-base font-serif text-muted-foreground">
              <span className="text-primary shrink-0">&#9632;</span>
              All vehicles at station means avoidable travel to incidents.
            </div>
            <div className="flex gap-3 text-base font-serif text-muted-foreground">
              <span className="text-primary shrink-0">&#9632;</span>
              All vehicles moved means no station cover, rest or recharge.
            </div>
            <div className="flex gap-3 text-base font-serif text-muted-foreground">
              <span className="text-primary shrink-0">&#9632;</span>
              Incidents make vehicles busy; the eligible fleet keeps changing.
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4">
              {[
                ['Where', 'should vehicles wait?'],
                ['When', 'is each vehicle available?'],
                ['How', 'should deployment change over time?'],
              ].map(([q, d]) => (
                <div key={q} className="border border-border p-4 bg-card/30">
                  <div className="text-lg font-sans font-semibold text-primary mb-1">{q}</div>
                  <p className="text-sm text-muted-foreground font-serif leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>

          <MapEmbed
            src="/maps/baseline_vs_optimised_map.html"
            title="North Wales — 28 wards, 5 stations"
            caption="Live map from the FDO pipeline. Toggle layers to compare station baseline vs. constrained FDL."
            height={380}
            delay={2}
          />
        </div>
      </div>
    </div>
  )
}
