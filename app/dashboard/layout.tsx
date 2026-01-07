import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { DashboardNav } from "@/components/dashboard-nav"
import { redirect } from "next/navigation"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile to determine user type
  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

  const userType = profile?.user_type || "student"

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 border-r bg-muted/40 md:flex md:flex-col">
        <DashboardNav userType={userType as "student" | "tutor"} />
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
          <h1 className="text-xl font-semibold">{userType === "tutor" ? "Tutor Dashboard" : "Student Dashboard"}</h1>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
