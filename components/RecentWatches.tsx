import Image from "next/image";
import { recentWatches, stars } from "@/lib/letterboxd";

/**
 * Recently watched, from Letterboxd — a fanned deck. Film posters all share a
 * 2:3 crop, so they stack like cards rather than books: each pivots about a
 * point below the deck, and hovering opens the fan.
 */
const FAN = [
  { rest: -5.5, out: -32 },
  { rest: -1.8, out: -16 },
  { rest: 1.8, out: 16 },
  { rest: 5.5, out: 32 },
];

export default async function RecentWatches() {
  const films = await recentWatches(4);
  if (films.length === 0) return null;

  return (
    <section className="watches">
      <p className="reads__label">Recently watched</p>
      <ul className="watches__deck">
        {films.map((film, i) => {
          const rated = stars(film.rating);
          const line = [
            film.title,
            film.year ? `(${film.year})` : "",
            rated ? `— ${rated}` : "",
          ]
            .filter(Boolean)
            .join(" ");
          const { rest, out } = FAN[i % FAN.length];

          return (
            <li
              key={film.href}
              className="watches__item"
              style={
                {
                  "--a": `${rest}deg`,
                  "--oa": `${out}deg`,
                  "--z": films.length - i,
                  "--delay": `${i * 40}ms`,
                } as React.CSSProperties
              }
            >
              <a
                className="watches__link"
                href={film.href}
                target="_blank"
                rel="noreferrer"
                data-tip={line}
              >
                <Image
                  className="watches__poster"
                  src={film.poster}
                  alt={`${film.title} poster`}
                  width={film.width}
                  height={film.height}
                  quality={90}
                  sizes="150px"
                />
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
