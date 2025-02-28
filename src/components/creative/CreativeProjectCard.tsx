"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useSoundManager } from "@/lib/sound";

interface CreativeProjectCardProps {
  title: string;
  type: string;
  year: string;
  description: string;
  coverImage: string;
  color: string;
  details?: string[];
  onSelect: () => void;
}

export default function CreativeProjectCard({
  title,
  type,
  year,
  description,
  coverImage,
  color,
  details = [],
  onSelect,
}: CreativeProjectCardProps) {
  const soundManager = useSoundManager();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={() => {
        soundManager.playClick();
        onSelect();
      }}
      className="relative bg-background/50 backdrop-blur-sm rounded-2xl overflow-hidden cursor-pointer group"
    >
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(45deg, ${color}20, transparent)`,
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center p-8">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full"
          >
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="space-y-2">
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
              <span className="text-primary/40">{year}</span>
            </div>
            <h2 className="text-3xl font-title">{title}</h2>
          </div>

          <p className="text-lg text-primary/70 leading-relaxed">
            {description}
          </p>

          {details.length > 0 && (
            <ul className="space-y-2">
              {details.map((detail, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3 text-primary/60 text-sm"
                >
                  <span style={{ color }}>&bull;</span>
                  {detail}
                </motion.li>
              ))}
            </ul>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2 rounded-xl text-white text-sm transition-colors"
            style={{ backgroundColor: color }}
            onMouseEnter={() => soundManager.playHover()}
          >
            Explore Project
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
