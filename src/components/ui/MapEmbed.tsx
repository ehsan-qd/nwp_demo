'use client'

import { useState } from 'react'

export default function MapEmbed({
  src,
  title,
  caption,
  height = 420,
  delay = 1,
}: {
  src: string
  title: string
  caption?: React.ReactNode
  height?: number
  delay?: 1 | 2 | 3 | 4
}) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={`border border-border bg-card/20 backdrop-blur-sm animate-fade-in-up-delay-${delay}`}>
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50">
        <span className="text-[13px] text-muted-foreground font-sans uppercase tracking-widest truncate">
          {title}
        </span>
        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          className="text-[13px] text-primary font-sans uppercase tracking-widest hover:text-foreground transition-colors shrink-0 ml-3"
        >
          Open full view &#8599;
        </a>
      </div>
      <div className="relative bg-white" style={{ height }}>
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/40">
            <div className="w-4 h-4 border border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <iframe
          src={src}
          title={title}
          className="w-full h-full border-0"
          onLoad={() => setLoaded(true)}
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
      {caption && (
        <div className="px-4 py-2.5 border-t border-border/50 text-sm text-muted-foreground font-serif leading-relaxed">
          {caption}
        </div>
      )}
    </div>
  )
}
