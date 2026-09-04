import Image from "next/image";
import { recentReads } from "@/lib/goodreads";

/**
 * Recently read, as a pile. At rest the books sit stacked and slightly askew,
 * the way four paperbacks left on a desk do — the newest on top, the rest
 * showing an edge. Hovering the pile pushes them apart far enough to read all
 * four, then lets them settle back.
 *
 * Each book keeps its own proportions: a common height, and a width that
 * follows the real cover, so a squat photography manual is not stretched into
 * the shape of a novel.
 *
 * Rest and scattered positions are fixed rather than random — a pile that
 * rearranged itself between renders would be noise, and the server and the
 * client have to agree anyway.
 *
 * Rest offsets are absolute (they are only a few px either way). The scattered
 * `x` is a fraction of `--spread` instead, which the stylesheet sizes against
 * the column — otherwise a fixed spread that fits the full-width layout pushes
 * the outer books past the edge in a narrower one.
 */
const PILE = [
  { rest: [0, -6, -3], out: [-1, -8, -7] },
  { rest: [9, 1, 4], out: [-0.34, 6, -2] },
  { rest: [-7, 8, -5.5], out: [0.35, -5, 2.5] },
  { rest: [5, 14, 7], out: [1, 9, 8] },
];

export default async function RecentReads() {
  const books = await recentReads(4);
  if (books.length === 0) return null;

  return (
    <section className="reads">
      <p className="reads__label">Recently read</p>
      <ul className="reads__pile">
        {books.map((book, i) => {
          const { rest, out } = PILE[i % PILE.length];
          return (
            <li
              key={book.href}
              className="reads__item"
              style={
                {
                  "--x": `${rest[0]}px`,
                  "--y": `${rest[1]}px`,
                  "--r": `${rest[2]}deg`,
                  "--ox": `calc(var(--spread) * ${out[0]})`,
                  "--oy": `${out[1]}px`,
                  "--or": `${out[2]}deg`,
                  "--z": books.length - i,
                  // A short cascade, so the pile comes apart rather than
                  // snapping open all at once.
                  "--delay": `${i * 40}ms`,
                } as React.CSSProperties
              }
            >
              <a
                className="reads__link"
                href={book.href}
                target="_blank"
                rel="noreferrer"
                data-tip={`${book.title} — ${book.author}`}
              >
                <Image
                  className="reads__cover"
                  src={book.cover}
                  alt={`${book.title} by ${book.author}`}
                  width={book.width}
                  height={book.height}
                  quality={90}
                  sizes="130px"
                />
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
