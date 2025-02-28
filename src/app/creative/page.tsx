"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import CreativeProjectCard from "@/components/creative/CreativeProjectCard";
import ProjectDetail from "@/components/creative/ProjectDetail";
import { useSoundManager } from "@/lib/sound";
import { useInView } from "react-intersection-observer";

type ImageSize = "sm" | "md" | "lg";
type ImageAspect = "square" | "wide";

interface FloatingImageProps {
  src: string;
  alt: string;
  initialX: number;
  initialY: number;
  floatX: number;
  floatY: number;
  duration: number;
  delay: number;
  rotate: number;
  size: ImageSize;
  aspect: ImageAspect;
}

const floatingImages: Array<Omit<FloatingImageProps, "key">> = [
  {
    src: "/garden/flowers.webp",
    alt: "Flowers",
    initialX: -400,
    initialY: -250,
    floatX: 80,
    floatY: 40,
    duration: 20,
    delay: 0,
    rotate: -15,
    size: "lg" as ImageSize,
    aspect: "wide" as ImageAspect,
  },
  {
    src: "/garden/touch.webp",
    alt: "Touch",
    initialX: 400,
    initialY: -180,
    floatX: -60,
    floatY: 50,
    duration: 18,
    delay: 1,
    rotate: 10,
    size: "sm" as ImageSize,
    aspect: "square" as ImageAspect,
  },
  {
    src: "/garden/music.webp",
    alt: "Music",
    initialX: -380,
    initialY: 200,
    floatX: 50,
    floatY: -70,
    duration: 15,
    delay: 2,
    rotate: 5,
    size: "md" as ImageSize,
    aspect: "wide" as ImageAspect,
  },
  {
    src: "/garden/dreams.webp",
    alt: "Dreams",
    initialX: 380,
    initialY: 180,
    floatX: -70,
    floatY: -50,
    duration: 22,
    delay: 3,
    rotate: -8,
    size: "lg" as ImageSize,
    aspect: "square" as ImageAspect,
  },
];

// Placeholder content for creative works
const creativeWorks = [
  {
    id: 1,
    title: "Nocturnal Echoes",
    type: "Music Album",
    year: "2024",
    description: "An ambient electronic journey through midnight cityscapes",
    coverImage: "/placeholder-album.jpg", // You'll need to add this image
    color: "#FF4500", // accent color
    details: [
      "7 tracks of atmospheric soundscapes",
      "Blend of analog synthesizers and field recordings",
      "Inspired by late-night urban exploration",
    ],
  },
  {
    id: 2,
    title: "Urban Fragments",
    type: "Photography Series",
    year: "2023",
    description: "Capturing the overlooked details of city life",
    coverImage: "/placeholder-photo.jpg", // You'll need to add this image
    color: "#95B365", // sage color
    details: [
      "25 black & white photographs",
      "Shot on medium format film",
      "Exhibited at Local Gallery Space",
    ],
  },
  // Add more creative works here
];

const FloatingImage = ({
  src,
  alt,
  initialX,
  initialY,
  floatX,
  floatY,
  duration,
  delay,
  rotate,
  size,
  aspect,
}: FloatingImageProps) => {
  const sizeClasses = {
    sm: {
      square: "w-32 h-32 md:w-36 md:h-36",
      wide: "w-48 h-28 md:w-56 md:h-32",
    },
    md: {
      square: "w-36 h-36 md:w-44 md:h-44",
      wide: "w-56 h-32 md:w-64 md:h-36",
    },
    lg: {
      square: "w-40 h-40 md:w-52 md:h-52",
      wide: "w-64 h-36 md:w-72 md:h-40",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0.4, x: initialX, y: initialY, rotate }}
      animate={{
        opacity: [0.4, 1, 0.4],
        x: [initialX, initialX + floatX, initialX],
        y: [initialY, initialY + floatY, initialY],
        rotate: [rotate - 2, rotate + 2, rotate - 2],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      className={`absolute pointer-events-none ${sizeClasses[size][aspect]}`}
      style={{
        filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.1))",
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover rounded-2xl"
        sizes={
          aspect === "wide"
            ? "(max-width: 768px) 256px, 288px"
            : "(max-width: 768px) 160px, 208px"
        }
      />
    </motion.div>
  );
};

export default function CreativePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const soundManager = useSoundManager();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Smoother transitions for hero effects
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(heroScrollProgress, [0, 0.5], [1, 0.8]);
  const heroY = useTransform(heroScrollProgress, [0, 0.5], [0, 100]);

  // Start background music on mount
  useEffect(() => {
    const startMusic = async () => {
      await soundManager.startBackgroundMusic();
    };
    startMusic();
  }, [soundManager]);

  // Handle project selection
  const handleProjectSelect = (index: number) => {
    soundManager.applyHighCutFilter();
    setSelectedProject(index);
  };

  // Handle project close
  const handleProjectClose = () => {
    soundManager.removeHighCutFilter();
    setSelectedProject(null);
  };

  const { ref } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <>
      {/* Full-width hero container */}
      <div
        ref={containerRef}
        className="relative min-h-screen -ml-[max(2rem,calc((100vw-64rem)/2+2rem))] -mr-[max(2rem,calc((100vw-64rem)/2+2rem))]"
      >
        {/* Hero Section */}
        <motion.div
          style={{
            opacity: heroOpacity,
            scale: heroScale,
            y: heroY,
          }}
          className="relative h-screen flex items-center justify-center overflow-hidden sticky top-0"
        >
          <div className="absolute inset-0 bg-dots-pattern opacity-5" />

          {/* Floating Images Layer */}
          <div className="absolute inset-0 flex items-center justify-center">
            {floatingImages.map((image) => (
              <FloatingImage key={image.src} {...image} />
            ))}
          </div>

          {/* Content Layer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6 px-4 relative z-20"
          >
            <div className="relative">
              <h1 className="text-6xl md:text-7xl lg:text-9xl font-title drop-shadow-[0_0_25px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_0_25px_rgba(255,255,255,0.05)]">
                Creative Garden
              </h1>
              <p className="text-xl md:text-2xl text-primary/60 max-w-3xl mx-auto mt-6">
                A space where technology meets artistry, featuring music,
                photography, and experimental projects.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Creative Works - Interactive Gallery */}
      <div className="relative z-10 bg-background perspective-[1000px]">
        <div className="max-w-5xl mx-auto px-4 py-32 space-y-32">
          <AnimatePresence mode="wait">
            {selectedProject === null ? (
              // Grid view
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 gap-16"
              >
                {creativeWorks.map((work, index) => (
                  <CreativeProjectCard
                    key={work.id}
                    {...work}
                    onSelect={() => handleProjectSelect(index)}
                  />
                ))}
              </motion.div>
            ) : (
              // Detailed view
              <ProjectDetail
                {...creativeWorks[selectedProject]}
                onClose={handleProjectClose}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
