'use client'

import SlideHeader from '@/components/ui/SlideHeader'

const TERMS: [string, string, string][] = [
  ['1000', 'x uncovered incidents', 'Heaviest penalty: an incident with no eligible vehicle available.'],
  ['25', 'x late incidents', 'An incident served, but outside the ten-minute target.'],
  ['1', 'x total response minutes', 'Sums modelled response time across all served incidents.'],
  ['0.05', 'x relocation minutes', 'A light weight on FDL relocation travel, so it does not dominate the score.'],
]

export default function CandidateScoreSlide() {
  return (
    <div className="flex items-start justify-center h-full px-8 pt-4 overflow-y-auto dashboard-scroll">
      <div className="max-w-5xl w-full">
        <SlideHeader eyebrow="Appendix D" title="Candidate schedule score" />

        <div className="border border-border p-8 bg-card/30 backdrop-blur-sm mb-8 animate-fade-in-up-delay-1">
          <div className="text-xs text-muted-foreground font-sans uppercase tracking-widest mb-4">
            Lower is better
          </div>
          <div className="font-mono text-foreground text-center py-4 leading-loose text-base lg:text-lg">
            score = 1000 &times; uncovered + 25 &times; late
            <br />
            + total response minutes + 0.05 &times; relocation minutes
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in-up-delay-2">
          {TERMS.map(([w, t, d]) => (
            <div key={t} className="border border-border p-4 bg-card/30">
              <div className="text-xl font-sans font-semibold text-primary mb-1">{w}</div>
              <div className="text-xs font-sans font-semibold text-foreground mb-2">{t}</div>
              <p className="text-sm text-muted-foreground font-serif leading-relaxed">{d}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 border border-border/50 bg-card/10 animate-fade-in-up-delay-3">
          <p className="text-base text-muted-foreground font-serif">
            <strong className="text-foreground font-sans">Experimental weights,</strong>{' '}
            pending operational agreement. SC01 minimises this score for the tested scenario only.
          </p>
        </div>
      </div>
    </div>
  )
}
