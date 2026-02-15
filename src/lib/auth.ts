import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { db } from "@/lib/db"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ profile }) {
      if (!profile?.id || !profile?.login) return false

      await db.user.upsert({
        where: { githubId: profile.id as unknown as number },
        create: {
          githubId: profile.id as unknown as number,
          username: profile.login as unknown as string,
          name: (profile.name as string) ?? null,
          email: (profile.email as string) ?? null,
          avatarUrl: profile.avatar_url as unknown as string,
          bio: (profile.bio as string) ?? null,
        },
        update: {
          name: (profile.name as string) ?? undefined,
          avatarUrl: profile.avatar_url as unknown as string,
          username: profile.login as unknown as string,
        },
      })

      return true
    },
    async jwt({ token, profile }) {
      if (profile) {
        token.githubId = profile.id as unknown as number
        token.username = profile.login as unknown as string
        token.avatar = profile.avatar_url as unknown as string

        // Fetch the database user ID
        const dbUser = await db.user.findUnique({
          where: { githubId: profile.id as unknown as number },
          select: { id: true },
        })
        if (dbUser) {
          token.dbUserId = dbUser.id
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.dbUserId as string) ?? (token.sub as string)
        session.user.githubId = token.githubId as number
        session.user.username = token.username as string
        session.user.image = token.avatar as string
      }
      return session
    },
  },
})
