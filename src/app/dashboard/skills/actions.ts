"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth-utils"

const skillSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  category: z.string().min(1, "Category is required"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]),
})

export async function getSkills() {
  const user = await getCurrentUser()
  if (!user?.id) return []

  return db.skill.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  })
}

export async function addSkill(formData: FormData) {
  const user = await getCurrentUser()
  if (!user?.id) return { error: "Unauthorized" }

  const parsed = skillSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    level: formData.get("level"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  await db.skill.create({
    data: {
      ...parsed.data,
      userId: user.id,
    },
  })

  revalidatePath("/dashboard/skills")
  return { success: true }
}

export async function updateSkill(id: string, formData: FormData) {
  const user = await getCurrentUser()
  if (!user?.id) return { error: "Unauthorized" }

  const existing = await db.skill.findUnique({ where: { id } })
  if (!existing || existing.userId !== user.id) {
    return { error: "Not found" }
  }

  const parsed = skillSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    level: formData.get("level"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  await db.skill.update({
    where: { id },
    data: parsed.data,
  })

  revalidatePath("/dashboard/skills")
  return { success: true }
}

export async function deleteSkill(id: string) {
  const user = await getCurrentUser()
  if (!user?.id) return { error: "Unauthorized" }

  const existing = await db.skill.findUnique({ where: { id } })
  if (!existing || existing.userId !== user.id) {
    return { error: "Not found" }
  }

  await db.skill.delete({ where: { id } })

  revalidatePath("/dashboard/skills")
  return { success: true }
}
