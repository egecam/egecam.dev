import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const GOODREADS_USER_ID = "119304187";

export interface GoodreadsBook {
  title: string;
  author: string;
  coverUrl: string;
  bookUrl: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const shelf = searchParams.get("shelf") || "currently-reading";
  
  const rssUrl = `https://www.goodreads.com/review/list_rss/${GOODREADS_USER_ID}?shelf=${shelf}`;
  
  try {
    const response = await fetch(rssUrl, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Goodreads RSS: ${response.status}`);
    }

    const xmlText = await response.text();
    const books = parseGoodreadsRSS(xmlText);

    return NextResponse.json({ books, shelf }, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("Error fetching Goodreads data:", error);
    return NextResponse.json(
      { error: "Failed to fetch reading list", books: [], shelf },
      { status: 500 }
    );
  }
}

function parseGoodreadsRSS(xmlText: string): GoodreadsBook[] {
  const books: GoodreadsBook[] = [];

  // Extract items from RSS feed using regex (avoiding XML parser dependency)
  const itemMatches = xmlText.match(/<item>([\s\S]*?)<\/item>/g);

  if (!itemMatches) return books;

  for (const item of itemMatches) {
    const title = extractTag(item, "title");
    const author = extractTag(item, "author_name");
    const bookUrl = extractTag(item, "link");

    // Extract cover image from the description HTML or book_image_url
    let coverUrl = extractTag(item, "book_large_image_url") ||
                   extractTag(item, "book_medium_image_url") ||
                   extractTag(item, "book_small_image_url");

    // If no direct image tag, try to extract from description HTML
    if (!coverUrl) {
      const description = extractTag(item, "description");
      const imgMatch = description.match(/src="([^"]+)"/);
      if (imgMatch) {
        coverUrl = imgMatch[1];
      }
    }

    // Clean up the cover URL - get higher resolution
    if (coverUrl) {
      // Replace size modifiers to get larger images
      coverUrl = coverUrl
        .replace(/\._S[XY]\d+_/, "")
        .replace(/\._[A-Z]+\d+_/, "")
        .replace("._SY75_", "")
        .replace("._SX50_", "")
        .replace("._SY98_", "");
    }

    if (title && author) {
      books.push({
        title: decodeHTMLEntities(title),
        author: decodeHTMLEntities(author),
        coverUrl: coverUrl || "",
        bookUrl: bookUrl || "",
      });
    }
  }

  return books;
}

function extractTag(xml: string, tagName: string): string {
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
    .replace(/&apos;/g, "'");
}

