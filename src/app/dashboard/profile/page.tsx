import { redirect } from "next/navigation"
import { ExternalLink } from "lucide-react"
import { getCurrentUser } from "@/lib/auth-utils"
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

export default async function ProfilePage() {
  const sessionUser = await getCurrentUser()
  if (!sessionUser) redirect("/login")

  const user = await db.user.findUnique({
    where: { id: sessionUser.id },
    include: {
      skills: true,
    },
  })

  if (!user) redirect("/login")

  const skillsByCategory = user.skills.reduce(
    (acc, skill) => {
      acc[skill.category] = (acc[skill.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.username[0].toUpperCase()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Your SkillNet profile.</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center gap-4 pt-6 sm:flex-row sm:items-start">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name ?? user.username} />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-semibold">{user.name ?? user.username}</h2>
            <p className="text-muted-foreground">@{user.username}</p>
            {user.bio && <p className="mt-2 text-sm">{user.bio}</p>}
            <p className="mt-2 text-xs text-muted-foreground">
              Member since {user.createdAt.toLocaleDateString()}
            </p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <a
                href={`https://github.com/${user.username}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View on GitHub
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills Summary</CardTitle>
          <CardDescription>
            {user.skills.length} skill{user.skills.length !== 1 ? "s" : ""} across{" "}
            {Object.keys(skillsByCategory).length} categor
            {Object.keys(skillsByCategory).length !== 1 ? "ies" : "y"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(skillsByCategory).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No skills added yet. Head to the Skills page to get started.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {Object.entries(skillsByCategory).map(([category, count]) => (
                <Badge key={category} variant="secondary">
                  {category}: {count}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
