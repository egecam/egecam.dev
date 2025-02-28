"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getBlogPosts, type BlogPost } from "@/lib/contentful";

export default function Home() {
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const { posts } = await getBlogPosts({ limit: 2 });
        setLatestPosts(posts);
      } catch (error) {
        console.error("Error fetching latest posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPosts();
  }, []);

  return (
    <div className="space-y-32">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-title text-5xl"
        >
          Hey, I'm Ege
        </motion.h1>

        {/* Profile Picture Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="group relative w-full aspect-[16/9] max-w-4xl mx-auto"
        >
          {/* Image Container */}
          <div className="relative h-full w-full overflow-hidden rounded-lg">
            <Image
              src="/profile-picture.JPG"
              alt="Ege's profile picture"
              fill
              className="object-cover object-center scale-105 group-hover:scale-110 transition-all duration-700 ease-out"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="text-xl text-primary/80 leading-relaxed max-w-2xl"
        >
          Software developer crafting iOS apps and immersive experiences.
          Passionate about building products that enhance content consumption
          and bring structure to everyday life, blending technology with
          thoughtful design to create seamless user experiences.
        </motion.p>
      </motion.section>

      {/* Featured Projects */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-12"
      >
        <h2 className="text-2xl font-medium">Featured Projects</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Osculo */}
          <Link
            href="https://getosculo.com"
            target="_blank"
            className="group block p-6 rounded-xl bg-accent/5 hover:bg-accent/10 transition-all"
          >
            <div className="space-y-4">
              <span className="text-sm text-accent">Featured Project</span>
              <h3 className="text-2xl font-medium group-hover:text-accent transition-colors">
                Osculo
              </h3>
              <p className="text-primary/70 leading-relaxed">
                Transforming written content into immersive audio experiences
                with ElevenLabs-powered voices and real-time text tracking.
              </p>
            </div>
          </Link>

          {/* Compulse */}
          <Link
            href="https://apps.apple.com/tr/app/compulse-daily-check-track/id6737450150"
            target="_blank"
            className="group block p-6 rounded-xl bg-sage/5 hover:bg-sage/10 transition-all"
          >
            <div className="space-y-4">
              <span className="text-sm text-sage-dark">iOS App</span>
              <h3 className="text-2xl font-medium group-hover:text-sage-dark transition-colors">
                Compulse
              </h3>
              <p className="text-primary/70 leading-relaxed">
                A daily ritual keeper designed to simplify life and bring peace
                of mind through smart tracking and logging.
              </p>
            </div>
          </Link>
        </div>
      </motion.section>

      {/* Experience */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-12"
      >
        <h2 className="text-2xl font-medium">Experience</h2>

        <div className="space-y-12">
          <div className="group space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-medium group-hover:text-sage-dark transition-colors">
                Independent iOS Developer
              </h3>
              <span className="text-sm text-primary/60">2023 - Present</span>
            </div>
            <p className="text-primary/70 leading-relaxed">
              Building iOS apps focused on content consumption and productivity.
              Working with SwiftUI, SwiftData, and various Apple frameworks.
            </p>
          </div>

          <div className="group space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-medium group-hover:text-sage-dark transition-colors">
                Software Development Intern @ Türk Telekom AssisTT
              </h3>
              <span className="text-sm text-primary/60">Summer 2023</span>
            </div>
            <p className="text-primary/70 leading-relaxed">
              Worked on IVR (Interactive Voice Response) systems, gaining
              experience in Java, SQL and agile methodologies.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Latest Writing */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-12"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-medium">Latest Writing</h2>
          <Link
            href="/blog"
            className="text-sm text-accent hover:text-accent/80 transition-colors"
          >
            View all writing →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loading ? (
            <div className="col-span-2 flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
            </div>
          ) : latestPosts.length > 0 ? (
            latestPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group space-y-4"
              >
                <span className="text-sm text-primary/60">
                  {post.tags[0] || "Article"}
                </span>
                <h3 className="text-xl font-medium group-hover:text-accent transition-colors">
                  {post.title}
                </h3>
                <p className="text-primary/70 leading-relaxed">
                  {post.description}
                </p>
              </Link>
            ))
          ) : (
            <div className="col-span-2 text-center py-12 text-primary/60">
              No posts available
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
}
