'use client'

import { useState, useEffect, useCallback } from 'react'
import ParticleBackground from '@/components/ParticleBackground'
import SlideNavigation from '@/components/SlideNavigation'
import TitleSlide from '@/components/slides/TitleSlide'
import OperationalProblemSlide from '@/components/slides/OperationalProblemSlide'
import SuccessMeasuresSlide from '@/components/slides/SuccessMeasuresSlide'
import LayeredSolutionSlide from '@/components/slides/LayeredSolutionSlide'
import StaticApproachSlide from '@/components/slides/StaticApproachSlide'
import StaticResultSlide from '@/components/slides/StaticResultSlide'
import SchedulingNeedSlide from '@/components/slides/SchedulingNeedSlide'
import SchedulingOptimisationSlide from '@/components/slides/SchedulingOptimisationSlide'
import SchedulingResultSlide from '@/components/slides/SchedulingResultSlide'
import DynamicLoopSlide from '@/components/slides/DynamicLoopSlide'
import FourMethodsSlide from '@/components/slides/FourMethodsSlide'
import DynamicOutputSlide from '@/components/slides/DynamicOutputSlide'
import BenchmarkDesignSlide from '@/components/slides/BenchmarkDesignSlide'
import BenchmarkResultSlide from '@/components/slides/BenchmarkResultSlide'
import NextStepsSlide from '@/components/slides/NextStepsSlide'
import QuestionsSlide from '@/components/slides/QuestionsSlide'
import CustomerReflectionSlide from '@/components/slides/CustomerReflectionSlide'
import ApproachOneQuboSlide from '@/components/slides/appendix/ApproachOneQuboSlide'
import ApproachTwoQuboSlide from '@/components/slides/appendix/ApproachTwoQuboSlide'
import SchedulingQuboSlide from '@/components/slides/appendix/SchedulingQuboSlide'
import CandidateScoreSlide from '@/components/slides/appendix/CandidateScoreSlide'
import BenchmarkDefinitionsSlide from '@/components/slides/appendix/BenchmarkDefinitionsSlide'
import LimitationsSlide from '@/components/slides/appendix/LimitationsSlide'

const slides = [
  // Core deck
  { component: TitleSlide, label: 'Title' },
  { component: OperationalProblemSlide, label: 'The operational problem' },
  { component: SuccessMeasuresSlide, label: 'What success means' },
  { component: LayeredSolutionSlide, label: 'The layered solution' },
  { component: StaticApproachSlide, label: 'Static formulation' },
  { component: StaticResultSlide, label: 'Static result' },
  { component: SchedulingNeedSlide, label: 'Why scheduling' },
  { component: SchedulingOptimisationSlide, label: 'Scheduling optimisation' },
  { component: SchedulingResultSlide, label: 'Scheduling result' },
  { component: DynamicLoopSlide, label: 'Dynamic optimisation loop' },
  { component: FourMethodsSlide, label: 'Four optimisation methods' },
  { component: DynamicOutputSlide, label: 'Dynamic output' },
  { component: BenchmarkDesignSlide, label: 'Benchmark design' },
  { component: BenchmarkResultSlide, label: 'Results and benchmark' },
  { component: NextStepsSlide, label: 'What we learned' },
  { component: CustomerReflectionSlide, label: 'Customer reflection' },
  { component: QuestionsSlide, label: 'Questions' },
  // Appendix
  { component: ApproachOneQuboSlide, label: 'Appendix A: Approach 1 QUBO' },
  { component: ApproachTwoQuboSlide, label: 'Appendix B: Approach 2 QUBO' },
  { component: SchedulingQuboSlide, label: 'Appendix C: Scheduling QUBO' },
  { component: CandidateScoreSlide, label: 'Appendix D: Candidate schedule score' },
  { component: BenchmarkDefinitionsSlide, label: 'Appendix E: Benchmark definitions' },
  { component: LimitationsSlide, label: 'Appendix F: Limitations' },
]

export default function Presentation() {
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
