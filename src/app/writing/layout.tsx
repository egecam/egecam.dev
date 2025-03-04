import type { Metadata } from "next";

// Default sharing message for the writing section
const sharingDescription =
  "Explore thoughts on software development, iOS apps, web technologies, arts, and culture by Ege Çam. Dive into articles about Swift, SwiftUI, React, Next.js, and creative technology.";

export const metadata: Metadata = {
  title: "Writing",
  description: sharingDescription,
  keywords: [
    "blog",
    "articles",
    "software development",
    "iOS development",
    "web development",
    "Swift",
    "SwiftUI",
    "React",
    "Next.js",
    "creative technology",
    "indie dev",
  ],
  openGraph: {
    title: "Writing by Ege Çam",
    description: sharingDescription,
    type: "article",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Writing by Ege Çam",
      },
    ],
    siteName: "Ege Çam",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Writing by Ege Çam",
    description: sharingDescription,
    images: ["/og-image.jpg"],
    creator: "@egecam",
  },
  alternates: {
    canonical: "https://egecam.dev/writing",
    types: {
      "application/rss+xml": "https://egecam.dev/rss.xml",
    },
  },
};

export default function WritingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
