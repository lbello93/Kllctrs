"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import { motion } from "framer-motion";
import type { ChatMessageData } from "./types";

function normalizeAssistantMarkdown(content: string) {
  return content
    .replace(/\\([\\`*_{}\[\]()#+\-.!|>])/g, "$1")
    .replace(/\[([^\]]+)\]\(\[(?:https?:\/\/[^\]]+)\]\((https?:\/\/[^)]+)\)\)/g, "[$1]($2)");
}

const isInternal = (href?: string) => Boolean(href?.startsWith("/") && !href.startsWith("//"));

const markdownComponents: Components = {
  a: ({ href, children }) => (
    <a
      href={href}
      target={isInternal(href) ? undefined : "_blank"}
      rel={isInternal(href) ? undefined : "noreferrer"}
      className="font-medium text-violet-700 underline decoration-violet-300 underline-offset-2 hover:text-violet-900"
    >
      {children}
    </a>
  ),
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  h2: ({ children }) => <h2 className="mb-2 mt-3 font-semibold first:mt-0">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-2 mt-3 font-semibold first:mt-0">{children}</h3>,
};

/** A single chat bubble. Assistant messages render markdown + source chips. */
export default function ChatMessage({
  message,
  streaming = false,
}: {
  message: ChatMessageData;
  streaming?: boolean;
}) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "whitespace-pre-wrap bg-[#5f2eea] text-white rounded-br-sm shadow-lg shadow-violet-500/20"
            : "bg-white border border-violet-100 text-[#1a0a3d] rounded-bl-sm shadow-sm"
        }`}
      >
        {isUser ? (
          message.content
        ) : message.content ? (
          <ReactMarkdown components={markdownComponents}>
            {normalizeAssistantMarkdown(message.content)}
          </ReactMarkdown>
        ) : streaming ? (
          <span className="inline-flex gap-1 py-0.5" aria-label="Assistant is typing">
            {[0, 0.15, 0.3].map((delay, i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#5f2eea]/40"
                style={{ animationDelay: `${delay}s` }}
              />
            ))}
          </span>
        ) : null}
        {!isUser && streaming && message.content && (
          <span className="ml-0.5 inline-block h-3.5 w-[2px] animate-pulse bg-violet-400 align-middle" />
        )}
      </div>

      {!isUser && Boolean(message.sources?.length) && (
        <div className="mt-2 flex max-w-[92%] flex-wrap gap-1.5">
          {message.sources?.map((source, i) => (
            <a
              key={`${source.url}-${i}`}
              href={source.url}
              target={isInternal(source.url) ? undefined : "_blank"}
              rel={isInternal(source.url) ? undefined : "noreferrer"}
              className="rounded-full border border-violet-100 bg-white px-2.5 py-1 text-[10px] text-violet-700 transition-colors hover:bg-violet-50"
              title={
                source.type === "official"
                  ? "Official source"
                  : source.type === "listing"
                    ? "Live listing"
                    : "KLLCTRS directory"
              }
            >
              {source.title}
            </a>
          ))}
        </div>
      )}
    </motion.div>
  );
}
