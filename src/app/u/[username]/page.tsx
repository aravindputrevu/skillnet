import { notFound } from "next/navigation"
import { type Metadata } from "next"
import { ExternalLink } from "lucide-react"
import { db } from "@/lib/db"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Props {
  params: Promise<{ username: string }>
}

async function getUser(username: string) {
  return db.user.findUnique({
    where: { username },
    include: { skills: { orderBy: { createdAt: "desc" } } },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const user = await getUser(username)

  if (!user) {
    return { title: "User Not Found" }
  }

  return {
    title: `${user.name ?? user.username} | SkillNet`,
    description: user.bio ?? `${user.username}'s skills on SkillNet`,
    openGraph: {
      title: `${user.name ?? user.username} | SkillNet`,
      description: user.bio ?? `${user.username}'s skills on SkillNet`,
    },
  }
}

const levelLabels: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  EXPERT: "Expert",
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params
  const user = await getUser(username)

  if (!user) notFound()

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.username[0].toUpperCase()

  return (
    <div className="container mx-auto max-w-2xl space-y-6 px-4 py-8">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 pt-6 sm:flex-row sm:items-start">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name ?? user.username} />
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-xl font-semibold">{user.name ?? user.username}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
            {user.bio && <p className="mt-2 text-sm">{user.bio}</p>}
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <a
                href={`https://github.com/${user.username}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                GitHub
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>
            {user.skills.length} skill{user.skills.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user.skills.length === 0 ? (
            <p className="text-sm text-muted-foreground">No skills added yet.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {user.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{skill.name}</p>
                    <p className="text-xs text-muted-foreground">{skill.category}</p>
                  </div>
                  <Badge variant="secondary">{levelLabels[skill.level]}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
