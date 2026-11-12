'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { QuantumDiceWordmark, NWPWordmark } from '@/components/BrandMark'

interface SlideNavigationProps {
  currentSlide: number
  totalSlides: number
  onNavigate: (slide: number) => void
  slideLabels: string[]
}

export default function SlideNavigation({ currentSlide, totalSlides, onNavigate, slideLabels }: SlideNavigationProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fullscreenError, setFullscreenError] = useState('')

  useEffect(() => {
    const syncFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', syncFullscreen)
    return () => document.removeEventListener('fullscreenchange', syncFullscreen)
  }, [])

  const toggleFullscreen = async () => {
    setFullscreenError('')
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await document.documentElement.requestFullscreen()
      }
    } catch {
      setFullscreenError('Fullscreen is unavailable in this browser.')
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-16 bg-black/60 backdrop-blur-lg border-b border-white/10">
      {/* Logo lockup */}
      <div className="flex items-center gap-4 shrink-0">
        <QuantumDiceWordmark />
        <div className="w-px h-6 bg-border hidden md:block" />
        <NWPWordmark className="hidden md:flex" />
      </div>

      {/* Slide indicators */}
      <div className="flex items-center gap-1 overflow-hidden">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button
            key={i}
            data-slide-number={i}
            onClick={() => onNavigate(i)}
            className="group relative px-1 py-3"
            title={`${i + 1}. ${slideLabels[i]}`}
          >
            <div
              className={`h-1 transition-all duration-300 rounded-full ${
                i === currentSlide
                  ? 'w-8 bg-primary'
                  : i < currentSlide
                  ? 'w-4 bg-primary/40'
                  : 'w-4 bg-white/20'
              }`}
            />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {slideLabels[i]}
            </div>
          </button>
        ))}
      </div>

      {/* Slide counter */}
      <div className="flex items-center gap-4 shrink-0">
      <Link href="/operations" data-pdf-hide className="hidden xl:inline-flex text-[12px] font-sans text-primary hover:text-foreground transition-colors" onKeyDown={(event) => event.stopPropagation()}>
        Operations prototype ↗
      </Link>
      <div className="text-sm text-muted-foreground font-sans">
        <span className="text-primary">{String(currentSlide + 1).padStart(2, '0')}</span>
        <span className="mx-1">/</span>
        <span>{String(totalSlides).padStart(2, '0')}</span>
      </div>
      <button
        type="button"
        data-pdf-hide
        onClick={toggleFullscreen}
        onKeyDown={(event) => event.stopPropagation()}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        aria-pressed={isFullscreen}
        title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Enter fullscreen'}
        className="flex items-center gap-2 rounded-md border border-white/20 px-3 py-2 text-sm font-sans text-foreground hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-primary transition-colors"
      >
        <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d={isFullscreen ? 'M8 3v5H3 M16 3v5h5 M8 21v-5H3 M16 21v-5h5' : 'M8 3H3v5 M16 3h5v5 M3 16v5h5 M21 16v5h-5'} />
        </svg>
        <span className="hidden lg:inline">{isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}</span>
      </button>
      {fullscreenError && <span role="status" className="absolute right-8 top-full mt-2 rounded-md bg-card px-3 py-2 text-sm text-foreground">{fullscreenError}</span>}
      </div>
    </div>
  )
}
