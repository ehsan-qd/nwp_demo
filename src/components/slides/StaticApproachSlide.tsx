'use client'

import SlideHeader from '@/components/ui/SlideHeader'
import MapEmbed from '@/components/ui/MapEmbed'

export default function StaticApproachSlide() {
  return (
    <div className="flex items-start justify-center h-full px-8 pt-4 overflow-y-auto dashboard-scroll">
      <div className="max-w-6xl w-full">
        <SlideHeader
          eyebrow="Static approach 1"
          title="Each vehicle is assigned to one ward"
          lede="One vehicle stays at each of the five stations; the remaining ten are positioned at forward deployment locations."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6 animate-fade-in-up-delay-1">
            <div className="flex items-center gap-3">
              {[
                ['15', 'vehicles at 5 stations'],
                ['5', 'retained at stations'],
                ['10', 'assigned to FDLs'],
              ].map(([v, l], i, arr) => (
                <div key={l} className="flex items-center gap-3">
                  <div className="border border-border p-4 bg-card/30 text-center min-w-[110px]">
                    <div className="text-2xl font-sans font-semibold text-primary">{v}</div>
                    <div className="text-[13px] text-muted-foreground font-sans mt-1">{l}</div>
                  </div>
                  {i < arr.length - 1 && <span className="text-primary text-lg">&#8594;</span>}
                </div>
              ))}
            </div>

            <div className="border border-border p-6 bg-card/20 backdrop-blur-sm">
              <code className="text-lg font-sans text-primary">x(v, l) = 1</code>
              <p className="text-base text-muted-foreground font-serif mt-2 mb-4">
                when vehicle <em>v</em> is placed at ward <em>l</em>
              </p>
              <ul className="space-y-2 text-base font-serif text-muted-foreground">
                <li className="flex gap-2"><span className="text-primary shrink-0">&#9632;</span> One location per vehicle.</li>
                <li className="flex gap-2"><span className="text-primary shrink-0">&#9632;</span> Rewards P0 demand access and geographic spread.</li>
                <li className="flex gap-2"><span className="text-primary shrink-0">&#9632;</span> Orbit solves the binary QUBO.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3 animate-fade-in-up-delay-2">
            <MapEmbed
              src="/maps/baseline_vs_optimised_map.html"
              title="Baseline vs. constrained FDL"
              caption="Station-retained and optimised vehicles appear as separate map layers."
              height={340}
            />
            <p className="text-sm text-muted-foreground font-serif leading-relaxed">
              Retains vehicle identity, useful when current position matters. Scales with roughly K &times; 28 binary
              variables.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
