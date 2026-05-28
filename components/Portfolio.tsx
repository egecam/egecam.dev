"use client";

import { useEffect, useMemo, useState } from "react";
import { AUTHOR, STATEMENT, WORKS, type Work, type WorkFile } from "@/data";
import { WorkChapter } from "./WorkChapter";
import { MiniIndex } from "./MiniIndex";
import { PdfPanel, ImagePanel } from "./Panels";

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const compute = () => {
      const probe = window.scrollY + window.innerHeight * 0.4;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= probe) current = id;
        else break;
      }
      setActive(current);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [ids.join(",")]);
  return active;
}

function useClock() {
  const [t, setT] = useState<Date | null>(null);
  useEffect(() => {
    setT(new Date());
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function Hero() {
  const lines = STATEMENT.split(/\n\n/);
  return (
    <header className="hero" id="hero" data-screen-label="00 Hero">
      <div className="hero-header">
        <h1 className="hero-name">Ege Çam</h1>
        <div className="hero-meta">
          <div className="row"><span></span><span></span></div>
          <div className="row"><span></span><span>2026</span></div>
          <div className="row"><span></span><span>{AUTHOR.location}</span></div>
          <div className="row"><span></span><span>{WORKS.length} pieces · 2022–2026</span></div>
        </div>
      </div>

      <section className="statement" aria-label="Artist statement">
        <div className="label">Statement<br />—</div>
        <div className="statement-body">
          {lines.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

    </header>
  );
}

function Kv({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="kv-row">
      <span className="kv-k">{k}</span>
      <span className="kv-v">{v}</span>
    </div>
  );
}

function Colophon() {
  return (
    <footer id="colophon" className="colophon" data-screen-label="Colophon">
      <div className="colophon-inner">
        <div className="colophon-left">
          <div className="smallcaps muted colophon-eyebrow">
            End of portfolio · {WORKS.length} works
          </div>
          <h2 className="serif colophon-title">
            Let&apos;s connect
            <span className="colophon-sub">and create together.</span>
          </h2>
        </div>
        <div className="colophon-right">
          <Kv k="Mail" v={<a href="mailto:hey@egecam.dev">hey@egecam.dev</a>} />
          <Kv k="Web" v={<a href="https://egecam.dev" target="_blank" rel="noopener">egecam.dev</a>} />
          <Kv k="Code" v={<a href="https://github.com/egecam" target="_blank" rel="noopener">github.com/egecam</a>} />
        </div>
      </div>
    </footer>
  );
}

export default function Portfolio() {
  const workIds = useMemo(() => WORKS.map((w) => w.id), []);
  const ids = useMemo(() => ["hero", ...workIds, "colophon"], [workIds]);
  const active = useScrollSpy(ids);
  const activeLabel =
    active === "hero" || active === null
      ? "HERO"
      : active === "colophon"
      ? "COLOPHON"
      : active.toUpperCase();
  const [openFile, setOpenFile] = useState<{ work: Work; file: WorkFile } | null>(null);
  const [scrolled, setScrolled] = useState(0);
  const clock = useClock();

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(h > 0 ? window.scrollY / h : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleOpenFile = (work: Work, file: WorkFile) => setOpenFile({ work, file });
  const closePanel = () => setOpenFile(null);

  const stampClock = clock ? clock.toISOString().slice(11, 19) : "";
  const stampDate = clock ? clock.toISOString().slice(0, 10) : "";

  return (
    <>
      <div className="frame" />

      <div className="corner-stamp tl">
        <div>{AUTHOR.name}</div>
        <div className="dim"></div>
      </div>
      <div className="corner-stamp tr">
        <div>{stampDate}</div>
        <div className="dim">{stampClock ? `${stampClock} UTC` : ""}</div>
      </div>
      <div className="corner-stamp bl">
        <div></div>
        <div className="dim"></div>
      </div>
      <div className="corner-stamp br">
        <div>Scroll · {Math.round(scrolled * 100).toString().padStart(2, "0")}%</div>
        <div className="dim">→ {activeLabel}</div>
      </div>

      <Hero />
      <main className="works">
        {WORKS.map((w, i) => (
          <WorkChapter key={w.id} work={w} index={i} total={WORKS.length} onOpenFile={handleOpenFile} />
        ))}
      </main>
      <Colophon />

      <MiniIndex works={WORKS} activeId={active && workIds.includes(active) ? active : null} onJump={jump} />

      <PdfPanel
        open={!!openFile && openFile.file.kind === "pdf"}
        file={openFile?.file}
        workTitle={openFile?.work?.title}
        onClose={closePanel}
      />

      <ImagePanel
        open={!!openFile && openFile.file.kind === "image"}
        file={openFile?.file}
        workTitle={openFile?.work?.title}
        onClose={closePanel}
      />
    </>
  );
}
