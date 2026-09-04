import { Slot } from "./Plate";
import { image } from "@/lib/images";

/**
 * The record and the book: two stacked layers in a positioned box. The rear
 * slot is hidden until hover, then slides out from behind the cover while the
 * cover's shadow deepens. Shadows exist on exactly three things in this design,
 * and this is two of them. The caption is the front face's source line.
 */
export default function HoverObject({
  kind,
  rear,
  front,
  figureClassName = "",
}: {
  kind: "record" | "book";
  /** Plate id of the hidden layer. */
  rear: string;
  /** Plate id of the cover. */
  front: string;
  figureClassName?: string;
}) {
  return (
    <figure className={`object__figure ${figureClassName}`.trim()}>
      <div className={`object object--${kind}`}>
        <div className="object__rear">
          <Slot id={rear} fit="cover" shape={kind === "record" ? "circle" : "rounded"} />
        </div>
        <div className="object__front">
          <Slot id={front} fit="cover" shape="rounded" />
        </div>
      </div>
      <figcaption className="plate__cap" data-cap="1">
        {image(front).caption}
      </figcaption>
    </figure>
  );
}
