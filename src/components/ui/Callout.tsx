export function Callout({ children, delay = 1 }: { children: React.ReactNode; delay?: 1 | 2 | 3 | 4 }) {
  return (
    <div
      className={`border-l-2 border-primary pl-5 py-1 text-lg text-foreground/90 font-serif leading-relaxed animate-fade-in-up-delay-${delay}`}
    >
      {children}
    </div>
  )
}

export function Footnote({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] text-muted-foreground font-sans leading-relaxed pt-3 mt-auto border-t border-border/40 animate-fade-in-up-delay-3">
      {children}
    </p>
  )
}

export function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs text-muted-foreground font-sans uppercase tracking-widest mb-3">
      {children}
    </div>
  )
}
