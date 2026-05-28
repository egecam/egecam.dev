import type { Metadata } from "next";
import { Fraunces, Space_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ege Çam — Portfolio · 2026",
  description:
    "Portfolio of Ege Çam — digital media, music, photography, collage.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="ivory"
      data-grain="on"
      data-density="comfortable"
      className={`${fraunces.variable} ${spaceMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
