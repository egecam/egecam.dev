import { MetadataRoute } from 'next';
import { getBlogPosts } from '@/lib/contentful';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all blog posts
  const { posts } = await getBlogPosts({ limit: 100 });
  
  // Create sitemap entries for blog posts
  const blogEntries = posts.map((post) => ({
    url: `https://egecam.dev/writing/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Get all unique tags
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));
  
  // Create sitemap entries for tag pages
  const tagEntries = allTags.map((tag) => ({
    url: `https://egecam.dev/writing/tags/${tag.toLowerCase().replace(/\s+/g, "-")}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Static routes
  const routes = [
    {
      url: 'https://egecam.dev',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1.0,
    },
    {
      url: 'https://egecam.dev/projects',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: 'https://egecam.dev/writing',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: 'https://egecam.dev/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  return [...routes, ...blogEntries, ...tagEntries];
} 