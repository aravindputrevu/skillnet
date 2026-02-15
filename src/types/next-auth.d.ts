import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      githubId: number
      username: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    githubId?: number
    username?: string
    avatar?: string
    dbUserId?: string
  }
}
