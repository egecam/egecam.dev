"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function seededRand(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
function generateWaveform(src: string, bars = 96) {
  const rnd = seededRand(hashStr(src || "x"));
  const arr: number[] = [];
  for (let i = 0; i < bars; i++) {
    const t = i / bars;
    const env = Math.sin(t * Math.PI) * 0.7 + 0.3;
    const jitter = 0.35 + rnd() * 0.65;
    arr.push(Math.max(0.08, env * jitter));
  }
  return arr;
}
function formatTime(t: number) {
  if (!isFinite(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioPlayer({ src, label }: { src: string; label?: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const waveRef = useRef<HTMLDivElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [hasAudio, setHasAudio] = useState(false);

  useEffect(() => {
    setHasAudio(false);
    if (!src) return;
    let cancelled = false;
    fetch(src, { method: "HEAD" })
      .then((r) => {
        if (!cancelled) setHasAudio(r.ok);
      })
      .catch(() => {
        if (!cancelled) setHasAudio(false);
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  const bars = useMemo(() => generateWaveform(src || label || "x", 96), [src, label]);

  useEffect(() => {
    if (!hasAudio) return;
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => {
      setCurrent(a.currentTime);
      if (a.duration) setProgress(a.currentTime / a.duration);
    };
    const onMeta = () => setDuration(a.duration || 0);
    const onEnd = () => {
      setPlaying(false);
      setProgress(0);
      setCurrent(0);
    };
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
    };
  }, [src, hasAudio]);

  useEffect(() => {
    if (!playing || hasAudio) return;
    let raf = 0;
    const start = performance.now() - progress * 180000;
    const fakeDur = 184;
    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      const p = Math.min(1, elapsed / fakeDur);
      setProgress(p);
      setCurrent(elapsed);
      if (p >= 1) {
        setPlaying(false);
        setProgress(0);
        setCurrent(0);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, hasAudio, progress]);

  const toggle = () => {
    const a = audioRef.current;
    if (hasAudio && a) {
      if (playing) {
        a.pause();
        setPlaying(false);
      } else {
        a.play()
          .then(() => setPlaying(true))
          .catch(() => setPlaying(true));
      }
    } else {
      setPlaying((p) => !p);
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!waveRef.current) return;
    const rect = waveRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const p = Math.max(0, Math.min(1, x));
    setProgress(p);
    const a = audioRef.current;
    if (hasAudio && a && a.duration) {
      a.currentTime = p * a.duration;
    } else {
      setCurrent(p * 184);
    }
  };

  const displayDur = hasAudio && duration ? duration : 184;

  return (
    <div className="audio-player">
      <button className="play-btn" onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
        {playing ? (
          <svg viewBox="0 0 14 14" fill="currentColor">
            <rect x="2" y="1" width="3.5" height="12" />
            <rect x="8.5" y="1" width="3.5" height="12" />
          </svg>
        ) : (
          <svg viewBox="0 0 14 14" fill="currentColor">
            <polygon points="2,1 13,7 2,13" />
          </svg>
        )}
      </button>
      <div className="wave" ref={waveRef} onClick={seek}>
        {bars.map((h, i) => {
          const played = i / bars.length <= progress;
          return (
            <div
              key={i}
              className={"bar" + (played ? " played" : "")}
              style={{ height: `${Math.round(h * 10000) / 100}%` }}
            />
          );
        })}
      </div>
      <div className="time">
        {formatTime(current)} / {formatTime(displayDur)}
      </div>
      <audio ref={audioRef} src={hasAudio ? src : undefined} preload="metadata" style={{ display: "none" }} />
    </div>
  );
}

export function AudioPair({ src }: { src: string }) {
  const tracks = (src || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const labels = ["301", "Mild or No Shaking"];
  return (
    <div className="audio-pair">
      {tracks.map((t, i) => (
        <div key={i}>
          <div className="track-label">— {labels[i] || `Track ${i + 1}`}</div>
          <AudioPlayer src={t} label={labels[i] || `track-${i}`} />
        </div>
      ))}
    </div>
  );
}
