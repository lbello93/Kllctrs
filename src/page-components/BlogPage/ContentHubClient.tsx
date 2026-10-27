"use client";

import { useMemo, useState } from "react";

import ContentHeroSection from "./hero/ContentHeroSection";
import ContentFilterBar from "./filters/ContentFilterBar";
import EmptyState from "./empty/EmptyState";
import BlogGrid from "./grid/BlogGrid";

export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  meta_description?: string | null;
  published_at?: string | null;
  updated_at?: string | null;
  author?: string | null;
  type: string;
  category?: string | null;
}

interface Props {
  initialContent: ContentItem[];
}

export default function ContentHubClient({ initialContent }: Props) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filteredContent = useMemo(() => {
    return initialContent.filter((item) => {
      const normalizedCategory = item.category
        ?.toLowerCase()
        .replace(/\s+/g, "_");

      const matchesCategory =
        activeCategory === "all" || normalizedCategory === activeCategory;

      const q = search.toLowerCase();

      const matchesSearch =
        q === "" ||
        item.title?.toLowerCase().includes(q) ||
        item.meta_description?.toLowerCase().includes(q) ||
        item.author?.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [initialContent, activeCategory, search]);

  return (
    <main className="min-h-screen bg-[#FEF9FF]">
      <ContentHeroSection />

      <ContentFilterBar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        search={search}
        setSearch={setSearch}
        totalResults={filteredContent.length}
      />

      <section className="mx-auto max-w-7xl px-5 py-10">
        {filteredContent.length === 0 ? (
          <EmptyState search={search} />
        ) : (
          <BlogGrid content={filteredContent} />
        )}
      </section>
    </main>
  );
}
