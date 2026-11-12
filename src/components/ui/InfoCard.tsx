export default function InfoCard({
  index,
  title,
  children,
  delay = 1,
}: {
  index?: React.ReactNode
  title: React.ReactNode
  children: React.ReactNode
  delay?: 1 | 2 | 3 | 4
}) {
  return (
    <div className={`border border-border p-6 bg-card/30 backdrop-blur-sm animate-fade-in-up-delay-${delay}`}>
      {index !== undefined && (
        <div className="text-primary text-2xl font-sans font-semibold mb-3">{index}</div>
      )}
      <h3 className="text-lg font-sans font-semibold text-foreground mb-2">{title}</h3>
      <div className="text-base text-muted-foreground font-serif leading-relaxed">{children}</div>
    </div>
  )
}
