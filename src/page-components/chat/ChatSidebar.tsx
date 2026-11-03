"use client";

import { Plus, MessageSquare } from "lucide-react";
import type { ChatThread } from "./types";

interface ChatSidebarProps {
  threads: ChatThread[];
  activeId: string | null;
  loading?: boolean;
  onSelect: (id: string) => void;
  onNew: () => void;
}

/** Conversation history list shown beside the chat panel. */
export default function ChatSidebar({
  threads,
  activeId,
  loading = false,
  onSelect,
  onNew,
}: ChatSidebarProps) {
  return (
    <div className="flex h-full w-full flex-col bg-[#f7f5ff]">
      <div className="shrink-0 p-2">
        <button
          onClick={onNew}
          className="flex w-full cursor-pointer items-center gap-2 rounded-xl border border-violet-200 bg-white px-3 py-2 text-xs font-semibold text-[#1a0a3d] transition-colors hover:border-[#5f2eea] hover:bg-violet-50"
        >
          <Plus className="h-3.5 w-3.5" />
          New chat
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        {loading && threads.length === 0 ? (
          <p className="px-2 py-3 text-xs text-[#4a3f6b]/40">Loading…</p>
        ) : threads.length === 0 ? (
          <p className="px-2 py-3 text-xs text-[#4a3f6b]/40">No conversations yet.</p>
        ) : (
          <ul className="space-y-1">
            {threads.map((thread) => (
              <li key={thread.id}>
                <button
                  onClick={() => onSelect(thread.id)}
                  className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                    thread.id === activeId
                      ? "bg-violet-100 text-[#1a0a3d]"
                      : "text-[#4a3f6b]/70 hover:bg-violet-50 hover:text-[#1a0a3d]"
                  }`}
                >
                  <MessageSquare className="h-3.5 w-3.5 shrink-0 text-[#5f2eea]/50" />
                  <span className="truncate">{thread.title || "Untitled chat"}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
