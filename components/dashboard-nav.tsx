"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, Home, Search, User, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

export function DashboardNav({ userType }: { userType: "student" | "tutor" }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    ...(userType === "student"
      ? [{ href: "/tutors", icon: Search, label: "Find Tutors" }]
      : [{ href: "/dashboard/availability", icon: Calendar, label: "Availability" }]),
    { href: "/dashboard/sessions", icon: Calendar, label: "Sessions" },
    { href: "/profile", icon: User, label: "Profile" },
  ]

  return (
    <nav className="flex flex-col gap-2">
      <div className="flex items-center gap-2 px-4 py-2">
        <BookOpen className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold">TutorConnect</span>
      </div>
      <div className="flex flex-col gap-1 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start gap-2">
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </div>
      <div className="mt-auto px-2">
        <Button variant="ghost" className="w-full justify-start gap-2 text-destructive" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </nav>
  )
}
