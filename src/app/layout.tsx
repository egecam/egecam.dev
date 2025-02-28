import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const bluuNext = localFont({
  src: [
    {
      path: "../fonts/BluuNext-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-bluu-next",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Ege Çam",
    template: "%s | Ege Çam",
  },
  description:
    "Software engineer and creative technologist passionate about building innovative digital experiences",
  keywords: [
    "Ege Çam",
    "software engineer",
    "iOS developer",
    "creative technologist",
    "SwiftUI",
    "React",
    "Next.js",
  ],
  authors: [{ name: "Ege Çam" }],
  creator: "Ege Çam",
  publisher: "Ege Çam",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://egecam.dev",
    siteName: "Ege Çam",
    title: "Ege Çam",
    description:
      "Software engineer and creative technologist passionate about building innovative digital experiences",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ege Çam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ege Çam",
    description:
      "Software engineer and creative technologist passionate about building innovative digital experiences",
    images: ["/og-image.jpg"],
    creator: "@egecam",
  },
  metadataBase: new URL("https://egecam.dev"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bluuNext.variable}`}>
      <body
        className={`${inter.className} bg-background text-primary antialiased`}
      >
        <div className="min-h-screen">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left column with sidebar */}
            <div className="md:col-span-3">
              <Sidebar />
            </div>

            {/* Main content */}
            <main className="md:col-span-6 px-4 sm:px-6 py-16 sm:py-20">
              {children}
            </main>

            {/* Right empty column - hidden on mobile */}
            <div className="hidden md:block md:col-span-3" />
          </div>
        </div>
      </body>
    </html>
  );
}
