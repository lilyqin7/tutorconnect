import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User } from "lucide-react"
import { redirect, notFound } from "next/navigation"
import { BookingForm } from "@/components/booking-form"

type Params = Promise<{ tutorId: string }>

export default async function BookSessionPage(props: { params: Params }) {
  const params = await props.params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get tutor profile
  const { data: tutor } = await supabase
    .from("profiles")
    .select(
      `
      *,
      tutor_subjects (
        id,
        subject:subject_id (
          id,
          name
        )
      )
    `,
    )
    .eq("id", params.tutorId)
    .eq("user_type", "tutor")
    .single()

  if (!tutor) {
    notFound()
  }

  // Get tutor availability
  const { data: availability } = await supabase
    .from("availability")
    .select("*")
    .eq("tutor_id", params.tutorId)
    .order("day_of_week")
    .order("start_time")

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container py-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle>Book a Session with {tutor.full_name}</CardTitle>
                  <CardDescription>Schedule a tutoring session</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6 space-y-2">
                <p className="text-sm font-medium">Available Subjects:</p>
                <div className="flex flex-wrap gap-2">
                  {tutor.tutor_subjects?.map((ts: { id: string; subject: { id: string; name: string } }) => (
                    <Badge key={ts.id} variant="secondary">
                      {ts.subject.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <BookingForm
                tutorId={params.tutorId}
                studentId={user.id}
                subjects={
                  tutor.tutor_subjects?.map((ts: { subject: { id: string; name: string } }) => ts.subject) || []
                }
                availability={availability || []}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
