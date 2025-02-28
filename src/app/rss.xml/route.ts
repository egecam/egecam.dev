import { getBlogPosts } from '@/lib/contentful';
import { NextResponse } from 'next/server';

export async function GET() {
  const { posts } = await getBlogPosts({ limit: 100 });
  
  // Format the current date for the RSS feed
  const now = new Date();
  const dateString = now.toUTCString();
  
  // Build the RSS XML
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ege Çam's Blog</title>
    <link>https://egecam.dev/writing</link>
    <description>Thoughts on software development, iOS apps, web technologies, arts, and culture by Ege Çam.</description>
    <language>en-us</language>
    <lastBuildDate>${dateString}</lastBuildDate>
    <atom:link href="https://egecam.dev/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (post) => `
    <item>
      <title>${post.title}</title>
      <link>https://egecam.dev/writing/${post.slug}</link>
      <description>${post.description}</description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <guid>https://egecam.dev/writing/${post.slug}</guid>
      ${post.tags.map((tag) => `<category>${tag}</category>`).join('')}
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  // Return the RSS feed with the appropriate content type
  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
} 