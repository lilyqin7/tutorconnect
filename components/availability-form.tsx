"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"

type Availability = {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export function AvailabilityForm({ tutorId, availability }: { tutorId: string; availability: Availability[] }) {
  const [dayOfWeek, setDayOfWeek] = useState<string>("")
  const [startTime, setStartTime] = useState<string>("09:00")
  const [endTime, setEndTime] = useState<string>("10:00")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleAddAvailability = async () => {
    if (!dayOfWeek) return

    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.from("availability").insert({
        tutor_id: tutorId,
        day_of_week: Number.parseInt(dayOfWeek),
        start_time: startTime,
        end_time: endTime,
      })

      if (error) throw error

      setDayOfWeek("")
      setStartTime("09:00")
      setEndTime("10:00")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveAvailability = async (availabilityId: string) => {
    try {
      const { error } = await supabase.from("availability").delete().eq("id", availabilityId)

      if (error) throw error

      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    }
  }

  // Group availability by day
  const groupedAvailability = availability.reduce(
    (acc, avail) => {
      if (!acc[avail.day_of_week]) {
        acc[avail.day_of_week] = []
      }
      acc[avail.day_of_week].push(avail)
      return acc
    },
    {} as Record<number, Availability[]>,
  )

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {DAYS.map((day, index) => (
          <div key={index} className="flex items-start gap-4 border-b pb-4 last:border-0">
            <div className="w-24 flex-shrink-0">
              <p className="font-medium">{day}</p>
            </div>
            <div className="flex flex-1 flex-wrap gap-2">
              {groupedAvailability[index]?.map((avail) => (
                <Badge key={avail.id} variant="secondary" className="gap-2 py-1.5">
                  <span>
                    {avail.start_time.substring(0, 5)} - {avail.end_time.substring(0, 5)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAvailability(avail.id)}
                    className="rounded-full hover:bg-muted"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {!groupedAvailability[index]?.length && <p className="text-sm text-muted-foreground">Not available</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 border-t pt-6">
        <h3 className="font-semibold">Add Time Slot</h3>
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="day">Day</Label>
            <Select value={dayOfWeek} onValueChange={setDayOfWeek}>
              <SelectTrigger id="day">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {DAYS.map((day, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="start-time">Start Time</Label>
            <Input id="start-time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-time">End Time</Label>
            <Input id="end-time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>

          <div className="flex items-end">
            <Button onClick={handleAddAvailability} disabled={!dayOfWeek || isLoading} className="w-full">
              {isLoading ? "Adding..." : "Add"}
            </Button>
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  )
}
