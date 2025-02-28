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
  const shareText = `Check this post by Ege Çam — ${post.title}`;

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
                        href={`/writing/tags/${tag
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
                    )}&title=${encodeURIComponent(
                      post.title
                    )}&summary=${encodeURIComponent(post.description)}`}
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
                <ShareIcon>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      shareUrl
                    )}&quote=${encodeURIComponent(shareText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-1"
                    aria-label="Share on Facebook"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
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
                  className="play-button-container px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
                  onClick={() => {
                    const audioPlayer = document.querySelector(
                      ".rhap_play-pause-button"
                    ) as HTMLButtonElement;
                    if (audioPlayer) audioPlayer.click();
                  }}
                >
                  <span className="rhap-play-status">Play</span>
                </motion.button>
              </div>

              <AudioPlayer
                src={post.audio.url}
                autoPlayAfterSrcChange={false}
                autoPlay={false}
                showJumpControls={false}
                layout="horizontal"
                customControlsSection={[
                  RHAP_UI.CURRENT_TIME,
                  RHAP_UI.PROGRESS_BAR,
                  RHAP_UI.DURATION,
                ]}
                customProgressBarSection={[
                  RHAP_UI.MAIN_CONTROLS,
                  RHAP_UI.VOLUME_CONTROLS,
                ]}
                onLoadedMetaData={(e) => {
                  const audio = e.target as HTMLAudioElement;
                  setAudioDuration(audio.duration);
                }}
                onPlay={() => {
                  const playStatus =
                    document.querySelector(".rhap-play-status");
                  if (playStatus) playStatus.textContent = "Pause";

                  const buttonContainer = document.querySelector(
                    ".play-button-container"
                  );
                  if (buttonContainer)
                    buttonContainer.classList.add("is-playing");
                }}
                onPause={() => {
                  const playStatus =
                    document.querySelector(".rhap-play-status");
                  if (playStatus) playStatus.textContent = "Play";

                  const buttonContainer = document.querySelector(
                    ".play-button-container"
                  );
                  if (buttonContainer)
                    buttonContainer.classList.remove("is-playing");
                }}
                customIcons={{
                  play: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-8 h-8"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ),
                  pause: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-8 h-8"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ),
                  volume: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06Z" />
                      <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
                    </svg>
                  ),
                  volumeMute: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06Z" />
                    </svg>
                  ),
                }}
                className="audio-player"
              />
            </div>
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="prose prose-lg max-w-none prose-headings:font-medium prose-headings:text-primary prose-p:text-primary/90 prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-blockquote:border-accent prose-blockquote:bg-accent/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-primary/80 prose-strong:text-primary prose-code:text-accent prose-code:bg-accent/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none"
        >
          {documentToReactComponents(post.body)}
        </motion.div>

        {/* Back to All Writing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pt-8 border-t border-primary/10"
        >
          <Link
            href="/writing"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clipRule="evenodd"
              />
            </svg>
            Back to all writing
          </Link>
        </motion.div>
      </div>
    </article>
  );
}
