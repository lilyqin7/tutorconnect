import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { redirect, notFound } from "next/navigation"
import { JitsiMeeting } from "@/components/jitsi-meeting"

type Params = Promise<{ sessionId: string }>

export default async function SessionPage(props: { params: Params }) {
  const params = await props.params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get session details
  const { data: session } = await supabase
    .from("sessions")
    .select(
      `
      *,
      tutor:tutor_id (full_name, email),
      student:student_id (full_name, email),
      subject:subject_id (name)
    `,
    )
    .eq("id", params.sessionId)
    .single()

  if (!session) {
    notFound()
  }

  // Check if user is part of this session
  if (session.tutor_id !== user.id && session.student_id !== user.id) {
    redirect("/dashboard")
  }

  const isStudent = session.student_id === user.id
  const otherPerson = isStudent ? session.tutor : session.student

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Tutoring Session</CardTitle>
                  <CardDescription>
                    {isStudent ? `with ${otherPerson?.full_name}` : `with ${otherPerson?.full_name}`}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{session.subject?.name}</Badge>
                  <Badge variant="outline" className="capitalize">
                    {session.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="font-medium">Scheduled Time</p>
                  <p className="text-muted-foreground">
                    {new Date(session.scheduled_at).toLocaleString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Duration</p>
                  <p className="text-muted-foreground">{session.duration_minutes} minutes</p>
                </div>
              </div>

              {session.notes && (
                <div>
                  <p className="mb-1 text-sm font-medium">Session Notes</p>
                  <p className="text-sm text-muted-foreground">{session.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {session.meeting_url && (
            <JitsiMeeting roomName={session.meeting_url.split("/").pop() || ""} userName={user.email || "User"} />
          )}
        </div>
      </div>
    </div>
  )
}
