'use client'

import SlideHeader from '@/components/ui/SlideHeader'

const PATTERN = [1, 1, 1, 1, 0, 0, 1, 1]
const HOURS = ['08', '09', '10', '11', '12', '13', '14', '15']

export default function SchedulingNeedSlide() {
  return (
    <div className="flex items-start justify-center h-full px-8 pt-4 overflow-y-auto dashboard-scroll">
      <div className="max-w-5xl w-full">
        <SlideHeader
          eyebrow="Operational availability"
          title="A plan is useless if the vehicle is resting"
          lede="The scheduling layer does not choose FDL locations. It decides which vehicles may be passed into the location optimiser at each time."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="animate-fade-in-up-delay-1">
            <div className="text-[13px] text-muted-foreground font-sans uppercase tracking-widest mb-4">
              One example eight-hour pattern
            </div>
            <div className="grid grid-cols-8 gap-1.5">
              {PATTERN.map((v, i) => (
                <div key={i} className="text-center">
                  <div
                    className="h-12 w-full"
                    style={{ background: v ? 'var(--state-available)' : 'rgba(255,255,255,0.1)' }}
                  />
                  <div className="text-[12px] text-muted-foreground font-mono mt-1.5">{HOURS[i]}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-5 mt-5 text-xs text-muted-foreground font-sans">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 inline-block" style={{ background: 'var(--state-available)' }} />
                Deployed, eligible for dispatch
              </span>
            </div>
            <div className="flex gap-5 mt-2 text-xs text-muted-foreground font-sans">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 inline-block bg-white/10" />
                Resting at station, unavailable
              </span>
            </div>
          </div>

          <div className="border border-border p-6 bg-card/20 backdrop-blur-sm animate-fade-in-up-delay-2">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <div className="text-3xl font-sans font-semibold text-primary">4h</div>
                <div className="text-xs text-muted-foreground font-sans mt-1">maximum consecutive deployment</div>
              </div>
              <div>
                <div className="text-3xl font-sans font-semibold text-primary">2h</div>
                <div className="text-xs text-muted-foreground font-sans mt-1">maximum consecutive station rest</div>
              </div>
            </div>
            <ul className="space-y-2.5 text-base font-serif text-muted-foreground">
              <li className="flex gap-2"><span className="text-primary shrink-0">&#9632;</span> 4 to 6 deployed hours per eight-hour pattern.</li>
              <li className="flex gap-2"><span className="text-primary shrink-0">&#9632;</span> Busy vehicles finish the incident before returning to base.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
