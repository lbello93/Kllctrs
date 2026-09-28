"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function ArticleTableOfContents({
  headings,
}: {
  headings: Heading[];
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -70% 0px" },
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <div className="rounded-2xl border border-violet-100 bg-white/80 p-5 backdrop-blur-sm">
      <p className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-[#5f2eea]">
        In This Article
      </p>
      <nav className="space-y-1.5">
        {headings.map((h) => (
          <a
            key={h.id}
            href={`#${h.id}`}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              activeId === h.id
                ? "font-bold text-[#5f2eea]"
                : "text-[#4a3f6b]/60 hover:text-[#1a0a3d]"
            } ${h.level === 3 ? "pl-4" : ""}`}
          >
            <ChevronRight className="h-3 w-3 shrink-0" />
            {h.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
