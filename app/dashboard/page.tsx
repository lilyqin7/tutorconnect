import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, Users, Clock, Search } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get upcoming sessions
  const { data: sessions } = await supabase
    .from("sessions")
    .select(
      `
      *,
      tutor:tutor_id (full_name),
      student:student_id (full_name),
      subject:subject_id (name)
    `,
    )
    .or(`tutor_id.eq.${user.id},student_id.eq.${user.id}`)
    .eq("status", "scheduled")
    .gte("scheduled_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(5)

  const isStudent = profile?.user_type === "student"

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-balance">
          Welcome back, {profile?.full_name || "there"}!
        </h2>
        <p className="text-muted-foreground">
          {isStudent
            ? "Find tutors and schedule your next learning session"
            : "Manage your tutoring sessions and help students succeed"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Sessions scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.bio ? "Complete" : "Incomplete"}</div>
            <p className="text-xs text-muted-foreground">
              {profile?.bio ? "Profile looks great" : "Add bio to complete"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Type</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{profile?.user_type || "Student"}</div>
            <p className="text-xs text-muted-foreground">Your current role</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member Since</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                : "Recently"}
            </div>
            <p className="text-xs text-muted-foreground">Join date</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Your next scheduled tutoring sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {sessions && sessions.length > 0 ? (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="space-y-1">
                      <p className="font-medium">{session.subject?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {isStudent ? `with ${session.tutor?.full_name}` : `with ${session.student?.full_name}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.scheduled_at).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <Link href="/dashboard/sessions">
                  <Button variant="outline" className="w-full bg-transparent">
                    View All Sessions
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="font-medium">No upcoming sessions</p>
                  <p className="text-sm text-muted-foreground">
                    {isStudent
                      ? "Browse tutors to schedule your first session"
                      : "Students will book sessions with you"}
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
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {isStudent ? (
              <>
                <Link href="/tutors" className="block">
                  <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <Search className="h-4 w-4" />
                    Find a Tutor
                  </Button>
                </Link>
                <Link href="/dashboard/sessions" className="block">
                  <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <Calendar className="h-4 w-4" />
                    View My Sessions
                  </Button>
                </Link>
                <Link href="/profile" className="block">
                  <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <Users className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard/availability" className="block">
                  <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <Clock className="h-4 w-4" />
                    Set Availability
                  </Button>
                </Link>
                <Link href="/dashboard/sessions" className="block">
                  <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <Calendar className="h-4 w-4" />
                    View Sessions
                  </Button>
                </Link>
                <Link href="/profile" className="block">
                  <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <Users className="h-4 w-4" />
                    Edit Profile & Subjects
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
