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
      <div className="space-y-4">
        <Link href={`/blog/${post.slug}`} className="block space-y-4">
          {thumbnail && (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
              <Image
                src={getOptimizedImageUrl(thumbnail.url, {
                  width: 800,
                  height: 450,
                })}
                alt={thumbnail.title}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                priority={priority}
              />
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm text-primary/60">
              <time dateTime={post.publishedAt}>
                {format(new Date(post.publishedAt), "MMMM d, yyyy")}
              </time>
              {hasAudio && (
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

            <h2 className="text-xl font-medium group-hover:text-accent transition-colors">
              {post.title}
            </h2>

            <p className="text-primary/70 leading-relaxed">
              {post.description}
            </p>
          </div>
        </Link>

        {/* Tags - Outside of the main link to be independently clickable */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tags/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                className="px-3 py-1 text-sm rounded-full bg-sage/5 hover:bg-sage/10 text-sage-dark transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}
