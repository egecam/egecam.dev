// Design tokens and constants for the home page
export const DESIGN_TOKENS = {
  // Typography
  typography: {
    sectionHeading: "text-3xl sm:text-4xl font-garamond font-extrabold tracking-display text-foreground",
    sectionHeadingSmall: "text-2xl sm:text-3xl font-garamond font-extrabold text-foreground",
    subsectionLabel: "text-sm uppercase tracking-[0.14em]",
    subsectionLabelLight: "text-sm uppercase tracking-[0.14em] text-foreground/70",
    subsectionLabelMuted: "text-sm uppercase tracking-[0.14em] text-foreground/60",
    externalLink: "text-sm text-foreground/60 hover:text-accent transition-colors",
  },
  
  // Spacing
  spacing: {
    section: "space-y-4",
    subsection: "space-y-3",
    container: "space-y-16 sm:space-y-20",
  },
  
  // Grid layouts
  grid: {
    mediaGrid: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4",
    writingGrid: "grid grid-cols-1 gap-4 md:grid-cols-3",
    musicGrid: "grid grid-cols-1 md:grid-cols-2 gap-6",
  },
  
  // Card styles
  card: {
    mediaCard: "group relative aspect-[2/3] overflow-hidden rounded-2xl bg-background-alt border border-black/10 shadow-[0_10px_25px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(0,0,0,0.16)] will-change-transform",
    mediaCardHistory: "group relative aspect-[2/3] overflow-hidden rounded-2xl bg-background-alt/70 border border-black/10 shadow-[0_10px_25px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(0,0,0,0.16)] will-change-transform",
    writingCard: "group rounded-3xl border border-black/10 bg-background px-5 py-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(0,0,0,0.14)]",
    skeletonCard: "relative aspect-[2/3] overflow-hidden rounded-2xl bg-background-alt border border-black/10 shadow-[0_10px_25px_rgba(0,0,0,0.08)]",
    skeletonCardHistory: "relative aspect-[2/3] overflow-hidden rounded-2xl bg-background-alt/70 border border-black/10 shadow-[0_10px_25px_rgba(0,0,0,0.08)]",
  },
  
  // Image styles
  image: {
    cover: "object-cover object-center",
    coverHover: "object-cover object-center opacity-75 group-hover:opacity-100 transition-opacity duration-300",
    sizes: "(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw",
  },
  
  // Overlay styles
  overlay: {
    gradientDark: "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent",
    gradientDarkHistory: "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent",
    hoverInfo: "absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out",
    defaultTitle: "absolute bottom-3 left-3 right-3 text-background/90 text-sm font-semibold drop-shadow-sm line-clamp-2",
    defaultTitleHover: "absolute bottom-3 left-3 right-3 text-background/90 text-sm font-semibold drop-shadow-sm line-clamp-2 group-hover:opacity-0 transition-opacity duration-300",
  },
  
  // Text styles
  text: {
    titleHover: "text-background text-sm font-semibold drop-shadow-md line-clamp-2",
    subtitleHover: "text-background/80 text-xs mt-1 drop-shadow-md",
    ratingHover: "text-background/90 text-xs font-semibold drop-shadow-md",
    yearHover: "text-background/80 text-xs drop-shadow-md",
    placeholder: "text-center text-sm font-medium text-foreground/70",
  },
  
  // Animation
  animation: {
    section: {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.45, ease: "easeOut" },
    },
    historyItem: {
      open: { opacity: 1, scale: 1 },
      closed: { opacity: 0.65, scale: 0.97 },
      transition: { duration: 0.3, ease: "easeOut" },
    },
  },
  
  // History section
  history: {
    container: (isOpen: boolean) => `relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 transition-all duration-300 ${
      isOpen ? "" : "max-h-72 overflow-hidden cursor-pointer"
    }`,
    button: "rounded-full bg-foreground text-background px-4 py-2 text-sm font-semibold shadow-lg",
    buttonContainer: "pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background flex items-end justify-center pb-4",
  },
  
  // Empty states
  empty: {
    container: "col-span-full rounded-2xl border border-black/10 bg-background-alt/50 p-6 text-center text-foreground/60",
  },
  
  // Skeleton
  skeleton: {
    shimmer: "absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent",
  },
} as const;

