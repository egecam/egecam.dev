"use client";

import Link from "next/link";
import { useState } from "react";
import { tagsOf, type Writing } from "@/lib/writings";

/**
 * The register. Filtering is the tags themselves — click one to narrow, click
 * it again to open back up — and the filter state sits on the heading's
 * baseline as the clear control. Non-matching lines drop away rather than
 * disappearing, so the shape of the whole register stays visible.
 */
export default function Register({ entries }: { entries: Writing[] }) {
  const [filter, setFilter] = useState<string | null>(null);

  const pick = (tag: string) => setFilter((f) => (f === tag ? null : tag));

  return (
    <>
      <h2 className="heading heading--split">
        Register
        <button
          type="button"
          className={`filter-state${filter ? " filter-state--on" : ""}`}
          onClick={() => setFilter(null)}
          disabled={!filter}
        >
          {filter ? `Filtered: ${filter} — clear` : "Reverse chronological"}
        </button>
      </h2>

      <ul className="register">
        {entries.map((w) => {
          const tags = tagsOf(w);
          const shown = !filter || tags.includes(filter);
          return (
            <li key={w.slug} className={`reg${shown ? "" : " reg--dim"}`}>
              {w.hasBody ? (
                <Link className="reg__title" href={`/writings/${w.slug}`}>
                  {w.title}
                </Link>
              ) : (
                // Listed, but not yet written — nothing to open.
                <span className="reg__title reg__title--unwritten">{w.title}</span>
              )}
              <span className="reg__leader" />
              <span className="reg__tags">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`reg__tag${filter === tag ? " reg__tag--on" : ""}`}
                    onClick={() => pick(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </span>
              <span className="reg__date">{w.dateLabel}</span>
            </li>
          );
        })}
      </ul>
    </>
  );
}
