import { Code2 } from "lucide-react"
import { getSkills } from "./actions"
import { SkillCard } from "@/components/skills/skill-card"
import { AddSkillDialog } from "@/components/skills/add-skill-dialog"

export default async function SkillsPage() {
  const skills = await getSkills()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Skills</h1>
          <p className="text-muted-foreground">
            Manage and track your skill set.
          </p>
        </div>
        <AddSkillDialog />
      </div>

      {skills.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <Code2 className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No skills yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your first skill to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      )}
    </div>
  )
}
