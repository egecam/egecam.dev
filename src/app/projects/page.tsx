"use client";

import { ProjectCard } from "@/components/projects";

const projects = [
  {
    title: "Osculo",
    description:
      "Osculo redefines how you experience written content, turning every saved article into a rich and immersive audio journey. By seamlessly blending advanced technology with thoughtful design, Osculo makes staying informed effortless and enjoyable.",
    features: [
      "<b>Tailored TTS voices</b> powered by ElevenLabs for a natural, lifelike narration",
      "<b>Real-time text tracking</b> with dynamic highlighting to elevate comprehension",
      "<b>Offline audio library</b> for uninterrupted listening, anytime, anywhere",
    ],
    techStack: "Swift, SwiftUI, SwiftData, Firebase, ElevenLabs",
    link: "https://getosculo.com",
  },
  {
    title: "Compulse",
    description:
      "Compulse isn't just a checklist app – it's your daily ritual keeper, designed to simplify life and bring peace of mind. this clean and efficient app helps you track and log essential daily tasks with ease.",
    features: [
      "<b>Instant logging</b> for tracking key moments in just a tap",
      "<b>Custom notifications and smart widgets</b> to gently remind you when it matters most",
      "<b>Video recording integration</b> for detailed, personalized logs",
    ],
    techStack: "Swift, SwiftUI, SwiftData",
    link: "https://apps.apple.com/tr/app/compulse-daily-check-track/id6737450150",
  },
  {
    title: "Vizor - Your Pocket Viewfinder",
    description:
      "Vizor is not just another photo app – it's a celestial canvas for iOS photographers. this elegantly crafted mobile application marries form and function in a package that's as visually stunning as the images it helps create.",
    features: [
      "<b>Minimalist homepage</b> showcasing real-time daylight phases powered by SunKit",
      "<b>Social feed</b> for sharing and discovering phenomenal photographs",
      '<b>Seamless cloud integration</b> with Firebase for a "no-backend" experience',
    ],
    techStack: "Swift, SwiftUI, UIKit, Firebase",
    link: "https://github.com/egecam/Vizor",
  },
  {
    title: "RateMyCocktail",
    description:
      "A dynamic social platform for cocktail enthusiasts. this django-powered application stirs together a potent mix of features for sharing, discovering, and rating your favorite libations.",
    features: [
      "<b>User-friendly interface</b> for browsing recipes with CocktailDB",
      "<b>Interactive rating system</b> with real-time updates and user feedback",
      "<b>Robust search functionality</b> for exploring cocktails by name, ingredient, or user",
    ],
    techStack: "Python, Django, SQLite, Bootstrap",
    link: "https://github.com/egecam/RateMyCocktail",
  },
  {
    title: "Music Recommendation System",
    description:
      "Dive into the world of personalized music discovery. this intelligent system employs advanced collaborative filtering techniques to connect listeners with their next favorite track.",
    features: [
      "<b>Analyzes user preferences</b> across a curated database of 24 diverse songs",
      "<b>Utilizes euclidean distance calculations</b> to identify musical soulmates among users",
      "<b>Delivers tailored recommendations</b> that evolve with individual tastes",
    ],
    techStack: "Python, SciPy",
    link: "https://github.com/egecam/MusicRecommendationSystem",
  },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-12 md:space-y-16 px-4 sm:px-6 md:px-0">
      <header className="space-y-4 md:space-y-6">
        <h1 className="text-3xl md:text-4xl font-display tracking-display text-foreground">
          Projects
        </h1>
        <p className="text-base md:text-lg text-foreground/80 max-w-2xl">
          Here&apos;s a selection of projects I&apos;ve worked on, showcasing my
          skills and experience.
        </p>
      </header>

      <div>
        {projects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </div>
  );
}
