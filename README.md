# GlobeDk Elite Academy

GlobeDk Elite Academy is a Next.js education platform for online O-Level and A-Level tutoring, homeschooling, one-to-one support, revision classes, and examination preparation across ZIMSEC and Cambridge curricula. This repository contains the academy website, its public-facing UI, account flows, administrative areas, supporting assets, and the current frontend design documentation.

The latest UI direction is a **premium academic/editorial experience** rather than a default template. It combines deep navy surfaces, warm orange accents, refined serif and sans-serif typography, classroom imagery, responsive navigation, scroll-led motion, interactive academic discovery, and the original GlobeDk brand artwork.

## Project status

The current implementation focuses on frontend UI and interaction design. The homepage and shared navigation/footer have been iteratively redesigned and verified at desktop, mobile, and narrow viewport sizes. Backend and authentication modules remain part of the repository, but backend configuration and service integrations were intentionally outside the scope of the visual redesign.

| Area | Status |
|---|---|
| Premium homepage UI | Implemented |
| Responsive desktop and mobile header | Implemented |
| Mobile navigation drawer | Implemented with focus handling, Escape dismissal, backdrop, and body scroll locking |
| Interactive course finder | Implemented with pathway filters, search, and subject detail modal |
| AI Exam Predictor preview | Implemented as an interactive under-construction modal preview |
| Footer route coverage | Enhanced for public and account-facing routes |
| Original horizontal header logo | Implemented from the original GlobeDk artwork without a recreated mark |
| Production build | Passing with documented placeholder environment variables |
| Permanent hosting | Not configured in this repository workflow |

## Frontend experience

The homepage is structured as an art-directed academic landing page. A moving announcement stripe introduces the academy, the two-tier header separates brand and navigation, and the asymmetric hero establishes the tutoring proposition before guiding visitors toward enrolment or further discovery.

The main interactive areas are summarized below.

| Experience | Description | Primary source |
|---|---|---|
| Editorial header | Announcement stripe, brand/action row, numbered navigation rail, enrolment action, and AI Exam Predictor utility | [`components/navigation.tsx`](components/navigation.tsx) |
| Responsive drawer | Touch-friendly off-canvas navigation with accessible dismissal and route links | [`components/navigation.tsx`](components/navigation.tsx) |
| Hero section | Academic positioning, curriculum messaging, classroom imagery, animated reveals, and CTA hierarchy | [`app/page.tsx`](app/page.tsx) |
| Course finder | Subject discovery by pathway and search, with selectable subject details | [`app/page.tsx`](app/page.tsx) |
| AI Exam Predictor preview | Analyse, detect, and predict stages presented inside an interactive modal | [`components/navigation.tsx`](components/navigation.tsx) |
| Footer | Admissions CTA, public/account routes, contact details, social links, and original brand treatment | [`components/footer.tsx`](components/footer.tsx) |
| Brand system | Responsive horizontal header lockup and full original footer mark | [`components/brand.tsx`](components/brand.tsx) |

## Technology stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.2.6 with the App Router |
| Language | TypeScript |
| UI runtime | React 18.3.1 |
| Styling | Tailwind CSS 4, PostCSS, and project-specific global CSS |
| Motion | Framer Motion |
| Icons | Lucide React |
| UI primitives | Radix UI packages and local components under `components/ui` |
| Forms and validation | React Hook Form, Zod, and resolver utilities |
| Data and authentication | Supabase client/server helpers already present in the repository |
| Email and service utilities | Resend, Nodemailer, and existing API helpers |
| Sitemap | `next-sitemap` via the `postbuild` script |
| Package manager | pnpm |

## Repository structure

```text
.
├── app/
│   ├── page.tsx                    # Redesigned homepage
│   ├── layout.tsx                  # Root metadata, fonts, and providers
│   ├── globals.css                 # Global design tokens and responsive safeguards
│   ├── about/                      # Academy information
│   ├── contact/                    # Contact experience
│   ├── enroll/                     # Enrolment experience
│   ├── subjects/                   # Subject catalogue
│   ├── timetable/                  # Timetable experience
│   ├── testimonials/               # Testimonials experience
│   ├── exam-predictor/              # Predictor route
│   ├── login/ signup/               # Account entry points
│   ├── dashboard/ student/ tutor/  # Account and learning areas
│   ├── admin/                      # Administrative routes
│   └── api/                        # Existing server/API routes
├── components/
│   ├── brand.tsx                   # Responsive original logo component
│   ├── navigation.tsx              # Header, drawer, and predictor modal
│   ├── footer.tsx                  # Shared footer and admissions CTA
│   ├── theme-provider.tsx          # Theme provider
│   └── ui/                         # Reusable interface primitives
├── lib/
│   ├── auth.ts                     # Authentication helpers
│   ├── resend.ts                   # Email helper
│   ├── supabaseClient.ts           # Browser-side Supabase client
│   ├── supabaseAdmin.ts            # Server-side Supabase helper
│   └── utils.ts                    # Shared utilities
├── public/
│   ├── Logo.png                    # Original GlobeDk source artwork
│   ├── Logo-horizontal-original.png # Transparent horizontal header lockup
│   ├── Logo-original-transparent.png # Original full mark without outer canvas
│   ├── classroom and student imagery
│   ├── GlobeDK-Weekend-Timetable-Updated.pdf
│   ├── robots.txt
│   └── generated sitemap files
├── types/                          # Shared TypeScript and Supabase types
├── middleware.ts                   # Existing request middleware
├── next.config.mjs                 # Next.js configuration
├── next-sitemap.config.js          # Sitemap configuration
├── package.json                    # Scripts and dependencies
├── pnpm-lock.yaml                  # Locked dependency graph
└── README.md                       # This project overview
```

## Route overview

The repository contains both public experiences and authenticated areas. Administrative routes are intentionally not presented as public navigation destinations.

| Category | Routes |
|---|---|
| Public | `/`, `/about`, `/subjects`, `/timetable`, `/testimonials`, `/contact`, `/enroll`, `/exam-predictor` |
| Account | `/login`, `/signup`, `/forgot-password`, `/auth/callback`, `/auth/reset-password`, `/auth/verify`, `/dashboard` |
| Learning areas | `/student/dashboard`, `/tutor/dashboard` |
| Administration | `/admin`, `/admin/dashboard`, `/admin/applicants`, `/admin/settings`, `/admin/subjects` |
| API and auth endpoints | `/api/auth`, `/api/login`, `/api/logout`, `/api/send-verification` |

## Original logo handling

The visible header brand uses `public/Logo-horizontal-original.png`. This asset is a deterministic horizontal composition of the exact original GlobeDk emblem and the exact original `GlobeDk / ELITE` wordmark from `public/Logo.png`. The artwork was not redrawn, replaced with an AI-generated logo, or converted into an invented SVG identity.

The footer uses `public/Logo-original-transparent.png`, which preserves the original stacked mark while removing only the outer raster canvas. The source `public/Logo.png` remains the branding source of truth for metadata and favicon references.

> Do not replace the original logo assets with recreated marks or generated alternatives. If a future brand update is required, use an official vector or transparent source supplied by GlobeDk.

## Documentation overview

The repository includes design rationale, implementation notes, responsive checks, and presentation material from the UI redesign process. The documents below are intended to make the design decisions and verification history easy to review.

| Document | Purpose |
|---|---|
| [`premium-design-references.md`](premium-design-references.md) | High-level inspiration notes from major university sites, used for information architecture and editorial direction only |
| [`homepage-improvement-wireframe.md`](homepage-improvement-wireframe.md) | Homepage wireframe and proposed content hierarchy |
| [`homepage-ui-improvement-snippets.tsx`](homepage-ui-improvement-snippets.tsx) | Earlier UI implementation snippets retained as reference |
| [`homepage-ui-improvement.css`](homepage-ui-improvement.css) | Earlier styling reference retained from the homepage improvement process |
| [`ui-presentation-script-and-review.md`](ui-presentation-script-and-review.md) | Website UI showcase script, mobile responsiveness review, and UI/UX recommendations |
| [`final-ui-enhancement-verification.md`](final-ui-enhancement-verification.md) | Verification notes for the course finder, predictor modal, drawer, and homepage interactions |
| [`implementation-verification-notes.md`](implementation-verification-notes.md) | Implementation and responsive testing notes |
| [`brand-layout-verification.md`](brand-layout-verification.md) | Brand and layout checks across responsive viewport sizes |
| [`footer-verification.md`](footer-verification.md) | Footer route coverage and layout verification |
| [`header-reference-notes.md`](header-reference-notes.md) | Header reference and editorial navigation direction |
| [`logo-header-verification.md`](logo-header-verification.md) | Logo/header verification history |
| [`vector-logo-verification.md`](vector-logo-verification.md) | Earlier logo verification record retained as historical context |
| [`horizontal-logo-notes.md`](horizontal-logo-notes.md) | Current horizontal original-logo crop diagnosis and verification |

The verification documents record an iterative design process. For the current brand implementation, use `components/brand.tsx`, `public/Logo-horizontal-original.png`, `public/Logo-original-transparent.png`, and `horizontal-logo-notes.md` as the latest source of truth.

## Local development

### Prerequisites

Install Node.js and pnpm, then install the repository dependencies:

```bash
pnpm install
```

Start the development server on the default Next.js port:

```bash
pnpm dev
```

The site will normally be available at `http://localhost:3000`.

### Environment variables

The repository contains existing Supabase, authentication, email, and API modules. Use real project credentials when running those flows. For frontend-only build verification, the following placeholder values are sufficient because some backend configuration modules are evaluated during the build:

```bash
export NEXT_PUBLIC_SUPABASE_URL="https://placeholder.supabase.co"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="placeholder-anon-key"
export SUPABASE_SERVICE_ROLE_KEY="placeholder-service-role-key"
export RESEND_API_KEY="re_placeholder_key"
```

Do not commit real secrets. Store local values in an ignored `.env.local` file or through the deployment platform’s secret manager.

### Available scripts

| Command | Purpose |
|---|---|
| `pnpm dev` | Start the Next.js development server |
| `pnpm build` | Create a production build and run sitemap generation through `postbuild` |
| `pnpm start` | Serve the production build locally |
| `pnpm lint` | Run ESLint across the repository |

A documented build verification command is:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://placeholder.supabase.co" \
NEXT_PUBLIC_SUPABASE_ANON_KEY="placeholder-anon-key" \
SUPABASE_SERVICE_ROLE_KEY="placeholder-service-role-key" \
RESEND_API_KEY="re_placeholder_key" \
pnpm build
```

## UI verification checklist

The current homepage work has been checked at 1440px desktop, 390px mobile, and 257px narrow width. The checks cover navigation containment, responsive logo visibility, interactive drawer behavior, smooth anchor navigation, course finder filtering, subject details, predictor stage controls, and successful HTTP responses from the local preview.

| Verification area | Expected result |
|---|---|
| Desktop header | Full original horizontal lockup is visible, including the complete `GlobeDk` wordmark and `ELITE` line |
| Mobile header | Horizontal lockup remains readable beside the menu trigger without page overflow |
| Narrow viewport | Header remains contained at 257px and the full logo remains visible |
| Mobile drawer | Opens inside a bounded panel, supports Escape dismissal, restores body scrolling, and maintains large touch targets |
| Course finder | Filters subjects by pathway and search, then opens a detailed subject modal |
| AI Exam Predictor | Opens a staged interactive preview without claiming the feature is production-ready |
| Production build | Passes with the documented placeholder environment variables |
| TypeScript note | Existing Framer Motion `ease` typing errors remain in `app/subjects/page.tsx`; they are unrelated to the homepage/logo work |

## Scope and contribution guidance

The current design scope is frontend/UI only. Preserve existing site copy, subject information, calls to action, account behavior, and backend integrations unless a separate change explicitly requests them. New visual work should maintain the premium academic/editorial direction while respecting responsive layout, reduced-motion preferences, keyboard accessibility, touch target size, and the original GlobeDk brand identity.

When adding a new page or shared interaction, update the relevant route/source table in this README and add a concise verification note if the change affects responsive behavior or navigation. Keep generated screenshots and exploratory logo alternatives out of production branding unless they are explicitly required by the implementation.

## References

[1]: package.json "Project scripts and dependency metadata"
[2]: app/page.tsx "Homepage implementation"
[3]: components/navigation.tsx "Navigation and AI Exam Predictor implementation"
[4]: components/footer.tsx "Footer implementation"
[5]: components/brand.tsx "Responsive brand component"
[6]: app/globals.css "Global theme and responsive safeguards"
[7]: public/Logo.png "Original GlobeDk logo source artwork"
[8]: horizontal-logo-notes.md "Current horizontal logo verification notes"
