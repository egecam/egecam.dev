"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { LastFmTrack } from "@/app/api/lastfm/route";
import { NOW_CONFIG } from "@/config/now";

interface NowSectionProps {
  lastUpdated?: string;
}

export function NowSection({ lastUpdated }: NowSectionProps) {
  const [track, setTrack] = useState<LastFmTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>("");

  // Fetch currently playing track
  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const response = await fetch("/api/lastfm");
        const data = await response.json();
        if (data.track) {
          setTrack(data.track);
        }
      } catch (error) {
        console.error("Error fetching Last.fm data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrack();
    // Refresh every 30 seconds
    const interval = setInterval(fetchTrack, 30000);
    return () => clearInterval(interval);
  }, []);

  // Update local time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString("en-US", {
        timeZone: NOW_CONFIG.timezone.name,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      setCurrentTime(time);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="rounded-2xl border border-black/10 bg-background-alt/50 p-5 space-y-4"
    >
      <h3 className="text-xs uppercase tracking-[0.14em] text-foreground/60 font-medium">
        Now
      </h3>

      <div className="space-y-3">
        {/* Currently Listening */}
        <div className="flex items-start gap-3">
          <span className="text-lg">🎵</span>
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="space-y-1">
                <div className="h-4 w-32 bg-foreground/5 rounded animate-pulse" />
                <div className="h-3 w-24 bg-foreground/5 rounded animate-pulse" />
              </div>
            ) : track ? (
              <a
                href={track.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <p className="text-sm font-medium text-foreground truncate group-hover:text-accent transition-colors">
                  {track.name}
                </p>
                <p className="text-xs text-foreground/60 truncate">
                  {track.artist}
                  {track.userPlayCount > 1 && (
                    <span className="ml-1.5 text-foreground/40">
                      · {track.userPlayCount} plays
                    </span>
                  )}
                  {track.nowPlaying && (
                    <span className="ml-2 inline-flex items-center gap-1 text-accent">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                      </span>
                      now
                    </span>
                  )}
                </p>
              </a>
            ) : (
              <p className="text-sm text-foreground/50 italic">Nothing playing</p>
            )}
          </div>
        </div>

        {/* Location & Time */}
        <div className="flex items-center gap-3">
          <span className="text-lg">{NOW_CONFIG.location.emoji}</span>
          <div>
            <p className="text-sm text-foreground">
              {NOW_CONFIG.location.city}, {NOW_CONFIG.location.country}
            </p>
            <p className="text-xs text-foreground/60">
              {currentTime} ({NOW_CONFIG.timezone.abbreviation}, UTC{NOW_CONFIG.timezone.utcOffset})
            </p>
          </div>
        </div>

        {/* Last Updated */}
        {lastUpdated && (
          <div className="flex items-center gap-3 pt-2 border-t border-black/5">
            <span className="text-lg">✏️</span>
            <p className="text-xs text-foreground/50">
              Site updated {lastUpdated}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

