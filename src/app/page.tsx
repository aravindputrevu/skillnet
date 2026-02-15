import Link from "next/link"
import { Code2, Github, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const features = [
  {
    title: "Skill Tracking",
    description: "Track and visualize your skills across categories and proficiency levels.",
    icon: Code2,
  },
  {
    title: "GitHub Integration",
    description: "Sign in with GitHub and import skills from your repositories.",
    icon: Github,
  },
  {
    title: "Network",
    description: "Connect with others who share your skills and discover new ones.",
    icon: Users,
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center gap-6 px-4 py-24 text-center md:py-32">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Map Your Skills, Grow Your Network
        </h1>
        <p className="max-w-lg text-lg text-muted-foreground">
          Track your skills, showcase your expertise, and connect with
          developers who share your interests.
        </p>
        <Button size="lg" asChild>
          <Link href="/login">
            <Github className="mr-2 h-5 w-5" />
            Get Started with GitHub
          </Link>
        </Button>
      </section>

      {/* Features */}
      <section className="container mx-auto grid gap-6 px-4 pb-24 md:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <feature.icon className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto flex flex-col items-center gap-2 px-4 text-center text-sm text-muted-foreground">
          <p>Built with Next.js, shadcn/ui, and GitHub OAuth.</p>
        </div>
      </footer>
    </div>
  )
}
