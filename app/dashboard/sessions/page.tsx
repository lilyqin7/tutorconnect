import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Video } from "lucide-react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function SessionsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

  // Get all sessions
  const { data: sessions } = await supabase
    .from("sessions")
    .select(
      `
      *,
      tutor:tutor_id (full_name, email),
      student:student_id (full_name, email),
      subject:subject_id (name)
    `,
    )
    .or(`tutor_id.eq.${user.id},student_id.eq.${user.id}`)
    .order("scheduled_at", { ascending: false })

  const upcomingSessions = sessions?.filter((s) => new Date(s.scheduled_at) >= new Date() && s.status === "scheduled")
  const pastSessions = sessions?.filter((s) => new Date(s.scheduled_at) < new Date() || s.status !== "scheduled")

  const isStudent = profile?.user_type === "student"

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Sessions</h2>
        <p className="text-muted-foreground">Manage your tutoring sessions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
          <CardDescription>Your scheduled tutoring sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingSessions && upcomingSessions.length > 0 ? (
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{session.subject?.name}</Badge>
                      <Badge variant="outline" className="capitalize">
                        {session.status}
                      </Badge>
                    </div>
                    <p className="font-medium">
                      {isStudent ? `Tutor: ${session.tutor?.full_name}` : `Student: ${session.student?.full_name}`}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(session.scheduled_at).toLocaleString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>
                    <p className="text-sm text-muted-foreground">{session.duration_minutes} minutes</p>
                  </div>
                  <div className="flex gap-2">
                    {session.meeting_url && (
                      <Link href={session.meeting_url} target="_blank">
                        <Button>
                          <Video className="mr-2 h-4 w-4" />
                          Join Meeting
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground" />
              <div>
                <p className="font-medium">No upcoming sessions</p>
                <p className="text-sm text-muted-foreground">
                  {isStudent ? "Find a tutor to schedule your first session" : "Students will book sessions with you"}
                </p>
              </div>
              {isStudent && (
                <Link href="/tutors">
                  <Button>Find Tutors</Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Past Sessions</CardTitle>
          <CardDescription>Your completed and cancelled sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {pastSessions && pastSessions.length > 0 ? (
            <div className="space-y-4">
              {pastSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex flex-col gap-4 rounded-lg border p-4 opacity-75 md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{session.subject?.name}</Badge>
                      <Badge variant="outline" className="capitalize">
                        {session.status}
                      </Badge>
                    </div>
                    <p className="font-medium">
                      {isStudent ? `Tutor: ${session.tutor?.full_name}` : `Student: ${session.student?.full_name}`}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(session.scheduled_at).toLocaleString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">No past sessions yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
