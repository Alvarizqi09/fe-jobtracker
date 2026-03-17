'use client'

import { CoverLetterStyle } from '@/types/cover-letter.types'
import { Card, CardContent } from '@/components/ui/card'
import { Briefcase, MessageSquare, Sparkles } from 'lucide-react'

interface Props {
  selected: CoverLetterStyle
  onSelect: (style: CoverLetterStyle) => void
}

const STYLES: { id: CoverLetterStyle, label: string, desc: string, icon: any }[] = [
  { 
    id: 'formal', 
    label: 'Formal', 
    desc: 'Professional and structured, best for corporate roles',
    icon: Briefcase
  },
  { 
    id: 'conversational', 
    label: 'Conversational', 
    desc: 'Warm and personable, great for startups & creative companies',
    icon: MessageSquare
  },
  { 
    id: 'creative', 
    label: 'Creative', 
    desc: 'Bold and memorable, for roles where you want to stand out',
    icon: Sparkles
  }
]

export function StyleSelector({ selected, onSelect }: Props) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Writing Style</h3>
      <div className="grid grid-cols-1 gap-3">
        {STYLES.map(style => {
          const isSelected = selected === style.id
          const Icon = style.icon
          
          return (
            <Card 
              key={style.id}
              className={`cursor-pointer transition-all duration-200 border-2 overflow-hidden
                ${isSelected 
                  ? 'border-primary shadow-[0_0_15px_rgba(var(--primary),0.3)] bg-primary/5' 
                  : 'border-transparent hover:border-primary/50'
                }`}
              onClick={() => onSelect(style.id)}
            >
              <CardContent className="p-4 flex items-start gap-4">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <h4 className="font-semibold">{style.label}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{style.desc}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
