export type FileKind = "pdf" | "image" | "video" | "audio" | "audio-pair" | "link";

// One uniform shape so the data is easy to author. `src` is interpreted per kind:
//   pdf    → path to a .md file (rendered as a document)
//   image  → path to an image file
//   video  → Vimeo video ID (e.g. "76979871") OR a full player URL
//   audio  → path to an audio file
//   link   → external URL (opened in a new tab)
// An empty string falls back to the design's placeholder treatment.
export interface WorkFile {
  kind: FileKind;
  title: string;
  src: string;
}

export interface Work {
  id: string;
  title: string;
  year: string;
  medium: string;
  presentation: string;
  primary: { kind: "image" | "video" | "audio" | "audio-pair"; src: string; alt: string };
  files: WorkFile[];
}

export const AUTHOR = {
  name: "Ege Çam",
  tagline: "Portfolio · 2026",
  location: "Istanbul",
};

export const STATEMENT = `I work with data, code, digital and physical visuals, found objects and sounds, using old media and obsolete technologies.

The idea I am chasing after is about us, the false nostalgia feeding our profound loneliness through obsolete media. As the loneliest of Hominids, we are captives in the universe and the only friends around are the ones we moulded.

This captivity leads me to wire components, translate and sculpt data, dig and process sounds through cassettes, create speculative artifacts and understand the haunting pasts of people and spaces and to evoke a sense of empathy.

`;

export const WORKS: Work[] = [
  {
    id: "matisse-se100",
    title: "Matisse SE-100",
    year: "2026",
    medium: "Speculative artifact",
    presentation:
      "A fictional personal assistant presented as a product of Yamashiro Electronics, Osaka, manufactured between 1985 and 1989. The system runs end-to-end on a MacBook and a CRT television: speech is captured locally, transcribed with Whisper, answered by a custom Ollama model with a character system prompt, and spoken back through macOS text-to-speech. Music is played through a real-time degradation chain that returns it as a tired recording. A reactive layer in TouchDesigner drives the screen.",
    primary: { kind: "video", src: "1194791869", alt: "Demo" },
    files: [
      { kind: "pdf", title: "View project", src: "statements/matisse/EgeCam_MatisseSE100_2026.md" },
      { kind: "link", title: "Source code (GitHub)", src: "https://github.com/egecam/matisse" },
    ],
  },
  {
    id: "rasat",
    title: "RASAT",
    year: "2026",
    medium: "Generative data sculpture",
    presentation:
      "A system that reads Kandilli Observatory's catalogue of every earthquake recorded in the Marmara region since 1907 and renders each event as a vertical form in chronological order. Magnitude scales the form's size, depth controls its emergence. The structure oscillates and the particles around it move continuously. The data is real.",
    primary: { kind: "video", src: "1194800593", alt: "" },
    files: [
      { kind: "pdf", title: "View project", src: "statements/rasat/EgeCam_RASAT_2026.md" },
      { kind: "link", title: "Source code (GitHub)", src: "https://github.com/egecam/rasat" },
    ],
  },
  {
    id: "melodika",
    title: "Melodika",
    year: "2025",
    medium: "Released single",
    presentation:
      "Crafted from the home video archive of my own childhood: laughter, questions, voices calling and being called, lifted out as ambient material and woven into the track. Old media tells us something flattering about ourselves; a family records only its happy minutes, and the recording returns a childhood without trauma, a world without its problems. The piece works that illusion rather than the footage. The curation is the composition: choosing which fragments of a falsified past to let through, and at what distance.",
    primary: { kind: "audio", src: "audio/EgeCam_Melodika_2026.mp3", alt: "" },
    files: [],
  },
  {
    id: "untitled-hiroshima",
    title: "Untitled (Hiroshima)",
    year: "2024",
    medium: "Collage",
    presentation:
  "The past we long for never existed in the form we long for it. Children are born with a memory of a world that was never there, and meet its real version only later. Two figures stand with their backs to us, looking out over a city the morning after, at a globe that someone has placed into the sky. They see something that is not there. The black-and-white ground is found; the figures and the world are added. The vertical text reads \"August 6th, around ten o'clock\" in Japanese.",
    primary: { kind: "image", src: "image/hiroshima-1.jpg", alt: "" },
    files: [
      { kind: "image", title: "Detail 1", src: "image/hiroshima-2.jpg" },
      { kind: "image", title: "Detail 2", src: "image/hiroshima-3.jpg" },
      { kind: "image", title: "Detail 3", src: "image/hiroshima-4.jpg" },
    ],
  },
  {
    id: "walking-distance",
    title: "Walking Distance",
    year: "2025",
    medium: "electronic-ambient compositions, 6 pieces",
    presentation:
    "Each piece features the same asynchronous repetition, but at a different scale. \"301\" takes its name from a number produced twice by a system, eleven years apart: the miners who were lost at <a href=\"https://en.wikipedia.org/wiki/Soma_mine_disaster\" target=\"_blank\" rel=\"noopener noreferrer\">Soma in 2014</a> and the students who were detained during the <a href=\"https://en.wikipedia.org/wiki/2025%E2%80%932026_Turkish_protests\" target=\"_blank\" rel=\"noopener noreferrer\">2025 Turkish protests</a>. \"Mild or No Shaking\" is the wording of an earthquake app notification that we read every hour during the 2025 Istanbul tremors, when the Earth's inhabitants continued to move past each other.",
    primary: { kind: "audio-pair", src: "audio/EgeCam_301_2025.mp3, audio/EgeCam_MildOrNoShaking_2025.mp3", alt: "" },
    files: [
    ],
  },
  {
    id: "stills",
    title: "Stills",
    year: "2022-2026",
    medium: "Photographs",
    presentation:
      "Selected photographs from different series.",
    primary: { kind: "image", src: "image/distances-1.JPG", alt: "" },
    files: [
      { kind: "image", title: "Still 2", src: "image/distances-2.JPG" },
      { kind: "image", title: "Still 3", src: "image/distances-3.webp" },
      { kind: "image", title: "Still 4", src: "image/distances-4.jpg" },
      { kind: "image", title: "Still 5", src: "image/distances-5.jpg" },
    ],
  },
];

export const KIND_LABEL: Record<FileKind, string> = {
  pdf: "DOC",
  image: "IMG",
  video: "VID",
  audio: "AUD",
  "audio-pair": "AUD2",
  link: "URL",
};
