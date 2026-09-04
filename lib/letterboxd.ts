import snapshot from "@/content/watches.json";

/**
 * Recently watched films, from the public Letterboxd RSS feed.
 *
 * Unlike the Goodreads widget this really is a feed, and a well-formed one: the
 * title, year and rating each have their own `letterboxd:` element, so nothing
 * has to be scraped out of prose. The only thing that hides in markup is the
 * poster, which sits in the CDATA description as a plain <img>.
 *
 * The feed mixes watch entries with list and review entries; only items that
 * carry a film title are watches, so the rest are dropped.
 *
 * Revalidated daily, with `content/watches.json` — a snapshot of the same parse
 * — standing in if Letterboxd is unreachable, so the section never renders
 * empty or breaks a build.
 */

export interface Watch {
  title: string;
  /** Release year, as printed by Letterboxd. */
  year: number | null;
  /** Out of 5, in half steps. `null` when logged without a rating. */
  rating: number | null;
  poster: string;
  /** The entry on Letterboxd. */
  href: string;
  width: number;
  height: number;
}

const FEED_URL = "https://letterboxd.com/egecam/rss/";

const DAY = 60 * 60 * 24;

/** Posters are cropped to 2:3; this is the size we ask for. */
const POSTER_W = 1000;
const POSTER_H = 1500;

function decodeEntities(s: string): string {
  return s
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

const clean = (s: string) => decodeEntities(s).replace(/\s+/g, " ").trim();

const tag = (block: string, name: string) => {
  const match = block.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  return match ? clean(match[1]) : null;
};

/** The feed serves 600×900; ask for the next size up. */
const upsize = (src: string) =>
  src.replace(/-0-\d+-0-\d+-crop\./, `-0-${POSTER_W}-0-${POSTER_H}-crop.`);

export function parseFeed(xml: string): Watch[] {
  return (xml.match(/<item>[\s\S]*?<\/item>/g) ?? [])
    .map((block): Watch | null => {
      // List and review entries share the feed but carry no film title.
      const title = tag(block, "letterboxd:filmTitle");
      const link = tag(block, "link");
      const poster = block.match(/<img[^>]*\bsrc="([^"]+)"/);
      if (!title || !link || !poster) return null;

      const year = tag(block, "letterboxd:filmYear");
      const rating = tag(block, "letterboxd:memberRating");

      return {
        title,
        year: year ? Number(year) : null,
        rating: rating ? Number(rating) : null,
        poster: upsize(decodeEntities(poster[1])),
        href: link,
        width: POSTER_W,
        height: POSTER_H,
      };
    })
    .filter((w): w is Watch => w !== null);
}

/** A rating as Letterboxd prints it: ★★★½. */
export function stars(rating: number | null): string {
  if (rating === null) return "";
  return "★".repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? "½" : "");
}

export async function recentWatches(limit = 4): Promise<Watch[]> {
  try {
    const res = await fetch(FEED_URL, {
      headers: { "user-agent": "egecam.dev (+https://egecam.dev)" },
      next: { revalidate: DAY },
    });
    if (!res.ok) throw new Error(`letterboxd: HTTP ${res.status}`);
    const watches = parseFeed(await res.text());
    if (watches.length === 0) throw new Error("letterboxd: no watches parsed");
    return watches.slice(0, limit);
  } catch (error) {
    console.warn(
      `[watches] falling back to content/watches.json — ${(error as Error).message}`,
    );
    return (snapshot as Watch[]).slice(0, limit);
  }
}
