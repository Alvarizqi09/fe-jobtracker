'use client'

import { useState } from 'react'
import { useProfileStore } from '@/store/profileStore'
import { WorkExperience } from '@/types/profile.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'
import { WorkExperienceCard } from '../WorkExperienceCard'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

export function WorkExperienceStep() {
  const { profile, updateField } = useProfileStore()
  const experiences = profile?.workExperience || []
  
  const [isEditing, setIsEditing] = useState(false)
  const [currentExp, setCurrentExp] = useState<Partial<WorkExperience>>({})

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = experiences.findIndex(x => x.id === active.id)
      const newIndex = experiences.findIndex(x => x.id === over.id)
      const newArray = arrayMove(experiences, oldIndex, newIndex)
      updateField('workExperience', newArray)
    }
  }

  const handleSaveExp = () => {
    if (!currentExp.company || !currentExp.role || !currentExp.startDate || !currentExp.description) return

    let newArray = [...experiences]
    if (currentExp.id) {
      // Edit
      newArray = newArray.map(x => x.id === currentExp.id ? currentExp as WorkExperience : x)
    } else {
      // Add
      newArray.push({
        ...currentExp,
        id: crypto.randomUUID()
      } as WorkExperience)
    }
    
    updateField('workExperience', newArray)
    setIsEditing(false)
    setCurrentExp({})
  }

  const handleEdit = (id: string) => {
    const exp = experiences.find(x => x.id === id)
    if (exp) {
      setCurrentExp(exp)
      setIsEditing(true)
    }
  }

  const handleDelete = (id: string) => {
    updateField('workExperience', experiences.filter(x => x.id !== id))
  }

  return (
    <div className="space-y-6">
      {!isEditing && (
        <div className="flex justify-between items-center bg-card p-4 rounded-lg border">
          <div>
            <h3 className="font-semibold text-lg">Work Experience</h3>
            <p className="text-sm text-muted-foreground">Add your relevant work history.</p>
          </div>
          <Button onClick={() => { setCurrentExp({ isCurrent: false }); setIsEditing(true) }}>
            <Plus className="mr-2 h-4 w-4" /> Add Experience
          </Button>
        </div>
      )}

      {isEditing && (
        <div className="bg-card p-6 rounded-lg border space-y-4">
          <h3 className="font-semibold text-lg mb-4">{currentExp.id ? 'Edit' : 'Add'} Experience</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company *</Label>
              <Input 
                value={currentExp.company || ''} 
                onChange={e => setCurrentExp({...currentExp, company: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Role *</Label>
              <Input 
                value={currentExp.role || ''} 
                onChange={e => setCurrentExp({...currentExp, role: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Start Date (YYYY-MM) *</Label>
              <Input 
                type="month"
                value={currentExp.startDate || ''} 
                onChange={e => setCurrentExp({...currentExp, startDate: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>End Date (YYYY-MM)</Label>
              <Input 
                type="month"
                disabled={currentExp.isCurrent}
                value={currentExp.endDate || ''} 
                onChange={e => setCurrentExp({...currentExp, endDate: e.target.value})} 
              />
              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" 
                  id="current" 
                  checked={currentExp.isCurrent || false} 
                  onChange={e => {
                    setCurrentExp({...currentExp, isCurrent: e.target.checked, endDate: e.target.checked ? '' : currentExp.endDate})
                  }} 
                />
                <Label htmlFor="current" className="font-normal cursor-pointer">I currently work here</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea 
              placeholder="Highlight your key responsibilities and achievements..."
              className="min-h-[100px]"
              value={currentExp.description || ''} 
              onChange={e => setCurrentExp({...currentExp, description: e.target.value})} 
            />
          </div>

          <div className="space-y-2">
            <Label>Technologies (comma separated)</Label>
            <Input 
              placeholder="React, TypeScript, Node.js"
              value={currentExp.technologies?.join(', ') || ''} 
              onChange={e => {
                const techs = e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                setCurrentExp({...currentExp, technologies: techs})
              }} 
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSaveExp} disabled={!currentExp.company || !currentExp.role || !currentExp.startDate || !currentExp.description}>Save</Button>
          </div>
        </div>
      )}

      {!isEditing && experiences.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={experiences.map(x => x.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {experiences.map(exp => (
                <WorkExperienceCard 
                  key={exp.id} 
                  experience={exp} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete} 
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
