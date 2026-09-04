/**
 * What a text is, and the one derived value the register needs. No filesystem
 * here on purpose: the register is a client component and imports this module.
 * The loader lives in `writings.server.ts`.
 */
export type Lang = "tr" | "en";

export interface Writing {
  /** The filename, minus `.md`. */
  slug: string;
  title: string;
  lang: Lang;
  topics: string[];
  /** `YYYY-MM` or `YYYY-MM-DD`, as written in the file. */
  date: string;
  /** How the date prints: "March 2026". */
  dateLabel: string;
  place?: string;
  /** What the cursor label says over the place in the byline. */
  placeNote?: string;
  /** False for a text that is listed in the register but not yet written. */
  hasBody: boolean;
  /** Its leaf in the book. Home is i, the register ii, texts iii onward. */
  folio: number;
}

export const FOLIO_HOME = 1;
export const FOLIO_REGISTER = 2;
/** The oldest text is the third leaf; every new one takes the next number. */
export const FOLIO_FIRST_WRITING = 3;

const NUMERALS: [number, string][] = [
  [1000, "m"], [900, "cm"], [500, "d"], [400, "cd"], [100, "c"], [90, "xc"],
  [50, "l"], [40, "xl"], [10, "x"], [9, "ix"], [5, "v"], [4, "iv"], [1, "i"],
];

export function roman(n: number): string {
  let rest = Math.max(1, Math.floor(n));
  let out = "";
  for (const [value, sign] of NUMERALS) {
    while (rest >= value) {
      out += sign;
      rest -= value;
    }
  }
  return out;
}

export const folioLabel = (n: number) => `Fol. ${roman(n)}`;

/** Every tag on a register line is a filter — the language tag first, then topics. */
export const tagsOf = (w: Writing): string[] => [w.lang, ...w.topics];
