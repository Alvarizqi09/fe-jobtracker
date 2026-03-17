'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CoverLetter } from '@/types/cover-letter.types'
import { FileText, Calendar, Building, Trash2, Edit } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

interface Props {
  letter: CoverLetter
  onDelete: (id: string) => void
}

export function CoverLetterCard({ letter, onDelete }: Props) {
  const isFormal = letter.style === 'formal'
  const isCreative = letter.style === 'creative'

  return (
    <Card className="hover:border-primary/50 transition-colors flex flex-col h-full bg-card/50">
      <CardContent className="p-5 flex flex-col flex-1 h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <FileText size={24} />
          </div>
          <Badge variant="outline" className={`capitalize border ${isFormal ? 'border-blue-500/50 text-blue-500' : isCreative ? 'border-purple-500/50 text-purple-500' : 'border-green-500/50 text-green-500'}`}>
            {letter.style}
          </Badge>
        </div>

        <div className="flex-1">
          <h3 className="font-semibold px-0 text-lg line-clamp-1 mb-1" title={letter.jobTitle}>
            {letter.jobTitle}
          </h3>
          <div className="flex items-center text-muted-foreground mb-3 text-sm">
            <Building className="w-4 h-4 mr-1.5" />
            <span className="line-clamp-1">{letter.companyName}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <div className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              {letter.createdAt && !isNaN(new Date(letter.createdAt).getTime()) ? formatDistanceToNow(new Date(letter.createdAt), { addSuffix: true }) : 'Recently'}
            </div>
            <span>{letter.wordCount} words</span>
          </div>
          
          <div className="flex gap-2 w-full mt-2">
            <Button variant="outline" className="flex-1" onClick={() => window.location.href = `/cover-letter/${letter.jobId || 'new'}`}>
              <Edit className="w-4 h-4 mr-2" /> View & Edit
            </Button>
            <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => onDelete(letter._id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
