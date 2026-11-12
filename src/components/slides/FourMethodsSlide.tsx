'use client'

import SlideHeader from '@/components/ui/SlideHeader'

export default function FourMethodsSlide() {
  return (
    <div className="flex items-start justify-center h-full px-8 pt-4 overflow-y-auto dashboard-scroll">
      <div className="max-w-6xl w-full">
        <SlideHeader
          eyebrow="Method comparison"
          title="Two formulations, two solver representations"
        />

        <div className="grid grid-cols-[170px_1fr_1fr] gap-px bg-border border border-border animate-fade-in-up-delay-1">
          <div className="bg-background" />
          <div className="bg-primary/10 p-5 flex items-center">
            <h3 className="font-sans font-semibold text-foreground">Orbit / QUBO</h3>
          </div>
          <div className="bg-primary/10 p-5 flex items-center">
            <h3 className="font-sans font-semibold text-foreground">Categorical p-dit</h3>
          </div>

          <div className="bg-primary/10 p-5 flex items-center">
            <h3 className="font-sans font-semibold text-foreground text-sm leading-snug">
              Approach 1
              <br />
              Vehicle assignment
            </h3>
          </div>
          <div className="bg-card/40 p-5">
            <div className="text-sm font-sans font-semibold text-foreground mb-1.5">One binary block per eligible vehicle</div>
            <p className="text-sm text-muted-foreground font-serif leading-relaxed">Preserves vehicle identity.</p>
          </div>
          <div className="bg-card/40 p-5">
            <div className="text-sm font-sans font-semibold text-foreground mb-1.5">One categorical location value per eligible vehicle</div>
            <p className="text-sm text-muted-foreground font-serif leading-relaxed">Removes the binary one-hot encoding.</p>
          </div>

          <div className="bg-primary/10 p-5 flex items-center">
            <h3 className="font-sans font-semibold text-foreground text-sm leading-snug">
              Approach 2
              <br />
              FDL selection
            </h3>
          </div>
          <div className="bg-card/40 p-5">
            <div className="text-sm font-sans font-semibold text-foreground mb-1.5">28 ward bits select exactly K FDLs</div>
            <p className="text-sm text-muted-foreground font-serif leading-relaxed">Followed by minimum-travel vehicle matching.</p>
          </div>
          <div className="bg-card/40 p-5">
            <div className="text-sm font-sans font-semibold text-foreground mb-1.5">Categorical FDL-set search</div>
            <p className="text-sm text-muted-foreground font-serif leading-relaxed">Followed by vehicle matching.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 animate-fade-in-up-delay-2">
          <div className="border-l-2 border-primary pl-5 py-1 text-base font-serif text-foreground/90">
            Approach 1 answers: <strong className="font-sans text-foreground">Which vehicle goes where?</strong>
          </div>
          <div className="border-l-2 border-primary pl-5 py-1 text-base font-serif text-foreground/90">
            Approach 2 answers: <strong className="font-sans text-foreground">Which K locations should be active?</strong>
          </div>
        </div>

        <p className="text-sm text-muted-foreground font-serif mt-6 max-w-3xl animate-fade-in-up-delay-3">
          Solver choice is not a KPI. Removing one-hot encoding does not by itself produce a better operational result.
        </p>
      </div>
    </div>
  )
}
