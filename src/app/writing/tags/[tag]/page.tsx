import { TagPageClient } from "@/components/writing";

export default async function TagPage({ params }: { params: { tag: string } }) {
  // Ensure params is fully resolved
  const resolvedParams = await Promise.resolve(params);

  return <TagPageClient tag={resolvedParams.tag} />;
}
