const STATES: { key: 'available' | 'busy' | 'resting'; label: string; color: string }[] = [
  { key: 'available', label: 'Available / deployed', color: 'var(--state-available)' },
  { key: 'busy', label: 'Busy', color: 'var(--state-busy)' },
  { key: 'resting', label: 'Resting at station', color: 'var(--state-resting)' },
]

export default function StateLegend({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-4 text-xs text-muted-foreground font-sans ${className}`}>
      {STATES.map((s) => (
        <span key={s.key} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: s.color }} />
          {s.label}
        </span>
      ))}
    </div>
  )
}

export function stateColor(key: 'available' | 'busy' | 'resting') {
  return STATES.find((s) => s.key === key)!.color
}
