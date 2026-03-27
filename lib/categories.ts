export type Category = {
  id: string;
  name: string;
  emoji: string;
  description: string;
};

export const CATEGORIES: Record<number, Category> = {
  1: {
    id: "sitrep",
    name: "SITREP Monday",
    emoji: "🎖️",
    description:
      "Weekly mental health and wellness check-in using military framing",
  },
  2: {
    id: "qotd",
    name: "Question of the Day",
    emoji: "💬",
    description:
      "Conversation starter about military life, transition, and shared experience",
  },
  3: {
    id: "history",
    name: "This Week in Military History",
    emoji: "📜",
    description:
      "Notable military history event from the current calendar week across US, UK, Israel, and Norway",
  },
  4: {
    id: "comms-check",
    name: "Comms Check",
    emoji: "📡",
    description: "Shoutouts, gratitude, and team connection",
  },
  5: {
    id: "fire-mission",
    name: "Friday Fire Mission",
    emoji: "🔥",
    description: "Fun, lighthearted prompt and weekend sendoff",
  },
};

export function getCategoryForDay(dayOfWeek: number): Category {
  return CATEGORIES[dayOfWeek] ?? CATEGORIES[1];
}
