import { NextResponse } from "next/server";

const FAVOURITE_FILM_URLS = [
  "https://letterboxd.com/film/camera-buff/",
  "https://letterboxd.com/film/drive-my-car/",
  "https://letterboxd.com/film/nomadland/",
  "https://letterboxd.com/film/train-dreams/",
];

const FAVOURITE_RATINGS: Record<string, number> = {
  "camera-buff": 4.5,
  "drive-my-car": 5,
  "nomadland": 5,
  "train-dreams": 4.5,
};

// Fallback film data for films not in RSS feed
const FALLBACK_FILM_DATA: Record<string, { title: string; year: string }> = {
  "camera-buff": { title: "Camera Buff", year: "1979" },
  "drive-my-car": { title: "Drive My Car", year: "2021" },
  "nomadland": { title: "Nomadland", year: "2020" },
  "train-dreams": { title: "Train Dreams", year: "2025" },
};

// Local poster images
const LOCAL_POSTERS: Record<string, string> = {
  "camera-buff": "/poster/camera-buff.jpg",
  "drive-my-car": "/poster/drive-my-car.jpg",
  "nomadland": "/poster/nomadland.jpg",
  "train-dreams": "/poster/train-dreams.jpg",
};

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
    // Fetch films from RSS feed
    const response = await fetch("https://letterboxd.com/egecam/rss/", {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Letterboxd RSS: ${response.status}`);
    }

    const xmlText = await response.text();
    const allFilms = parseLetterboxdRSS(xmlText);

    // Match films from RSS feed to the favourite URLs
    const favouriteFilms: LetterboxdFilm[] = [];
    
    for (const url of FAVOURITE_FILM_URLS) {
      // Extract film slug from URL (e.g., "camera-buff" from "https://letterboxd.com/film/camera-buff/")
      const urlParts = url.split("/film/");
      if (urlParts.length < 2) continue;
      const filmSlug = urlParts[1].replace(/\/$/, "").toLowerCase();
      
      // Find matching film in RSS feed - try multiple matching strategies
      let foundFilm = allFilms.find((film) => {
        const filmUrl = film.filmUrl.toLowerCase();
        const filmTitle = film.title.toLowerCase();
        const fallbackTitle = FALLBACK_FILM_DATA[filmSlug]?.title.toLowerCase();
        
        // Try exact slug match in URL
        if (filmUrl.includes(`/film/${filmSlug}/`) || filmUrl.includes(`/film/${filmSlug}`)) {
          return true;
        }
        // Try with username prefix
        if (filmUrl.includes(`/egecam/film/${filmSlug}/`) || filmUrl.includes(`/egecam/film/${filmSlug}`)) {
          return true;
        }
        // Try just the slug at the end
        if (filmUrl.endsWith(`/${filmSlug}/`) || filmUrl.endsWith(`/${filmSlug}`)) {
          return true;
        }
        // Try matching by title (normalize titles for comparison)
        if (fallbackTitle && filmTitle === fallbackTitle) {
          return true;
        }
        // Try partial title match (for variations)
        if (fallbackTitle && filmTitle.includes(fallbackTitle.split(' ')[0])) {
          return true;
        }
        return false;
      });
      
      // Get the rating for this film from the mapping
      const rating = FAVOURITE_RATINGS[filmSlug] || (foundFilm?.rating || 0);
      
      if (foundFilm) {
        // Use the provided URL and rating, and local poster
        favouriteFilms.push({
          ...foundFilm,
          filmUrl: url.replace(/\/$/, ''),
          rating: rating,
          posterUrl: LOCAL_POSTERS[filmSlug] || foundFilm.posterUrl,
        });
      } else {
        // Film not found in RSS feed - create entry with local poster
        const fallbackData = FALLBACK_FILM_DATA[filmSlug];
        if (fallbackData) {
          // Try to get watched date from title match
          const titleMatch = allFilms.find((film) => {
            const filmTitle = film.title.toLowerCase();
            const searchTitle = fallbackData.title.toLowerCase();
            return filmTitle === searchTitle || 
                   filmTitle.includes(searchTitle.split(' ')[0]) ||
                   searchTitle.includes(filmTitle.split(' ')[0]);
          });
          
          favouriteFilms.push({
            title: fallbackData.title,
            year: fallbackData.year,
            rating: rating,
            posterUrl: LOCAL_POSTERS[filmSlug] || "",
            filmUrl: url.replace(/\/$/, ''),
            watchedDate: titleMatch?.watchedDate || "",
          });
        }
      }
    }

    return NextResponse.json({ films: favouriteFilms }, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("Error fetching favourite films:", error);
    return NextResponse.json(
      { error: "Failed to fetch favourite films", films: [] },
      { status: 500 }
    );
  }
}

function parseLetterboxdRSS(xmlText: string): LetterboxdFilm[] {
  const films: LetterboxdFilm[] = [];

  const itemMatches = xmlText.match(/<item>([\s\S]*?)<\/item>/g);

  if (!itemMatches) return films;

  for (const item of itemMatches) {
    const filmTitle = extractTag(item, "letterboxd:filmTitle");
    const filmYear = extractTag(item, "letterboxd:filmYear");
    const memberRating = extractTag(item, "letterboxd:memberRating");
    const filmUrl = extractTag(item, "link");
    const watchedDate = extractTag(item, "letterboxd:watchedDate");

    let posterUrl = "";
    const description = extractTag(item, "description");
    if (description) {
      const imgMatch = description.match(/<img[^>]+src="([^"]+)"/);
      if (imgMatch) {
        posterUrl = imgMatch[1];
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
  const namespacedRegex = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`);
  const namespacedMatch = xml.match(namespacedRegex);
  if (namespacedMatch) return namespacedMatch[1].trim();

  const cdataRegex = new RegExp(`<${tagName}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tagName}>`);
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

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

async function fetchPosterFromFilmPage(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch film page: ${response.status}`);
    }

    const html = await response.text();
    
    // Try to extract poster from meta og:image tag
    const ogImageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
    if (ogImageMatch) {
      let posterUrl = ogImageMatch[1];
      // Get higher resolution
      posterUrl = posterUrl.replace(/0-600-0-900-crop/, "0-1000-0-1500-crop");
      return posterUrl;
    }
    
    // Try to extract from film-poster img tag
    const imgMatch = html.match(/<img[^>]*class="[^"]*film-poster[^"]*"[^>]*src="([^"]+)"/i);
    if (imgMatch) {
      let posterUrl = imgMatch[1];
      posterUrl = posterUrl.replace(/0-600-0-900-crop/, "0-1000-0-1500-crop");
      return posterUrl;
    }
    
    // Try to extract from any img tag with poster in src
    const posterMatch = html.match(/<img[^>]*src="([^"]*film-poster[^"]*)"/i);
    if (posterMatch) {
      let posterUrl = posterMatch[1];
      posterUrl = posterUrl.replace(/0-600-0-900-crop/, "0-1000-0-1500-crop");
      return posterUrl;
    }
  } catch (error) {
    console.error(`Error fetching poster from ${url}:`, error);
  }
  
  return "";
}

