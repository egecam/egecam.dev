import type { ReactNode } from "react";
import { Mark, MarginalNote } from "@/components/Marginalia";
import Plate, { InlinePlate } from "@/components/Plate";

/**
 * A very small markup, sized to exactly what this design can show. Full
 * Markdown would not know about marginal notes, tagged words, or plates, and
 * everything else the chronicle uses is a paragraph.
 *
 *   *italic*                  em
 *   [text](url)               link — the label shows the URL without its scheme
 *   [text]{a short footnote}  dotted word, the label shows the note
 *   {^a marginal note}        the ✻ mark, and its note in the right margin
 *   :plate[id]                a plate at full measure, on its own line
 *   :plate[id] text…          a plate the paragraph runs around
 *   :plate[id]{right} text…   the same, floated right
 *
 * Blank lines separate paragraphs. The first paragraph opens with a versal and
 * the rest are indented — the chronicle has no blank line between paragraphs.
 */

// Order matters: the note form is tried before the tagged-word form, and the
// tagged-word form before the link form.
const INLINE_SOURCE =
  "\\{\\^([\\s\\S]*?)\\}" + // {^ marginal note }
  "|\\[([^\\]]+)\\]\\{([^}]*)\\}" + // [word]{footnote}
  "|\\[([^\\]]+)\\]\\(([^)]+)\\)" + // [text](url)
  "|\\*([^*]+)\\*"; // *italic*

const PLATE = /^:plate\[([A-Za-z0-9_-]+)\](?:\{(left|right)\})?/;

/** What a link's label says: the URL, without its scheme. Mail keeps `mailto:`. */
export function linkTip(href: string) {
  if (href.startsWith("mailto:")) return href;
  return href.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function inline(source: string, key: string): ReactNode[] {
  // A fresh regex per call: `inline` recurses into marginal notes, and a shared
  // one would carry its lastIndex into the nested scan.
  const re = new RegExp(INLINE_SOURCE, "g");
  const out: ReactNode[] = [];
  let last = 0;
  let n = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(source)) !== null) {
    if (m.index > last) out.push(source.slice(last, m.index));
    const k = `${key}-${n++}`;

    if (m[1] !== undefined) {
      out.push(<Mark key={`${k}-mark`} />);
      out.push(<MarginalNote key={k}>{inline(m[1], k)}</MarginalNote>);
    } else if (m[2] !== undefined) {
      out.push(
        <span key={k} data-tip={m[3].trim()}>
          {m[2]}
        </span>,
      );
    } else if (m[4] !== undefined) {
      const href = m[5];
      const external = /^https?:\/\//.test(href);
      out.push(
        <a
          key={k}
          href={href}
          data-tip={linkTip(href)}
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {m[4]}
        </a>,
      );
    } else {
      out.push(<em key={k}>{m[6]}</em>);
    }

    last = m.index + m[0].length;
  }

  if (last < source.length) out.push(source.slice(last));
  return out;
}

function paragraph(
  text: string,
  key: string,
  { versal, indent, plate }: { versal: boolean; indent: boolean; plate?: ReactNode },
) {
  const body = versal ? text.slice(1) : text;
  return (
    <p key={key} className={`prose${indent ? " prose--indent" : ""}`}>
      {versal ? <span className="versal">{text[0]}</span> : null}
      {plate}
      {inline(body, key)}
    </p>
  );
}

/** Turn an article body into the page's elements. */
export function renderMarkdown(body: string): ReactNode {
  const blocks = body
    .trim()
    .split(/\n\s*\n/)
    .map((b) => b.trim().replace(/\s*\n\s*/g, " "))
    .filter(Boolean);

  let seenParagraph = false;

  return blocks.map((block, i) => {
    const key = `b${i}`;
    const match = block.match(PLATE);

    if (match) {
      const rest = block.slice(match[0].length).trim();
      // On its own line, the plate stands at full measure.
      if (!rest) return <Plate key={key} id={match[1]} className="plate--full" />;

      const versal = !seenParagraph;
      const indent = seenParagraph;
      seenParagraph = true;
      return paragraph(rest, key, {
        versal,
        indent,
        plate: <InlinePlate key={`${key}-plate`} id={match[1]} align={match[2] === "right" ? "right" : "left"} />,
      });
    }

    const versal = !seenParagraph;
    const indent = seenParagraph;
    seenParagraph = true;
    return paragraph(block, key, { versal, indent });
  });
}
