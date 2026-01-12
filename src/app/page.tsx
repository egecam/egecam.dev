"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getBlogPosts, type BlogPost } from "@/lib/contentful";
import type { GoodreadsBook } from "./api/goodreads/route";
import type { LetterboxdFilm } from "./api/letterboxd/route";
import { DESIGN_TOKENS } from "./page.constants";
import {
  MediaCard,
  MediaGrid,
  HistorySection,
  SectionHeader,
  SubsectionLabel,
} from "./page.components";
import { TypewriterText } from "@/components/ui/AnimatedText";
import { NowSection } from "@/components/ui/NowSection";
import { Bookshelf } from "@/components/ui/Bookshelf";
import { PosterBoard, PosterStrip } from "@/components/ui/PosterBoard";

export default function Home() {
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentlyReading, setCurrentlyReading] = useState<GoodreadsBook[]>([]);
  const [readBooks, setReadBooks] = useState<GoodreadsBook[]>([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [films, setFilms] = useState<LetterboxdFilm[]>([]);
  const [filmsLoading, setFilmsLoading] = useState(true);
  const [filmsHistoryOpen, setFilmsHistoryOpen] = useState(false);
  const [filmsHistoryLoading, setFilmsHistoryLoading] = useState(true);
  const [favouriteFilms, setFavouriteFilms] = useState<LetterboxdFilm[]>([]);
  const [favouriteFilmsLoading, setFavouriteFilmsLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const { posts } = await getBlogPosts({ limit: 3 });
        setLatestPosts(posts);
      } catch (error) {
        console.error("Error fetching latest posts:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCurrentlyReading = async () => {
      try {
        const response = await fetch("/api/goodreads?shelf=currently-reading");
        const data = await response.json();
        if (data.books) {
          setCurrentlyReading(data.books);
        }
      } catch (error) {
        console.error("Error fetching Goodreads data:", error);
      } finally {
        setBooksLoading(false);
      }
    };

    const fetchReadBooks = async () => {
      try {
        const response = await fetch("/api/goodreads?shelf=read");
        const data = await response.json();
        if (data.books) {
          setReadBooks(data.books);
        }
      } catch (error) {
        console.error("Error fetching read books:", error);
      } finally {
        setHistoryLoading(false);
      }
    };

    const fetchFilms = async () => {
      try {
        const response = await fetch("/api/letterboxd");
        const data = await response.json();
        if (data.films) {
          setFilms(data.films);
        }
      } catch (error) {
        console.error("Error fetching Letterboxd data:", error);
      } finally {
        setFilmsLoading(false);
        setFilmsHistoryLoading(false);
      }
    };

    const fetchFavouriteFilms = async () => {
      try {
        const response = await fetch("/api/letterboxd/favourites");
        const data = await response.json();
        if (data.films) {
          setFavouriteFilms(data.films);
        }
      } catch (error) {
        console.error("Error fetching favourite films:", error);
      } finally {
        setFavouriteFilmsLoading(false);
      }
    };

    fetchLatest();
    fetchCurrentlyReading();
    fetchReadBooks();
    fetchFilms();
    fetchFavouriteFilms();
  }, []);
  return (
    <div className={DESIGN_TOKENS.spacing.container}>
      <motion.section
        {...DESIGN_TOKENS.animation.section}
        className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-black/10 bg-background-alt px-4 py-6 sm:px-6 sm:py-8 md:px-7 md:py-10 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-white to-sage/5 pointer-events-none" />
        <div className="relative space-y-4 sm:space-y-5 md:space-y-6 max-w-3xl pr-20 sm:pr-24 md:pr-0">
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[3.6rem] leading-[1.1] sm:leading-[1.08] md:leading-[1.05] tracking-display text-foreground">
            Creating calm, expressive digital experiences.
          </h1>
          <TypewriterText
            text="I build mobile and web products that sound, feel, and move with intention. Currently focused on audio-first storytelling and thoughtful digital tools."
            className="text-sm sm:text-subtitle text-foreground/80 leading-relaxed max-w-2xl"
            speed={20}
            delay={800}
          />
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Link
              href="/projects"
              className="rounded-full bg-accent px-4 py-2 text-xs sm:text-sm font-semibold text-background transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/70"
            >
              View projects
            </Link>
            <Link
              href="/writing"
              className="rounded-full border border-black/10 bg-background px-4 py-2 text-xs sm:text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/70"
            >
              Read writing
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-black/10 px-4 py-2 text-xs sm:text-sm font-semibold text-foreground/70 transition hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/70"
            >
              Say hello
            </Link>
          </div>
        </div>

        {/* Character Images */}
        <div className="absolute bottom-0 right-0 pointer-events-auto opacity-60 sm:opacity-100">
          <div className="relative w-16 h-20 sm:w-24 sm:h-32 md:w-32 md:h-40 lg:w-40 lg:h-52 cursor-pointer">
            <Image
              src="/charc1.PNG"
              alt=""
              fill
              className="object-contain object-bottom-right transition-opacity duration-300 group-hover:opacity-0"
              sizes="(max-width: 640px) 64px, (max-width: 768px) 96px, (max-width: 1024px) 128px, 160px"
              priority
            />
            <Image
              src="/charc2.PNG"
              alt=""
              fill
              className="object-contain object-bottom-right absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              sizes="(max-width: 640px) 64px, (max-width: 768px) 96px, (max-width: 1024px) 128px, 160px"
            />
          </div>
        </div>
      </motion.section>

      {/* Now Section */}
      <NowSection />

      <motion.section
        {...DESIGN_TOKENS.animation.section}
        className={DESIGN_TOKENS.spacing.section}
      >
        <SectionHeader
          title="Music for Media"
          rightContent={
            <span className="text-sm text-foreground/70">music.egecam.dev</span>
          }
        />
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Portfolio Website */}
            <Link
              href="https://music.egecam.dev"
              target="_blank"
              rel="noreferrer"
              className="group relative block overflow-hidden rounded-3xl border border-black/10"
            >
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src="/music-for-media.webp"
                  alt="Music for Media portfolio website"
                  fill
                  className="object-cover object-center transition-transform duration-700 ease-out will-change-transform group-hover:scale-[1.02]"
                  priority
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/15 to-transparent" />
              <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between text-background">
                <div className="flex items-center gap-2 text-sm sm:text-base font-semibold">
                  <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_rgba(255,106,61,0.8)]" />
                  <span>Portfolio Website</span>
                </div>
                <span className="text-xs sm:text-sm opacity-80">Visit →</span>
              </div>
            </Link>

            {/* Minigame Sneak Peek */}
            <Link
              href="/demo"
              className="group relative block overflow-hidden rounded-3xl border border-black/10"
            >
              <div className="relative aspect-square w-full bg-gradient-to-br from-[#0D3B66] via-[#1B4F72] to-[#20B2AA]">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                  <div
                    className="absolute top-10 left-8 text-4xl opacity-20 animate-bounce"
                    style={{ animationDelay: "0s" }}
                  >
                    🐟
                  </div>
                  <div
                    className="absolute top-20 right-12 text-3xl opacity-20 animate-bounce"
                    style={{ animationDelay: "0.5s" }}
                  >
                    🌴
                  </div>
                  <div
                    className="absolute bottom-20 left-12 text-3xl opacity-20 animate-bounce"
                    style={{ animationDelay: "1s" }}
                  >
                    🚤
                  </div>
                  <div
                    className="absolute bottom-10 right-8 text-4xl opacity-20 animate-bounce"
                    style={{ animationDelay: "1.5s" }}
                  >
                    🎣
                  </div>
                </div>

                {/* Title overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <h4 className="text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-2xl">
                    <span className="bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FF6B6B] bg-clip-text text-transparent">
                      Flip Flop
                    </span>
                  </h4>
                  <p className="text-sm sm:text-base text-white/80 mb-4">
                    A Cozy Fishing Experience
                  </p>
                  <p className="text-xs text-white/60">
                    🎵 Interactive Minigame
                  </p>
                </div>

                {/* Gradient overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />

                {/* Visit indicator */}
                <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between text-background">
                  <div className="flex items-center gap-2 text-sm sm:text-base font-semibold">
                    <span className="h-2 w-2 rounded-full bg-[#20B2AA] shadow-[0_0_12px_rgba(32,178,170,0.8)]" />
                    <span>Interactive Minigame</span>
                  </div>
                  <span className="text-xs sm:text-sm opacity-80">Play →</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </motion.section>

      <motion.section
        {...DESIGN_TOKENS.animation.section}
        className="flex flex-col gap-4 -mt-2"
      >
        <SectionHeader
          title="Photography"
          rightContent={
            <span className="text-sm text-foreground/70">photo.egecam.dev</span>
          }
        />
        <a
          href="https://photo.egecam.dev"
          target="_blank"
          rel="noreferrer"
          className="group relative block overflow-hidden rounded-3xl border border-black/10"
        >
          <div className="relative aspect-[21/9] w-full">
            <Image
              src="/photos.jpg"
              alt="Photography preview"
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
              priority
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
          <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between text-background">
            <div className="flex items-center gap-2 text-sm sm:text-base font-semibold">
              <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_rgba(255,106,61,0.8)]" />
              <span>Photography</span>
            </div>
            <span className="text-xs sm:text-sm opacity-80">Visit →</span>
          </div>
        </a>
      </motion.section>

      <motion.section
        {...DESIGN_TOKENS.animation.section}
        className={DESIGN_TOKENS.spacing.section}
      >
        <SectionHeader title="Writing" link="/writing" linkText="View all →" />
        <div className={DESIGN_TOKENS.grid.writingGrid}>
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-3xl border border-black/10 bg-background px-5 py-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
              >
                <div className="h-4 w-24 overflow-hidden rounded bg-background-alt">
                  <span className="block h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
                <div className="mt-4 h-6 w-3/4 overflow-hidden rounded bg-background-alt">
                  <span className="block h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
                <div className="mt-3 h-4 w-full overflow-hidden rounded bg-background-alt">
                  <span className="block h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
              </div>
            ))
          ) : latestPosts.length > 0 ? (
            latestPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/writing/${post.slug}`}
                className={DESIGN_TOKENS.card.writingCard}
              >
                <p className="text-xs uppercase tracking-[0.14em] text-foreground/60">
                  {post.tags?.[0] || "Article"}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
                  {post.title}
                </h3>
                <p className="mt-2 text-foreground/75 leading-relaxed">
                  {post.description}
                </p>
              </Link>
            ))
          ) : (
            <div className="md:col-span-3 rounded-3xl border border-black/10 bg-background px-5 py-8 text-center text-foreground/70 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
              No posts available yet — new writing soon.
            </div>
          )}
        </div>
      </motion.section>

      <motion.section
        {...DESIGN_TOKENS.animation.section}
        className={DESIGN_TOKENS.spacing.section}
      >
        <SectionHeader title="Films" />
        <div className={DESIGN_TOKENS.spacing.subsection}>
          <SubsectionLabel text="Favourites" />
          <PosterBoard
            films={favouriteFilms}
            isLoading={favouriteFilmsLoading}
            maxItems={4}
          />
        </div>
        <div className={DESIGN_TOKENS.spacing.subsection}>
          <SubsectionLabel text="Watch history" variant="muted" />
          <PosterStrip films={films} isLoading={filmsLoading} maxItems={10} />
        </div>
        <div className="flex justify-end">
          <a
            href="https://letterboxd.com/egecam/"
            target="_blank"
            rel="noopener noreferrer"
            className={DESIGN_TOKENS.typography.externalLink}
          >
            View on Letterboxd →
          </a>
        </div>
      </motion.section>

      <motion.section
        {...DESIGN_TOKENS.animation.section}
        className={DESIGN_TOKENS.spacing.section}
      >
        <SectionHeader title="Reading" />
        <Bookshelf
          currentlyReading={currentlyReading}
          readBooks={readBooks}
          isLoading={booksLoading || historyLoading}
        />
        <div className="flex justify-end">
          <a
            href="https://www.goodreads.com/review/list/119304187-ege-am"
            target="_blank"
            rel="noopener noreferrer"
            className={DESIGN_TOKENS.typography.externalLink}
          >
            View on Goodreads →
          </a>
        </div>
      </motion.section>
    </div>
  );
}
