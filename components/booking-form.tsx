"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

type Subject = {
  id: string
  name: string
}

type Availability = {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
}

export function BookingForm({
  tutorId,
  studentId,
  subjects,
  availability,
}: {
  tutorId: string
  studentId: string
  subjects: Subject[]
  availability: Availability[]
}) {
  const [subjectId, setSubjectId] = useState<string>("")
  const [scheduledDate, setScheduledDate] = useState<string>("")
  const [scheduledTime, setScheduledTime] = useState<string>("")
  const [duration, setDuration] = useState<string>("60")
  const [notes, setNotes] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Combine date and time
      const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`)

      // Generate unique Jitsi meeting room ID
      const roomName = `tutor-${tutorId}-student-${studentId}-${Date.now()}`
      const meetingUrl = `https://meet.jit.si/${roomName}`

      const { error } = await supabase.from("sessions").insert({
        tutor_id: tutorId,
        student_id: studentId,
        subject_id: subjectId,
        scheduled_at: scheduledAt.toISOString(),
        duration_minutes: Number.parseInt(duration),
        notes,
        meeting_url: meetingUrl,
        status: "scheduled",
      })

      if (error) throw error

      router.push("/dashboard/sessions")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="subject">Subject</Label>
        <Select value={subjectId} onValueChange={setSubjectId} required>
          <SelectTrigger id="subject">
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            min={today}
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="duration">Duration</Label>
        <Select value={duration} onValueChange={setDuration} required>
          <SelectTrigger id="duration">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">30 minutes</SelectItem>
            <SelectItem value="60">60 minutes</SelectItem>
            <SelectItem value="90">90 minutes</SelectItem>
            <SelectItem value="120">120 minutes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any specific topics or questions you'd like to cover..."
          rows={4}
        />
      </div>

      {availability.length === 0 && (
        <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
          Note: This tutor hasn&apos;t set their availability yet. Please coordinate the session time with them.
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={isLoading || !subjectId}>
        {isLoading ? "Booking..." : "Book Session"}
      </Button>
    </form>
  )
}
