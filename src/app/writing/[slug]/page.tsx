import { getBlogPostBySlug } from "@/lib/contentful";
import { BlogPostContent } from "@/components/writing/BlogPostContent";
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import { getOptimizedImageUrl } from "@/lib/contentful";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Resolve params since it's a Promise
  const resolvedParams = await params;

  // Fetch the post
  try {
    const post = await getBlogPostBySlug(resolvedParams.slug);

    if (!post) {
      return {
        title: "Post Not Found",
        description: "The requested blog post could not be found.",
      };
    }

    // Get the featured image if available
    const featuredImage = post.media?.[0]?.url
      ? getOptimizedImageUrl(post.media[0].url, { width: 1200, height: 630 })
      : "/og-image.jpg";

    // Default sharing message
    const sharingDescription = `Check out "${post.title}" by Ege Çam. ${post.description}`;

    // Format the date for structured data
    const publishDate = new Date(post.publishedAt).toISOString();

    return {
      title: post.title,
      description: sharingDescription,
      keywords: [
        ...post.tags,
        "blog",
        "article",
        "software development",
        "iOS development",
        "web development",
      ],
      openGraph: {
        title: post.title,
        description: sharingDescription,
        type: "article",
        publishedTime: post.publishedAt,
        authors: ["Ege Çam"],
        tags: post.tags,
        images: [
          {
            url: featuredImage,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
        siteName: "Ege Çam",
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: sharingDescription,
        images: [featuredImage],
        creator: "@egecam",
      },
      alternates: {
        canonical: `https://egecam.dev/writing/${resolvedParams.slug}`,
      },
      // Add structured data for articles
      other: {
        "script:ld+json": JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          image: featuredImage,
          datePublished: publishDate,
          dateModified: publishDate,
          author: {
            "@type": "Person",
            name: "Ege Çam",
            url: "https://egecam.dev",
          },
          publisher: {
            "@type": "Person",
            name: "Ege Çam",
            url: "https://egecam.dev",
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://egecam.dev/writing/${resolvedParams.slug}`,
          },
          keywords: post.tags.join(", "),
        }),
      },
    };
  } catch (error) {
    console.error(
      `Error generating metadata for slug ${resolvedParams.slug}:`,
      error
    );
    return {
      title: "Error Loading Post",
      description: "There was an error loading this blog post.",
    };
  }
}

export default async function WritingPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Resolve params since it's a Promise
  const resolvedParams = await params;

  if (!resolvedParams?.slug) {
    console.error("No slug provided in params");
    notFound();
  }

  try {
    const post = await getBlogPostBySlug(resolvedParams.slug);

    if (!post) {
      console.log(`No post found with slug: ${resolvedParams.slug}`);
      notFound();
    }

    return <BlogPostContent post={post} />;
  } catch (error) {
    console.error(
      `Error fetching post with slug ${resolvedParams.slug}:`,
      error
    );
    notFound();
  }
}
