"use client";

import { useEffect, useRef } from "react";
import { OVERRIDE_KEY, PERIOD_KEY, periodOf, resolveNight } from "@/lib/night";

/**
 * The night toggle: a candle, third item in the nav. Its appearance is driven
 * entirely by `data-night` on the root element, so it renders correctly on the
 * server and never flashes.
 *
 * The reader's own clock decides — dark from 19:00 to 07:00. Blowing the candle
 * out or lighting it overrides that, but only until the period turns over, so a
 * page left open through the night is light again in the morning.
 */
export default function Candle() {
  const ref = useRef<HTMLButtonElement>(null);

  const label = (night: boolean) => (night ? "Blow out the candle" : "Light the candle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const apply = () => {
      const night = resolveNight();
      document.documentElement.toggleAttribute("data-night", night);
      el.setAttribute("data-tip", label(night));
    };

    apply();
    const tick = window.setInterval(apply, 60_000);
    document.addEventListener("visibilitychange", apply);
    return () => {
      window.clearInterval(tick);
      document.removeEventListener("visibilitychange", apply);
    };
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const night = !root.hasAttribute("data-night");
    root.toggleAttribute("data-night", night);
    try {
      localStorage.setItem(OVERRIDE_KEY, night ? "1" : "0");
      localStorage.setItem(PERIOD_KEY, periodOf());
    } catch {
      // Private browsing, or storage disabled — the toggle still works for the session.
    }
    ref.current?.setAttribute("data-tip", label(night));
  };

  return (
    <button
      ref={ref}
      type="button"
      className="candle"
      onClick={toggle}
      data-tip={label(false)}
      aria-label="Toggle night"
    >
      <span className="candle__glow" />
      <span className="candle__flame" />
      <span className="candle__wick" />
      <span className="candle__body" />
    </button>
  );
}
