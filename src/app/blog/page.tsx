"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { BlogCard } from "@/components/blog/BlogCard";
import { getBlogPosts, getAllTags, type BlogPost } from "@/lib/contentful";

// Add this skeleton component at the top of the file
const BlogCardSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-primary/5" />
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="h-4 w-24 rounded bg-primary/5" />
      </div>
      <div className="h-7 w-3/4 rounded bg-primary/5" />
      <div className="h-4 w-full rounded bg-primary/5" />
      <div className="h-4 w-2/3 rounded bg-primary/5" />
    </div>
    <div className="flex gap-2 pt-2">
      <div className="h-6 w-16 rounded-full bg-primary/5" />
      <div className="h-6 w-20 rounded-full bg-primary/5" />
    </div>
  </div>
);

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const postsPerPage = 6;

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [postsData, tagsData, featuredData] = await Promise.all([
          getBlogPosts({ limit: postsPerPage }),
          getAllTags(),
          getBlogPosts({ featured: true, limit: 2 }),
        ]);

        setPosts(postsData.posts);
        setTags(tagsData);
        setFeaturedPosts(featuredData.posts);
        setHasMore(postsData.total > postsPerPage);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Handle infinite scroll
  useEffect(() => {
    const loadMorePosts = async () => {
      if (inView && hasMore && !loading) {
        setLoading(true);
        const nextPage = page + 1;

        try {
          const data = await getBlogPosts({
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
  }, [inView, hasMore, loading, page]);

  if (loading && posts.length === 0) {
    return (
      <div className="space-y-24">
        {/* Header Skeleton */}
        <div className="space-y-4 animate-pulse">
          <div className="h-12 w-32 rounded bg-primary/5" />
          <div className="h-8 w-2/3 max-w-2xl rounded bg-primary/5" />
        </div>

        {/* Featured Posts Skeleton */}
        <section className="space-y-8">
          <div className="h-8 w-48 rounded bg-primary/5" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <BlogCardSkeleton />
            <BlogCardSkeleton />
          </div>
        </section>

        {/* Topics Skeleton */}
        <section className="space-y-4">
          <div className="h-8 w-32 rounded bg-primary/5" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-24 rounded-lg bg-primary/5" />
            ))}
          </div>
        </section>

        {/* All Posts Skeleton */}
        <section className="space-y-8">
          <div className="h-8 w-40 rounded bg-primary/5" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <BlogCardSkeleton />
            <BlogCardSkeleton />
            <BlogCardSkeleton />
            <BlogCardSkeleton />
          </div>
        </section>
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
        <h1 className="text-4xl font-title">Writing</h1>
        <p className="text-xl text-primary/80 max-w-2xl">
          Thoughts on software development, arts, and culture.
        </p>
      </motion.header>

      {/* Featured Writing */}
      {featuredPosts.length > 0 && (
        <section className="space-y-8">
          <h2 className="text-2xl font-medium">Featured Writing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredPosts.map((post, index) => (
              <BlogCard key={post.slug} post={post} priority={index < 2} />
            ))}
          </div>
        </section>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-medium">Topics</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <a
                key={tag.id}
                href={`/blog/tags/${tag.id}`}
                className="px-4 py-2 rounded-lg bg-accent/5 hover:bg-accent/10 text-accent transition-colors"
              >
                {tag.name}
              </a>
            ))}
          </div>
        </motion.section>
      )}

      {/* All Writing */}
      <section className="space-y-8">
        <h2 className="text-2xl font-medium">All Writing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        {/* Load More Trigger */}
        <div ref={ref} className="h-10 flex items-center justify-center">
          {loading && hasMore && (
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-accent"></div>
          )}
        </div>
      </section>
    </div>
  );
}
