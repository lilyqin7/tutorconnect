"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

type Subject = {
  id: string
  name: string
}

export function TutorFilters({ subjects, selectedSubject }: { subjects: Subject[]; selectedSubject?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSubjectChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all") {
      params.delete("subject")
    } else {
      params.set("subject", value)
    }
    router.push(`/tutors?${params.toString()}`)
  }

  const handleClearFilters = () => {
    router.push("/tutors")
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Label htmlFor="subject-filter">Filter by Subject</Label>
        <Select value={selectedSubject || "all"} onValueChange={handleSubjectChange}>
          <SelectTrigger id="subject-filter">
            <SelectValue placeholder="All subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedSubject && (
        <Button variant="outline" onClick={handleClearFilters} className="bg-transparent">
          Clear Filters
        </Button>
      )}
    </div>
  )
}
