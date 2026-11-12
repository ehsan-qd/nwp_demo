import { HOURS, TARGET_DEPLOYED, SELECTED_DEPLOYED } from './ScheduleHeatmap'

export default function DemandLineChart({ delay = 1 }: { delay?: 1 | 2 | 3 | 4 }) {
  const min = 8
  const max = 13
  const w = 560
  const h = 220
  const padL = 28
  const padR = 16
  const padT = 12
  const padB = 28
  const plotW = w - padL - padR
  const plotH = h - padT - padB

  const x = (i: number) => padL + (i / (HOURS.length - 1)) * plotW
  const y = (v: number) => padT + plotH - ((v - min) / (max - min)) * plotH

  const toPath = (values: number[]) =>
    values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')

  return (
    <div className={`border border-border bg-card/30 backdrop-blur-sm p-5 animate-fade-in-up-delay-${delay}`}>
      <div className="text-[13px] text-muted-foreground font-sans uppercase tracking-widest mb-2">
        Hourly deployed vehicles &mdash; target vs. selected schedule
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" role="img" aria-label="Target versus selected hourly deployed vehicle counts">
        {[9, 10, 11, 12].map((v) => (
          <g key={v}>
            <line x1={padL} x2={w - padR} y1={y(v)} y2={y(v)} stroke="rgba(255,255,255,0.08)" />
            <text x={padL - 8} y={y(v) + 3} textAnchor="end" fontSize="9" fill="var(--muted-foreground)" fontFamily="var(--font-sans)">
              {v}
            </text>
          </g>
        ))}
        <path d={toPath(TARGET_DEPLOYED)} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeDasharray="4 3" />
        <path d={toPath(SELECTED_DEPLOYED)} fill="none" stroke="var(--primary)" strokeWidth="2.5" />
        {SELECTED_DEPLOYED.map((v, i) => (
          <circle key={i} cx={x(i)} cy={y(v)} r="3.5" fill="var(--primary)" />
        ))}
        {HOURS.map((label, i) => (
          <text key={label} x={x(i)} y={h - 6} textAnchor="middle" fontSize="9" fill="var(--muted-foreground)" fontFamily="var(--font-sans)">
            {label}
          </text>
        ))}
      </svg>
      <div className="flex gap-5 mt-1 text-[12px] text-muted-foreground font-sans">
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-[2px] inline-block bg-white/35" style={{ borderTop: '2px dashed rgba(255,255,255,0.35)' }} />
          Historical target
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-[2px] inline-block" style={{ background: 'var(--primary)' }} />
          Selected schedule (SC01)
        </span>
      </div>
    </div>
  )
}
