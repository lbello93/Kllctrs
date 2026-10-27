"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 600);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`fixed bottom-24 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-[#8B5CF6] text-white shadow-lg shadow-violet-500/30 transition-all duration-300 hover:opacity-90 ${
        visible
          ? "opacity-100 translate-y-0"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
}
