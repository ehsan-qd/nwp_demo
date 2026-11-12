'use client'

import SlideHeader from '@/components/ui/SlideHeader'
import MetricCard from '@/components/ui/MetricCard'
import { Callout, Footnote } from '@/components/ui/Callout'

export default function ResultsOverviewSlide() {
  return (
    <div className="flex items-start justify-center h-full px-8 pt-4 overflow-y-auto dashboard-scroll">
      <div className="max-w-6xl w-full h-full flex flex-col">
        <SlideHeader
          eyebrow="Results"
          title="Every coverage measure improved"
          lede="Tested against the fixed-station baseline and historical demand."
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <MetricCard
            value="75.6%"
            label="P0 demand within 10 min"
            note="up from 58.8% at fixed stations"
            delay={1}
          />
          <MetricCard
            value="4.82 min"
            label="Weighted response time"
            note="down from 8.07 min — 3.25 min faster"
            delay={2}
          />
          <MetricCard
            value="64.3%"
            label="Wards within 10 min"
            note="up from 39.3% — +25.0 pp"
            delay={3}
          />
          <MetricCard
            value="4"
            label="Validated schedules"
            note="best candidate tracks hourly demand within a 1-vehicle gap"
            delay={4}
          />
        </div>

        <div className="mt-8">
          <Callout delay={2}>
            <strong className="font-sans text-foreground">Static FDL placement</strong> gave the strongest single
            improvement in modelled coverage — the foundation the scheduling and dynamic layers build on next.
          </Callout>
        </div>

        <Footnote>
          Modelled, weighted, in-sample; travel time is the response proxy. Evidence: outputs/04_1_summary_metrics.csv,
          outputs/08_scheduling_layer_qubo_*
        </Footnote>
      </div>
    </div>
  )
}
