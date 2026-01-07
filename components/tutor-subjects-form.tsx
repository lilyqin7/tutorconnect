"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"

type Subject = {
  id: string
  name: string
}

type TutorSubject = {
  id: string
  subject_id: string
  proficiency_level: string
  subject: Subject
}

export function TutorSubjectsForm({
  tutorId,
  subjects,
  tutorSubjects,
}: {
  tutorId: string
  subjects: Subject[]
  tutorSubjects: TutorSubject[]
}) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("")
  const [proficiencyLevel, setProficiencyLevel] = useState<string>("intermediate")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleAddSubject = async () => {
    if (!selectedSubjectId) return

    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.from("tutor_subjects").insert({
        tutor_id: tutorId,
        subject_id: selectedSubjectId,
        proficiency_level: proficiencyLevel,
      })

      if (error) throw error

      setSelectedSubjectId("")
      setProficiencyLevel("intermediate")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveSubject = async (tutorSubjectId: string) => {
    try {
      const { error } = await supabase.from("tutor_subjects").delete().eq("id", tutorSubjectId)

      if (error) throw error

      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    }
  }

  const availableSubjects = subjects.filter((subject) => !tutorSubjects.some((ts) => ts.subject_id === subject.id))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {tutorSubjects.map((ts) => (
          <Badge key={ts.id} variant="secondary" className="gap-2 py-1.5">
            <span>
              {ts.subject.name} ({ts.proficiency_level})
            </span>
            <button type="button" onClick={() => handleRemoveSubject(ts.id)} className="rounded-full hover:bg-muted">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        {tutorSubjects.length === 0 && <p className="text-sm text-muted-foreground">No subjects added yet</p>}
      </div>

      {availableSubjects.length > 0 && (
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <Label htmlFor="subject">Add Subject</Label>
            <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
              <SelectTrigger id="subject">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {availableSubjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Label htmlFor="proficiency">Proficiency Level</Label>
            <Select value={proficiencyLevel} onValueChange={setProficiencyLevel}>
              <SelectTrigger id="proficiency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button onClick={handleAddSubject} disabled={!selectedSubjectId || isLoading}>
              {isLoading ? "Adding..." : "Add"}
            </Button>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
