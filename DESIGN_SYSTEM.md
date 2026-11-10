# DESIGN_SYSTEM.md — Single Source of Truth

> ONE WEBSITE. ONE BRAND IDENTITY. ONE DESIGN SYSTEM.
> Every agent MUST read this file (and `REDESIGN_PROGRESS.md`) before touching any page or component.
> Need a new design decision? Update this file FIRST, then implement.

Scope: **public site only** (`client/src/pages`, `sections`, `components`). The admin dashboard (`pages/admin/**`) shares shadcn CSS vars — do not change `--primary/--accent/...` in `index.css` without checking admin.

## 1. Stack facts (verified from the repo)
- React 19 + Vite 7 + Tailwind **3.4.19** (`tailwind.config.js`, not v4) + shadcn/ui (`components/ui/*.tsx`, used mainly by admin)
- State: Redux Toolkit slices hydrated by `AppInitializer` via React Query. **Pages read from `useSelector`** (about, projects, skills, testimonial, service, plan, FAQ, siteSettings, experience, education). Never replace this with hardcoded data.
- Routing: `Routes/user.route.jsx` (lazy pages under `Layout` = Navbar + `<main>` + Footer). Public routes: `/`, `/about`, `/services`, `/services/:slug`, `/projects`, `/projects/:slug`, `/reviews`, `/contact`.
- SEO: `MetaUpdater` (global, driven by `siteSettings.seo_pages`) + `DynamicMetaUpdater` (service/project detail). JSON-LD is injected per page. Keep this mechanism; extend, don't replace.
- Breakpoints: Tailwind defaults + `xs: 300px` (via `theme.extend.screens` — defaults are preserved). **Never move `xs` out of `extend`.**
- Animation target: **`motion/react`** (`motion` ^12 installed). Legacy: `framer-motion` and `gsap` (see progress file).

## 2. Color tokens
Defined once in `client/src/design-tokens.css` (RGB channels) and exposed in Tailwind. Use the Tailwind classes; use `var(--…)` only in custom CSS.

| Role | Token / class | Value |
|---|---|---|
| Primary accent | `brand-cyan` | #02D3FE |
| Secondary accent | `brand-blue` | #4E90E1 |
| Highlight (selective) | `brand-purple` | #9A5CB7 |
| Page background | `surface-base` | #0A0A0F |
| Deepest | `surface-void` | #050507 |
| Section alt | `surface-secondary` | #101017 |
| Elevated | `surface-elevated` | #15151F |
| Card | `surface-card` | #191923 |
| Soft / inputs | `surface-soft` | #20202C |
| Text | `text-ink` / `ink-secondary` / `ink-muted` | #F5F7FA / #A1A1B2 / #737386 |
| Borders | `border-line-subtle` / `border-line-strong` | white 8% / 14% |
| Glows | `shadow-glow-cyan|blue|purple` | 16% alpha, 40px blur |
| Gradient | `var(--gradient-brand)` / `--gradient-cyan-blue` | accent only |

Rules: cyan = primary, blue = secondary emphasis, purple = selective depth. Gradient on **at most** one element per section (hero word, primary CTA, one stat). No stacked neon text-shadows.
Contrast: body text uses `ink` or `ink-secondary` only; `ink-muted` is for captions/metadata (≥14px).

### Legacy tokens (DEPRECATED — remove after migration)
`THEME` object in `components/UI.jsx`, `neon-*`, `dark-*`, `theme-cyan`, `theme-purple` (**is actually green #00d596 — misleading name**), `light-blue`, `theme-dark`, `.neon-glow-*`, `.neon-text-*`, `.glass`, `.glass-strong`, `.border-gradient`, `.gradient-mesh`, `.animate-float`. When a component is redesigned, replace its usage with the tokens above. Do not add new usages.

## 3. Typography
- Body/UI: **Inter** (already loaded via Google Fonts in `index.css`).
- Headings: **PROPOSED — Inter 600/700, tight tracking.** Current `h1–h6` use **Oswald** (`font-display`). Oswald is a condensed display face that fights the "premium/sophisticated" direction. ⚠ *Pending owner confirmation*; until confirmed, leave existing Oswald headings in place on pages not yet redesigned, and do not mix both inside one page.
- Mono: Fira Code (`font-fira-code`) for code/metadata only.

| Style | Mobile (300–639) | Desktop |
|---|---|---|
| Hero H1 | `clamp(2rem, 8vw, 3.25rem)` | `clamp(3rem, 5vw, 4.5rem)` |
| Page H1 | `clamp(1.75rem, 6vw, 2.5rem)` | up to 3.5rem |
| Section H2 | `clamp(1.5rem, 5vw, 2rem)` | up to 2.75rem |
| Card title | 1.125rem | 1.25rem |
| Body | 1rem / 1.65 | 1.0625rem |
| Caption/meta | 0.8125rem | 0.875rem |
Min body size on mobile: 16px. Weights: headings 600–700, body 400, labels 500.

## 4. Spacing, shape, surfaces
- Section padding: `py-16 sm:py-20 lg:py-28`; container `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` (at 300px: `px-4` minimum, never less).
- Radius: card `rounded-2xl` (`--ds-radius-lg`), buttons/inputs `rounded-xl`, badges `rounded-full`. No other radii.
- Card: `bg-surface-card/60 border border-line-subtle rounded-2xl`; hover → `border-line-strong` + (optional) `shadow-glow-cyan`. Backdrop blur only on navbar and modals.
- Background: one treatment site-wide — `surface-base` + one soft radial glow per page max (cyan/blue top, purple bottom). Replace the global full-screen `.noise-overlay::before` (z-index 9999) when touching `App.jsx`; it is a mobile perf cost.

## 5. Components (to be created in `client/src/components/ds/` as pages are redesigned)
`Button` (primary / secondary / ghost), `Card`, `SectionHeading`, `Badge`, `Container`/`Section`, `EmptyState`, `ErrorState`, `Skeleton` variants. Until they exist, existing `PrimaryButton`, `OutlineButton`, `GlassCard`, `TechBadge`, `GradientText` in `UI.jsx` may be reused but must be restyled to tokens, keeping their props API.
Interaction: visible focus ring `focus-visible:ring-2 ring-brand-cyan ring-offset-2 ring-offset-surface-base`; min touch target 44×44px.

## 6. Responsive rules
Mobile-first; verify at **300, 320, 375, 390, 430, 640, 768, 1024, 1280, 1440, 1920**. Use `xs:` for 300–639 adjustments. No horizontal overflow (`overflow-x-clip` on sections with decorative blobs). Layouts are re-composed for mobile (stack/reorder/simplify), not scaled down. Fluid type via `clamp()`.
⚠ `#userRoot` in `App.css` currently forces `padding: 2rem; text-align:center; max-width:1280px` (Vite template leftover) — remove when `Layout` is redesigned.

## 7. Motion (`motion/react` only)
- Import presets from `client/src/lib/motion.js` (`useMotionPrefs`, `fadeUp`, `staggerParent`, `VIEWPORT_ONCE`, `EASE_OUT`).
- Animate `transform` + `opacity` only. Reveals trigger once. Easing `[0.16,1,0.3,1]`. Durations: micro 150ms, base 300ms, reveal ≤600ms.
- Mobile: distances ≤12px, stagger ≤0.05s, no infinite decorative loops (no float/orbit/particles).
- `prefers-reduced-motion`: opacity-only, no loops. Prevent CLS (reserve space/aspect-ratio).
- No new animation libraries. GSAP/framer-motion are removed only after the page using them is migrated and verified.

## 8. Data states (mandatory per data-driven component)
Loading → skeleton matching final layout. Empty → `EmptyState` (no fake content). Error → `ErrorState` with retry where possible. No fabricated testimonials, stats, projects.

## 9. SEO/A11y rules
One `<h1>` per page; semantic landmarks; descriptive alt (from backend data where available); labels on all form fields; `aria-current` on active nav. Metadata flows through `MetaUpdater`/`DynamicMetaUpdater`. Structured data: Person + WebSite on Home (Organization already in `index.html`).

## 10. Change log
- 2026-11-10 — Initial system established from repo inspection. Tokens added (additive, nothing removed).
