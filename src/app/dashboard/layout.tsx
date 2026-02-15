"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Code2, User, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const sidebarLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/skills", label: "Skills", icon: Code2 },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col gap-6 px-4 py-6 md:flex-row">
      {/* Sidebar (desktop) */}
      <aside className="hidden w-52 shrink-0 md:block">
        <nav className="flex flex-col gap-1">
          {sidebarLinks.map((link) => {
            const isActive =
              link.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(link.href)
            return (
              <Button
                key={link.href}
                variant={isActive ? "secondary" : "ghost"}
                className="justify-start"
                asChild
              >
                <Link href={link.href}>
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.label}
                </Link>
              </Button>
            )
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1">{children}</div>

      {/* Bottom bar (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t bg-background md:hidden">
        {sidebarLinks.map((link) => {
          const isActive =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2 text-xs",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
