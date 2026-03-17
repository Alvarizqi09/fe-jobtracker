'use client'

import React from 'react'

interface StepperProps {
  currentStep: number
  steps: string[]
  setStep: (step: number) => void
}

export function ProfileStepper({ currentStep, steps, setStep }: StepperProps) {
  return (
    <div className="flex items-center justify-center w-full mb-8 overflow-x-auto py-2">
      {steps.map((step, index) => {
        const isActive = currentStep === index
        const isCompleted = currentStep > index

        return (
          <div key={step} className="flex items-center">
            <div
              className={`flex flex-col items-center relative z-10 cursor-pointer`}
              onClick={() => setStep(index)}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-colors duration-200
                  ${isActive ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' : 
                    isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
              >
                {isCompleted ? '✓' : index + 1}
              </div>
              <span className={`text-xs md:text-sm font-medium whitespace-nowrap ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {step}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`w-8 md:w-16 lg:w-24 h-1 mx-2 md:mx-4 rounded-full transition-colors duration-200 ${isCompleted ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
