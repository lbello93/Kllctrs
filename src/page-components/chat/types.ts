export interface ChatSource {
  title: string;
  url: string;
  type: "directory" | "official" | "listing";
}

export interface ChatMessageData {
  id?: string;
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[];
}

export interface ChatThread {
  id: string;
  title: string | null;
  updated_at: string;
}

export const CHAT_SUGGESTIONS = [
  "What card shows are coming up in Texas?",
  "Which companies sponsor the most shows?",
  "Find card shops near Chicago",
  "What are the biggest grading companies?",
];
