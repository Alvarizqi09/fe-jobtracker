'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import gsap from 'gsap'

interface Props {
  isGenerating: boolean
  onClick: () => void
  disabled?: boolean
}

export function GenerateButton({ isGenerating, onClick, disabled }: Props) {
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    let ctx = gsap.context(() => {})
    
    if (!isGenerating && !disabled && btnRef.current) {
      ctx.add(() => {
        gsap.to(btnRef.current, {
          boxShadow: '0 0 20px rgba(0, 212, 255, 0.4)',
          repeat: -1,
          yoyo: true,
          duration: 1.5,
          ease: 'power1.inOut'
        })
      })
    }
    
    return () => ctx.revert()
  }, [isGenerating, disabled])

  return (
    <Button 
      ref={btnRef}
      className={`w-full py-6 text-lg font-bold transition-all ${
        isGenerating ? 'opacity-90' : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400'
      }`}
      onClick={onClick}
      disabled={isGenerating || disabled}
    >
      {isGenerating ? (
        <span className="flex items-center gap-2 animate-pulse">
          <Sparkles className="animate-spin" /> Crafting your letter...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <Sparkles /> Generate Cover Letter
        </span>
      )}
    </Button>
  )
}
