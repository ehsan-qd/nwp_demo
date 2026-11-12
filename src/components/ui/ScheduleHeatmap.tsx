// Real selected work/rest schedule (15 vehicles x 8 hourly slots),
// sourced from outputs/08_scheduling_layer_qubo_schedule.csv
export const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00']

export const SCHEDULE: number[][] = [
  [1, 0, 1, 1, 0, 1, 1, 1],
  [0, 1, 1, 0, 1, 1, 1, 1],
  [1, 0, 1, 1, 1, 1, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 0],
  [0, 1, 0, 1, 1, 0, 1, 1],
  [1, 1, 0, 1, 1, 1, 1, 0],
  [1, 1, 1, 0, 0, 1, 1, 1],
  [1, 0, 0, 1, 1, 0, 1, 1],
  [0, 0, 1, 1, 1, 0, 1, 1],
  [1, 1, 1, 0, 1, 1, 0, 0],
  [1, 0, 0, 1, 0, 1, 1, 1],
  [1, 1, 1, 1, 0, 1, 0, 1],
  [0, 1, 0, 1, 1, 0, 1, 1],
  [0, 1, 1, 0, 1, 1, 1, 1],
  [0, 1, 0, 1, 1, 0, 1, 1],
]

export const TARGET_DEPLOYED = [9, 10, 9, 10, 11, 11, 12, 12]
export const SELECTED_DEPLOYED = [9, 10, 9, 10, 11, 10, 12, 12]

export default function ScheduleHeatmap({ delay = 1 }: { delay?: 1 | 2 | 3 | 4 }) {
  return (
    <div className={`border border-border bg-card/30 backdrop-blur-sm p-5 animate-fade-in-up-delay-${delay}`}>
      <div className="text-[13px] text-muted-foreground font-sans uppercase tracking-widest mb-4">
        Selected 15-vehicle schedule &mdash; SC01
      </div>
      <div className="grid gap-[3px]" style={{ gridTemplateColumns: '38px repeat(8, 1fr)' }}>
        <div />
        {HOURS.map((h) => (
          <div key={h} className="text-center text-[11px] text-muted-foreground font-mono pb-1">
            {h.slice(0, 2)}
          </div>
        ))}
        {SCHEDULE.map((row, i) => (
          <div key={`row-${i}`} className="contents">
            <div className="text-[11px] text-muted-foreground font-mono flex items-center">
              V{String(i + 1).padStart(2, '0')}
            </div>
            {row.map((v, j) => (
              <div
                key={`${i}-${j}`}
                className="h-3.5"
                style={{ background: v ? 'var(--state-available)' : 'rgba(255,255,255,0.08)' }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-4 text-[12px] text-muted-foreground font-sans">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-2 inline-block" style={{ background: 'var(--state-available)' }} />
          Deployed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-2 inline-block bg-white/10" />
          Station rest
        </span>
      </div>
    </div>
  )
}
