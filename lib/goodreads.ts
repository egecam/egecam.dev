import snapshot from "@/content/reads.json";

/**
 * Recently read books, from the Goodreads "custom widget" endpoint.
 *
 * That endpoint is not an API — it serves a JavaScript file whose only job is to
 * assign a blob of HTML to `widget_code` and drop it into the page. Rather than
 * run it in the browser (which would import Goodreads' markup, its stars, its
 * logo, and its stylesheet into a design that wants none of them), we fetch it
 * on the server, lift the HTML out of the string literal, and read the four
 * fields worth keeping. What reaches the page is data.
 *
 * The fetch is revalidated daily. If Goodreads is unreachable or changes shape,
 * `content/reads.json` — a snapshot of the same parse — stands in, so the
 * section never renders empty or breaks a build.
 */

export interface Read {
  title: string;
  author: string;
  /** Cover image, normalised to a legible width. */
  cover: string;
  /** The book's page on Goodreads. */
  href: string;
  /** The cover's real pixel size. The pile lays books out by their own
   *  proportions, so a squat photography manual is not stretched into the shape
   *  of a novel. */
  width: number;
  height: number;
}

const WIDGET_URL =
  "https://www.goodreads.com/review/custom_widget/119304187.Ege's%20bookshelf:%20read" +
  "?cover_position=&cover_size=&num_books=4&order=&shelf=&sort=&widget_bg_transparent=";

const DAY = 60 * 60 * 24;

/** The payload is a JS string literal; bring it back to HTML. */
function unwrap(js: string): string {
  const match = js.match(/var widget_code = '([\s\S]*?)'\s*\n\s*var widget_div/);
  if (!match) throw new Error("goodreads: could not find widget_code in the response");
  return match[1]
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\\//g, "/")
    .replace(/\\n/g, "\n")
    .replace(/\\\\/g, "\\");
}

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

/**
 * Goodreads serves 50px thumbnails. Ask for 318, which is the largest its
 * resizer will honour for these covers — the stored originals are 300px wide,
 * so this yields 300 rather than the 200 a smaller request returns.
 */
const upsize = (src: string) => src.replace(/\._S[XY]\d+_(?=\.[a-z]+$)/i, "._SX318_");

/** Drop the widget's tracking parameters. */
const tidy = (href: string) => decodeEntities(href).split("?")[0];

export function parseWidget(js: string): Read[] {
  const html = unwrap(js);

  // Each book is its own container; splitting on it keeps one book's markup from
  // being matched against the next one's.
  return html
    .split("gr_custom_each_container_")
    .slice(1)
    .map((block): Read | null => {
      const cover = block.match(/<img[^>]*\bsrc="([^"]+)"/);
      const link = block.match(/<a[^>]*\bhref="([^"]+)"/);
      const title = block.match(/gr_custom_title_[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/);
      const author = block.match(/gr_custom_author_[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/);
      if (!cover || !link || !title || !author) return null;
      return {
        title: clean(title[1]),
        author: clean(author[1]),
        cover: upsize(cover[1]),
        href: tidy(link[1]),
        width: 200,
        height: 300,
      };
    })
    .filter((b): b is Read => b !== null);
}

/** Width and height straight out of a PNG or JPEG header. */
function readSize(bytes: Uint8Array): [number, number] | null {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  const isPng =
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  if (isPng && bytes.length > 24) return [view.getUint32(16), view.getUint32(20)];

  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    let i = 2;
    while (i < bytes.length - 9) {
      if (bytes[i] !== 0xff) {
        i += 1;
        continue;
      }
      const marker = bytes[i + 1];
      // Padding and standalone markers carry no length.
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
        i += 2;
        continue;
      }
      const isFrameHeader =
        (marker >= 0xc0 && marker <= 0xc3) ||
        (marker >= 0xc5 && marker <= 0xc7) ||
        (marker >= 0xc9 && marker <= 0xcb) ||
        (marker >= 0xcd && marker <= 0xcf);
      if (isFrameHeader) return [view.getUint16(i + 7), view.getUint16(i + 5)];
      i += 2 + view.getUint16(i + 2);
    }
  }
  return null;
}

/** Goodreads does not report cover dimensions, so read them off the image. */
async function withSizes(books: Read[]): Promise<Read[]> {
  return Promise.all(
    books.map(async (book) => {
      try {
        const res = await fetch(book.cover, { next: { revalidate: DAY } });
        if (!res.ok) return book;
        const size = readSize(new Uint8Array(await res.arrayBuffer()));
        return size ? { ...book, width: size[0], height: size[1] } : book;
      } catch {
        return book; // Keep the 3:4 default rather than dropping the book.
      }
    }),
  );
}

export async function recentReads(limit = 4): Promise<Read[]> {
  try {
    const res = await fetch(WIDGET_URL, {
      headers: { "user-agent": "egecam.dev (+https://egecam.dev)" },
      next: { revalidate: DAY },
    });
    if (!res.ok) throw new Error(`goodreads: HTTP ${res.status}`);
    const books = parseWidget(await res.text());
    if (books.length === 0) throw new Error("goodreads: no books parsed");
    return withSizes(books.slice(0, limit));
  } catch (error) {
    console.warn(
      `[reads] falling back to content/reads.json — ${(error as Error).message}`,
    );
    return (snapshot as Read[]).slice(0, limit);
  }
}
