'use client'

import SlideHeader from '@/components/ui/SlideHeader'
import DemandLineChart from '@/components/ui/DemandLineChart'
import ScheduleHeatmap from '@/components/ui/ScheduleHeatmap'
import { Footnote } from '@/components/ui/Callout'

export default function SchedulingResultSlide() {
  return (
    <div className="flex items-start justify-center h-full px-8 pt-4 overflow-y-auto dashboard-scroll">
      <div className="max-w-6xl w-full h-full flex flex-col">
        <SlideHeader
          eyebrow="Scheduling result"
          title="The selected schedule tracks historical hourly demand"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
          <div className="space-y-4">
            <DemandLineChart delay={1} />
            <div className="grid grid-cols-3 gap-3">
              {[
                ['1', 'vehicle maximum hourly gap'],
                ['4', 'validated schedules'],
                ['SC01', 'best tested candidate'],
              ].map(([v, l]) => (
                <div key={l} className="border border-border p-3 bg-card/20 text-center">
                  <div className="text-xl font-sans font-semibold text-primary">{v}</div>
                  <div className="text-[12px] text-muted-foreground font-sans mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <ScheduleHeatmap delay={2} />
        </div>

        <Footnote>
          SC01 scored best in the tested scenario, not as a universally optimal roster; selection reuses the same
          24-hour scenario reported later. Evidence: outputs/08_scheduling_layer_qubo_* and
          outputs/10_approach1_scheduled_orbit_qubo_schedule_candidate_scorecard.csv
        </Footnote>
      </div>
    </div>
  )
}
