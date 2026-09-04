"use client";

import { useEffect, useRef } from "react";

/**
 * The cursor label — one global mechanism driven by a single attribute,
 * `data-tip`. Images give their source line, links their URL without the
 * scheme, dotted words a short footnote.
 *
 * Delegated on `document` with `closest('[data-tip]')` rather than per-element
 * React handlers: inline targets (links, dotted spans) otherwise flicker as the
 * pointer crosses intermediate nodes inside the paragraph. The label only
 * clears when the resolved element actually changes. See NOTES.md.
 *
 * When the target sits inside a plate, the label takes the caption's place: the
 * caption fades out, and on exit the label flies back down to it and hands the
 * line over before disappearing.
 */
export default function CursorLabel() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tip = ref.current;
    if (!tip) return;

    // Touch devices get no label, and no `title` fallback either — that would
    // produce a second, native tooltip.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let current: HTMLElement | null = null;
    let caption: HTMLElement | null = null;
    let docking = false;
    let raf = 0;
    // tx/ty is where the label wants to be, cx/cy where it currently is.
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const captionOf = (el: Element) => {
      const figure = el.closest("figure, [data-figure]");
      return figure ? figure.querySelector<HTMLElement>("[data-cap]") : null;
    };

    const dockPoint = (cap: HTMLElement): [number, number] => {
      const r = cap.getBoundingClientRect();
      return [r.left - 9, r.top - 4];
    };

    const aim = (x: number, y: number) => {
      const w = tip.offsetWidth;
      const h = tip.offsetHeight;
      let px = x + 12;
      let py = y + 10;
      if (px + w > window.innerWidth - 6) px = x - w - 12;
      if (py + h > window.innerHeight - 6) py = y - h - 10;
      tx = px;
      ty = py;
    };

    // A small lift while chasing, and a tilt in the direction of travel.
    const draw = () => {
      const lift = Math.max(-7, Math.min(7, (ty - cy) * 0.5));
      tip.style.transform = `translate3d(${cx.toFixed(1)}px,${(cy - lift).toFixed(
        1,
      )}px,0) rotate(${((tx - cx) * 0.05).toFixed(2)}deg)`;
    };

    const release = () => {
      if (caption) caption.style.opacity = "";
      caption = null;
      docking = false;
      tip.style.opacity = "0";
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);

      if (docking) {
        if (!caption || !caption.isConnected) {
          release();
          return;
        }
        const [dx, dy] = dockPoint(caption);
        tx = dx;
        ty = dy;
        cx += (tx - cx) * 0.2;
        cy += (ty - cy) * 0.2;
        draw();
        if (Math.abs(tx - cx) < 2 && Math.abs(ty - cy) < 2) release();
        return;
      }

      if (!current) return;

      // The label re-reads its target every frame, so a tip that changes under
      // the pointer — the candle's, as it is lit or blown out — reads true
      // immediately instead of waiting for the pointer to leave and come back.
      if (!current.isConnected) {
        current = null;
        if (caption) docking = true;
        else tip.style.opacity = "0";
        return;
      }
      const line = current.getAttribute("data-tip") ?? "";
      if (line !== tip.textContent) tip.textContent = line;

      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      draw();
    };

    raf = requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const el =
        target && target.closest ? target.closest<HTMLElement>("[data-tip]") : null;

      if (el !== current) {
        const previous = caption;
        current = el;

        if (el) {
          docking = false;
          tip.textContent = el.getAttribute("data-tip") ?? "";
          aim(e.clientX, e.clientY);

          const cap = captionOf(el);
          if (cap) {
            // Take the caption's line: start from where the caption sits, so
            // the label reads as the same object lifting off the page.
            if (previous && previous !== cap) previous.style.opacity = "";
            caption = cap;
            if (tip.style.opacity !== "1") {
              const [dx, dy] = dockPoint(cap);
              cx = dx;
              cy = dy;
            }
            cap.style.opacity = "0";
          } else {
            if (previous) previous.style.opacity = "";
            caption = null;
            if (tip.style.opacity !== "1") {
              cx = tx;
              cy = ty - 16;
            } else {
              cy = ty - 12;
            }
          }
          tip.style.opacity = "1";
        } else if (caption) {
          docking = true;
        } else {
          tip.style.opacity = "0";
        }
      }

      if (current) aim(e.clientX, e.clientY);
    };

    // Only fires for us when the pointer leaves the document entirely.
    const onOut = (e: PointerEvent) => {
      if (e.relatedTarget) return;
      current = null;
      if (caption) docking = true;
      else tip.style.opacity = "0";
    };

    document.addEventListener("pointermove", onMove, true);
    document.addEventListener("pointerout", onOut, true);

    return () => {
      document.removeEventListener("pointermove", onMove, true);
      document.removeEventListener("pointerout", onOut, true);
      cancelAnimationFrame(raf);
      if (caption) caption.style.opacity = "";
    };
  }, []);

  return <div ref={ref} className="cursor-label" aria-hidden="true" />;
}
