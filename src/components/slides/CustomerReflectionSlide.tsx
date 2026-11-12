export default function CustomerReflectionSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8 text-center overflow-y-auto dashboard-scroll">
      <div className="text-[18px] text-primary font-sans uppercase tracking-widest mb-6 animate-fade-in-up">
        Customer perspective
      </div>
      <h1 className="text-[68px] lg:text-[100px] font-sans font-semibold text-foreground mb-8 leading-tight animate-fade-in-up-delay-1">
        David Westby
      </h1>
      <div className="max-w-[1600px] animate-fade-in-up-delay-2">
        <p className="text-[38px] font-sans font-semibold text-primary mb-5">Head of Strategy</p>
        <p className="text-[36px] font-sans text-muted-foreground leading-relaxed">
          Office of the Police Chief Scientific Adviser (OPCSA)
        </p>
        <p className="text-[36px] font-sans text-muted-foreground leading-relaxed mt-3">
          National Police Chiefs’ Council
        </p>
      </div>
    </div>
  )
}
