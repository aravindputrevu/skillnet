# SkillNet

Map your skills, grow your network. A platform for developers to track skills, showcase expertise, and connect with others.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** shadcn/ui + Tailwind CSS v4
- **Auth:** NextAuth.js v5 (GitHub OAuth)
- **Database:** PostgreSQL + Prisma
- **Validation:** Zod
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL database

### Setup

1. Clone the repository and install dependencies:

```bash
pnpm install
```

2. Copy the environment file and fill in your values:

```bash
cp .env.example .env.local
```

3. Create a GitHub OAuth App at https://github.com/settings/developers:
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`

4. Set up the database:

```bash
npx prisma db push
```

5. Run the development server:

```bash
pnpm dev
```

Open http://localhost:3000.

## Project Structure

```
src/
├── app/
│   ├── api/auth/          # NextAuth API routes
│   ├── dashboard/         # Authenticated dashboard
│   │   ├── skills/        # Skills CRUD
│   │   ├── profile/       # User profile
│   │   └── settings/      # Settings (placeholder)
│   ├── login/             # Login page
│   ├── u/[username]/      # Public profile
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # shadcn/ui components
│   └── skills/            # Skills-specific components
├── lib/
│   ├── auth.ts            # NextAuth configuration
│   ├── auth-utils.ts      # Auth helper functions
│   ├── db.ts              # Prisma client
│   └── utils.ts           # Utility functions
└── types/                 # TypeScript type augmentations
```

## Development

```bash
pnpm dev        # Start dev server
pnpm build      # Production build
pnpm lint       # Run ESLint
```
