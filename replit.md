# Muhammad Huzaifa Shamsi — Portfolio

## Overview

Full-stack personal portfolio website for Muhammad Huzaifa Shamsi — Frontend Developer & Data Science student at Dawood University, Karachi. Futuristic dark-themed React/Vite frontend with Express API + PostgreSQL backend.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + TanStack Query + Wouter + Framer Motion + Recharts
- **Styling**: Tailwind CSS v4, Space Grotesk / Orbitron / JetBrains Mono fonts
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: JWT (jsonwebtoken) with SHA-256 password hashing
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

- **Portfolio frontend** (`artifacts/portfolio`) — previewPath `/` — React+Vite SPA
- **API server** (`artifacts/api-server`) — previewPath `/api` — Express REST API on port 8080

## Key Files

- `artifacts/portfolio/src/pages/HomePage.tsx` — Full single-page portfolio with all sections
- `artifacts/portfolio/src/pages/AdminPage.tsx` — Full admin dashboard with CRUD
- `artifacts/api-server/src/routes/portfolio.ts` — All portfolio + admin API routes
- `lib/db/src/schema/portfolio.ts` — Database schema (9 tables)
- `lib/api-spec/openapi.yaml` — OpenAPI 3.0 spec (source of truth)
- `lib/api-client-react/src/generated/api.ts` — Generated React Query hooks (26 hooks)

## Database Tables

- `bio` — Personal info (name, tagline, subtitle, about, contact)
- `skills` — Skills with category and percentage
- `projects` — Portfolio projects with status
- `certifications` — Certificates with image URLs
- `social` — Social media links
- `messages` — Contact form submissions
- `analytics` — Page views and CV download counts
- `admin` — Admin credentials
- `rate_limit` — Contact form rate limiting

## Admin Access

- URL: `/admin`
- Username: `huzaifa`
- Password: `admin123`
- Auth: JWT token stored in localStorage

## Portfolio Sections

Hero, About, Education, Skills, Projects, Services, Certifications, Interests/Hobbies, Map (Karachi), Contact Form, Footer with Social Links

## Features

- Futuristic dark/light theme with neon cyan + purple palette
- Particles canvas animation in hero
- Typewriter effect cycling through roles
- Animated skill bars and section fade-ins
- Custom cursor (desktop)
- Scroll progress bar
- Certificate lightbox viewer
- Floating WhatsApp button
- Back-to-top button
- OpenStreetMap location embed
- Rate-limited contact form (honeypot + IP limiting)
- Full admin CRUD for all sections + analytics chart
- Dark mode default (toggle available)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
