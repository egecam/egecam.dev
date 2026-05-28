"use client";

import { useEffect, useState } from "react";
import type { WorkFile } from "@/data";
import { Placeholder } from "./Media";

function resolveRelative(src: string, baseDir: string): string {
  if (!src) return src;
  if (/^(https?:|data:|\/)/.test(src)) return src;
  return baseDir ? `${baseDir}/${src}` : src;
}

function renderMarkdown(md: string, baseDir = ""): string {
  if (!md) return "";
  const lines = md.split(/\r?\n/);
  let html = "";
  let inList = false;
  let inPara = false;
  const closePara = () => {
    if (inPara) {
      html += "</p>";
      inPara = false;
    }
  };
  const closeList = () => {
    if (inList) {
      html += "</ul>";
      inList = false;
    }
  };
  const inline = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/_(.+?)_/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/!\[(.*?)\]\((.+?)\)/g, (_m, alt, src) => {
        const resolved = resolveRelative(src, baseDir);
        return `<img src="${resolved}" alt="${alt}" loading="lazy"/>`;
      })
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      closePara();
      closeList();
      continue;
    }
    if (line.startsWith("# ")) {
      closePara();
      closeList();
      html += `<h1>${inline(line.slice(2))}</h1>`;
      continue;
    }
    if (line.startsWith("## ")) {
      closePara();
      closeList();
      html += `<h2>${inline(line.slice(3))}</h2>`;
      continue;
    }
    if (line.startsWith("### ")) {
      closePara();
      closeList();
      html += `<h3>${inline(line.slice(4))}</h3>`;
      continue;
    }
    if (line.startsWith("---") || line.startsWith("***")) {
      closePara();
      closeList();
      html += "<hr/>";
      continue;
    }
    if (line.startsWith("> ")) {
      closePara();
      closeList();
      html += `<blockquote>${inline(line.slice(2))}</blockquote>`;
      continue;
    }
    if (/^[-*] /.test(line)) {
      closePara();
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${inline(line.slice(2))}</li>`;
      continue;
    }
    closeList();
    if (!inPara) {
      html += "<p>";
      inPara = true;
    } else {
      html += " ";
    }
    html += inline(line);
  }
  closePara();
  closeList();
  return html;
}

function placeholderStatement(workTitle: string) {
  return `# ${workTitle}\n\n*Project Statement — placeholder*\n\nThe full statement PDF for *${workTitle}* will be served from this panel. The reader keeps the committee inside the portfolio — no page change, no download dialog — and supports keyboard navigation (← / →, Esc to close).\n\n---\n\n## Concept\n\nThis paragraph stands in for the opening of the statement. In the production portfolio it will pull the rendered markdown from the project's \`.md\` source so the committee reads the same copy that is bundled with the application package.\n\n## Method\n\nA second section. The reader supports headings, paragraphs, *emphasis*, **bold**, lists, blockquotes, and inline \`code\`.\n\n- Built end-to-end on local hardware\n- Documented with screen captures and field recordings\n- Sources versioned alongside the artifact\n\n> A short pull-quote from the work — placeholder.\n\n## Context\n\nA closing paragraph. The real statement runs to roughly four pages; this panel scrolls comfortably and remembers the committee's place if they close and reopen it.\n\n---\n\n*End of placeholder. The final PDF lives at the path declared in \`data.ts\`.*`;
}

type PanelProps = {
  open: boolean;
  file: WorkFile | undefined;
  workTitle: string | undefined;
  onClose: () => void;
};

export function PdfPanel({ open, file, workTitle, onClose }: PanelProps) {
  const [content, setContent] = useState("");
  const [baseDir, setBaseDir] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [zoomed, setZoomed] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoaded(false);
    setContent("");
    if (!file?.src) {
      setBaseDir("");
      setContent(placeholderStatement(workTitle || "Work"));
      setLoaded(true);
      return;
    }
    const dir = file.src.includes("/") ? file.src.slice(0, file.src.lastIndexOf("/")) : "";
    setBaseDir(dir);
    fetch(file.src)
      .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
      .then((t) => {
        setContent(t);
        setLoaded(true);
      })
      .catch(() => {
        setContent(placeholderStatement(workTitle || "Work"));
        setLoaded(true);
      });
  }, [open, file?.src, workTitle]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (zoomed) setZoomed(null);
      else onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, zoomed]);

  useEffect(() => {
    if (!open) setZoomed(null);
  }, [open]);

  if (!open) return null;
  return (
    <div className="panel-overlay" role="dialog" aria-modal="true">
      <div className="panel-head">
        <div>
          <span className="panel-title">{file?.title || "Document"}</span>
          <span style={{ marginLeft: 14 }}>· {workTitle}</span>
        </div>
        <button className="panel-close" onClick={onClose}>
          Close · Esc
        </button>
      </div>
      <div className="panel-body">
        <article
          className="reader"
          onClick={(e) => {
            const t = e.target as HTMLElement;
            if (t.tagName === "IMG") {
              const img = t as HTMLImageElement;
              setZoomed({ src: img.src, alt: img.alt || "" });
            }
          }}
        >
          {loaded ? (
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(content, baseDir) }} />
          ) : (
            <div className="muted mono" style={{ fontSize: 12 }}>
              Loading…
            </div>
          )}
        </article>
      </div>
      {zoomed && (
        <div
          className="panel-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setZoomed(null)}
          style={{ zIndex: 60 }}
        >
          <div className="panel-head" onClick={(e) => e.stopPropagation()}>
            <div>
              <span className="panel-title">{zoomed.alt || "Image"}</span>
              <span style={{ marginLeft: 14 }}>· {workTitle}</span>
            </div>
            <button className="panel-close" onClick={() => setZoomed(null)}>
              Close · Esc
            </button>
          </div>
          <div className="panel-body" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-content">
              <img src={zoomed.src} alt={zoomed.alt} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ImagePanel({ open, file, workTitle, onClose }: PanelProps) {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (open) setFailed(false);
  }, [open, file?.src]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="panel-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="panel-head" onClick={(e) => e.stopPropagation()}>
        <div>
          <span className="panel-title">{file?.title || "Image"}</span>
          <span style={{ marginLeft: 14 }}>· {workTitle}</span>
        </div>
        <button className="panel-close" onClick={onClose}>
          Close · Esc
        </button>
      </div>
      <div className="panel-body" onClick={(e) => e.stopPropagation()}>
        <div className="lightbox-content">
          {file?.src && !failed ? (
            <img src={file.src} alt={file.title} onError={() => setFailed(true)} />
          ) : (
            <div className="img-placeholder">
              <Placeholder tag="IMG" label={file?.title || "image"} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
