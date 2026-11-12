'use client'

import { useState, useEffect, useCallback } from 'react'
import ParticleBackground from '@/components/ParticleBackground'
import SlideNavigation from '@/components/SlideNavigation'
import TitleSlide from '@/components/slides/TitleSlide'
import QuestionsSlide from '@/components/slides/QuestionsSlide'
import CustomerReflectionSlide from '@/components/slides/CustomerReflectionSlide'
import ProblemSlide from '@/components/slides/showcase/ProblemSlide'
import SolutionSlide from '@/components/slides/showcase/SolutionSlide'
import ResultsOverviewSlide from '@/components/slides/showcase/ResultsOverviewSlide'
import SchedulingSlide from '@/components/slides/showcase/SchedulingSlide'
import BenchmarkResultSlide from '@/components/slides/showcase/BenchmarkResultSlide'
import NextStepsSlide from '@/components/slides/showcase/NextStepsSlide'

// Condensed 9-slide showcase deck (~10-12 min). Reuses the full deck's design
// system; slide components live under components/slides/showcase and do not
// modify the full deck's components.
const slides = [
  { component: TitleSlide, label: 'Title' },
  { component: ProblemSlide, label: 'The problem' },
  { component: SolutionSlide, label: 'The solution' },
  { component: ResultsOverviewSlide, label: 'Results' },
  { component: SchedulingSlide, label: 'Scheduling' },
  { component: BenchmarkResultSlide, label: 'Benchmark' },
  { component: NextStepsSlide, label: "What's next" },
  { component: CustomerReflectionSlide, label: 'Customer reflection' },
  { component: QuestionsSlide, label: 'Questions' },
]

export default function ShowcasePresentation() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [slideKey, setSlideKey] = useState(0)

  const navigateTo = useCallback((index: number) => {
    if (index === currentSlide || isTransitioning) return
    if (index < 0 || index >= slides.length) return

    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide(index)
      setSlideKey((prev) => prev + 1)
      setIsTransitioning(false)
    }, 300)
  }, [currentSlide, isTransitioning])

  const next = useCallback(() => navigateTo(currentSlide + 1), [currentSlide, navigateTo])
  const prev = useCallback(() => navigateTo(currentSlide - 1), [currentSlide, navigateTo])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        next()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        prev()
      } else if (e.key === 'Home') {
        e.preventDefault()
        navigateTo(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        navigateTo(slides.length - 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [next, prev, navigateTo])

  const CurrentSlideComponent = slides[currentSlide].component

  return (
    <div
      className="h-screen w-screen overflow-hidden bg-background relative"
      data-presentation
      data-current-slide={currentSlide}
      data-total-slides={slides.length}
    >
      <ParticleBackground />

      <SlideNavigation
        currentSlide={currentSlide}
        totalSlides={slides.length}
        onNavigate={navigateTo}
        slideLabels={slides.map((s) => s.label)}
      />

      <div
        data-slide-frame
        className={`relative z-10 h-full pt-16 pb-28 transition-all duration-300 ${
          isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}
        key={slideKey}
      >
        <CurrentSlideComponent />
      </div>

      <div data-pdf-hide className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
        <div className="h-24 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 text-xs text-white/50 font-sans pointer-events-auto">
          {currentSlide > 0 && (
            <button onClick={prev} className="hover:text-white transition-colors flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <polyline points="15,18 9,12 15,6" />
              </svg>
              Prev
            </button>
          )}
          {currentSlide < slides.length - 1 && (
            <button onClick={next} className="hover:text-white transition-colors flex items-center gap-1">
              Next
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <polyline points="9,6 15,12 9,18" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
