import { getBlogPostBySlug } from "@/lib/contentful";
import { BlogPostContent } from "@/components/writing/BlogPostContent";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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
