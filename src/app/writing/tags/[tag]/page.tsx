import { TagPageClient } from "@/components/writing";

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  // Resolve params since it's a Promise
  const resolvedParams = await params;

  return <TagPageClient tag={resolvedParams.tag} />;
}
