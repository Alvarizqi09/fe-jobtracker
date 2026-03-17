'use client'

import { useProfileStore } from '@/store/profileStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function PersonalInfoStep() {
  const { profile, updateField } = useProfileStore()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Professional Headline *</Label>
            <Input 
              placeholder="e.g. Full Stack Developer with 3 years experience" 
              value={profile?.headline || ''} 
              onChange={(e) => updateField('headline', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Location *</Label>
            <Input 
              placeholder="e.g. Jakarta, Indonesia" 
              value={profile?.location || ''} 
              onChange={(e) => updateField('location', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Personal Summary *</Label>
          <Textarea 
            placeholder="A 2-3 sentence personal summary about your background and goals..." 
            className="min-h-[100px]"
            value={profile?.summary || ''}
            onChange={(e) => updateField('summary', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Phone (Optional)</Label>
            <Input 
              placeholder="+62 812..." 
              value={profile?.phone || ''} 
              onChange={(e) => updateField('phone', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>LinkedIn URL (Optional)</Label>
            <Input 
              placeholder="https://linkedin.com/in/..." 
              value={profile?.linkedin || ''} 
              onChange={(e) => updateField('linkedin', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Portfolio URL (Optional)</Label>
            <Input 
              placeholder="https://yourwebsite.com" 
              value={profile?.portfolio || ''} 
              onChange={(e) => updateField('portfolio', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>GitHub URL (Optional)</Label>
            <Input 
              placeholder="https://github.com/..." 
              value={profile?.github || ''} 
              onChange={(e) => updateField('github', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
