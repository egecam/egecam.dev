"use client";

import { useEffect } from "react";
import MusicControl from "@/components/MusicControl";
import { useSoundManager } from "@/lib/sound";

export default function CreativeGarden() {
  const soundManager = useSoundManager();

  useEffect(() => {
    // Start background music when component mounts
    const startMusic = async () => {
      await soundManager.startBackgroundMusic();
    };
    startMusic();

    // Cleanup: Stop background music when component unmounts
    return () => {
      const audio = document.querySelector("audio");
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [soundManager]);

  return (
    <main className="relative min-h-screen w-full">
      <MusicControl />
    </main>
  );
}
