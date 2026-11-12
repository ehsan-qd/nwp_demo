'use client'

import { useState } from 'react'
import SlideHeader from '@/components/ui/SlideHeader'
import MapEmbed from '@/components/ui/MapEmbed'
import { Footnote } from '@/components/ui/Callout'

type Row = {
  method: string
  mean: string
  median: string
  p90: string
  max: string
  reposEvents: string
  reposMinutes: string
  returnToBase: string
  tag?: string
}

const SCHEDULED_ROWS: Row[] = [
  { method: 'Approach 1 · Orbit/QUBO', mean: '10.76', median: '10.92', p90: '19.48', max: '31.81', reposEvents: '53', reposMinutes: '1,924', returnToBase: '42' },
  { method: 'Approach 1 · p-dit', mean: '9.86', median: '11.21', p90: '18.39', max: '19.87', reposEvents: '41', reposMinutes: '1,322', returnToBase: '44', tag: 'Fewest repositions' },
  { method: 'Approach 2 · Orbit/QUBO', mean: '7.76', median: '8.37', p90: '14.05', max: '22.92', reposEvents: '178', reposMinutes: '3,445', returnToBase: '78', tag: 'Fastest response' },
  { method: 'Approach 2 · p-dit', mean: '10.30', median: '11.21', p90: '17.45', max: '18.40', reposEvents: '87', reposMinutes: '1,867', returnToBase: '56' },
]

const ANIMATIONS = [
  {
    key: 'a1-orbit',
    label: 'Approach 1 · Orbit / QUBO',
    src: '/maps/10_approach1_scheduled_orbit_qubo_animation.html',
  },
  {
    key: 'a1-pdit',
    label: 'Approach 1 · categorical p-dit',
    src: '/maps/12_approach1_scheduled_pdit_animation.html',
  },
  {
    key: 'a2-pdit',
    label: 'Approach 2 · p-dit',
    src: '/maps/13_approach2_scheduled_pdit_animation.html',
  },
]

function DataRow({ r }: { r: Row }) {
  return (
    <tr className="border-b border-border/30 last:border-0">
      <td className="px-4 py-2.5 font-sans text-sm text-foreground">
        {r.method}
        {r.tag && (
          <span className="ml-2 text-[12px] uppercase tracking-wider text-primary border border-primary/40 px-1.5 py-0.5 align-middle">
            {r.tag}
          </span>
        )}
      </td>
      <td className="px-2 py-2.5 text-center font-mono text-xs text-muted-foreground">{r.mean}</td>
      <td className="px-2 py-2.5 text-center font-mono text-xs text-muted-foreground">{r.median}</td>
      <td className="px-2 py-2.5 text-center font-mono text-xs text-muted-foreground">{r.p90}</td>
      <td className="px-2 py-2.5 text-center font-mono text-xs text-muted-foreground">{r.max}</td>
      <td className="px-2 py-2.5 text-center font-mono text-xs text-muted-foreground">{r.reposEvents}</td>
      <td className="px-2 py-2.5 text-center font-mono text-xs text-muted-foreground">{r.reposMinutes}</td>
      <td className="px-4 py-2.5 text-center font-mono text-xs text-muted-foreground">{r.returnToBase}</td>
    </tr>
  )
}

export default function BenchmarkResultSlide() {
  const [active, setActive] = useState(ANIMATIONS[0].key)
  const current = ANIMATIONS.find((a) => a.key === active)!

  return (
    <div className="flex items-start justify-center h-full px-8 pt-3 overflow-y-auto dashboard-scroll">
      <div className="max-w-6xl w-full h-full flex flex-col">
        <SlideHeader
          eyebrow="Benchmark"
          title="Speed vs. movement trade-off"
          lede="All four scheduled methods serve every incident. The difference is how they get there: response speed traded against how much the fleet has to move."
        />

        <div className="border border-border bg-card/20 backdrop-blur-sm animate-fade-in-up-delay-1 overflow-x-auto mt-1 shrink-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[12px] text-muted-foreground font-sans uppercase tracking-wider">
                <th rowSpan={2} className="text-left px-4 py-1.5 align-bottom">Method</th>
                <th colSpan={4} className="text-center py-1 border-b border-l border-border/30">Response time (min)</th>
                <th colSpan={2} className="text-center py-1 border-b border-l border-border/30">Repositioning</th>
                <th rowSpan={2} className="text-center px-4 py-1.5 align-bottom border-l border-border/30">Return-to-base</th>
              </tr>
              <tr className="border-b border-border text-[12px] text-muted-foreground font-sans uppercase tracking-wider">
                <th className="text-center px-2 py-1.5 border-l border-border/30">Mean</th>
                <th className="text-center px-2 py-1.5">Median</th>
                <th className="text-center px-2 py-1.5">P90</th>
                <th className="text-center px-2 py-1.5">Max</th>
                <th className="text-center px-2 py-1.5 border-l border-border/30">Events</th>
                <th className="text-center px-2 py-1.5">Minutes</th>
              </tr>
            </thead>
            <tbody>
              {SCHEDULED_ROWS.map((r) => (
                <DataRow key={r.method} r={r} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 animate-fade-in-up-delay-2">
          <div className="border border-border p-3.5 bg-primary/5">
            <p className="text-sm text-muted-foreground font-serif leading-snug">
              <strong className="text-foreground font-sans">Approach 2 Orbit/QUBO</strong>{' '}
              has the lowest mean, median and P90 response time of any scheduled method, but needs 178
              repositioning moves (3,445 minutes) &mdash; more than triple the next-highest (53 events, 1,924
              minutes) &mdash; and the most return-to-base events (78).
            </p>
          </div>
          <div className="border border-border p-3.5 bg-card/30">
            <p className="text-sm text-muted-foreground font-serif leading-snug">
              <strong className="text-foreground font-sans">Approach 1 p-dit</strong>{' '}
              makes the fewest repositioning moves (41, 1,322 minutes) and a near-best worst case (19.87 min max)
              &mdash; the smallest movement bill for competitive coverage.
            </p>
          </div>
        </div>

        <div className="mt-6 animate-fade-in-up-delay-3">
          <div className="text-[13px] text-muted-foreground font-sans uppercase tracking-widest mb-3">
            See it move
          </div>
          <div className="flex gap-2 mb-3">
            {ANIMATIONS.map((a) => (
              <button
                key={a.key}
                onClick={() => setActive(a.key)}
                className={`px-3 py-1.5 text-xs font-sans uppercase tracking-wider border transition-colors ${
                  active === a.key
                    ? 'border-primary text-primary bg-primary/10'
                    : 'border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
          <MapEmbed
            src={current.src}
            title={current.label}
            height={380}
            caption="Live rolling-horizon simulation output. Use the animation controls inside the frame to step through the day."
          />
        </div>

        <Footnote>
          Evidence: scheduled benchmark rerun &mdash; response-time distribution and repositioning counts, Approach 1
          and Approach 2, Orbit/QUBO and p-dit solvers
        </Footnote>
      </div>
    </div>
  )
}
