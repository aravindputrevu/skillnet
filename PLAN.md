# SkillNet — Next.js + shadcn/ui + GitHub Auth

## Approach

Build a server-rendered Next.js application using the App Router, styled with shadcn/ui (built on Radix UI + Tailwind CSS), and authenticated via GitHub OAuth using NextAuth.js. The app will serve as a foundation for "SkillNet" — a platform where users can log in with GitHub and interact with skill-related features.

---

## Assumptions

| # | Assumption | Rationale |
|---|-----------|-----------|
| 1 | This is a greenfield project | Repo contains only a README.md |
| 2 | The app needs server-side rendering and API routes | Next.js App Router provides both |
| 3 | GitHub is the only auth provider needed initially | Task specifies GitHub auth login |
| 4 | PostgreSQL will be the database (via Prisma) | Industry standard for production apps with auth |
| 5 | Session strategy will be JWT-based initially | Simpler to start; no DB session table needed |
| 6 | The app should be deployable to Vercel | Next.js is optimized for Vercel |
| 7 | TypeScript is required | Type safety is non-negotiable for modern apps |
| 8 | We need a landing page + dashboard pattern | Common pattern: public landing → auth gate → dashboard |

---

## Choices Made

| Decision | Choice | Alternatives Considered | Why |
|----------|--------|------------------------|-----|
| Framework | Next.js 14+ (App Router) | Pages Router, Remix, SvelteKit | App Router is the current standard; RSC support, layouts, server actions |
| UI Library | shadcn/ui | Material UI, Chakra UI, Ant Design | Copy-paste components, full control, Tailwind-native, no runtime overhead |
| CSS | Tailwind CSS v3 | CSS Modules, styled-components | Required by shadcn/ui, utility-first, great DX |
| Auth | NextAuth.js v5 (Auth.js) | Clerk, Supabase Auth, custom OAuth | Open-source, first-party Next.js support, GitHub provider built-in |
| Session Strategy | JWT | Database sessions | No DB dependency for auth to start; can migrate later |
| Package Manager | pnpm | npm, yarn, bun | Fast, disk-efficient, strict dependency resolution |
| Database ORM | Prisma | Drizzle, TypeORM | Best ecosystem, type-safe, works well with NextAuth |
| State Management | React Server Components + `nuqs` for URL state | Redux, Zustand | RSC reduces client state needs; URL state is shareable |
| Validation | Zod | Yup, Joi | TypeScript-first, integrates with server actions and shadcn forms |

---

## Implementation Plan

### Phase 1: Project Scaffolding & Configuration

**Goal:** Get a working Next.js app running locally with Tailwind CSS and shadcn/ui installed.

---

#### Task 1.1 — Initialize Next.js Project

```
Create a new Next.js 14+ project in the current directory using pnpm.
Use TypeScript, Tailwind CSS, ESLint, App Router, and the `src/` directory convention.
Set the import alias to `@/*`.
Do NOT use Turbopack.
The project should be created in-place (not in a subdirectory).
After creation, verify it builds with `pnpm build`.
```

---

#### Task 1.2 — Configure .gitignore and Environment Files

```
Create a comprehensive .gitignore for a Next.js project covering:
node_modules, .next, .env*.local, .vercel, *.tsbuildinfo, next-env.d.ts.

Create a `.env.example` file documenting all required environment variables:
- GITHUB_CLIENT_ID
- GITHUB_CLIENT_SECRET
- NEXTAUTH_URL (default http://localhost:3000)
- NEXTAUTH_SECRET
- DATABASE_URL (for future use)

Create a `.env.local` with placeholder values.
```

---

#### Task 1.3 — Install and Initialize shadcn/ui

```
Initialize shadcn/ui in the project using `pnpm dlx shadcn@latest init`.
Choose the "New York" style, Zinc base color, and enable CSS variables.
Verify the generated `components.json` is correct.
Install the following base shadcn/ui components:
- button
- card
- avatar
- dropdown-menu
- separator
- skeleton
- badge
- toast (sonner)

Verify the project still builds after installation.
```

---

#### Task 1.4 — Set Up Base Layout and Theme

```
Create the root layout in `src/app/layout.tsx` with:
- Inter font from next/font/google
- Theme provider using next-themes for dark/light mode
- A `<Toaster />` component from sonner
- Proper metadata (title: "SkillNet", description)

Create a ThemeProvider wrapper component at `src/components/theme-provider.tsx`
using next-themes.

Create a ThemeToggle component at `src/components/theme-toggle.tsx`
using the shadcn/ui dropdown-menu and button components.
It should cycle between light, dark, and system.

Verify dark mode works by toggling.
```

---

### Phase 2: GitHub OAuth Authentication

**Goal:** Users can sign in and out with their GitHub account.

---

#### Task 2.1 — Install and Configure NextAuth.js v5

```
Install next-auth@beta (v5) and @auth/core.

Create the NextAuth configuration at `src/lib/auth.ts` with:
- GitHub provider using GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET
- JWT session strategy
- Callbacks: jwt (to persist GitHub user ID and username), session (to expose them)
- Pages: custom sign-in page at "/login"

Create the API route handler at `src/app/api/auth/[...nextauth]/route.ts`
that exports GET and POST from the auth config.

Create the auth middleware at `src/middleware.ts` that protects
routes under `/dashboard/*` — redirect unauthenticated users to `/login`.
```

---

#### Task 2.2 — Create Auth Session Provider

```
Create a client-side SessionProvider wrapper at `src/components/session-provider.tsx`
that wraps the app with NextAuth's SessionProvider.

Update the root layout to include the SessionProvider.

Create a `src/lib/auth-utils.ts` utility file with:
- `getCurrentUser()` — server-side helper that returns the current session user or null
- Type definitions for the extended session (with GitHub username, avatar)
```

---

#### Task 2.3 — Build the Login Page

```
Create the login page at `src/app/login/page.tsx` with:
- A centered card (shadcn Card component) on a clean background
- SkillNet logo/title at the top
- "Sign in with GitHub" button using the shadcn Button component
  with a GitHub icon (use lucide-react's Github icon)
- Clicking the button calls signIn("github")
- If the user is already authenticated, redirect to /dashboard
- Handle error states (show toast on auth failure)

Style it to look polished in both light and dark mode.
```

---

#### Task 2.4 — Build the User Menu Component

```
Create a UserMenu component at `src/components/user-menu.tsx` that:
- Shows the user's GitHub avatar using the shadcn Avatar component
- On click, opens a shadcn DropdownMenu with:
  - User's name and @username
  - Separator
  - "Dashboard" link
  - "Settings" link (can be placeholder)
  - Separator
  - "Sign out" button that calls signOut()
- When not authenticated, shows a "Sign in" button instead

This component will be used in the site header/navbar.
```

---

### Phase 3: App Shell & Navigation

**Goal:** Create the app shell with navigation that adapts based on auth state.

---

#### Task 3.1 — Create the Site Header

```
Create a site header component at `src/components/site-header.tsx` with:
- Sticky top position, backdrop blur, border-bottom
- Left side: SkillNet logo/name linking to "/"
- Right side: ThemeToggle + UserMenu
- Responsive: works on mobile and desktop
- Use proper semantic HTML (<header>, <nav>)

Include the SiteHeader in the root layout so it appears on every page.
```

---

#### Task 3.2 — Build the Landing Page

```
Create the public landing page at `src/app/page.tsx` with:
- Hero section: headline "Map Your Skills, Grow Your Network"
  with a subtitle and a CTA button "Get Started with GitHub"
  (links to /login)
- Features section: 3-column grid of feature cards using shadcn Card:
  - "Skill Tracking" — track and visualize your skills
  - "GitHub Integration" — import skills from your repos
  - "Network" — connect with others who share your skills
- Footer with basic links

Use Tailwind for responsive layout. No client-side interactivity needed
(can be a Server Component).
```

---

#### Task 3.3 — Build the Dashboard Layout

```
Create a dashboard layout at `src/app/dashboard/layout.tsx` with:
- A sidebar navigation on the left (desktop) / bottom bar (mobile) with links:
  - Overview (icon: LayoutDashboard)
  - Skills (icon: Code2)
  - Settings (icon: Settings)
- Main content area on the right
- The sidebar should highlight the active route
- Use shadcn button variants for nav items

Create the dashboard overview page at `src/app/dashboard/page.tsx` with:
- Welcome message using the user's GitHub name
- Placeholder cards for "Your Skills", "Recent Activity", "Network Stats"
  using shadcn Card + Skeleton components to show the layout
```

---

### Phase 4: Database & User Model

**Goal:** Persist user data and set up the database layer.

---

#### Task 4.1 — Set Up Prisma with PostgreSQL

```
Install prisma and @prisma/client.

Initialize Prisma with `pnpm prisma init --datasource-provider postgresql`.

Create the Prisma schema at `prisma/schema.prisma` with models:
- User: id, githubId (unique), username, name, email, avatarUrl,
  bio, createdAt, updatedAt
- Skill: id, name, category, userId (relation to User), level (enum:
  BEGINNER/INTERMEDIATE/ADVANCED/EXPERT), createdAt, updatedAt
- Add proper indexes on User.githubId and Skill.userId

Create a singleton Prisma client at `src/lib/db.ts` that handles
the dev hot-reload issue (global prisma instance).

Update .env.example with the DATABASE_URL format.
```

---

#### Task 4.2 — Integrate Prisma with NextAuth

```
Update the NextAuth configuration in `src/lib/auth.ts` to:
- Use the signIn callback to upsert the user in the database
  on every GitHub login (create if new, update name/avatar if changed)
- Store the database user ID in the JWT token
- Expose the database user ID in the session object

Update the session type definitions to include the database user ID.

Create a migration and verify the schema with `pnpm prisma db push`
(for development).
```

---

### Phase 5: Core Feature — Skills Management

**Goal:** Users can add, view, edit, and delete their skills.

---

#### Task 5.1 — Create Skills Server Actions

```
Create server actions at `src/app/dashboard/skills/actions.ts` with:
- `addSkill(formData)` — validates with Zod, creates a Skill record
- `updateSkill(id, formData)` — validates ownership + data, updates
- `deleteSkill(id)` — validates ownership, deletes
- `getSkills()` — returns all skills for the current user

Each action should:
- Verify the user is authenticated (get session)
- Validate input with Zod schemas
- Return proper error/success responses
- Use revalidatePath to refresh the UI
```

---

#### Task 5.2 — Build the Skills List Page

```
Create the skills page at `src/app/dashboard/skills/page.tsx` with:
- Page title "Your Skills"
- An "Add Skill" button that opens a dialog
- A grid/list of skill cards showing:
  - Skill name
  - Category badge (using shadcn Badge)
  - Level indicator (visual, e.g., dots or progress bar)
  - Edit and Delete action buttons
- Empty state with illustration/icon when no skills exist
- Use Suspense with skeleton loading states

Install additional shadcn components as needed: dialog, input,
select, label, form.
```

---

#### Task 5.3 — Build the Add/Edit Skill Dialog

```
Create an AddSkillDialog component at
`src/components/skills/add-skill-dialog.tsx` with:
- shadcn Dialog wrapping a form
- Fields:
  - Name (Input, required)
  - Category (Select: "Frontend", "Backend", "DevOps", "Data",
    "Mobile", "Design", "Other")
  - Level (Select: Beginner, Intermediate, Advanced, Expert)
- Form validation using Zod + react-hook-form + @hookform/resolvers
- Submit calls the addSkill server action
- Shows loading state during submission
- Shows success toast on completion
- Closes dialog on success

Create an EditSkillDialog with the same fields, pre-populated
with existing data, that calls updateSkill.
```

---

#### Task 5.4 — Add Delete Confirmation

```
Create a DeleteSkillAlert component using shadcn AlertDialog:
- Triggered by the delete button on each skill card
- Shows "Are you sure?" with the skill name
- Confirm button calls deleteSkill server action
- Shows loading state during deletion
- Shows success/error toast

Install shadcn alert-dialog component if not already installed.
```

---

### Phase 6: Polish & Production Readiness

**Goal:** Error handling, loading states, and production configuration.

---

#### Task 6.1 — Add Error and Loading States

```
Create the following error/loading boundary files:
- `src/app/error.tsx` — global error boundary with "Something went wrong"
  message and retry button
- `src/app/loading.tsx` — global loading state with skeleton/spinner
- `src/app/not-found.tsx` — custom 404 page with "Page not found"
  and link back to home
- `src/app/dashboard/error.tsx` — dashboard-specific error boundary
- `src/app/dashboard/loading.tsx` — dashboard loading with sidebar
  skeleton

Each should be styled with shadcn components and work in both
light/dark mode.
```

---

#### Task 6.2 — Add SEO and Metadata

```
Update the root layout metadata in `src/app/layout.tsx` with:
- Proper title template: "%s | SkillNet"
- Description, keywords, author
- Open Graph metadata (title, description, image placeholder)
- Twitter card metadata
- Favicon configuration

Create a `src/app/opengraph-image.tsx` using next/og (ImageResponse)
that generates a dynamic OG image with the SkillNet branding.

Add metadata exports to each page with appropriate titles.
```

---

#### Task 6.3 — Final Configuration and Cleanup

```
Update `next.config.js` with:
- Image domains: avatars.githubusercontent.com (for GitHub avatars)
- Any security headers

Review and update the README.md with:
- Project description
- Tech stack
- Setup instructions (env vars, database, GitHub OAuth app)
- Development commands
- Project structure overview

Run `pnpm build` and fix any remaining errors.
Run `pnpm lint` and fix any linting issues.
Ensure all pages render correctly in both light and dark mode.
```

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | 4 tasks | Project scaffolding, shadcn/ui, theming |
| 2 | 4 tasks | GitHub OAuth with NextAuth.js v5 |
| 3 | 3 tasks | App shell, landing page, dashboard layout |
| 4 | 2 tasks | Prisma + PostgreSQL, user persistence |
| 5 | 4 tasks | Skills CRUD with server actions |
| 6 | 3 tasks | Error states, SEO, production readiness |
| **Total** | **20 tasks** | |

Each task is a self-contained prompt that can be executed sequentially. Tasks within a phase may depend on prior tasks in the same phase, but each phase builds cleanly on the previous one.
