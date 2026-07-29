"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Sparkles } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Card shows in Texas",
  "Shops near me with Pokemon",
  "Where can I get cards graded?",
];

export default function ChatWindow() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      const userMsg: Message = { role: "user", content: text };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            history: messages.slice(-6),
          }),
        });
        const data = await res.json();
        const reply = data.response ?? data.error ?? "Something went wrong.";
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Connection failed. Try again." },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, messages],
  );

  // ✅ Listen for hero search bar events
  useEffect(() => {
    const handler = (e: Event) => {
      const message = (e as CustomEvent<{ message: string }>).detail?.message;
      if (!message?.trim()) return;
      setOpen(true);
      // Delay slightly so panel animates open first
      setTimeout(() => sendMessage(message), 200);
    };

    window.addEventListener("kllctbls:chat", handler);
    return () => window.removeEventListener("kllctbls:chat", handler);
  }, [sendMessage]);

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="group fixed bottom-6 right-6 z-50 w-16 h-16 cursor-pointer"
        aria-label="Open chat"
      >
        <div className="relative w-full h-full">
          {/* Closed Crystal */}
          <Image
            src="/Chat/chat_icon_closed.png"
            alt="Chat"
            fill
            priority
            sizes="(max-width: 768px) 48px, 64px"
            className="
        absolute
        inset-0
        object-contain
        transition-all
        duration-500
        ease-out
        group-hover:opacity-0
        group-hover:scale-75
        group-hover:-rotate-12
      "
          />

          {/* Open Crystal */}
          <Image
            src="/Chat/chat_icon_open.png"
            alt="Chat"
            fill
            priority
            sizes="(max-width: 768px) 48px, 64px"
            className="
        absolute
        inset-0
        object-contain
        opacity-0
        scale-125
        rotate-12
        transition-all
        duration-500
        ease-out
        group-hover:opacity-100
        group-hover:scale-100
        group-hover:rotate-0
      "
          />

          {/* Close icon when chat is open */}
          {open && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full bg-black/40 p-2 backdrop-blur-sm">
                <X className="w-5 h-5 text-white" />
              </div>
            </div>
          )}
        </div>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 w-[390px] max-w-[calc(100vw-3rem)] h-[560px] max-h-[calc(100vh-8rem)] bg-white border border-violet-100 rounded-2xl shadow-2xl shadow-violet-200/50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-violet-100 bg-gradient-to-r from-violet-50 to-fuchsia-50 flex items-center gap-3 shrink-0">
              <div className="relative w-8 h-8 rounded-xl overflow-hidden shrink-0 shadow-md shadow-violet-500/20">
                <Image
                  src="/footer/Gem_Pink.png"
                  alt="KLLCTRS AI"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-black text-[#1a0a3d]">
                  KLLCTRS Assistant
                </div>
                <div className="text-[10px] text-[#4a3f6b]/40">
                  AI · verify key details
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#4a3f6b]/30 hover:text-[#4a3f6b] hover:bg-violet-100 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#faf9ff]"
            >
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-[#4a3f6b]/60">
                    Hi! Ask me about card shows, shops, prices, or anything
                    hobby-related.
                  </p>
                  <div className="flex flex-col gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="text-left text-xs px-3 py-2.5 rounded-xl border border-violet-200 hover:border-[#5f2eea] hover:bg-violet-50 text-[#4a3f6b]/70 hover:text-[#1a0a3d] transition-all cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
                      m.role === "user"
                        ? "bg-[#5f2eea] text-white rounded-br-sm shadow-lg shadow-violet-500/20"
                        : "bg-white border border-violet-100 text-[#1a0a3d] rounded-bl-sm shadow-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-violet-100 rounded-2xl rounded-bl-sm px-3.5 py-3 shadow-sm">
                    <span className="inline-flex gap-1">
                      {[0, 0.15, 0.3].map((delay, i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 bg-[#5f2eea]/40 rounded-full animate-bounce"
                          style={{ animationDelay: `${delay}s` }}
                        />
                      ))}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="p-3 border-t border-violet-100 bg-white flex gap-2 shrink-0"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                disabled={loading}
                className="flex-1 h-9 rounded-xl border border-violet-200 bg-[#faf9ff] px-3 text-sm text-[#1a0a3d] placeholder-[#4a3f6b]/30 focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 disabled:opacity-50 transition-colors"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="h-9 w-9 rounded-xl flex items-center justify-center disabled:opacity-40 cursor-pointer transition-opacity shrink-0"
                style={{
                  background: "linear-gradient(135deg, #5f2eea, #4a1fa8)",
                }}
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
