import { getBlogPostBySlug } from "@/lib/contentful";
import { BlogPostContent } from "@/components/writing/BlogPostContent";
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import { getOptimizedImageUrl } from "@/lib/contentful";

export const dynamic = "force-dynamic";

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Fetch the post
  try {
    const post = await getBlogPostBySlug(params.slug);

    if (!post) {
      return {
        title: "Post Not Found",
      };
    }

    // Get the featured image if available
    const featuredImage = post.media?.[0]?.url
      ? getOptimizedImageUrl(post.media[0].url, { width: 1200, height: 630 })
      : "/og-image.jpg";

    // Default sharing message
    const sharingDescription = `Check out "${post.title}" by Ege Çam. ${post.description}`;

    return {
      title: post.title,
      description: sharingDescription,
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
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: sharingDescription,
        images: [featuredImage],
      },
    };
  } catch (error) {
    console.error(`Error generating metadata for slug ${params.slug}:`, error);
    return {
      title: "Error Loading Post",
    };
  }
}

export default async function WritingPostPage({
  params,
}: {
  params: { slug: string };
}) {
  if (!params?.slug) {
    console.error("No slug provided in params");
    notFound();
  }

  try {
    const post = await getBlogPostBySlug(params.slug);

    if (!post) {
      console.log(`No post found with slug: ${params.slug}`);
      notFound();
    }

    return <BlogPostContent post={post} />;
  } catch (error) {
    console.error(`Error fetching post with slug ${params.slug}:`, error);
    notFound();
  }
}
