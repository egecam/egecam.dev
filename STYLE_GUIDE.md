# Design System & Style Guide

A comprehensive design guide for building consistent, elegant interfaces. This system prioritizes warmth, clarity, and subtle motion.

---

## Color Palette

### Core Colors

| Token                | Value                  | Usage                                  |
| -------------------- | ---------------------- | -------------------------------------- |
| `--background`       | `#f5f5f5` (whitesmoke) | Primary page background                |
| `--background-alt`   | `#f7f7f7`              | Cards, elevated surfaces               |
| `--background-hover` | `#fafafa`              | Hover states on backgrounds            |
| `--foreground`       | `#343434`              | Primary text, headings                 |
| `--accent`           | `#ff6a3d`              | CTAs, highlights, interactive elements |

### Extended Palette

| Color           | Value     | Context                              |
| --------------- | --------- | ------------------------------------ |
| Subtitle text   | `#4a4a4a` | Secondary body text                  |
| Muted text      | `#f5f5f5` | Text on dark backgrounds             |
| Dark surface    | `#1f1f1f` | Audio player, dark cards             |
| Highlight       | `#facc15` | Active/highlighted elements (yellow) |
| Highlight faded | `#b8a033` | Inactive highlighted elements        |
| Bar default     | `#f5f5f5` | Waveform bars (playing)              |
| Bar faded       | `#a3a3a3` | Waveform bars (paused)               |

### Opacity Patterns

- Borders on light: `border-black/10` or `border-black/15`
- Shadows: `rgba(0,0,0,0.08)` to `rgba(0,0,0,0.12)`
- Text on dark: `text-[var(--background)]/80`
- Ring highlights: `ring-white/50`

---

## Typography

### Font Stack

| Role            | Font          | Fallbacks                                        |
| --------------- | ------------- | ------------------------------------------------ |
| **Primary**     | Inter         | system-ui, -apple-system, "Segoe UI", sans-serif |
| **Alternative** | IBM Plex Sans | system-ui, sans-serif                            |
| **Display**     | Bowlby One    | sans-serif                                       |

### Type Styles

#### `.title-strong` — Display Headings

```css
font-family: var(--font-bowlby-one);
font-weight: 400;
line-height: 1.05;
letter-spacing: 0.01em;
color: var(--foreground);
```

**Sizes:** `text-5xl` / `text-6xl` (hero), `text-3xl` (section headings)

#### `.eyebrow` — Labels & Categories

```css
font-family: var(--font-inter);
font-weight: 300;
letter-spacing: 0.14em;
font-stretch: 95%;
color: var(--accent);
```

**Size:** `text-xs`

#### `.subtitle` — Body Text

```css
font-family: var(--font-inter);
font-weight: 400;
font-size: 0.9375rem;
line-height: 1.5;
letter-spacing: 0.02em;
color: #4a4a4a;
```

#### `.audio-title` — Component Titles

```css
font-family: var(--font-inter);
font-weight: 700;
line-height: 1.2;
```

**Size:** `text-xl`

### Tracking Reference

| Style             | Letter Spacing |
| ----------------- | -------------- |
| Eyebrow           | `0.14em`       |
| Display           | `0.01em`       |
| Subtitle          | `0.02em`       |
| Highlighted label | `0.3em`        |

---

## Spacing

### Layout Spacing

| Context           | Mobile      | Desktop           |
| ----------------- | ----------- | ----------------- |
| Page padding X    | `px-4`      | `px-6`            |
| Page padding Y    | `py-10`     | `py-12` / `py-14` |
| Section gap       | `space-y-8` | `space-y-10`      |
| Content max-width | `max-w-3xl` | —                 |

### Component Spacing

| Pattern             | Value                      |
| ------------------- | -------------------------- |
| Card padding        | `px-6 py-6` or `px-6 py-7` |
| Element gaps        | `gap-2`, `gap-3`, `gap-4`  |
| Section top padding | `pt-6` / `pt-8`            |
| Grid gaps           | `gap-6` / `gap-7`          |

---

## Border Radius

| Size   | Token          | Usage                            |
| ------ | -------------- | -------------------------------- |
| Small  | `rounded-xl`   | Thumbnails, small cards          |
| Medium | `rounded-2xl`  | Buttons, inputs, embeds          |
| Large  | `rounded-3xl`  | Cards, containers                |
| Full   | `rounded-full` | Pills, avatars, circular buttons |

---

## Shadows

### Elevation Levels

```css
/* Level 1 — Cards */
shadow-[0_12px_40px_rgba(0,0,0,0.08)]

/* Level 2 — Hover cards */
shadow-[0_10px_35px_rgba(0,0,0,0.12)]

/* Level 3 — Elevated hover */
shadow-[0_24px_55px_rgba(0,0,0,0.2)]

/* Tooltips */
shadow-md
```

---

## Animation

### Timing Functions

| Easing        | Usage                         |
| ------------- | ----------------------------- |
| `ease-out`    | Enter animations              |
| `ease-in`     | Exit animations               |
| `ease-in-out` | Looping/continuous animations |

### Duration Scale

| Duration | Usage                           |
| -------- | ------------------------------- |
| `150ms`  | Micro-interactions (tooltips)   |
| `200ms`  | Hover states, small transitions |
| `220ms`  | Exit animations                 |
| `300ms`  | Enter animations, transforms    |
| `480ms`  | Color transitions               |

### Signature Animations

#### Genie In (Card Enter)

```css
@keyframes genie-in {
  0% {
    transform: scaleY(0.75) translateY(20px);
    opacity: 0;
    filter: blur(6px);
  }
  60% {
    transform: scaleY(1.03) translateY(-2px);
    opacity: 1;
    filter: blur(1px);
  }
  100% {
    transform: scaleY(1) translateY(0);
    opacity: 1;
    filter: blur(0);
  }
}
/* Duration: 0.3s ease-out */
```

#### Genie Out (Card Exit)

```css
@keyframes genie-out {
  0% {
    transform: scaleY(1) translateY(0);
    opacity: 1;
    filter: blur(0);
  }
  100% {
    transform: scaleY(0.75) translateY(24px);
    opacity: 0;
    filter: blur(6px);
  }
}
/* Duration: 0.22s ease-in */
```

#### Wave Active (Audio Bars Playing)

```css
@keyframes wave-active {
  0% { transform: translateY(-50%) scaleY(1); }
  35% { transform: translateY(-51.5%) scaleY(1.06); }
  70% { transform: translateY(-48.5%) scaleY(0.97); }
  100% { transform: translateY(-50%) scaleY(1); }
}
/* Duration: 1.4s ease-in-out infinite alternate */
```

### Staggered Animations

For sequential reveals, use `animation-delay` with multiplier:

```tsx
animationDelay: `${index * 18}ms`
```

---

## Interactive States

### Buttons

#### Primary Button (Accent)

```tsx
className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold
           text-[var(--background)] transition hover:opacity-90"
```

#### Icon Button

```tsx
className="h-14 w-14 cursor-pointer items-center justify-center rounded-2xl
           text-[var(--accent)] transition hover:text-[#ff6a2e]"
```

### Focus States

Always include visible focus indicators for accessibility:

```tsx
focus-visible:outline focus-visible:outline-2
focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]/70
focus-visible:ring-2 focus-visible:ring-[var(--accent)]/80
focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]
```

### Hover Transforms

Cards and interactive elements use subtle lift on hover:

```tsx
group-hover:-translate-y-3 group-hover:scale-[1.02]
```

---

## Component Patterns

### Card (Light Surface)

```tsx
<div className="rounded-3xl border border-black/10 bg-[var(--background-alt)]
                px-6 py-7 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
```

### Card (Dark Surface)

```tsx
<div className="rounded-3xl border border-black/15 bg-[#1f1f1f] px-6 py-6">
```

### Image Container with Gradient Overlay

```tsx
<div className="relative overflow-hidden rounded-2xl">
  <Image ... className="object-cover" />
  <div
    className="absolute inset-0"
    style={{ background: `linear-gradient(180deg, ${accentColor}, transparent 55%)` }}
  />
</div>
```

### Tooltip Pattern

```tsx
<div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2
                rounded-full bg-white/90 px-3 py-2 text-xs shadow-md
                opacity-0 transition duration-150
                group-hover:-translate-y-1 group-hover:opacity-100">
```

### Loading Spinner

```tsx
<div className="h-8 w-8 animate-spin rounded-full border-2
                border-white/60 border-t-transparent" />
```

---

## Responsive Breakpoints

| Breakpoint | Prefix    | Min Width |
| ---------- | --------- | --------- |
| Mobile     | (default) | 0px       |
| Small      | `sm:`     | 640px     |
| Medium     | `md:`     | 768px     |
| Large      | `lg:`     | 1024px    |

### Common Responsive Patterns

```tsx
// Text sizing
text-5xl sm:text-6xl

// Spacing
px-4 sm:px-6
py-10 sm:py-12 md:py-14
space-y-8 sm:space-y-10

// Component sizing
h-14 sm:h-20
w-[3px] sm:w-[6px]

// Grid
grid-cols-1 md:grid-cols-3

// Gaps
gap-[2px] sm:gap-[7px]
```

---

## Accessibility

### Required Practices

1. **Semantic HTML**: Use proper heading hierarchy, landmarks, and button elements
2. **Focus management**: All interactive elements must have visible focus states
3. **ARIA labels**: Provide labels for icon-only buttons and complex widgets
4. **Color contrast**: Maintain WCAG AA contrast ratios (4.5:1 for text)
5. **Reduced motion**: Respect `prefers-reduced-motion` for animations

### Example ARIA Pattern

```tsx
<button
  type="button"
  aria-pressed={isActive}
  aria-label={isActive ? "Pause track" : "Play track"}
>
```

---

## File Naming Conventions

| Type       | Convention | Example                   |
| ---------- | ---------- | ------------------------- |
| Components | PascalCase | `Track.tsx`, `Sparks.tsx` |
| Utilities  | camelCase  | `formatTime.ts`           |
| Styles     | kebab-case | `globals.css`             |
| Assets     | kebab-case | `spark-cover-image/`      |

---

## CSS Custom Properties Reference

```css
:root {
  /* Colors */
  --background: #f5f5f5;
  --background-alt: #f7f7f7;
  --background-hover: #fafafa;
  --foreground: #343434;
  --accent: #ff6a3d;

  /* Fonts (set via Next.js) */
  --font-inter: "Inter";
  --font-ibm-plex-sans: "IBM Plex Sans";
  --font-bowlby-one: "Bowlby One";
}
```

---

_This guide is a living document. Update it as the design system evolves._
