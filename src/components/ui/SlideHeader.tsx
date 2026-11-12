export default function SlideHeader({
  eyebrow,
  title,
  lede,
  className = '',
}: {
  eyebrow?: string
  title: React.ReactNode
  lede?: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      {eyebrow && (
        <div className="text-xs text-primary font-sans uppercase tracking-widest mb-3 animate-fade-in-up">
          {eyebrow}
        </div>
      )}
      <h2 className="text-4xl lg:text-5xl font-sans font-semibold text-foreground mb-4 animate-fade-in-up leading-tight">
        {title}
      </h2>
      {lede && (
        <p className="text-lg text-muted-foreground font-serif mb-10 animate-fade-in-up-delay-1 max-w-3xl leading-relaxed">
          {lede}
        </p>
      )}
    </div>
  )
}
