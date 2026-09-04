import registry from "@/content/images.json";

/**
 * The plate registry. One entry per image, keyed by the id used in pages and in
 * `:plate[…]` directives. The caption is the source line — it is what prints
 * under the plate and what the cursor label says, so it is written once here.
 *
 * Adding an image: drop the file in `public/plates/`, add an entry with its
 * `src`, and reference the id. Nothing else changes.
 */
export interface PlateImage {
  /** Path under `public/`, e.g. `/plates/nurnberg-1493.jpg`. Omit for an empty slot. */
  src?: string;
  alt?: string;
  /** The source line, printed under the plate. */
  caption?: string;
  /** What the cursor label says, when it should differ from the caption. */
  tip?: string;
  /** Shown in the empty slot until `src` is filled in. */
  placeholder?: string;
  /** Intrinsic size. Optional, but it reserves the space and avoids a reflow. */
  width?: number;
  height?: number;
}

export interface ResolvedPlate extends PlateImage {
  id: string;
  /** Always present: falls back to the tip when the plate carries no caption. */
  caption: string;
  /** Always present: falls back to the caption. */
  tip: string;
}

const IMAGES = registry as Record<string, PlateImage>;

export function image(id: string): ResolvedPlate {
  const entry = IMAGES[id];
  if (!entry) {
    throw new Error(
      `Unknown plate "${id}". Add it to content/images.json, or fix the id. ` +
        `Known ids: ${Object.keys(IMAGES).join(", ")}`,
    );
  }
  const caption = entry.caption ?? entry.tip;
  const tip = entry.tip ?? entry.caption;
  if (!caption || !tip) {
    throw new Error(`Plate "${id}" needs a caption or a tip in content/images.json.`);
  }
  return { ...entry, id, caption, tip };
}

export const imageIds = () => Object.keys(IMAGES);
