# Product Requirements Document (PRD) - HMPG ITB Website

Last updated: March 16, 2026

## 1) Product overview

HMPG ITB (Himpunan Mahasiswa Teknik Pangan ITB) needs a public-facing website and an internal admin dashboard to manage organizational information and publication content (HMPG Reports). This product will centralize official profile content, activity highlights, and publication archives while allowing admins to maintain content without code changes.

This PRD is derived from `docs/Project_Charter_HMPG_Website.md` and translated into implementation-ready product and technical requirements.

## 2) Goals and success criteria

### Goals

- Publish a professional, responsive website for HMPG ITB with pages: Home, About Us, Reports, and Contact Us.
- Provide an admin dashboard for authenticated content management.
- Ensure content updates (reports, profile text, logo, contact/social links) can be done by non-developers.

### Success criteria (MVP)

- Public pages load and render correctly on desktop and mobile.
- Admin can sign in, reset password, and perform CRUD for all managed entities.
- HMPG Reports listing and article detail pages are functional and searchable by period/edition.
- Admin content updates for reports and general site information are publish-ready without code changes.
- Core web quality gates pass (lint, tests, build, CI).

## 3) Users and personas

- Visitor (public): Reads profile, activities, reports, and contacts.
- Admin (internal committee): Maintains content through dashboard.
- Super-admin (optional role extension): Manages admin access and policy settings.

## 4) Scope

### In scope (MVP)

Based on charter feature IDs:

- UI/UX
  - U-1: Wireframe all pages.
  - U-2: High-fidelity visual system.
  - U-3: One revision cycle.
- Home
  - H-1: Hero section.
  - H-2: General HMPG ITB information.
  - H-3: Activity highlights and latest report preview.
  - H-4: Navbar and footer with contact/location/social links.
- About Us
  - T-1: Short profile.
  - T-2: Vision, mission, values.
  - T-4: HMPG ITB logo display.
- Reports
  - K-1: Drive Akademik external redirect block.
  - K-2: HMPG Reports index by edition/period.
  - K-3: HMPG Report article detail page.
- Contact Us
  - C-1: Showing email and address.
  - C-2: Showing HMPG's social media
- Dashboard
  - D-1: Email/password authentication + password reset.
  - D-3: HMPG Reports management with rich text editor and metadata.
  - D-4: General content management.
  - D-5: Logo upload/replacement.

### Out of scope (MVP)

- Complex role-based workflows beyond basic admin permissions.
- Multi-language localization.
- Community account registration for public users.
- Native mobile app.

## 5) Functional requirements

### FR-1 Public website

- The system must render Home, About Us, Reports, and Contact Us pages.
- The system must provide responsive layouts for mobile, tablet, and desktop.
- The system must expose navigation and footer links consistently across pages.

### FR-2 Home page

- The system must display a hero section with HMPG ITB visual identity.
- The system must display organization purpose/foundation/value summary.
- The system must display highlighted activities and latest HMPG Reports preview.

### FR-3 About Us page

- The system must display profile, vision, mission, and values.
- The system must display the active HMPG ITB logo.

### FR-4 Reports and Drive Akademic Section

- The system must display a Drive Akademik access section with external redirect behavior.
- The system must list HMPG Reports grouped/filterable by edition/period.
- The system must provide detailed report article pages.

### FR-5 Contact Us page

- The system must display HMPG's address and email.
- The system must display HMPG's social media.

### FR-6 Authentication and admin access

- The system must allow admin login via email/password.
- The system must provide password reset via email.
- The system must restrict dashboard routes to authenticated users.

### FR-7 Dashboard content management

- HMPG Reports management:
  - Create, edit, delete articles.
  - Rich text editor support.
  - Metadata fields: title, period, thumbnail.
- General content management:
  - Edit Home and About Us text sections.
  - Update contact details and social links.
- Logo management:
  - Upload and replace logo asset.

## 6) Non-functional requirements

- Performance: Public pages should target Lighthouse performance >= 80 on mobile for MVP pages.
- Accessibility: Meet baseline WCAG 2.1 AA practices (semantic structure, alt text, keyboard navigation, color contrast).
- SEO: SSR/SSG metadata, Open Graph tags, sitemap, robots.
- Reliability: Admin CRUD actions should provide success/failure feedback and safe retry behavior.
- Security: Enforce authenticated dashboard access and secure storage rules for uploads.

## 7) Proposed stack and tooling

Chosen from stakeholder input:

- Frontend: Next.js (App Router) + TypeScript
- Backend/data/auth/storage: Firebase (Auth, Firestore, Cloud Storage)
- Hosting/deployment: Vercel
- Quality suite: ESLint, Prettier, test automation, CI pipeline, staging environment

### Technical decisions

- Use Next.js for SSR/SEO and clean route structure for public pages and dashboard.
- Use Firebase Auth for admin sign-in and reset-password flow.
- Use Firestore collections for content entities and Storage for images (logo and report thumbnails).
- Deploy preview environments through Vercel for every branch/PR.

### Suggested package/tooling baseline

- UI: Tailwind CSS + component primitives (or existing design system).
- Forms and validation: React Hook Form + Zod.
- Editor: Tiptap or equivalent rich text editor with sanitized output handling.
- Testing:
  - Unit/integration: Vitest + Testing Library.
  - E2E: Playwright (critical admin and publishing flows).
- CI: GitHub Actions running lint, tests, build.

## 8) Information architecture and data model

### Public routes

- `/` Home
- `/about-us`
- `/reports`
- `/reports/[slug]`
- `/contact-us`

### Admin routes

- `/dashboard/login`
- `/dashboard`
- `/dashboard/reports`
- `/dashboard/content`
- `/dashboard/assets`

### Core entities (Firestore)

- `admins`: uid, email, role, createdAt
- `site_content`: key, value, updatedAt, updatedBy
- `reports`: id, title, slug, period, excerpt, body, thumbnailUrl, publishedAt, status
- `activity_highlights`: id, title, summary, imageUrl, link, sortOrder
- `site_assets`: id, type (logo, other), url, updatedAt

## 9) User flows (MVP)

- Visitor flow:
  - Open website -> navigate sections -> read reports -> open detail page -> optionally visit Drive Akademik.
- Admin flow:
  - Login -> open dashboard module -> create/edit/delete content -> upload assets -> publish changes -> verify on public page.

## 10) Milestones and delivery plan

Reference estimate from charter: 39 hours total.

- Phase 1: Discovery and design (U-1 to U-3)
- Phase 2: Public pages
- Phase 3: Report system (K-2, K-3)
- Phase 4: Dashboard and CMS features (D-1, D-3, D-4, D-5)
- Phase 5: QA hardening, bug fixes, launch checklist

## 11) Risks and mitigations

- Risk: Admin content errors break page rendering.
  - Mitigation: Schema validation and safe fallbacks in rendering.
- Risk: Rich text content introduces unsafe markup.
  - Mitigation: Sanitize HTML output and constrain editor features.
- Risk: Storage permission misconfiguration exposes assets.
  - Mitigation: Enforce Firebase security rules and environment separation.
- Risk: Scope creep in dashboard role management.
  - Mitigation: Keep MVP permission model simple; defer advanced RBAC.

## 12) Acceptance criteria checklist

- All MVP feature IDs from charter are implemented and demoable.
- Dashboard auth and password reset work end-to-end.
- Admin CRUD works for reports, content, and logo.
- Public pages reflect updates from dashboard without code changes.
- CI passes: lint, tests, and production build.
- Basic SEO and accessibility checks are completed.
