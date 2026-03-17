'use client'

import { useState } from 'react'
import { useProfileStore } from '@/store/profileStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { X, Plus } from 'lucide-react'

export function SkillsStep() {
  const { profile, updateField } = useProfileStore()
  
  const [skillInput, setSkillInput] = useState('')
  const [achievementInput, setAchievementInput] = useState('')
  const [languageInput, setLanguageInput] = useState('')

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault()
      if (!profile?.skills.includes(skillInput.trim())) {
        updateField('skills', [...(profile?.skills || []), skillInput.trim()])
      }
      setSkillInput('')
    }
  }

  const handleRemoveSkill = (skill: string) => {
    updateField('skills', (profile?.skills || []).filter(s => s !== skill))
  }

  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault()
    if (achievementInput.trim()) {
      updateField('achievements', [...(profile?.achievements || []), achievementInput.trim()])
      setAchievementInput('')
    }
  }

  const handleRemoveAchievement = (index: number) => {
    const newArr = [...(profile?.achievements || [])]
    newArr.splice(index, 1)
    updateField('achievements', newArr)
  }

  const handleAddLanguage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && languageInput.trim()) {
      e.preventDefault()
      if (!profile?.languages.includes(languageInput.trim())) {
        updateField('languages', [...(profile?.languages || []), languageInput.trim()])
      }
      setLanguageInput('')
    }
  }

  const handleRemoveLanguage = (lang: string) => {
    updateField('languages', (profile?.languages || []).filter(l => l !== lang))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills & Achievements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* SKILLS */}
        <div className="space-y-3">
          <div>
            <Label>Skills</Label>
            <p className="text-sm text-muted-foreground mb-2">Type a skill and press Enter to add.</p>
            <Input 
              placeholder="e.g. React, TypeScript, Node.js" 
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {(profile?.skills || []).map(skill => (
              <div key={skill} className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {skill}
                <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-primary/70 focus:outline-none">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {(profile?.skills || []).length === 0 && (
              <span className="text-sm text-muted-foreground">No skills added yet.</span>
            )}
          </div>
        </div>

        {/* ACHIEVEMENTS */}
        <div className="space-y-3 pt-4 border-t">
          <div>
            <Label>Notable Achievements</Label>
            <p className="text-sm text-muted-foreground mb-2">Add specific, measurable achievements.</p>
            <div className="flex gap-2">
              <Input 
                placeholder="e.g. Increased API response time by 40%..." 
                value={achievementInput}
                onChange={(e) => setAchievementInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddAchievement(e)
                }}
              />
              <Button onClick={handleAddAchievement} type="button" variant="secondary">
                <Plus className="h-4 w-4 mr-2" /> Add
              </Button>
            </div>
          </div>
          
          <ul className="space-y-2 mt-2">
            {(profile?.achievements || []).map((achievement, i) => (
              <li key={i} className="flex gap-2 items-start bg-muted/50 p-2 rounded-md group">
                <div className="flex-1 text-sm">{achievement}</div>
                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive" onClick={() => handleRemoveAchievement(i)}>
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
            {(profile?.achievements || []).length === 0 && (
              <span className="text-sm text-muted-foreground">No achievements added yet.</span>
            )}
          </ul>
        </div>

        {/* LANGUAGES */}
        <div className="space-y-3 pt-4 border-t">
          <div>
            <Label>Languages</Label>
            <p className="text-sm text-muted-foreground mb-2">Type a language and press Enter to add.</p>
            <Input 
              placeholder="e.g. English (Fluent), Indonesian (Native)" 
              value={languageInput}
              onChange={(e) => setLanguageInput(e.target.value)}
              onKeyDown={handleAddLanguage}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {(profile?.languages || []).map(lang => (
              <div key={lang} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
                {lang}
                <button type="button" onClick={() => handleRemoveLanguage(lang)} className="hover:text-secondary-foreground/70 focus:outline-none">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {(profile?.languages || []).length === 0 && (
              <span className="text-sm text-muted-foreground">No languages added yet.</span>
            )}
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
