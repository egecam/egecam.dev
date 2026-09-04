import Image from "next/image";
import { image, type ResolvedPlate } from "@/lib/images";

export type Shape = "rect" | "rounded" | "circle";

const shapeClass: Record<Shape, string> = {
  rect: "",
  rounded: "shape-rounded",
  circle: "shape-circle",
};

type SlotProps = {
  /** Key into content/images.json. */
  id: string;
  shape?: Shape;
  /** `flow` keeps the plate's native ratio; `cover` fills a sized box. */
  fit?: "flow" | "cover";
  /** Render span wrappers, for slots that sit inside a paragraph. */
  inline?: boolean;
  className?: string;
};

/**
 * An image, or the space one will occupy. Square corners unless asked
 * otherwise, and always under the sepia/contrast wash so plates from different
 * sources sit on the same paper.
 */
export function Slot({
  id,
  shape = "rect",
  fit = "flow",
  inline = false,
  className = "",
}: SlotProps) {
  const plate = image(id);

  // A slot inside a paragraph must not open a <div>: the parser would close the
  // <p> around it and the markup would no longer match what the server sent.
  const Box = inline ? "span" : "div";
  const classes = [shapeClass[shape], inline ? "slot-inline" : "", className]
    .filter(Boolean)
    .join(" ");

  if (!plate.src) {
    return (
      <Box className={classes || undefined}>
        <Box className="plate__slot" data-tip={plate.tip}>
          {plate.placeholder ?? plate.caption}
        </Box>
      </Box>
    );
  }

  const sized = plate.width && plate.height;

  if (fit === "cover") {
    return (
      <Box className={classes || undefined} style={{ position: "absolute", inset: 0 }}>
        <Image
          className="plate__img"
          src={plate.src}
          alt={plate.alt ?? plate.caption}
          data-tip={plate.tip}
          fill
          quality={90}
          sizes="(max-width: 700px) 100vw, 270px"
          style={{ objectFit: "cover" }}
        />
      </Box>
    );
  }

  return (
    <Box className={classes || undefined}>
      <Image
        className="plate__img"
        src={plate.src}
        alt={plate.alt ?? plate.caption}
        data-tip={plate.tip}
        width={sized ? plate.width : 0}
        height={sized ? plate.height : 0}
        quality={90}
        sizes="(max-width: 1180px) 100vw, 700px"
        style={{ width: "100%", height: "auto" }}
      />
    </Box>
  );
}

/**
 * A plate and its caption, at full measure. The caption is the source line, and
 * it belongs to the cursor label as much as to the page — hovering the image
 * hands it over.
 */
export default function Plate({
  id,
  className = "",
}: {
  id: string;
  className?: string;
}) {
  const plate: ResolvedPlate = image(id);
  return (
    <figure className={`plate ${className}`.trim()}>
      <Slot id={id} />
      <figcaption className="plate__cap" data-cap="1">
        {plate.caption}
      </figcaption>
    </figure>
  );
}

/**
 * A plate that sits inside a paragraph and the text runs around it. All spans,
 * so it is legal inside a <p>.
 */
export function InlinePlate({
  id,
  align = "left",
}: {
  id: string;
  align?: "left" | "right";
}) {
  const plate = image(id);
  return (
    <span className={`inplate inplate--${align}`} data-figure="1">
      <Slot id={id} inline />
      <span className="plate__cap" data-cap="1">
        {plate.caption}
      </span>
    </span>
  );
}
