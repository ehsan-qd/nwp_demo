'use client'

export default function QuestionsSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8">
      <div className="text-xs text-primary font-sans uppercase tracking-widest mb-6 animate-fade-in-up">
        North Wales Police &middot; Forward Deployment Optimisation
      </div>
      <h1 className="text-5xl lg:text-7xl font-sans font-semibold text-foreground mb-6 animate-fade-in-up-delay-1 text-center leading-tight">
        Questions?
      </h1>
      <p className="text-lg lg:text-xl text-muted-foreground font-serif max-w-2xl text-center animate-fade-in-up-delay-2 leading-relaxed">
        Formulations, benchmark definitions and limitations are in the appendix that follows.
      </p>
    </div>
  )
}
