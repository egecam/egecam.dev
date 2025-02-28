"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSoundManager } from "@/lib/sound";

export default function MusicControl() {
  const soundManager = useSoundManager();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(soundManager.isBackgroundMusicPlaying());
  }, []);

  const handleClick = async () => {
    await soundManager.toggleBackgroundMusic();
    setIsPlaying(soundManager.isBackgroundMusicPlaying());
  };

  return (
    <motion.button
      onClick={handleClick}
      className="fixed top-24 left-8 xl:left-16 2xl:left-24 z-50 p-3 rounded-full
        bg-background/80 backdrop-blur-sm hover:bg-background/90
        border border-accent/10 hover:border-accent/20
        text-primary/60 hover:text-accent
        transition-colors duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={() => soundManager.playHover()}
    >
      <AnimatePresence mode="wait">
        {isPlaying ? (
          <motion.svg
            key="playing"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.15 }}
          >
            <path d="M8.889 16.15c.768.768 2.111.246 2.111-.858V5.708c0-1.104-1.343-1.626-2.111-.858L5.444 8.295H3.1c-.48 0-.9.42-.9.9v2.61c0 .48.42.9.9.9h2.344l3.445 3.445z" />
            <path d="M12.5 5.5a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5z" />
            <path d="M14.5 6.5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5z" />
            <path d="M16.5 7.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V8a.5.5 0 0 1 .5-.5z" />
          </motion.svg>
        ) : (
          <motion.svg
            key="muted"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.15 }}
          >
            <path d="M8.889 16.15c.768.768 2.111.246 2.111-.858V5.708c0-1.104-1.343-1.626-2.111-.858L5.444 8.295H3.1c-.48 0-.9.42-.9.9v2.61c0 .48.42.9.9.9h2.344l3.445 3.445z" />
            <path d="M16.5 8.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V9a.5.5 0 0 1 .5-.5z" />
            <path d="M14.5 7.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V8a.5.5 0 0 1 .5-.5z" />
            <path d="M12.5 6.5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5z" />
            <path d="M18.5 9.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1a.5.5 0 0 1 .5-.5z" />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
