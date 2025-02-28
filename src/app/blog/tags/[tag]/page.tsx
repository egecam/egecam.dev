"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { BlogCard } from "@/components/blog/BlogCard";
import { getBlogPosts, type BlogPost } from "@/lib/contentful";

// Helper function to format tag for display
const formatTagForDisplay = (tag: string): string => {
  return tag
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function TagPage({ params }: { params: { tag: string } }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const postsPerPage = 6;

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  const displayTag = formatTagForDisplay(params.tag);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const postsData = await getBlogPosts({
          tag: displayTag,
          limit: postsPerPage,
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
  }, [displayTag]);

  // Handle infinite scroll
  useEffect(() => {
    const loadMorePosts = async () => {
      if (inView && hasMore && !loading) {
        setLoading(true);
        const nextPage = page + 1;

        try {
          const data = await getBlogPosts({
            tag: displayTag,
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
      }
    };

    loadMorePosts();
  }, [inView, hasMore, loading, page, displayTag]);

  if (loading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-sage"></div>
      </div>
    );
  }

  return (
    <div className="space-y-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-title">#{displayTag}</h1>
          <span className="text-primary/60">
            {posts.length} piece{posts.length !== 1 ? "s" : ""} of writing
          </span>
        </div>
      </motion.header>

      {/* Writing Grid */}
      <section className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post, index) => (
            <BlogCard key={post.slug} post={post} priority={index < 2} />
          ))}
        </div>

        {/* Load More Trigger */}
        <div ref={ref} className="h-10 flex items-center justify-center">
          {loading && hasMore && (
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-sage"></div>
          )}
        </div>
      </section>
    </div>
  );
}
