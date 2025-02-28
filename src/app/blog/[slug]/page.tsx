import { getBlogPostBySlug } from "@/lib/contentful";
import { BlogPostContent } from "@/components/blog/BlogPostContent";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: PageProps) {
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
