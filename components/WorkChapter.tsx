"use client";

import type { Work, WorkFile } from "@/data";
import { KIND_LABEL } from "@/data";
import { PrimaryMedia } from "./Media";

function FileRow({ file, onOpen }: { file: WorkFile; onOpen: () => void }) {
  const label = KIND_LABEL[file.kind] || file.kind.toUpperCase();
  const content = (
    <>
      <span className="kind">{label}</span>
      <span className="title">{file.title}</span>
      <span className="open">Open</span>
    </>
  );
  if (file.kind === "link") {
    return (
      <a
        className="file-row"
        data-kind="link"
        href={file.src}
        target="_blank"
        rel="noopener noreferrer"
        role="listitem"
        style={{ borderBottom: 0 }}
      >
        {content}
      </a>
    );
  }
  return (
    <button
      className="file-row"
      data-kind={file.kind}
      onClick={(e) => {
        e.preventDefault();
        onOpen();
      }}
      role="listitem"
    >
      {content}
    </button>
  );
}

export function WorkChapter({
  work,
  index,
  total,
  onOpenFile,
}: {
  work: Work;
  index: number;
  total: number;
  onOpenFile: (work: Work, file: WorkFile) => void;
}) {
  const w = work;
  return (
    <section
      className="chapter"
      id={w.id}
      data-screen-label={`${String(index + 1).padStart(2, "0")} ${w.title}`}
    >
      <div className="chapter-inner">
        <aside className="chapter-sticky">
          <div className="work-index">
            <span className="tick" />
            <span>
              Work · {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
          <h2 className="work-title">{w.title}</h2>
          <div className="work-meta">
            <div>
              <span className="k">Year</span>
              <span className="v">{w.year}</span>
            </div>
            <div>
              <span className="k">Form</span>
              <span className="v">{w.medium}</span>
            </div>
          </div>
        </aside>

        <div className="chapter-body">
          <PrimaryMedia primary={w.primary} workTitle={w.title} />
          <div className="work-prose" dangerouslySetInnerHTML={{ __html: w.presentation }} />

          {(() => {
            const images = w.files.filter((f) => f.kind === "image");
            const others = w.files.filter((f) => f.kind !== "image");
            return (
              <>
                {images.length > 0 && (
                  <div className="gallery" aria-label={`${w.title} — images`}>
                    {images.map((f, i) => (
                      <button
                        key={i}
                        type="button"
                        className="gallery-item"
                        onClick={() => onOpenFile(w, f)}
                        aria-label={f.title}
                      >
                        <img src={f.src} alt={f.title} loading="lazy" />
                      </button>
                    ))}
                  </div>
                )}
                {others.length > 0 && (
                  <div className="files" role="list" aria-label={`${w.title} — files`}>
                    {others.map((f, i) => (
                      <FileRow key={i} file={f} onOpen={() => onOpenFile(w, f)} />
                    ))}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </section>
  );
}
