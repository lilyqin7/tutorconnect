import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Users, Video, Calendar } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TutorConnect</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container flex flex-col items-center gap-8 py-16 md:py-24 lg:py-32">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">
            Connect with Volunteer Tutors,
            <br />
            <span className="text-primary">Learn Anything</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground text-balance sm:text-xl">
            Free tutoring platform connecting students who need help with volunteer tutors who love to teach. Schedule
            sessions, learn together, grow together.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Find a Tutor
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Become a Tutor
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid w-full max-w-4xl grid-cols-1 gap-8 pt-8 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2">
            <div className="text-4xl font-bold">100%</div>
            <div className="text-sm text-muted-foreground">Free Forever</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-4xl font-bold">24/7</div>
            <div className="text-sm text-muted-foreground">Available Tutors</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-4xl font-bold">10+</div>
            <div className="text-sm text-muted-foreground">Subjects Covered</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-16 md:py-24">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
            How TutorConnect Works
          </h2>
          <p className="max-w-2xl text-lg text-muted-foreground text-balance">
            Connect with volunteer tutors in three simple steps
          </p>
        </div>

        <div className="grid gap-8 pt-12 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Create Profile</h3>
              <p className="text-sm text-muted-foreground">
                Sign up as a student or tutor and set up your profile with your subjects and availability
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Find Your Tutor</h3>
              <p className="text-sm text-muted-foreground">
                Browse tutors by subject and availability to find the perfect match for your learning needs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Schedule Session</h3>
              <p className="text-sm text-muted-foreground">
                Book a session at a time that works for both you and your tutor with our easy scheduling system
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Learn Together</h3>
              <p className="text-sm text-muted-foreground">
                Meet with your tutor via video chat and get the help you need to succeed
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16 md:py-24">
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="flex flex-col items-center gap-6 p-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="max-w-2xl text-lg text-blue-50 text-balance">
              Join our community of learners and tutors today. It&apos;s free, easy, and makes a real difference.
            </p>
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary">
                Get Started Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-semibold">TutorConnect</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Connecting students and volunteer tutors for free, quality education
          </p>
          <p className="text-xs text-muted-foreground">© 2026 TutorConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
