import type { Metadata } from "next";
import {
  IM_Fell_English_SC,
  Inconsolata,
  Pirata_One,
  Spectral,
  UnifrakturMaguntia,
} from "next/font/google";
import CursorLabel from "@/components/CursorLabel";
import { NIGHT_FROM, NIGHT_UNTIL } from "@/lib/night";
import "./globals.css";

const imFellEnglishSC = IM_Fell_English_SC({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-im-fell-english-sc",
  display: "swap",
});

const inconsolata = Inconsolata({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-inconsolata",
  display: "swap",
});

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-spectral",
  display: "swap",
});

const maguntia = UnifrakturMaguntia({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-maguntia",
  display: "swap",
});

const pirata = Pirata_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pirata",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ege Çam",
  description:
    "Ege Çam — information systems and data, digital humanities, ambient and electronic music, writing.",
  metadataBase: new URL("https://egecam.dev"),
  alternates: { types: { "application/rss+xml": "/feed.xml" } },
};

// Sets data-night before first paint so the page never flashes the wrong ground.
// The clock decides; a manual override only holds until the period turns over.
// Mirrors lib/night.ts, which cannot be imported into an inline script.
const THEME_SCRIPT = `try{var h=new Date().getHours(),a=h>=${NIGHT_FROM}||h<${NIGHT_UNTIL},v=localStorage.getItem("night"),n=(v!==null&&localStorage.getItem("nightFor")===(a?"n":"d"))?v==="1":a;if(n){document.documentElement.setAttribute("data-night","")}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      // The script below sets data-night before paint, so the root element
      // legitimately differs from what the server sent.
      suppressHydrationWarning
      className={`${spectral.variable} ${maguntia.variable} ${pirata.variable} ${inconsolata.variable} ${imFellEnglishSC.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        {children}
        <CursorLabel />
      </body>
    </html>
  );
}
