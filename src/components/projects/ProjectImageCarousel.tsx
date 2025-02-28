"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { contentfulClient, getOptimizedImageUrl } from "@/lib/contentful";

interface ProjectImageCarouselProps {
  projectName: string;
  imagePrefix: string;
  imageCount: number;
}

export default function ProjectImageCarousel({
  projectName,
  imagePrefix,
  imageCount,
}: ProjectImageCarouselProps) {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const TRANSITION_DURATION = 5000; // 5 seconds per image
  const PROGRESS_INTERVAL = 50; // Update progress every 50ms
  const ANIMATION_DURATION = 400; // ms

  // Variants for image animations - using fade to prevent breaking
  const imageVariants = {
    enter: {
      opacity: 0,
    },
    center: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  };

  // Use useCallback to memoize the startProgressBar function
  const startProgressBar = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const totalSteps = TRANSITION_DURATION / PROGRESS_INTERVAL;
    let currentStep = 0;

    intervalRef.current = setInterval(() => {
      currentStep++;
      const newProgress = (currentStep / totalSteps) * 100;
      setProgress(newProgress);

      if (newProgress >= 100) {
        if (!isTransitioning) {
          setIsTransitioning(true);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
          setProgress(0);
          // Reset transitioning state after animation completes
          setTimeout(() => {
            setIsTransitioning(false);
          }, ANIMATION_DURATION);
        }
      }
    }, PROGRESS_INTERVAL);
  }, [
    PROGRESS_INTERVAL,
    TRANSITION_DURATION,
    images.length,
    isTransitioning,
    ANIMATION_DURATION,
  ]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);

        // Fetch assets from Contentful that match the image prefix
        const response = await contentfulClient.getAssets({
          "fields.title[match]": imagePrefix,
          limit: imageCount + 2, // Add a buffer for potential extra images
        });

        if (response.items.length > 0) {
          console.log(
            `Found ${response.items.length} images for ${projectName}`
          );

          // Sort images by their title to ensure correct order (osculo-1, osculo-2, etc.)
          const sortedItems = [...response.items].sort((a, b) => {
            const titleA = a.fields.title || "";
            const titleB = b.fields.title || "";

            // Extract numbers from titles (e.g., "osculo-1" -> 1)
            const numA = parseInt(titleA.split("-").pop() || "0", 10);
            const numB = parseInt(titleB.split("-").pop() || "0", 10);

            return numA - numB;
          });

          // Extract and optimize image URLs
          const imageUrls = sortedItems
            .map((item) => {
              const url = item.fields.file?.url;
              if (!url) return "";

              // Ensure URL has https protocol
              const fullUrl = url.startsWith("//") ? `https:${url}` : url;

              // Optimize the image URL with responsive sizes
              return getOptimizedImageUrl(fullUrl, {
                width: 800,
                height: 450,
                quality: 85,
                format: "webp",
                fit: "fill",
              });
            })
            .filter((url) => url !== "");

          setImages(imageUrls);
        }
      } catch (error) {
        console.error("Error fetching project images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [imagePrefix, imageCount, projectName]);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    setProgress(0);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Reset transitioning state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
      startProgressBar();
    }, ANIMATION_DURATION);
  }, [images.length, startProgressBar, isTransitioning, ANIMATION_DURATION]);

  const goToPrevious = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
    setProgress(0);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Reset transitioning state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
      startProgressBar();
    }, ANIMATION_DURATION);
  }, [images.length, startProgressBar, isTransitioning, ANIMATION_DURATION]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentIndex) return;

      setIsTransitioning(true);
      setCurrentIndex(index);
      setProgress(0);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Reset transitioning state after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
        startProgressBar();
      }, ANIMATION_DURATION);
    },
    [startProgressBar, currentIndex, isTransitioning, ANIMATION_DURATION]
  );

  // Auto-advance the carousel
  useEffect(() => {
    if (images.length <= 1) return;

    if (!isTransitioning) {
      startProgressBar();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [images.length, startProgressBar, isTransitioning]);

  // Preload all images for smoother transitions
  useEffect(() => {
    if (images.length <= 1) return;

    // Preload all images
    images.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [images]);

  // Skeleton loading component
  const SkeletonLoader = () => (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-accent/5 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5 animate-shimmer" />
    </div>
  );

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (images.length === 0) {
    return null; // Return null instead of a placeholder when no images are found
  }

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            disabled={isTransitioning}
            className={`absolute left-1 md:left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/20 p-1.5 md:p-2 text-white backdrop-blur-sm transition-all hover:bg-sage/60 ${
              isTransitioning ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Previous image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 md:h-5 md:w-5"
            >
              <path
                fillRule="evenodd"
                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={goToNext}
            disabled={isTransitioning}
            className={`absolute right-1 md:right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/20 p-1.5 md:p-2 text-white backdrop-blur-sm transition-all hover:bg-sage/60 ${
              isTransitioning ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Next image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 md:h-5 md:w-5"
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </>
      )}

      {/* Carousel indicators with progress bar */}
      {images.length > 1 && (
        <div className="absolute bottom-2 md:bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1 md:gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`relative h-1 md:h-1.5 rounded-full bg-white/30 transition-all overflow-hidden ${
                isTransitioning ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{ width: index === currentIndex ? "2rem" : "0.5rem" }}
              aria-label={`Go to image ${index + 1}`}
            >
              {index === currentIndex && (
                <motion.div
                  className="absolute left-0 top-0 h-full bg-white"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0 }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Images with smooth fade transitions */}
      <div className="relative h-full w-full overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentIndex}
            variants={imageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              opacity: {
                duration: ANIMATION_DURATION / 1000,
                ease: "easeInOut",
              },
            }}
            className="absolute inset-0"
          >
            <Image
              src={images[currentIndex]}
              alt={`${projectName} image ${currentIndex + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 50vw, 800px"
              priority={true}
            />
            {/* No gradient overlay */}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
