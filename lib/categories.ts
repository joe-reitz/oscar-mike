export type Category = {
  id: string;
  name: string;
  emoji: string;
  description: string;
};

const DAILY_CATEGORY: Category = {
  id: "daily",
  name: "Oscar Mike",
  emoji: "🫡",
  description: "Daily conversation starter from a veteran perspective",
};

export function getCategoryForDay(): Category {
  return DAILY_CATEGORY;
}
