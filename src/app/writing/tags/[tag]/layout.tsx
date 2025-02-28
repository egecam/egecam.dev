import type { Metadata, ResolvingMetadata } from "next";

// Helper function to format tag for display
const formatTagForDisplay = (tag?: string): string => {
  if (!tag) return "Tag";

  return tag
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

type Props = {
  params: { tag: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Ensure params is fully resolved
  const resolvedParams = await Promise.resolve(params);
  const tagValue = resolvedParams.tag;

  const displayTag = formatTagForDisplay(tagValue);
  const originalTag = tagValue || "Tag";

  return {
    title: `#${originalTag} - Writing`,
    description: `Explore articles tagged with #${originalTag} by Ege Çam`,
    openGraph: {
      title: `#${originalTag} - Writing by Ege Çam`,
      description: `Explore articles tagged with #${originalTag} by Ege Çam`,
      type: "website",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `#${originalTag} - Writing by Ege Çam`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `#${originalTag} - Writing by Ege Çam`,
      description: `Explore articles tagged with #${originalTag} by Ege Çam`,
      images: ["/og-image.jpg"],
    },
  };
}

export default function TagLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
