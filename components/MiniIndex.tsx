"use client";

import { useEffect, useRef, useState } from "react";
import type { Work } from "@/data";

export function MiniIndex({
  works,
  activeId,
  onJump,
}: {
  works: Work[];
  activeId: string | null;
  onJump: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollIdleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoveringRef = useRef(false);

  // scroll: dim while scrolling; only collapse if the cursor isn't near/over
  useEffect(() => {
    const onScroll = () => {
      setScrolling(true);
      if (scrollIdleTimer.current) clearTimeout(scrollIdleTimer.current);
      scrollIdleTimer.current = setTimeout(() => setScrolling(false), 250);
      if (!hoveringRef.current) setExpanded(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollIdleTimer.current) clearTimeout(scrollIdleTimer.current);
    };
  }, []);

  // near-hover proximity: expand when mouse approaches the right edge
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const fromRight = window.innerWidth - e.clientX;
      const NEAR = 180;
      const FAR = 260;
      if (fromRight < NEAR) {
        hoveringRef.current = true;
        if (collapseTimer.current) {
          clearTimeout(collapseTimer.current);
          collapseTimer.current = null;
        }
        setExpanded(true);
      } else if (fromRight > FAR) {
        hoveringRef.current = false;
        if (collapseTimer.current) clearTimeout(collapseTimer.current);
        collapseTimer.current = setTimeout(() => setExpanded(false), 220);
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (collapseTimer.current) clearTimeout(collapseTimer.current);
    };
  }, []);

  return (
    <nav
      className={
        "mini-index" +
        (expanded ? " expanded" : "") +
        (scrolling && expanded ? " scrolling" : "")
      }
      aria-label="Works index"
      onMouseEnter={() => {
        hoveringRef.current = true;
        if (collapseTimer.current) clearTimeout(collapseTimer.current);
        setExpanded(true);
      }}
      onMouseLeave={() => {
        hoveringRef.current = false;
        if (collapseTimer.current) clearTimeout(collapseTimer.current);
        collapseTimer.current = setTimeout(() => setExpanded(false), 220);
      }}
    >
      <ul>
        {works.map((w, i) => (
          <li key={w.id}>
            <button
              className={"mi-item" + (w.id === activeId ? " active" : "")}
              onClick={() => onJump(w.id)}
              title={w.title}
            >
              <span className="t">{w.title}</span>
              <span className="n">{String(i + 1).padStart(2, "0")}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
