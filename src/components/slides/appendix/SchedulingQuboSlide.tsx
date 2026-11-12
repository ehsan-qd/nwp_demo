'use client'

import SlideHeader from '@/components/ui/SlideHeader'

export default function SchedulingQuboSlide() {
  return (
    <div className="flex items-start justify-center h-full px-8 pt-4 overflow-y-auto dashboard-scroll">
      <div className="max-w-5xl w-full">
        <SlideHeader eyebrow="Appendix C" title="Scheduling QUBO" />

        <div className="border border-border p-8 bg-card/30 backdrop-blur-sm mb-8 animate-fade-in-up-delay-1">
          <div className="text-xs text-muted-foreground font-sans uppercase tracking-widest mb-4">
            One pattern per vehicle, matched to hourly demand
          </div>
          <div className="font-mono text-foreground text-center py-4 leading-loose text-base lg:text-lg">
            H = A &sum;<sub>v</sub> (&sum;<sub>s</sub> y(v,s) &minus; 1)&sup2;
            <br />
            + B &sum;<sub>t</sub> (&sum;<sub>v,s</sub> pattern(s,t)&middot;y(v,s) &minus; target(t))&sup2;
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up-delay-2">
          <div className="border border-border p-5 bg-card/30">
            <div className="text-xs text-muted-foreground font-sans uppercase tracking-widest mb-2">Assignment term</div>
            <p className="text-base text-muted-foreground font-serif leading-relaxed">
              Binary variable y(v,s) assigns exactly one allowed pattern s to each vehicle v.
            </p>
          </div>
          <div className="border border-border p-5 bg-card/30">
            <div className="text-xs text-muted-foreground font-sans uppercase tracking-widest mb-2">Demand-matching term</div>
            <p className="text-base text-muted-foreground font-serif leading-relaxed">
              The scheduled deployed count at each hour t should match the historical hourly target(t).
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 border border-border/50 bg-card/10 animate-fade-in-up-delay-3">
          <p className="text-base text-muted-foreground font-serif">
            <strong className="text-foreground font-sans">Feasibility is enforced up front:</strong>{' '}
            pattern generation applies the four-hour deployment and two-hour rest limits before optimisation, so
            the QUBO only selects among feasible patterns.
          </p>
        </div>
      </div>
    </div>
  )
}
