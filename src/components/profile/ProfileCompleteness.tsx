'use client'

import { useProfileStore, calculateCompleteness } from '@/store/profileStore'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ProfileCompleteness() {
  const profile = useProfileStore((state) => state.profile)
  const completeness = calculateCompleteness(profile)
  const { percentage, missing } = completeness

  let colorClass = 'text-red-500'
  
  if (percentage >= 80) {
    colorClass = 'text-green-500'
  } else if (percentage >= 50) {
    colorClass = 'text-amber-500'
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Profile Completeness</span>
          <span className={`font-bold ${colorClass}`}>{percentage}%</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={percentage} className="h-2 mb-4" />
        
        {missing.length > 0 ? (
          <div className="text-sm">
            <p className="font-semibold mb-2">To reach 100%, add:</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {missing.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-green-500 font-medium">
            Your profile is fully complete! You're ready to generate amazing cover letters.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
