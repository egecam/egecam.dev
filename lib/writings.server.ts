import fs from "node:fs";
import path from "node:path";
import { FOLIO_FIRST_WRITING, type Writing } from "./writings";

/**
 * Reads `content/writings/*.md`. Filesystem-bound, so it must only be imported
 * from server components — `lib/writings.ts` holds the types and helpers that
 * the register (a client component) shares with it.
 */

export interface LoadedWriting extends Writing {
  body: string;
}

const DIR = path.join(process.cwd(), "content", "writings");

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDate(value: string, file: string) {
  const m = value.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/);
  if (!m) {
    throw new Error(`${file}: date must be YYYY-MM or YYYY-MM-DD, got "${value}".`);
  }
  const month = MONTHS[Number(m[2]) - 1];
  if (!month) throw new Error(`${file}: month out of range in "${value}".`);
  return `${month} ${m[1]}`;
}

/**
 * A deliberately small frontmatter reader: `key: value` lines between two `---`
 * fences, with lists written either `[a, b]` or `a, b`. Enough for the six keys
 * a text carries, and nothing to learn beyond what the files already show.
 */
function parseFrontmatter(raw: string, file: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`${file}: missing the --- frontmatter block at the top.`);

  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const at = trimmed.indexOf(":");
    if (at === -1) throw new Error(`${file}: cannot read frontmatter line "${trimmed}".`);
    data[trimmed.slice(0, at).trim()] = trimmed.slice(at + 1).trim();
  }
  return { data, body: match[2] };
}

function list(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .replace(/^\[|\]$/g, "")
    .split(",")
    .map((v) => v.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

function required(data: Record<string, string>, key: string, file: string) {
  const value = data[key];
  if (!value) throw new Error(`${file}: frontmatter is missing "${key}".`);
  return value.replace(/^["']|["']$/g, "");
}

function read(file: string): LoadedWriting {
  const raw = fs.readFileSync(path.join(DIR, file), "utf8");
  const { data, body } = parseFrontmatter(raw, file);

  const lang = required(data, "lang", file);
  if (lang !== "tr" && lang !== "en") {
    throw new Error(`${file}: lang must be "tr" or "en", got "${lang}".`);
  }

  const date = required(data, "date", file);
  const place = data.place?.replace(/^["']|["']$/g, "");

  return {
    slug: file.replace(/\.md$/, ""),
    title: required(data, "title", file),
    lang,
    topics: list(data.topics),
    date,
    dateLabel: formatDate(date, file),
    place: place || undefined,
    placeNote: data.placeNote?.replace(/^["']|["']$/g, "") || undefined,
    hasBody: body.trim().length > 0,
    folio: 0, // assigned in loadWritings, once the whole set is known
    body: body.trim(),
  };
}

let cache: LoadedWriting[] | null = null;

/** Every text, newest first — the register's own order. */
export function loadWritings(): LoadedWriting[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".md"));
  const all = files.map(read).sort((a, b) => b.date.localeCompare(a.date));
  // Folios run with the book, oldest first, so adding a text never renumbers
  // the ones already bound in.
  const last = all.length - 1;
  all.forEach((w, i) => {
    w.folio = FOLIO_FIRST_WRITING + (last - i);
  });
  cache = all;
  return cache;
}

/** The register's view: metadata only, safe to hand to a client component. */
export function registerEntries(): Writing[] {
  return loadWritings().map((w) => ({
    slug: w.slug,
    title: w.title,
    lang: w.lang,
    topics: w.topics,
    date: w.date,
    dateLabel: w.dateLabel,
    place: w.place,
    placeNote: w.placeNote,
    hasBody: w.hasBody,
    folio: w.folio,
  }));
}

export function loadWriting(slug: string): LoadedWriting | undefined {
  return loadWritings().find((w) => w.slug === slug);
}
