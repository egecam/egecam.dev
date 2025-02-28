import type { Metadata } from "next";

// Default sharing message for the projects section
const sharingDescription =
  "Explore innovative software projects by Ege Çam, including iOS apps built with Swift and SwiftUI, web applications using React and Next.js, and other creative technology solutions.";

export const metadata: Metadata = {
  title: "Projects",
  description: sharingDescription,
  keywords: [
    "iOS apps",
    "mobile development",
    "web applications",
    "Swift",
    "SwiftUI",
    "React",
    "Next.js",
    "portfolio",
    "software projects",
    "indie dev",
    "creative technology",
  ],
  openGraph: {
    title: "Projects by Ege Çam",
    description: sharingDescription,
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Projects by Ege Çam",
      },
    ],
    siteName: "Ege Çam",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects by Ege Çam",
    description: sharingDescription,
    images: ["/og-image.jpg"],
    creator: "@egecam",
  },
  alternates: {
    canonical: "https://egecam.dev/projects",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
