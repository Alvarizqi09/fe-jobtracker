"use client"
import React, { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

export function GlobalLoader() {
  const containerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Grid fade in
      gsap.to('.loader-grid', { opacity: 0.3, duration: 1, ease: 'power2.out' })
      
      // 2. Logo scaling & glow
      gsap.fromTo('.loader-logo', 
        { y: 30, opacity: 0, filter: 'blur(10px)' }, 
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'expo.out' }
      )

      // 3. Scanner line moving up and down
      gsap.fromTo('.scanner', 
        { top: '-10%' }, 
        { top: '110%', duration: 1.5, repeat: -1, yoyo: true, ease: 'power1.inOut' }
      )

      // 4. Dot pulsing
      gsap.to('.dot', {
        opacity: 0.2,
        scale: 0.5,
        duration: 0.6,
        stagger: { each: 0.1, yoyo: true, repeat: -1 },
        ease: 'power1.inOut'
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-(--bg-primary) overflow-hidden">
      {/* Background Grid */}
      <div 
        className="loader-grid absolute inset-0 opacity-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(30,45,64,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(30,45,64,0.4) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 20%, transparent 80%)'
        }}
      />

      {/* Main Logo Box */}
      <div className="loader-logo relative flex flex-col items-center">
        <div className="relative font-syne text-5xl font-bold tracking-tighter text-(--text-primary) px-4 py-2">
          Job<span className="text-(--accent-cyan)">Deck</span>
          
          {/* Scanner Line */}
          <div className="scanner absolute left-0 right-0 h-[2px] bg-(--accent-cyan) shadow-[0_0_12px_rgba(0,212,255,1)] opacity-80 z-10 pointer-events-none" />
        </div>
        
        <div className="mt-8 flex items-center gap-2">
          <span className="text-xs uppercase tracking-[0.2em] text-(--text-muted)">Initializing Systems</span>
          <div className="flex gap-1 ml-1">
            <div className="dot w-1.5 h-1.5 rounded-full bg-(--accent-cyan)" />
            <div className="dot w-1.5 h-1.5 rounded-full bg-(--accent-cyan)" />
            <div className="dot w-1.5 h-1.5 rounded-full bg-(--accent-cyan)" />
          </div>
        </div>
      </div>
    </div>
  )
}
