"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, PanelLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ChatSidebar from "./ChatSidebar";
import {
  CHAT_SUGGESTIONS,
  type ChatMessageData,
  type ChatSource,
  type ChatThread,
} from "./types";

type StreamEvent =
  | { type: "meta"; threadId: string; title: string | null }
  | { type: "token"; value: string }
  | { type: "sources"; sources: ChatSource[] }
  | { type: "error"; message: string }
  | { type: "done" };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [threadsLoading, setThreadsLoading] = useState(true);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  const loadThreads = useCallback(async () => {
    // No synchronous setState here — the effect calls this, and the loading
    // flag starts true and is cleared in `finally` after the awaited fetch.
    try {
      const res = await fetch("/api/chat/threads");
      if (res.status === 401) {
        setNeedsAuth(true);
        return;
      }
      setNeedsAuth(false);
      const data = await res.json();
      setThreads(Array.isArray(data.threads) ? data.threads : []);
    } catch {
      /* non-fatal: sidebar just stays empty */
    } finally {
      setThreadsLoading(false);
    }
  }, []);

  // Load history + focus when the panel is opened. Doing this in the click
  // handler (not an effect) keeps the data fetch tied to the user action.
  const toggleOpen = useCallback(() => {
    const next = !open;
    setOpen(next);
    if (next) {
      void loadThreads();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open, loadThreads]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || streaming) return;

      const priorHistory = messages.map((m) => ({ role: m.role, content: m.content }));
      setInput("");
      setStreaming(true);
      setMessages((prev) => [
        ...prev,
        { role: "user", content: trimmed },
        { role: "assistant", content: "" },
      ]);

      const appendToAssistant = (value: string) =>
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last?.role === "assistant") next[next.length - 1] = { ...last, content: last.content + value };
          return next;
        });
      const setAssistant = (patch: Partial<ChatMessageData>) =>
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last?.role === "assistant") next[next.length - 1] = { ...last, ...patch };
          return next;
        });

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmed,
            conversationId: activeThreadId,
            history: priorHistory.slice(-6),
          }),
        });

        if (res.status === 401) {
          setNeedsAuth(true);
          setMessages((prev) => prev.slice(0, -2));
          return;
        }
        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => ({}));
          setAssistant({ content: data.error ?? "Something went wrong. Please try again." });
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let newThreadId: string | null = null;

        const handle = (evt: StreamEvent) => {
          if (evt.type === "meta") newThreadId = evt.threadId;
          else if (evt.type === "token") appendToAssistant(evt.value);
          else if (evt.type === "sources") setAssistant({ sources: evt.sources });
          else if (evt.type === "error") setAssistant({ content: evt.message });
        };

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const raw of lines) {
            const line = raw.trim();
            if (!line) continue;
            try {
              handle(JSON.parse(line) as StreamEvent);
            } catch {
              /* ignore malformed partial line */
            }
          }
        }

        if (newThreadId) {
          setActiveThreadId(newThreadId);
          void loadThreads();
        }
      } catch {
        setAssistant({ content: "Connection failed. Please try again." });
      } finally {
        setStreaming(false);
      }
    },
    [streaming, messages, activeThreadId, loadThreads],
  );

  const startNewChat = useCallback(() => {
    setActiveThreadId(null);
    setMessages([]);
    setSidebarOpen(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const selectThread = useCallback(async (id: string) => {
    setActiveThreadId(id);
    setSidebarOpen(false);
    try {
      const res = await fetch(`/api/chat/threads/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      const loaded: ChatMessageData[] = Array.isArray(data.messages)
        ? data.messages.map((m: { role: "user" | "assistant"; content: string; sources?: ChatSource[] }) => ({
            role: m.role,
            content: m.content,
            sources: Array.isArray(m.sources) ? m.sources : undefined,
          }))
        : [];
      setMessages(loaded);
    } catch {
      /* non-fatal */
    }
  }, []);

  // Hero search bar dispatches this event to open the assistant and ask.
  useEffect(() => {
    const handler = (e: Event) => {
      const message = (e as CustomEvent<{ message: string }>).detail?.message;
      if (!message?.trim()) return;
      setOpen(true);
      void loadThreads();
      setTimeout(() => void sendMessage(message), 250);
    };
    window.addEventListener("kllctbls:chat", handler);
    return () => window.removeEventListener("kllctbls:chat", handler);
  }, [sendMessage, loadThreads]);

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={toggleOpen}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="group fixed bottom-6 right-6 z-50 h-16 w-16 cursor-pointer"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        <div className="relative h-full w-full">
          <Image
            src="/ChatPage-artifact/chat_icon_closed.webp"
            alt="Chat"
            fill
            priority
            sizes="(max-width: 768px) 48px, 64px"
            className="absolute inset-0 object-contain transition-all duration-500 ease-out group-hover:-rotate-12 group-hover:scale-75 group-hover:opacity-0"
          />
          <Image
            src="/ChatPage-artifact/chat_icon_open.webp"
            alt="Chat"
            fill
            priority
            sizes="(max-width: 768px) 48px, 64px"
            className="absolute inset-0 rotate-12 scale-125 object-contain opacity-0 transition-all duration-500 ease-out group-hover:rotate-0 group-hover:scale-100 group-hover:opacity-100"
          />
          {open && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full bg-black/40 p-2 backdrop-blur-sm">
                <X className="h-5 w-5 text-white" />
              </div>
            </div>
          )}
        </div>
      </motion.button>

      {/* Chat panel: full-screen on mobile, docked panel on desktop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex flex-col overflow-hidden border-violet-100 bg-white sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[70vh] sm:max-h-[640px] sm:w-[440px] sm:rounded-2xl sm:border sm:shadow-2xl sm:shadow-violet-200/50"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center gap-3 border-b border-violet-100 bg-gradient-to-r from-violet-50 to-fuchsia-50 px-4 py-3">
              <button
                onClick={() => setSidebarOpen((s) => !s)}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-[#4a3f6b]/40 transition-all hover:bg-violet-100 hover:text-[#4a3f6b]"
                aria-label="Toggle conversation history"
              >
                <PanelLeft className="h-4 w-4" />
              </button>
              <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-xl shadow-md shadow-violet-500/20">
                <Image src="/ChatPage-artifact/Gem_Pink.webp" alt="KLLCTRS AI" fill sizes="40px" className="object-contain" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-black text-[#1a0a3d]">KLLCTRS Assistant</div>
                <div className="text-[10px] text-[#4a3f6b]/40">AI · verify key details</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-[#4a3f6b]/30 transition-all hover:bg-violet-100 hover:text-[#4a3f6b]"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body: sidebar + conversation */}
            <div className="relative flex min-h-0 flex-1">
              {/* Sidebar (overlay on mobile, column on desktop) */}
              {sidebarOpen && (
                <>
                  <div
                    className="absolute inset-0 z-10 bg-black/20 sm:hidden"
                    onClick={() => setSidebarOpen(false)}
                  />
                  <div className="absolute inset-y-0 left-0 z-20 w-3/4 max-w-[240px] border-r border-violet-100 sm:static sm:z-0 sm:w-44 sm:max-w-none">
                    <ChatSidebar
                      threads={threads}
                      activeId={activeThreadId}
                      loading={threadsLoading}
                      onSelect={selectThread}
                      onNew={startNewChat}
                    />
                  </div>
                </>
              )}

              {/* Conversation column */}
              <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-[#faf9ff] p-4">
                  {messages.length === 0 && (
                    <div className="space-y-3">
                      <p className="text-sm text-[#4a3f6b]/60">
                        Hi! Ask me about card shows, sponsors, shops, prices, or anything hobby-related.
                      </p>
                      <div className="flex flex-col gap-2">
                        {CHAT_SUGGESTIONS.map((s) => (
                          <button
                            key={s}
                            onClick={() => void sendMessage(s)}
                            disabled={streaming || needsAuth}
                            className="cursor-pointer rounded-xl border border-violet-200 px-3 py-2.5 text-left text-xs text-[#4a3f6b]/70 transition-all hover:border-[#5f2eea] hover:bg-violet-50 hover:text-[#1a0a3d] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.map((m, i) => (
                    <ChatMessage
                      key={m.id ?? i}
                      message={m}
                      streaming={streaming && i === messages.length - 1 && m.role === "assistant"}
                    />
                  ))}
                </div>

                {/* Input or sign-in prompt */}
                {needsAuth ? (
                  <div className="shrink-0 border-t border-violet-100 bg-white p-4 text-center">
                    <p className="mb-2 text-xs text-[#4a3f6b]/60">Sign in to chat with the assistant.</p>
                    <Link
                      href="/login?redirect=/"
                      className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-semibold text-white"
                      style={{ background: "linear-gradient(135deg, #5f2eea, #4a1fa8)" }}
                    >
                      Sign in
                    </Link>
                  </div>
                ) : (
                  <ChatInput
                    ref={inputRef}
                    value={input}
                    onChange={setInput}
                    onSend={() => void sendMessage(input)}
                    disabled={streaming}
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
