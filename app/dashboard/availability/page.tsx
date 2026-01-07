import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AvailabilityForm } from "@/components/availability-form"

export default async function AvailabilityPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

  if (profile?.user_type !== "tutor") {
    redirect("/dashboard")
  }

  // Get availability
  const { data: availability } = await supabase
    .from("availability")
    .select("*")
    .eq("tutor_id", user.id)
    .order("day_of_week")
    .order("start_time")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Availability</h2>
        <p className="text-muted-foreground">Set your weekly availability for tutoring sessions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>Add time slots when you&apos;re available to tutor</CardDescription>
        </CardHeader>
        <CardContent>
          <AvailabilityForm tutorId={user.id} availability={availability || []} />
        </CardContent>
      </Card>
    </div>
  )
}
