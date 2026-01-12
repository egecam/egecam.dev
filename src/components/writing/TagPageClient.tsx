"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import Link from "next/link";
import { BlogCard } from "@/components/writing/BlogCard";
import { getBlogPosts, type BlogPost } from "@/lib/contentful";

// Helper function to format tag for display
const formatTagForDisplay = (tag?: string): string => {
  if (!tag) return "Tag";

  return tag
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Convert kebab-case tag from URL to the original format with spaces
const convertTagForQuery = (tag: string): string => {
  // First format it with proper capitalization
  return formatTagForDisplay(tag);
};

interface TagPageClientProps {
  tag: string;
}

export default function TagPageClient({ tag }: TagPageClientProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const postsPerPage = 6;

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  const displayTag = formatTagForDisplay(tag);
  const queryTag = convertTagForQuery(tag);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!tag) {
        setLoading(false);
        return;
      }

      console.log("Fetching posts for tag:", tag);
      console.log("Using query tag:", queryTag);

      try {
        const postsData = await getBlogPosts({
          tag: queryTag,
          limit: postsPerPage,
        });

        console.log("Posts data received:", {
          total: postsData.total,
          postsCount: postsData.posts.length,
          firstPostTags: postsData.posts[0]?.tags,
        });

        setPosts(postsData.posts);
        setHasMore(postsData.total > postsPerPage);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [tag, queryTag]);

  // Handle infinite scroll
  useEffect(() => {
    const loadMorePosts = async () => {
      if (!tag || !inView || !hasMore || loading) {
        return;
      }

      setLoading(true);
      const nextPage = page + 1;

      try {
        const data = await getBlogPosts({
          tag: queryTag,
          skip: nextPage * postsPerPage,
          limit: postsPerPage,
        });

        if (data.posts.length > 0) {
          setPosts((prev) => [...prev, ...data.posts]);
          setHasMore(data.total > (nextPage + 1) * postsPerPage);
          setPage(nextPage);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching more posts:", error);
      }

      setLoading(false);
    };

    loadMorePosts();
  }, [inView, hasMore, loading, page, tag, queryTag]);

  if (loading && posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          <p className="mt-4 text-foreground/80">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 md:space-y-16">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h1 className="text-4xl sm:text-5xl font-display tracking-display text-foreground">
          #{displayTag}
        </h1>
        <p className="text-subtitle text-foreground/80 max-w-2xl">
          Explore articles tagged with #{displayTag}
        </p>
      </motion.header>

      {posts.length > 0 ? (
        <>
          <div className="space-y-6">
            {posts.map((post, index) => (
              <BlogCard key={post.slug} post={post} priority={index < 6} />
            ))}
          </div>

          {/* Load more trigger */}
          {hasMore && (
            <div ref={ref} className="h-10 flex items-center justify-center">
              {loading && (
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-accent"></div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-foreground/60">
            No posts found for this tag.
          </p>
        </div>
      )}

      <div className="mt-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
    </div>
  );
}
