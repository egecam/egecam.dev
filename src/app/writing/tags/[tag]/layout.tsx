import type { Metadata } from "next";

// Helper function to format tag for display
const formatTagForDisplay = (tag?: string): string => {
  if (!tag) return "Tag";

  return tag
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

type Props = {
  params: Promise<{ tag: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Resolve params since it's a Promise
  const resolvedParams = await params;
  const tagValue = resolvedParams.tag;

  const displayTag = formatTagForDisplay(tagValue);
  const originalTag = tagValue || "Tag";

  // Create a description that includes both the original tag and the formatted display tag
  const description = `Explore articles tagged with #${displayTag} by Ege Çam. Browse content related to ${displayTag} in software development, iOS apps, web technologies, and creative technology.`;

  return {
    title: `#${displayTag} - Writing`,
    description: description,
    keywords: [
      originalTag,
      displayTag,
      "blog",
      "articles",
      "software development",
      "iOS development",
      "web development",
    ],
    openGraph: {
      title: `#${displayTag} - Writing by Ege Çam`,
      description: description,
      type: "website",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `#${displayTag} - Writing by Ege Çam`,
        },
      ],
      siteName: "Ege Çam",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `#${displayTag} - Writing by Ege Çam`,
      description: description,
      images: ["/og-image.jpg"],
      creator: "@egecam",
    },
    alternates: {
      canonical: `https://egecam.dev/writing/tags/${originalTag}`,
    },
  };
}

export default function TagLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
