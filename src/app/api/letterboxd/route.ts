import { NextResponse } from "next/server";

const LETTERBOXD_RSS_URL = "https://letterboxd.com/egecam/rss/";

export interface LetterboxdFilm {
  title: string;
  year: string;
  rating: number;
  posterUrl: string;
  filmUrl: string;
  watchedDate: string;
}

export async function GET() {
  try {
    const response = await fetch(LETTERBOXD_RSS_URL, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Letterboxd RSS: ${response.status}`);
    }

    const xmlText = await response.text();
    const films = parseLetterboxdRSS(xmlText);

    return NextResponse.json({ films }, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("Error fetching Letterboxd data:", error);
    return NextResponse.json(
      { error: "Failed to fetch films list", films: [] },
      { status: 500 }
    );
  }
}

function parseLetterboxdRSS(xmlText: string): LetterboxdFilm[] {
  const films: LetterboxdFilm[] = [];

  // Extract items from RSS feed using regex
  const itemMatches = xmlText.match(/<item>([\s\S]*?)<\/item>/g);

  if (!itemMatches) return films;

  for (const item of itemMatches) {
    const filmTitle = extractTag(item, "letterboxd:filmTitle");
    const filmYear = extractTag(item, "letterboxd:filmYear");
    const memberRating = extractTag(item, "letterboxd:memberRating");
    const filmUrl = extractTag(item, "link");
    const watchedDate = extractTag(item, "letterboxd:watchedDate");

    // Extract poster image from description CDATA
    let posterUrl = "";
    const description = extractTag(item, "description");
    if (description) {
      const imgMatch = description.match(/<img[^>]+src="([^"]+)"/);
      if (imgMatch) {
        posterUrl = imgMatch[1];
        // Get higher resolution by replacing size parameters
        posterUrl = posterUrl.replace(/0-600-0-900-crop/, "0-1000-0-1500-crop");
      }
    }

    if (filmTitle) {
      films.push({
        title: decodeHTMLEntities(filmTitle),
        year: filmYear || "",
        rating: memberRating ? parseFloat(memberRating) : 0,
        posterUrl: posterUrl || "",
        filmUrl: filmUrl || "",
        watchedDate: watchedDate || "",
      });
    }
  }

  return films;
}

function extractTag(xml: string, tagName: string): string {
  // Handle namespaced tags (e.g., letterboxd:filmTitle)
  const namespacedRegex = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`);
  const namespacedMatch = xml.match(namespacedRegex);
  if (namespacedMatch) return namespacedMatch[1].trim();

  // Handle CDATA sections
  const cdataRegex = new RegExp(`<${tagName}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tagName}>`);
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  // Handle regular tags
  const regex = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`);
  const match = xml.match(regex);
  return match ? match[1].trim() : "";
}

function decodeHTMLEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#039;/g, "'");
}

