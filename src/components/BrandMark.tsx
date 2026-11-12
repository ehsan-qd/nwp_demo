import Image from 'next/image'

export function QuantumDiceWordmark({ className = '', markClassName = 'h-9' }: { className?: string; markClassName?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/images/quantum-dice-mark.png"
        alt="Quantum Dice"
        width={4050}
        height={1386}
        className={`${markClassName} w-auto object-contain`}
        priority
      />
    </div>
  )
}

export function NWPWordmark({ className = '', crestClassName = 'h-9' }: { className?: string; crestClassName?: string }) {
  return (
    <div className={`flex items-center bg-white/95 px-2.5 py-1 ${className}`}>
      <Image
        src="/images/north-wales-police-crest.png"
        alt="North Wales Police"
        width={1418}
        height={710}
        className={`${crestClassName} w-auto object-contain`}
        priority
      />
    </div>
  )
}
