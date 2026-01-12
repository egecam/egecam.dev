import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { DESIGN_TOKENS } from "./page.constants";
import type { GoodreadsBook } from "./api/goodreads/route";
import type { LetterboxdFilm } from "./api/letterboxd/route";

// Media Card Component (for books and films)
export function MediaCard({
  item,
  type,
  isHistory = false,
  isClickable = true,
  onClick,
}: {
  item: GoodreadsBook | LetterboxdFilm;
  type: "book" | "film";
  isHistory?: boolean;
  isClickable?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}) {
  const coverUrl = "coverUrl" in item ? item.coverUrl : item.posterUrl;
  const title = item.title;
  const url = "bookUrl" in item ? item.bookUrl : item.filmUrl;
  const author = "author" in item ? item.author : undefined;
  const year = "year" in item ? item.year : undefined;
  const rating = "rating" in item && item.rating > 0 ? item.rating : undefined;

  const cardClass = isHistory
    ? DESIGN_TOKENS.card.mediaCardHistory
    : DESIGN_TOKENS.card.mediaCard;
  const overlayClass = isHistory
    ? DESIGN_TOKENS.overlay.gradientDarkHistory
    : DESIGN_TOKENS.overlay.gradientDark;
  const imageClass = isHistory
    ? DESIGN_TOKENS.image.coverHover
    : DESIGN_TOKENS.image.cover;

  const content = (
    <>
      {coverUrl ? (
        <Image
          src={coverUrl}
          alt={title}
          fill
          className={imageClass}
          sizes={DESIGN_TOKENS.image.sizes}
          unoptimized
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-sage/20 p-3">
          <span className={DESIGN_TOKENS.text.placeholder}>{title}</span>
        </div>
      )}
      <div className={overlayClass} />
      <div className={DESIGN_TOKENS.overlay.hoverInfo}>
        <p className={DESIGN_TOKENS.text.titleHover}>{title}</p>
        {author && <p className={DESIGN_TOKENS.text.subtitleHover}>{author}</p>}
        {(year || rating) && (
          <div className="flex items-center justify-between mt-1">
            {year && <p className={DESIGN_TOKENS.text.yearHover}>{year}</p>}
            {rating && (
              <p className={DESIGN_TOKENS.text.ratingHover}>
                {rating.toFixed(1)} ★
              </p>
            )}
          </div>
        )}
      </div>
      {isHistory && (
        <div className={DESIGN_TOKENS.overlay.defaultTitleHover}>{title}</div>
      )}
    </>
  );

  if (isHistory) {
    return (
      <motion.a
        href={isClickable ? url : undefined}
        target={isClickable ? "_blank" : undefined}
        rel={isClickable ? "noopener noreferrer" : undefined}
        onClick={onClick}
        layout
        animate={
          isClickable
            ? DESIGN_TOKENS.animation.historyItem.open
            : DESIGN_TOKENS.animation.historyItem.closed
        }
        transition={DESIGN_TOKENS.animation.historyItem.transition}
        className={`${cardClass} ${isClickable ? "cursor-pointer" : "cursor-default"}`}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cardClass}
    >
      {content}
    </a>
  );
}

// Skeleton Card Component
export function SkeletonCard({ isHistory = false }: { isHistory?: boolean }) {
  const cardClass = isHistory
    ? DESIGN_TOKENS.card.skeletonCardHistory
    : DESIGN_TOKENS.card.skeletonCard;

  return (
    <div className={cardClass}>
      <div className={DESIGN_TOKENS.skeleton.shimmer} />
    </div>
  );
}

// Section Header Component
export function SectionHeader({
  title,
  link,
  linkText,
  rightContent,
}: {
  title: string;
  link?: string;
  linkText?: string;
  rightContent?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className={DESIGN_TOKENS.typography.sectionHeading}>{title}</h2>
      {rightContent || (link && linkText && (
        <Link href={link} className={DESIGN_TOKENS.typography.externalLink}>
          {linkText}
        </Link>
      ))}
    </div>
  );
}

// Subsection Label Component
export function SubsectionLabel({
  text,
  variant = "light",
}: {
  text: string;
  variant?: "light" | "muted";
}) {
  const labelClass =
    variant === "muted"
      ? DESIGN_TOKENS.typography.subsectionLabelMuted
      : DESIGN_TOKENS.typography.subsectionLabelLight;

  return <p className={labelClass}>{text}</p>;
}

// History Section Component
export function HistorySection<T extends GoodreadsBook | LetterboxdFilm>({
  items,
  isLoading,
  isOpen,
  onToggle,
  type,
  emptyMessage,
  buttonText,
  limit = 10,
}: {
  items: T[];
  isLoading: boolean;
  isOpen: boolean;
  onToggle: () => void;
  type: "book" | "film";
  emptyMessage: string;
  buttonText: string;
  limit?: number;
}) {
  const handleItemClick = (e: React.MouseEvent) => {
    if (!isOpen) {
      e.preventDefault();
      onToggle();
    } else {
      e.stopPropagation();
    }
  };

  return (
    <motion.div
      layout
      onClick={() => !isOpen && onToggle()}
      className={DESIGN_TOKENS.history.container(isOpen)}
    >
      {isLoading ? (
        Array.from({ length: 8 }).map((_, idx) => (
          <SkeletonCard key={`history-skeleton-${idx}`} isHistory />
        ))
      ) : items.length > 0 ? (
        <>
          {items.slice(0, limit).map((item, idx) => (
            <MediaCard
              key={`history-${item.title}-${idx}`}
              item={item}
              type={type}
              isHistory
              isClickable={isOpen}
              onClick={handleItemClick}
            />
          ))}
          {!isOpen && items.length > 0 && (
            <div className={DESIGN_TOKENS.history.buttonContainer}>
              <div className={DESIGN_TOKENS.history.button}>{buttonText}</div>
            </div>
          )}
        </>
      ) : (
        <div className={DESIGN_TOKENS.empty.container}>{emptyMessage}</div>
      )}
    </motion.div>
  );
}

// Media Grid Component
export function MediaGrid<T extends GoodreadsBook | LetterboxdFilm>({
  items,
  isLoading,
  type,
  emptyMessage,
  skeletonCount = 4,
}: {
  items: T[];
  isLoading: boolean;
  type: "book" | "film";
  emptyMessage: string;
  skeletonCount?: number;
}) {
  return (
    <div className={DESIGN_TOKENS.grid.mediaGrid}>
      {isLoading ? (
        Array.from({ length: skeletonCount }).map((_, idx) => (
          <SkeletonCard key={`skeleton-${idx}`} />
        ))
      ) : items.length > 0 ? (
        items.map((item, idx) => (
          <MediaCard
            key={`${type}-${item.title}-${idx}`}
            item={item}
            type={type}
          />
        ))
      ) : (
        <div className={DESIGN_TOKENS.empty.container}>{emptyMessage}</div>
      )}
    </div>
  );
}

