import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/profile-form"
import { TutorSubjectsForm } from "@/components/tutor-subjects-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get subjects if tutor
  const { data: subjects } = await supabase.from("subjects").select("*").order("name")

  const { data: tutorSubjects } =
    profile?.user_type === "tutor"
      ? await supabase.from("tutor_subjects").select("*, subject:subject_id(id, name)").eq("tutor_id", user.id)
      : { data: null }

  return (
    <div className="space-y-6 justify-between px-6 py-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>
        <p className="text-muted-foreground">Manage your profile information</p>
      </div>

      <ProfileForm profile={profile} />

      {profile?.user_type === "tutor" && (
        <Card>
          <CardHeader>
            <CardTitle>Teaching Subjects</CardTitle>
            <CardDescription>Select subjects you can teach and your proficiency level</CardDescription>
          </CardHeader>
          <CardContent>
            <TutorSubjectsForm tutorId={user.id} subjects={subjects || []} tutorSubjects={tutorSubjects || []} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
