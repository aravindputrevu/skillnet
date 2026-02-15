"use client"

import { type Skill } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { EditSkillDialog } from "@/components/skills/edit-skill-dialog"
import { DeleteSkillAlert } from "@/components/skills/delete-skill-alert"

const levelColors: Record<string, string> = {
  BEGINNER: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  INTERMEDIATE: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  ADVANCED: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  EXPERT: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
}

const levelLabels: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  EXPERT: "Expert",
}

export function SkillCard({ skill }: { skill: Skill }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">{skill.name}</CardTitle>
        <div className="flex gap-1">
          <EditSkillDialog skill={skill} />
          <DeleteSkillAlert skillId={skill.id} skillName={skill.name} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{skill.category}</Badge>
          <Badge className={levelColors[skill.level] ?? ""} variant="outline">
            {levelLabels[skill.level]}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
