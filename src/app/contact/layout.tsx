import type { Metadata } from "next";

// Default sharing message for the contact section
const sharingDescription =
  "Get in touch with Ege Çam, a Software Engineer & Creative Technologist specializing in iOS development with Swift and SwiftUI, and web development with React and Next.js.";

export const metadata: Metadata = {
  title: "Contact",
  description: sharingDescription,
  keywords: [
    "contact",
    "hire",
    "freelance",
    "iOS developer",
    "web developer",
    "Swift developer",
    "React developer",
    "get in touch",
    "software engineer",
  ],
  openGraph: {
    title: "Contact Ege Çam",
    description: sharingDescription,
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Ege Çam",
      },
    ],
    siteName: "Ege Çam",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Ege Çam",
    description: sharingDescription,
    images: ["/og-image.jpg"],
    creator: "@egecamdev",
  },
  alternates: {
    canonical: "https://egecam.dev/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
