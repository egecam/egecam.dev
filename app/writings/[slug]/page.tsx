import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Colophon from "@/components/Colophon";
import Nav from "@/components/Nav";
import { renderMarkdown } from "@/lib/markdown";
import { loadWriting, loadWritings } from "@/lib/writings.server";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return loadWritings()
    .filter((w) => w.hasBody)
    .map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const writing = loadWriting(slug);
  return { title: writing ? `${writing.title} — Ege Çam` : "Ege Çam" };
}

export default async function Article({ params }: Params) {
  const { slug } = await params;
  const writing = loadWriting(slug);
  if (!writing || !writing.hasBody) notFound();

  const language = writing.lang === "tr" ? "Turkish" : "English";

  return (
    <div className="page face-spectral display-pirata">
      <div className="measure">
        <Nav current="writings" />

        <article lang={writing.lang}>
          <p style={{ margin: "0 0 1.4em" }}>
            <Link className="backlink" href="/writings">
              ← Register
            </Link>
          </p>

          <h1 className="article-title">{writing.title}</h1>
          <p className="byline">
            Ege Çam
            {writing.place ? (
              <>
                ,{" "}
                <span data-tip={writing.placeNote ?? `Written in ${writing.place}`}>
                  {writing.place}
                </span>
              </>
            ) : null}
            ,{" "}
            <span data-tip={`First published ${writing.dateLabel} · ${language}`}>
              {writing.dateLabel}
            </span>
          </p>

          {renderMarkdown(writing.body)}

          <p className="prose prose--closing">
            This text stays open to revision. If you read it differently,{" "}
            <a href="mailto:hey@egecam.dev" data-tip="mailto:hey@egecam.dev">
              share your thoughts with me
            </a>
            .
          </p>

          <p style={{ margin: "1.6em 0 0" }}>
            <Link className="backlink" href="/writings">
              ← Register
            </Link>
          </p>

          <Colophon folio={writing.folio} />
        </article>
      </div>
    </div>
  );
}
