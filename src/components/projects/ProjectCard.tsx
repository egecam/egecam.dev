"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import ProjectImageCarousel from "./ProjectImageCarousel";

export interface ProjectCardProps {
  title: string;
  type?: string;
  year?: string;
  description: string;
  coverImage?: string;
  color?: string;
  features?: string[];
  techStack: string;
  link: string;
  index?: number;
}

export default function ProjectCard({
  title,
  description,
  coverImage,
  color,
  features = [],
  techStack,
  link,
  index,
}: ProjectCardProps) {
  // Check if this is a project with carousel images
  const isOsculoProject = title === "Osculo";
  const isCompulseProject = title === "Compulse";
  const isVizorProject = title.includes("Vizor");

  const hasCarouselImages =
    isOsculoProject || isCompulseProject || isVizorProject;

  // Handle carousel navigation to prevent link navigation
  const handleCarouselClick = (e: React.MouseEvent) => {
    // Check if the click is on a carousel navigation button
    const target = e.target as HTMLElement;
    const isCarouselButton = target.closest("button");

    if (isCarouselButton) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Calculate animation delay based on index
  const getAnimationDelay = () => {
    if (typeof index !== "number") return 0;
    return index * 0.1; // 100ms delay per item
  };

  // Get the appropriate image prefix and count for carousel
  const getCarouselConfig = () => {
    if (isOsculoProject) {
      return { prefix: "osculo-", count: 4 };
    } else if (isCompulseProject) {
      return { prefix: "compulse-", count: 1 };
    } else if (isVizorProject) {
      return { prefix: "vizor-", count: 2 };
    }
    return { prefix: "", count: 0 };
  };

  const { prefix, count } = getCarouselConfig();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group mb-12 md:mb-16 w-full"
    >
      <div className="space-y-4 md:space-y-6">
        <Link
          href={link}
          className="block"
          onClick={hasCarouselImages ? handleCarouselClick : undefined}
        >
          {/* Title - Moved above the image */}
          <h2 className="text-xl md:text-2xl font-medium group-hover:text-accent transition-colors mb-3 md:mb-4">
            {title}
          </h2>

          {/* Image - Only show if we have a carousel or cover image */}
          {(hasCarouselImages || coverImage) && (
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg mb-4 md:mb-5">
              {hasCarouselImages ? (
                <ProjectImageCarousel
                  projectName={title}
                  imagePrefix={prefix}
                  imageCount={count}
                />
              ) : coverImage ? (
                <Image
                  src={coverImage}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                  priority={true}
                />
              ) : null}
            </div>
          )}

          <div className="space-y-4 md:space-y-5">
            {/* Description */}
            <p className="text-sm md:text-base text-primary/70 leading-relaxed">
              {description}
            </p>

            {/* Features */}
            {features && features.length > 0 && (
              <ul className="space-y-2 md:space-y-3 mt-4 md:mt-5">
                {features.map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    className="flex items-start gap-2 md:gap-3 text-xs md:text-sm text-primary/70"
                  >
                    <span className="flex-shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-sage" />
                    <span dangerouslySetInnerHTML={{ __html: feature }} />
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </Link>

        {/* Tech Stack Pills - Outside of the main link to be independently clickable */}
        <div className="flex flex-wrap gap-1.5 md:gap-2 pt-1">
          {techStack.split(", ").map((tech) => (
            <span
              key={tech}
              className="px-2 md:px-3 py-0.5 md:py-1 text-xs md:text-sm rounded-full bg-sage/5 hover:bg-sage/10 text-sage-dark transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
