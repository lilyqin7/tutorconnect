import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Calendar, BookOpen } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

type Params = Promise<{ id: string }>

export default async function TutorProfilePage(props: { params: Params }) {
  const params = await props.params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get tutor profile
  const { data: tutor } = await supabase
    .from("profiles")
    .select(
      `
      *,
      tutor_subjects (
        id,
        proficiency_level,
        subject:subject_id (
          id,
          name
        )
      )
    `,
    )
    .eq("id", params.id)
    .eq("user_type", "tutor")
    .single()

  if (!tutor) {
    notFound()
  }

  // Get tutor availability
  const { data: availability } = await supabase
    .from("availability")
    .select("*")
    .eq("tutor_id", params.id)
    .order("day_of_week")
    .order("start_time")

  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  // Group availability by day
  const groupedAvailability = availability?.reduce(
    (acc, avail) => {
      if (!acc[avail.day_of_week]) {
        acc[avail.day_of_week] = []
      }
      acc[avail.day_of_week].push(avail)
      return acc
    },
    {} as Record<number, typeof availability>,
  )

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="container py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <Link href="/tutors">
            <Button variant="ghost">← Back to Tutors</Button>
          </Link>

          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl">{tutor.full_name}</CardTitle>
                  <CardDescription>{tutor.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {tutor.bio && (
                <div>
                  <h3 className="mb-2 font-semibold">About</h3>
                  <p className="text-sm text-muted-foreground">{tutor.bio}</p>
                </div>
              )}

              <div>
                <h3 className="mb-3 flex items-center gap-2 font-semibold">
                  <BookOpen className="h-4 w-4" />
                  Teaching Subjects
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tutor.tutor_subjects && tutor.tutor_subjects.length > 0 ? (
                    tutor.tutor_subjects.map(
                      (ts: { id: string; proficiency_level: string; subject: { id: string; name: string } }) => (
                        <Badge key={ts.id} variant="secondary" className="text-sm">
                          {ts.subject.name} • {ts.proficiency_level}
                        </Badge>
                      ),
                    )
                  ) : (
                    <p className="text-sm text-muted-foreground">No subjects listed</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="mb-3 flex items-center gap-2 font-semibold">
                  <Calendar className="h-4 w-4" />
                  Availability
                </h3>
                <div className="space-y-2">
                  {DAYS.map((day, index) => (
                    <div key={index} className="flex items-start gap-4 text-sm">
                      <div className="w-24 flex-shrink-0 font-medium">{day}</div>
                      <div className="flex flex-1 flex-wrap gap-2">
                        {groupedAvailability?.[index]?.map((avail) => (
                          <Badge key={avail.id} variant="outline">
                            {avail.start_time.substring(0, 5)} - {avail.end_time.substring(0, 5)}
                          </Badge>
                        ))}
                        {!groupedAvailability?.[index]?.length && (
                          <span className="text-muted-foreground">Not available</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {user && (
                <div className="pt-4">
                  <Link href={`/book/${tutor.id}`}>
                    <Button size="lg" className="w-full">
                      Book a Session
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
