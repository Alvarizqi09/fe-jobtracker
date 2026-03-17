'use client'

import { useState } from 'react'
import { useProfileStore } from '@/store/profileStore'
import { Education } from '@/types/profile.types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export function EducationStep() {
  const { profile, updateField } = useProfileStore()
  const educations = profile?.education || []
  
  const [isEditing, setIsEditing] = useState(false)
  const [currentEdu, setCurrentEdu] = useState<Partial<Education>>({})

  const handleSaveEdu = () => {
    if (!currentEdu.institution || !currentEdu.degree || !currentEdu.field || !currentEdu.graduationYear) return

    let newArray = [...educations]
    if (currentEdu.id) {
      newArray = newArray.map(x => x.id === currentEdu.id ? currentEdu as Education : x)
    } else {
      newArray.push({
        ...currentEdu,
        id: crypto.randomUUID()
      } as Education)
    }
    
    updateField('education', newArray)
    setIsEditing(false)
    setCurrentEdu({})
  }

  const handleEdit = (id: string) => {
    const edu = educations.find(x => x.id === id)
    if (edu) {
      setCurrentEdu(edu)
      setIsEditing(true)
    }
  }

  const handleDelete = (id: string) => {
    updateField('education', educations.filter(x => x.id !== id))
  }

  return (
    <div className="space-y-6">
      {!isEditing && (
        <div className="flex justify-between items-center bg-card p-4 rounded-lg border">
          <div>
            <h3 className="font-semibold text-lg">Education</h3>
            <p className="text-sm text-muted-foreground">Add your educational background.</p>
          </div>
          <Button onClick={() => { setCurrentEdu({}); setIsEditing(true) }}>
            <Plus className="mr-2 h-4 w-4" /> Add Education
          </Button>
        </div>
      )}

      {isEditing && (
        <div className="bg-card p-6 rounded-lg border space-y-4">
          <h3 className="font-semibold text-lg mb-4">{currentEdu.id ? 'Edit' : 'Add'} Education</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Institution *</Label>
              <Input 
                value={currentEdu.institution || ''} 
                onChange={e => setCurrentEdu({...currentEdu, institution: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Degree *</Label>
              <Input 
                placeholder="e.g. Bachelor of Science"
                value={currentEdu.degree || ''} 
                onChange={e => setCurrentEdu({...currentEdu, degree: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Field of Study *</Label>
              <Input 
                placeholder="e.g. Computer Science"
                value={currentEdu.field || ''} 
                onChange={e => setCurrentEdu({...currentEdu, field: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Graduation Year *</Label>
              <Input 
                type="number"
                value={currentEdu.graduationYear || ''} 
                onChange={e => setCurrentEdu({...currentEdu, graduationYear: parseInt(e.target.value)})} 
              />
            </div>
            <div className="space-y-2">
              <Label>GPA (Optional)</Label>
              <Input 
                value={currentEdu.gpa || ''} 
                onChange={e => setCurrentEdu({...currentEdu, gpa: e.target.value})} 
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSaveEdu} disabled={!currentEdu.institution || !currentEdu.degree || !currentEdu.field || !currentEdu.graduationYear}>Save</Button>
          </div>
        </div>
      )}

      {!isEditing && educations.length > 0 && (
        <div className="space-y-4">
          {educations.map(edu => (
            <Card key={edu.id} className="bg-card/50">
              <CardContent className="p-4 flex gap-4 items-start pb-4">
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{edu.degree} in {edu.field}</h3>
                      <p className="text-muted-foreground font-medium">{edu.institution}</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        Class of {edu.graduationYear} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(edu.id)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(edu.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
