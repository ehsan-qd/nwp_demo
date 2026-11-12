'use client'

import SlideHeader from '@/components/ui/SlideHeader'

export default function ApproachTwoQuboSlide() {
  return (
    <div className="flex items-start justify-center h-full px-8 pt-4 overflow-y-auto dashboard-scroll">
      <div className="max-w-5xl w-full">
        <SlideHeader eyebrow="Appendix B" title="Approach 2 QUBO" />

        <div className="border border-border p-8 bg-card/30 backdrop-blur-sm mb-8 animate-fade-in-up-delay-1">
          <div className="text-xs text-muted-foreground font-sans uppercase tracking-widest mb-4">
            Exactly K forward deployment locations
          </div>
          <div className="text-xl lg:text-2xl font-mono text-foreground text-center py-4 leading-relaxed">
            H = A (&sum;<sub>l</sub> b(l) &minus; K)&sup2; &minus;{' '}
            <span className="text-primary">B &sum;<sub>l</sub> b(l)&middot;coverage(l)</span> +{' '}
            <span className="text-red-400/80">C &sum;<sub>l,l&prime;</sub> b(l)&middot;b(l&prime;)&middot;overlap(l,l&prime;)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up-delay-2">
          <div className="border border-border p-5 bg-card/30">
            <div className="text-xs text-muted-foreground font-sans uppercase tracking-widest mb-2">28-bit location vector</div>
            <p className="text-base text-muted-foreground font-serif leading-relaxed">
              One binary variable b(l) per ward selects whether that ward is active as a forward deployment location.
            </p>
          </div>
          <div className="border border-border p-5 bg-card/30">
            <div className="text-xs text-muted-foreground font-sans uppercase tracking-widest mb-2">Exact-K constraint</div>
            <p className="text-base text-muted-foreground font-serif leading-relaxed">
              A quadratic penalty holds the number of active locations at exactly K, matching the eligible fleet size.
            </p>
          </div>
          <div className="border border-border p-5 bg-card/30">
            <div className="text-xs text-muted-foreground font-sans uppercase tracking-widest mb-2">Coverage reward</div>
            <p className="text-base text-muted-foreground font-serif leading-relaxed">
              Rewards locations with strong historical demand coverage and low travel time to likely incidents.
            </p>
          </div>
          <div className="border border-border p-5 bg-card/30">
            <div className="text-xs text-muted-foreground font-sans uppercase tracking-widest mb-2">Overlap penalty</div>
            <p className="text-base text-muted-foreground font-serif leading-relaxed">
              Discourages selecting locations that are close together and would duplicate coverage.
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 border border-border/50 bg-card/10 animate-fade-in-up-delay-3">
          <p className="text-base text-muted-foreground font-serif">
            <strong className="text-foreground font-sans">Separate matching step:</strong>{' '}
            the QUBO picks which K locations are active; a minimum-travel step then assigns vehicles, so identity
            is not preserved inside the QUBO.
          </p>
        </div>
      </div>
    </div>
  )
}
