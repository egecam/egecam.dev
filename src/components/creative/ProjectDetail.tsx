"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useSoundManager } from "@/lib/sound";

interface ProjectDetailProps {
  title: string;
  type: string;
  year: string;
  description: string;
  coverImage: string;
  color: string;
  details: string[];
  onClose: () => void;
}

export default function ProjectDetail({
  title,
  type,
  year,
  description,
  coverImage,
  color,
  details,
  onClose,
}: ProjectDetailProps) {
  const soundManager = useSoundManager();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="relative"
    >
      <button
        onClick={() => {
          soundManager.playClick();
          onClose();
        }}
        className="absolute -top-16 left-0 text-foreground/60 hover:text-foreground transition-colors flex items-center gap-2"
        onMouseEnter={() => soundManager.playHover()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
            clipRule="evenodd"
          />
        </svg>
        Back to gallery
      </button>

      <div className="bg-background/50 backdrop-blur-sm rounded-2xl p-8 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span
              className="text-sm px-3 py-1 rounded-full"
              style={{
                backgroundColor: `${color}10`,
                color: color,
              }}
            >
              {type}
            </span>
            <span className="text-foreground/40">{year}</span>
          </div>
          <h2 className="text-4xl font-display tracking-display">{title}</h2>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl"
          >
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>

          {/* Content */}
          <div className="space-y-6">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-foreground/70 leading-relaxed"
            >
              {description}
            </motion.p>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              {details.map((detail, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-3 text-foreground/60"
                >
                  <span style={{ color }}>&bull;</span>
                  {detail}
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="pt-4"
            >
              <button
                className="px-6 py-2.5 rounded-xl text-white transition-transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: color }}
                onMouseEnter={() => soundManager.playHover()}
                onClick={() => soundManager.playClick()}
              >
                View Live Project
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
