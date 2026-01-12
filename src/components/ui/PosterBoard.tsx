"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { LetterboxdFilm } from "@/app/api/letterboxd/route";

interface PosterBoardProps {
  films: LetterboxdFilm[];
  isLoading?: boolean;
  maxItems?: number;
}

export function PosterBoard({ films, isLoading = false, maxItems = 4 }: PosterBoardProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: maxItems }).map((_, i) => (
          <div
            key={i}
            className="aspect-[2/3] bg-foreground/5 rounded-lg animate-pulse"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    );
  }

  if (films.length === 0) {
    return (
      <div className="rounded-2xl border border-black/10 bg-background-alt/50 p-8 text-center">
        <p className="text-foreground/50 text-sm">No films yet</p>
      </div>
    );
  }

  // Slight random rotations for organic look
  const rotations = [-2, 1.5, -1, 2, -1.5, 1, -2.5, 1.5];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {films.slice(0, maxItems).map((film, index) => {
        const rotation = rotations[index % rotations.length];
        const isHovered = hoveredIndex === index;

        return (
          <motion.a
            key={`${film.filmUrl}-${index}`}
            href={film.filmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            initial={{ rotate: rotation }}
            animate={{
              rotate: isHovered ? 0 : rotation,
              scale: isHovered ? 1.05 : 1,
              zIndex: isHovered ? 10 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            whileHover={{ y: -8 }}
          >
            {/* Shadow */}
            <div className="absolute inset-0 bg-black/20 rounded-lg blur-md translate-y-2 group-hover:translate-y-4 group-hover:blur-lg transition-all duration-300" />

            {/* Poster */}
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-neutral-200 shadow-lg border-4 border-white">
              {film.posterUrl ? (
                <Image
                  src={film.posterUrl}
                  alt={film.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 45vw, 22vw"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-300 to-neutral-400 flex items-center justify-center p-3">
                  <span className="text-sm text-center text-neutral-600 line-clamp-3 font-medium">
                    {film.title}
                  </span>
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <p className="text-white text-sm font-semibold line-clamp-2 drop-shadow-lg">
                  {film.title}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-white/80 text-xs">{film.year}</span>
                  {film.rating > 0 && (
                    <span className="text-amber-400 text-xs font-medium">
                      {film.rating.toFixed(1)} ★
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.a>
        );
      })}
    </div>
  );
}

// Horizontal strip with arrow navigation for watch history
interface PosterStripProps {
  films: LetterboxdFilm[];
  isLoading?: boolean;
  maxItems?: number;
}

export function PosterStrip({ films, isLoading = false, maxItems = 10 }: PosterStripProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isHoveringContainer, setIsHoveringContainer] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const updateScrollButtons = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
    setTimeout(updateScrollButtons, 300);
  };

  if (isLoading) {
    return (
      <div className="flex gap-3 py-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-28 aspect-[2/3] bg-foreground/5 rounded-lg animate-pulse"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    );
  }

  if (films.length === 0) {
    return (
      <div className="rounded-2xl border border-black/10 bg-background-alt/50 p-6 text-center">
        <p className="text-foreground/50 text-sm">No watch history</p>
      </div>
    );
  }

  return (
    <div 
      className="relative group/strip"
      onMouseEnter={() => setIsHoveringContainer(true)}
      onMouseLeave={() => setIsHoveringContainer(false)}
    >
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 shadow-lg border border-black/10 flex items-center justify-center transition-all duration-200 hover:bg-white hover:scale-110 ${
          isHoveringContainer && canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll left"
      >
        <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 shadow-lg border border-black/10 flex items-center justify-center transition-all duration-200 hover:bg-white hover:scale-110 ${
          isHoveringContainer && canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll right"
      >
        <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div
        ref={scrollRef}
        className="overflow-x-auto py-6 px-2 scrollbar-hide"
        onScroll={updateScrollButtons}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex gap-4">
          {films.slice(0, maxItems).map((film, index) => {
            const isHovered = hoveredIndex === index;

            return (
              <motion.a
                key={`${film.filmUrl}-${index}`}
                href={film.filmUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 group relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                animate={{
                  scale: isHovered ? 1.1 : 1,
                  y: isHovered ? -12 : 0,
                  zIndex: isHovered ? 10 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {/* Shadow */}
                <div className="absolute inset-0 bg-black/15 rounded-xl blur-md translate-y-2 group-hover:translate-y-4 group-hover:blur-lg transition-all duration-300" />
                
                {/* Poster */}
                <div className="relative w-24 sm:w-28 aspect-[2/3] rounded-xl overflow-hidden bg-neutral-200 shadow-lg border border-black/10">
                  {film.posterUrl ? (
                    <Image
                      src={film.posterUrl}
                      alt={film.title}
                      fill
                      className="object-cover"
                      sizes="120px"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-300 to-neutral-400 flex items-center justify-center p-2">
                      <span className="text-xs text-center text-neutral-600 line-clamp-3">
                        {film.title}
                      </span>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2">
                    <p className="text-white text-xs font-semibold line-clamp-2 drop-shadow-lg">
                      {film.title}
                    </p>
                    {film.rating > 0 && (
                      <span className="text-amber-400 text-[10px] font-medium mt-0.5">
                        {film.rating.toFixed(1)} ★
                      </span>
                    )}
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>

      {/* Edge gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
    </div>
  );
}

