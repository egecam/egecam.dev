"use client";

import { useEffect, useState } from "react";
import type { Work } from "@/data";
import { AudioPlayer, AudioPair } from "./AudioPlayer";

function vimeoUrl(idOrUrl: string) {
  if (!idOrUrl) return "";
  if (idOrUrl.startsWith("http")) return idOrUrl;
  return `https://player.vimeo.com/video/${idOrUrl}?title=0&byline=0&portrait=0&color=cccccc&dnt=1`;
}

const probeCache = new Map<string, boolean>();

export function useAssetExists(src: string | undefined | null): boolean | null {
  const [state, setState] = useState<boolean | null>(() =>
    src ? (probeCache.has(src) ? probeCache.get(src)! : null) : false
  );
  useEffect(() => {
    if (!src) {
      setState(false);
      return;
    }
    if (probeCache.has(src)) {
      setState(probeCache.get(src)!);
      return;
    }
    let cancelled = false;
    fetch(src, { method: "HEAD" })
      .then((r) => {
        probeCache.set(src, r.ok);
        if (!cancelled) setState(r.ok);
      })
      .catch(() => {
        probeCache.set(src, false);
        if (!cancelled) setState(false);
      });
    return () => {
      cancelled = true;
    };
  }, [src]);
  return state;
}

export function Placeholder({ tag, label }: { tag: string; label: string }) {
  return (
    <div className="media-placeholder">
      <div>
        <div className="tag">{tag}</div>
        <div>{label}</div>
        <div style={{ marginTop: 8, opacity: 0.6, fontSize: 10 }}>placeholder — file pending</div>
      </div>
    </div>
  );
}

function ProbeImage({ src, alt, fallbackLabel }: { src: string; alt: string; fallbackLabel: string }) {
  const exists = useAssetExists(src);
  if (exists === true) return <img src={src} alt={alt} />;
  return <Placeholder tag="IMG" label={fallbackLabel} />;
}

export function PrimaryMedia({ primary, workTitle }: { primary: Work["primary"]; workTitle: string }) {
  if (!primary) return null;
  const { kind, src, alt } = primary;

  if (kind === "video") {
    if (!src) {
      return (
        <div className="primary-media">
          <Placeholder tag="VID" label={`${workTitle} — demo video`} />
        </div>
      );
    }
    return (
      <div className="primary-media">
        <iframe
          src={vimeoUrl(src)}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={alt || workTitle}
        />
      </div>
    );
  }

  if (kind === "image") {
    return (
      <div className="primary-media tall">
        <ProbeImage src={src} alt={alt || workTitle} fallbackLabel={`${workTitle} — primary image`} />
      </div>
    );
  }

  if (kind === "audio") {
    return (
      <div>
        <AudioPlayer src={src} label={workTitle} />
      </div>
    );
  }

  if (kind === "audio-pair") {
    return <AudioPair src={src} />;
  }

  return null;
}
