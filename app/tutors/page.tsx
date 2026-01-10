import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import Link from "next/link"
import { TutorFilters } from "@/components/tutor-filters"

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function TutorsPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams
  const supabase = await createClient()

  const subjectFilter = searchParams.subject as string | undefined

  // Get all subjects for filters
  const { data: subjects } = await supabase.from("subjects").select("*").order("name")

  // Build query for tutors
  const query = supabase
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
    .eq("user_type", "tutor")

  // Execute query
  const { data: tutors } = await query

  // Filter tutors by subject if selected
  const filteredTutors = subjectFilter
    ? tutors?.filter((tutor) =>
        tutor.tutor_subjects.some((ts: { subject: { id: string } }) => ts.subject.id === subjectFilter),
      )
    : tutors

  return (
    <div className="min-h-screen bg-muted/40 justify-between px-6">
      <div className="container py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Find a Tutor</h1>
            <p className="text-muted-foreground">Browse tutors by subject and find the perfect match</p>
          </div>
          
          <TutorFilters subjects={subjects || []} selectedSubject={subjectFilter} />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTutors && filteredTutors.length > 0 ? (
              filteredTutors.map((tutor) => (
                <Card key={tutor.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle>{tutor.full_name}</CardTitle>
                        <CardDescription>{tutor.email}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-4">
                    {tutor.bio && <p className="text-sm text-muted-foreground line-clamp-3">{tutor.bio}</p>}

                    <div>
                      <p className="mb-2 text-sm font-medium">Teaches:</p>
                      <div className="flex flex-wrap gap-2">
                        {tutor.tutor_subjects && tutor.tutor_subjects.length > 0 ? (
                          tutor.tutor_subjects.map(
                            (ts: { id: string; proficiency_level: string; subject: { name: string } }) => (
                              <Badge key={ts.id} variant="secondary">
                                {ts.subject.name}
                              </Badge>
                            ),
                          )
                        ) : (
                          <p className="text-xs text-muted-foreground">No subjects listed</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto pt-4">
                      <Link href={`/tutors/${tutor.id}`}>
                        <Button className="w-full">View Profile</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center gap-4 py-12 text-center">
                <User className="h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="font-medium">No tutors found</p>
                  <p className="text-sm text-muted-foreground">
                    {subjectFilter ? "Try selecting a different subject filter" : "No tutors available at the moment"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
