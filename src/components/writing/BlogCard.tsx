import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { format } from "date-fns";
import type { BlogPost } from "@/lib/contentful";
import { getOptimizedImageUrl } from "@/lib/contentful";

interface BlogCardProps {
  post: BlogPost;
  priority?: boolean;
}

export function BlogCard({ post, priority = false }: BlogCardProps) {
  const thumbnail = post.media?.[0];
  const hasAudio = !!post.audio;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Link
        href={`/writing/${post.slug}`}
        className="flex flex-col md:flex-row rounded-3xl border border-black/10 bg-background overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(0,0,0,0.14)]"
      >
        {thumbnail && (
          <div className="relative w-full md:w-80 md:min-w-[320px] aspect-[16/9] md:aspect-auto md:h-auto overflow-hidden">
            <Image
              src={getOptimizedImageUrl(thumbnail.url, {
                width: 800,
                height: 450,
              })}
              alt={thumbnail.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] will-change-transform"
              sizes="(max-width: 768px) 100vw, 320px"
              priority={priority}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent md:bg-gradient-to-r md:from-black/20 md:via-transparent" />
          </div>
        )}

        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Meta information */}
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-foreground/60">
              <time dateTime={post.publishedAt}>
                {format(new Date(post.publishedAt), "MMM d, yyyy")}
              </time>
              {hasAudio && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-3.5 w-3.5"
                    >
                      <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
                      <path d="M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-1.5v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z" />
                    </svg>
                    <span>Listenable</span>
                  </span>
                </>
              )}
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-garamond font-bold text-foreground group-hover:text-accent transition-colors leading-tight">
              {post.title}
            </h2>

            {/* Description */}
            <p className="text-foreground/75 leading-relaxed line-clamp-2 md:line-clamp-3">
              {post.description}
            </p>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-black/5">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/writing/tags/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-1 text-xs rounded-full bg-accent/5 hover:bg-accent/10 text-accent transition-colors font-medium"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
