'use client'

import { QuantumDiceWordmark, NWPWordmark } from '@/components/BrandMark'

export default function TitleSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8">
      <div className="animate-fade-in-up mb-12 flex items-center gap-8">
        <QuantumDiceWordmark markClassName="h-14" />
        <div className="w-px h-12 bg-border" />
        <NWPWordmark crestClassName="h-14" />
      </div>
      <h1 className="text-4xl lg:text-6xl font-sans font-semibold text-foreground mb-6 animate-fade-in-up-delay-1 text-center leading-tight max-w-5xl">
        North Wales Police: Optimisation of Forward Deployment
      </h1>
      <p className="text-lg lg:text-xl text-muted-foreground font-serif max-w-2xl text-center animate-fade-in-up-delay-2 leading-relaxed">
        From static FDL placement to scheduled, dynamic vehicle deployment
      </p>
      <div className="mt-10 animate-fade-in-up-delay-3">
        <span className="inline-flex items-center gap-2 px-4 py-2 border border-primary/30 bg-primary/5 text-primary text-xs font-sans uppercase tracking-widest">
          Orbit / QUBO &amp; categorical p-dit simulated annealing
        </span>
      </div>
    </div>
  )
}
