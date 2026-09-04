import { folioLabel } from "@/lib/writings";

/** The foot of a leaf: a source note on the left, the folio number on the right. */
export default function Colophon({ folio, note }: { folio: number; note?: string }) {
  return (
    <p className="colophon">
      <span>{note}</span>
      <span>{folioLabel(folio)}</span>
    </p>
  );
}
