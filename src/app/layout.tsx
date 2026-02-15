import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/session-provider";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "SkillNet",
    template: "%s | SkillNet",
  },
  description: "Map your skills, grow your network. Track your expertise, showcase your skills, and connect with developers.",
  keywords: ["skills", "developer", "github", "portfolio", "network"],
  authors: [{ name: "SkillNet" }],
  openGraph: {
    title: "SkillNet",
    description: "Map your skills, grow your network",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillNet",
    description: "Map your skills, grow your network",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SiteHeader />
            <main>{children}</main>
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
