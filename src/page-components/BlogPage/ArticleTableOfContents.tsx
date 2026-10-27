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
    <div className="rounded-2xl border border-[#E5DFFD] bg-white p-5 shadow-[0_8px_28px_rgba(21,30,60,0.05)]">
      <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#5B18BE]">
        In This Article
      </p>
      <nav aria-label="Article contents" className="max-h-[calc(100vh-9rem)] space-y-1.5 overflow-y-auto">
        {headings.map((h) => (
          <a
            key={h.id}
            href={`#${h.id}`}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              activeId === h.id
                ? "font-semibold text-[#5B18BE]"
                : "text-[#596078] hover:text-[#151E3C]"
            } ${h.level === 3 ? "pl-4" : ""}`}
          >
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="min-w-0 break-words">{h.text}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
