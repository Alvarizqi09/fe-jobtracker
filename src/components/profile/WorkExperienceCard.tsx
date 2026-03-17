'use client'

import { WorkExperience } from '@/types/profile.types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GripVertical, Pencil, Trash2 } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Props {
  experience: WorkExperience
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function WorkExperienceCard({ experience, onEdit, onDelete }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: experience.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Card ref={setNodeRef} style={style} className="bg-card/50">
      <CardContent className="p-4 flex gap-4 items-start pb-4">
        <div {...attributes} {...listeners} className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground outline-none">
          <GripVertical size={20} />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{experience.role}</h3>
              <p className="text-muted-foreground font-medium">{experience.company}</p>
              <p className="text-sm text-muted-foreground mb-2">
                {experience.startDate} - {experience.isCurrent ? 'Present' : experience.endDate}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => onEdit(experience.id)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDelete(experience.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <p className="text-sm whitespace-pre-wrap mt-2">{experience.description}</p>
          
          {experience.technologies && experience.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {experience.technologies.map(tech => (
                <span key={tech} className="px-2 py-1 bg-secondary rounded-md text-xs font-medium">
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
