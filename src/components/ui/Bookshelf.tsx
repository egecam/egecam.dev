"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { GoodreadsBook } from "@/app/api/goodreads/route";

interface SingleShelfProps {
  books: GoodreadsBook[];
  label: string;
  isLoading?: boolean;
}

function SingleShelf({ books, label, isLoading = false }: SingleShelfProps) {
  const [hoveredBook, setHoveredBook] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="relative">
        <p className="text-xs uppercase tracking-[0.14em] text-foreground/50 mb-2 px-2">{label}</p>
        <div className="relative h-44 rounded-xl bg-gradient-to-b from-amber-900/15 to-amber-950/25 overflow-hidden">
          <div className="absolute inset-0 flex items-end justify-center gap-3 pb-5 px-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-20 h-28 bg-foreground/10 rounded animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-b from-amber-700/60 to-amber-900/80" />
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="relative">
        <p className="text-xs uppercase tracking-[0.14em] text-foreground/50 mb-2 px-2">{label}</p>
        <div className="relative h-44 rounded-xl bg-gradient-to-b from-amber-900/15 to-amber-950/25 flex items-center justify-center">
          <p className="text-foreground/40 text-sm">Empty shelf</p>
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-b from-amber-700/60 to-amber-900/80 rounded-b-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <p className="text-xs uppercase tracking-[0.14em] text-foreground/50 mb-2 px-2">{label}</p>
      <div className="relative h-48 rounded-xl bg-gradient-to-b from-amber-900/10 via-amber-950/15 to-amber-950/25 overflow-hidden">
        {/* Wood texture overlay */}
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJ0dXJidWxlbmNlIiBiYXNlRnJlcXVlbmN5PSIwLjgiIG51bU9jdGF2ZXM9IjQiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjQiLz48L3N2Zz4=')]" />

        {/* Books container */}
        <div className="absolute inset-x-0 bottom-5 flex items-end justify-center gap-3 px-4">
          {books.slice(0, 5).map((book, index) => (
            <motion.a
              key={book.bookUrl || index}
              href={book.bookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group"
              onMouseEnter={() => setHoveredBook(index)}
              onMouseLeave={() => setHoveredBook(null)}
              animate={{
                y: hoveredBook === index ? -10 : 0,
                rotateZ: hoveredBook === index ? -2 : 0,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              style={{ zIndex: hoveredBook === index ? 10 : 1 }}
            >
              {/* Book spine shadow */}
              <div className="absolute inset-0 bg-black/25 blur-sm translate-x-1 translate-y-1 rounded" />

              {/* Book cover */}
              <div className="relative w-20 sm:w-24 aspect-[2/3] rounded overflow-hidden shadow-xl border border-black/20">
                {book.coverUrl ? (
                  <Image
                    src={book.coverUrl}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="100px"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-sage/40 to-sage/60 flex items-center justify-center p-2">
                    <span className="text-[10px] text-center text-foreground/70 line-clamp-3">
                      {book.title}
                    </span>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-200 flex items-end justify-center p-2">
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{
                      opacity: hoveredBook === index ? 1 : 0,
                      y: hoveredBook === index ? 0 : 5,
                    }}
                    className="text-white text-xs font-medium text-center line-clamp-2 drop-shadow-lg"
                  >
                    {book.title}
                  </motion.p>
                </div>
              </div>

              {/* Book spine (3D effect) */}
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-r from-black/30 to-transparent rounded-l" />
            </motion.a>
          ))}
        </div>

        {/* Shelf */}
        <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-b from-amber-700/70 to-amber-900/90 shadow-[0_-4px_15px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-amber-600/40" />
        </div>
      </div>
    </div>
  );
}

interface BookshelfProps {
  currentlyReading: GoodreadsBook[];
  readBooks: GoodreadsBook[];
  isLoading?: boolean;
}

export function Bookshelf({ currentlyReading, readBooks, isLoading = false }: BookshelfProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for subtle 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1200,
      }}
      className="space-y-4"
    >
      <SingleShelf 
        books={currentlyReading} 
        label="Currently reading" 
        isLoading={isLoading} 
      />
      <SingleShelf 
        books={readBooks} 
        label="Recently read" 
        isLoading={isLoading} 
      />
    </motion.div>
  );
}

