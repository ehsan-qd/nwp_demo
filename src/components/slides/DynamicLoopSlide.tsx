'use client'

import SlideHeader from '@/components/ui/SlideHeader'
import StateLegend from '@/components/ui/StateLegend'

const STEPS = [
  'Apply work/rest schedule',
  'Release vehicles whose incidents have cleared',
  'Identify eligible, non-busy vehicles',
  'Forecast demand over the rolling horizon',
  'Optimise FDL positions',
  'Dispatch incidents and update vehicle state',
]

const WIDTH = 800
const HEIGHT = 620
const CENTER_X = 400
const CENTER_Y = 280

function pointOn(i: number, n: number) {
  const angle = (i / n) * 2 * Math.PI - Math.PI / 2
  return {
    x: CENTER_X + 260 * Math.cos(angle),
    y: CENTER_Y + 220 * Math.sin(angle),
  }
}

export default function DynamicLoopSlide() {
  return (
    <div className="flex items-start justify-center h-full px-8 pt-4 overflow-y-auto dashboard-scroll">
      <div className="max-w-6xl w-full">
        <SlideHeader
          eyebrow="Dynamic optimisation"
          title="Each cycle updates the fleet and FDL positions"
        />

        <div className="flex flex-col gap-8 items-center">
          <div className="relative mx-auto w-full max-w-[900px] animate-fade-in-up-delay-1" style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}>
            <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="absolute inset-0 w-full h-full" aria-hidden="true">
              <ellipse cx={CENTER_X} cy={CENTER_Y} rx={260} ry={220} fill="none" stroke="rgba(137,194,217,0.18)" strokeWidth="1.5" strokeDasharray="4 5" />
            </svg>
            <div className="absolute rounded-full border border-primary/40 bg-card/50 backdrop-blur-sm flex items-center justify-center text-center px-6" style={{ width: '24%', aspectRatio: '1', left: '50%', top: `${CENTER_Y / HEIGHT * 100}%`, transform: 'translate(-50%, -50%)' }}>
              <span className="text-[clamp(16px,2vw,28px)] font-sans font-semibold text-foreground leading-snug">
                Rolling optimisation boundary
              </span>
            </div>
            {STEPS.map((s, i) => {
              const p = pointOn(i, STEPS.length)
              return (
                <div
                  key={s}
                  className="absolute w-[30%] text-center"
                  style={{ left: `${p.x / WIDTH * 100}%`, top: `${(p.y - 20) / HEIGHT * 100}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-primary/10 border border-primary/40 flex items-center justify-center text-[22px] font-sans font-semibold text-primary">
                    {i + 1}
                  </div>
                  <span className="text-[clamp(16px,1.8vw,24px)] font-sans text-muted-foreground leading-snug">{s}</span>
                </div>
              )
            })}
          </div>

          <div className="w-full max-w-5xl space-y-5 pb-6 animate-fade-in-up-delay-2">
            <div className="border-l-2 border-primary pl-5 py-1 text-lg text-foreground/90 font-serif leading-relaxed">
              A dispatched vehicle goes busy, clears after travel plus scene time, then becomes available or returns to
              base per schedule.
            </div>
            <StateLegend />
          </div>
        </div>
      </div>
    </div>
  )
}
