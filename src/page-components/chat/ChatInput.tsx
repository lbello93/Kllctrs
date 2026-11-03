"use client";

import { forwardRef } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

/** Text input + send button for the chat panel. */
const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(function ChatInput(
  { value, onChange, onSend, disabled = false },
  ref,
) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }}
      className="flex shrink-0 gap-2 border-t border-violet-100 bg-white p-3"
    >
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ask anything..."
        disabled={disabled}
        maxLength={1000}
        className="h-9 flex-1 rounded-xl border border-violet-200 bg-[#faf9ff] px-3 text-sm text-[#1a0a3d] placeholder-[#4a3f6b]/30 transition-colors focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/30 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-xl transition-opacity disabled:opacity-40"
        style={{ background: "linear-gradient(135deg, #5f2eea, #4a1fa8)" }}
      >
        <Send className="h-4 w-4 text-white" />
      </button>
    </form>
  );
});

export default ChatInput;
