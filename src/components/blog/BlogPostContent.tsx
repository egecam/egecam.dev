"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import type { BlogPost } from "@/lib/contentful";
import { getOptimizedImageUrl } from "@/lib/contentful";

// Calculate reading time based on word count
const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Social share icons
const ShareIcon = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className="p-2 rounded-full bg-accent/5 hover:bg-accent/10 text-accent transition-colors cursor-pointer"
  >
    {children}
  </motion.div>
);

export function BlogPostContent({ post }: { post: BlogPost }) {
  const [readingProgress, setReadingProgress] = useState(0);
  const articleRef = useRef<HTMLElement>(null);
  const readingTime = calculateReadingTime(JSON.stringify(post.body));
  const [audioDuration, setAudioDuration] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (articleRef.current) {
        const element = articleRef.current;
        const totalHeight = element.clientHeight - window.innerHeight;
        const windowScrollTop =
          window.scrollY || document.documentElement.scrollTop;
        if (windowScrollTop === 0) {
          setReadingProgress(0);
        } else if (windowScrollTop > totalHeight) {
          setReadingProgress(100);
        } else {
          setReadingProgress((windowScrollTop / totalHeight) * 100);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Check out "${post.title}" on Ege's writing`;

  return (
    <article ref={articleRef} className="relative">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 w-full h-1 bg-background/10 z-50"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="h-full bg-accent origin-left"
          style={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </motion.div>

      <div className="space-y-12">
        {/* Header */}
        <header className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 text-sm text-primary/60">
              <time dateTime={post.publishedAt}>
                {format(new Date(post.publishedAt), "MMMM d, yyyy")}
              </time>
              <span>•</span>
              <span>{readingTime} min read</span>
              {post.audio && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
                      <path d="M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-1.5v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z" />
                    </svg>
                    <span>Listenable</span>
                  </span>
                </>
              )}
            </div>

            <h1 className="text-4xl font-title">{post.title}</h1>
            <p className="text-xl text-primary/80 max-w-2xl">
              {post.description}
            </p>

            {/* Author and Share Section */}
            <div className="flex items-center justify-between pt-4 border-t border-primary/10">
              <div className="space-y-4">
                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden">
                    <Image
                      src="/profile-picture.JPG"
                      alt="Ege's profile picture"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">Ege Çam</h3>
                  </div>
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog/tags/${tag
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="px-3 py-1 text-sm rounded-full bg-sage/5 hover:bg-sage/10 text-sage-dark transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Social Share */}
              <div className="flex items-center gap-3">
                <ShareIcon>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      shareText
                    )}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-1"
                    aria-label="Share on Twitter"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                </ShareIcon>
                <ShareIcon>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      shareUrl
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-1"
                    aria-label="Share on LinkedIn"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                    </svg>
                  </a>
                </ShareIcon>
              </div>
            </div>
          </motion.div>

          {/* Featured Image */}
          {post.media?.[0] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative aspect-[21/9] w-full overflow-hidden rounded-lg"
            >
              <Image
                src={getOptimizedImageUrl(post.media[0].url, {
                  width: 1200,
                  height: 630,
                })}
                alt={post.media[0].title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </motion.div>
          )}
        </header>

        {/* Audio Player */}
        {post.audio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="sticky top-4 z-40"
          >
            <div className="bg-background/80 backdrop-blur-lg rounded-2xl shadow-lg border border-accent/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-accent/10 flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium text-lg">
                    Listen to this article
                  </h3>
                  <p className="text-sm text-primary/60 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M8 4a4 4 0 1 0 8 0 4 4 0 0 0-8 0ZM16 8a6.97 6.97 0 0 1-2.577 5.423l1.599 1.599a.75.75 0 0 1-1.06 1.06l-1.599-1.598A6.97 6.97 0 0 1 7.16 17H5.75a.75.75 0 0 1 0-1.5h1.41a5.5 5.5 0 1 0 0-11H5.75a.75.75 0 0 1 0-1.5h1.41c1.96 0 3.729.81 5.002 2.109l1.599-1.598a.75.75 0 0 1 1.06 1.06L13.223 6.17A6.97 6.97 0 0 1 16 8Z" />
                    </svg>
                    {audioDuration
                      ? `${Math.ceil(audioDuration / 60)} min listening time`
                      : "Loading duration..."}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
                  onClick={() => {
                    const audioElement = document.querySelector(
                      ".rhap_play-pause-button"
                    ) as HTMLButtonElement;
                    if (audioElement) audioElement.click();
                  }}
                >
                  Start Listening
                </motion.button>
              </div>

              <AudioPlayer
                src={post.audio.url}
                onLoadedMetaData={(e: Event) => {
                  const audio = e.target as HTMLAudioElement;
                  setAudioDuration(audio.duration);
                }}
                className="
                  [&_.rhap_container]:bg-transparent [&_.rhap_container]:shadow-none [&_.rhap_container]:p-4
                  [&_.rhap_progress-bar]:bg-accent/10 
                  [&_.rhap_progress-filled]:bg-accent 
                  [&_.rhap_progress-indicator]:bg-accent [&_.rhap_progress-indicator]:shadow-lg [&_.rhap_progress-indicator]:scale-125
                  [&_.rhap_button-clear]:text-accent [&_.rhap_button-clear]:hover:text-accent/80
                  [&_.rhap_time]:text-primary/60
                  [&_.rhap_volume-bar]:bg-accent/10
                  [&_.rhap_volume-filled]:bg-accent
                  [&_.rhap_volume-indicator]:hidden
                "
                autoPlayAfterSrcChange={false}
                customProgressBarSection={[
                  RHAP_UI.CURRENT_TIME,
                  RHAP_UI.PROGRESS_BAR,
                  RHAP_UI.DURATION,
                ]}
                customControlsSection={[
                  RHAP_UI.MAIN_CONTROLS,
                  RHAP_UI.VOLUME_CONTROLS,
                ]}
                showSkipControls={false}
                showJumpControls={false}
                layout="horizontal"
              />
            </div>
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="prose prose-lg  max-w-none"
        >
          {documentToReactComponents(post.body)}
        </motion.div>

        {/* Newsletter CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="my-16 p-8 rounded-xl bg-accent/5"
        >
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h3 className="text-2xl font-medium">Enjoyed this post?</h3>
            <p className="text-primary/80">
              Subscribe to my newsletter to get notified about new writing and
              projects.
            </p>
            <form className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2 rounded-lg bg-background border border-accent/20 focus:border-accent focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </motion.section>
      </div>
    </article>
  );
}
