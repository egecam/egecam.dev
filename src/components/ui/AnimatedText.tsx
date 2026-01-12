"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// Letter-by-letter animation component
interface AnimatedHeadingProps {
  text: string;
  className?: string;
}

export function AnimatedHeading({ text, className = "" }: AnimatedHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true });

  // Split text into words and letters
  const words = text.split(" ");

  return (
    <h1 ref={ref} className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-[0.25em]">
          {word.split("").map((letter, letterIndex) => {
            const overallIndex =
              words.slice(0, wordIndex).join(" ").length + letterIndex;
            return (
              <motion.span
                key={letterIndex}
                className="inline-block"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{
                  duration: 0.4,
                  delay: overallIndex * 0.02,
                  ease: [0.2, 0.65, 0.3, 0.9],
                }}
              >
                {letter}
              </motion.span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

// Word with hover synonym effect
interface HoverWordProps {
  word: string;
  synonyms?: string[];
  className?: string;
}

export function HoverWord({ word, synonyms = [], className = "" }: HoverWordProps) {
  const [currentWord, setCurrentWord] = useState(word);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    if (synonyms.length > 0) {
      setIsHovered(true);
      const randomSynonym = synonyms[Math.floor(Math.random() * synonyms.length)];
      setCurrentWord(randomSynonym);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentWord(word);
  };

  return (
    <span
      className={`inline-block cursor-default ${synonyms.length > 0 ? "cursor-pointer" : ""} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.span
        key={currentWord}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className={`inline-block whitespace-nowrap ${isHovered && synonyms.length > 0 ? "text-accent" : ""}`}
      >
        {currentWord}
      </motion.span>
    </span>
  );
}

// Interactive heading with hoverable words
interface InteractiveHeadingProps {
  className?: string;
}

// Each word has synonyms - layout will naturally adjust
const wordData: { word: string; synonyms?: string[] }[] = [
  { word: "Creating", synonyms: ["Crafting", "Building", "Designing", "Shaping"] },
  { word: "calm,", synonyms: ["serene,", "peaceful,", "tranquil,", "gentle,"] },
  { word: "expressive", synonyms: ["evocative", "vivid", "eloquent", "artistic"] },
  { word: "digital", synonyms: ["modern", "interactive", "immersive", "dynamic"] },
  { word: "experiences.", synonyms: ["moments.", "journeys.", "stories.", "worlds."] },
];

export function InteractiveHeading({ className = "" }: InteractiveHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <h1 ref={ref} className={`${className} flex flex-wrap gap-x-[0.25em]`}>
      {wordData.map((item, index) => (
        <motion.span
          key={index}
          className="inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            ease: [0.2, 0.65, 0.3, 0.9],
          }}
        >
          <HoverWord 
            word={item.word} 
            synonyms={item.synonyms} 
          />
        </motion.span>
      ))}
    </h1>
  );
}

// Typewriter effect component
interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}

export function TypewriterText({
  text,
  className = "",
  speed = 30,
  delay = 500,
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true });
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!isInView || hasStartedRef.current) return;
    
    hasStartedRef.current = true;
    let currentIndex = 0;
    let intervalId: NodeJS.Timeout;

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        currentIndex++;
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
        } else {
          clearInterval(intervalId);
          setIsComplete(true);
          setTimeout(() => setShowCursor(false), 1000);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [isInView, text, speed, delay]);

  return (
    <p ref={ref} className={className}>
      {displayText || (hasStartedRef.current ? "" : text)}
      {showCursor && !isComplete && hasStartedRef.current && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="inline-block w-[2px] h-[1em] bg-accent ml-1 align-middle"
        />
      )}
    </p>
  );
}

