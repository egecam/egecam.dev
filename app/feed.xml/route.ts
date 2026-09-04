import { loadWritings } from "@/lib/writings.server";

export const dynamic = "force-static";

const SITE = "https://egecam.dev";
const TITLE = "Ege Çam — Writings";
const DESCRIPTION =
  "A register of political, socio-cultural and data texts by Ege Çam, in Turkish and English.";

const escape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** `YYYY-MM` or `YYYY-MM-DD` to an RFC-822 date. */
function pubDate(date: string): string {
  const [y, m, d] = date.split("-");
  return new Date(Date.UTC(Number(y), Number(m) - 1, Number(d ?? "1"))).toUTCString();
}

/** Enough of the text to know whether you want to open it. */
function excerpt(body: string, limit = 320): string {
  const flat = body
    .replace(/^:[a-z]+\[[^\]]*\](\{[^}]*\})?/gim, "")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return flat.length > limit ? `${flat.slice(0, limit).trimEnd()}…` : flat;
}

export function GET() {
  const writings = loadWritings().filter((w) => w.hasBody);

  const items = writings
    .map((w) => {
      const url = `${SITE}/writings/${w.slug}`;
      return `    <item>
      <title>${escape(w.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate(w.date)}</pubDate>
      <dc:language>${w.lang}</dc:language>
      <description>${escape(excerpt(w.body))}</description>
    </item>`;
    })
    .join("\n");

  const updated = writings[0] ? pubDate(writings[0].date) : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escape(TITLE)}</title>
    <link>${SITE}/writings</link>
    <description>${escape(DESCRIPTION)}</description>
    <language>en</language>
    <lastBuildDate>${updated}</lastBuildDate>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600",
    },
  });
}
