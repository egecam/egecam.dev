import type { Metadata } from "next";

// Default sharing message for the writing section
const sharingDescription =
  "Explore thoughts on software development, arts, and culture by Ege Çam. Check out this collection of insightful writing on egecam.dev.";

export const metadata: Metadata = {
  title: "Writing",
  description: sharingDescription,
  openGraph: {
    title: "Writing by Ege Çam",
    description: sharingDescription,
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Writing by Ege Çam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Writing by Ege Çam",
    description: sharingDescription,
    images: ["/og-image.jpg"],
  },
};

export default function WritingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
