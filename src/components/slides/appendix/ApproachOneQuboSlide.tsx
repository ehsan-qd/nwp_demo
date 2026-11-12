'use client'

import SlideHeader from '@/components/ui/SlideHeader'

export default function ApproachOneQuboSlide() {
  return (
    <div className="flex items-start justify-center h-full px-8 pt-4 overflow-y-auto dashboard-scroll">
      <div className="max-w-5xl w-full">
        <SlideHeader eyebrow="Appendix A" title="Approach 1 QUBO" />

        <div className="border border-border p-8 bg-card/30 backdrop-blur-sm mb-8 animate-fade-in-up-delay-1">
          <div className="text-xs text-muted-foreground font-sans uppercase tracking-widest mb-4">
            One location per vehicle
          </div>
          <div className="text-xl lg:text-2xl font-mono text-foreground text-center py-4 leading-relaxed">
            H = A &sum;<sub>v</sub> (&sum;<sub>l</sub> x(v,l) &minus; 1)&sup2; &minus;{' '}
            <span className="text-primary">B &sum;<sub>v,l</sub> x(v,l)&middot;reward(v,l)</span> +{' '}
            <span className="text-red-400/80">C &sum;<sub>l</sub> penalty<sub>overlap</sub>(l)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up-delay-2">
          <div className="border border-border p-5 bg-card/30">
            <div className="text-xs text-muted-foreground font-sans uppercase tracking-widest mb-2">Assignment penalty</div>
            <p className="text-base text-muted-foreground font-serif leading-relaxed">
              Enforces exactly one location per vehicle, so every vehicle is placed and no vehicle is placed twice.
            </p>
          </div>
          <div className="border border-border p-5 bg-card/30">
            <div className="text-xs text-muted-foreground font-sans uppercase tracking-widest mb-2">Demand and spread reward</div>
            <p className="text-base text-muted-foreground font-serif leading-relaxed">
              Rewards access to historically likely P0 demand and geographic spread across wards.
            </p>
          </div>
          <div className="border border-border p-5 bg-card/30">
            <div className="text-xs text-muted-foreground font-sans uppercase tracking-widest mb-2">Overlap penalty</div>
            <p className="text-base text-muted-foreground font-serif leading-relaxed">
              Discourages placing an excessive number of vehicles at the same location.
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 border border-border/50 bg-card/10 animate-fade-in-up-delay-3">
          <p className="text-base text-muted-foreground font-serif">
            <strong className="text-foreground font-sans">Trade-off:</strong>{' '}
            preserves vehicle identity and current location, but scales with roughly K &times; 28 binary
            variables (K = eligible vehicles).
          </p>
        </div>
      </div>
    </div>
  )
}
