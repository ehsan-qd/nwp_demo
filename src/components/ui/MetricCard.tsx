export default function MetricCard({
  value,
  label,
  note,
  delay = 1,
  valueClassName = '',
}: {
  value: React.ReactNode
  label: React.ReactNode
  note?: React.ReactNode
  delay?: 1 | 2 | 3 | 4
  valueClassName?: string
}) {
  return (
    <div className={`border border-border p-5 bg-card/30 backdrop-blur-sm animate-fade-in-up-delay-${delay}`}>
      <div className={`text-3xl font-sans font-semibold text-primary mb-2 ${valueClassName}`}>{value}</div>
      <h3 className="font-sans font-semibold text-foreground text-sm mb-1">{label}</h3>
      {note && <p className="text-sm text-muted-foreground font-serif leading-relaxed">{note}</p>}
    </div>
  )
}
