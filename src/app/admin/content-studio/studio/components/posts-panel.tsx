"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { generatePosts, type StudioInput } from "@/lib/content-studio";

import { PlatformCard } from "./platform-card";

export function PostsPanel({ input }: { input: StudioInput }) {
  const posts = useMemo(() => generatePosts(input), [input]);
  const [copiedAll, setCopiedAll] = useState(false);

  const copyAll = async () => {
    const bundle = posts.map((p) => `=== ${p.label} ===\n${p.text}`).join("\n\n\n");
    await navigator.clipboard.writeText(bundle);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  const downloadJson = () => {
    const slug = input.topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "content";
    const data = {
      topic: input.topic,
      audience: input.audience,
      tone: input.tone,
      generatedAt: new Date().toISOString(),
      posts: Object.fromEntries(posts.map((p) => [p.platform, p])),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}_content_bundle.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/50">6 platform-optimized posts, generated locally.</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyAll}>
            {copiedAll ? <Check className="size-3.5 text-amethyst-400" /> : <Copy className="size-3.5" />}
            {copiedAll ? "Copied all" : "Copy all"}
          </Button>
          <Button variant="outline" size="sm" onClick={downloadJson}>
            <Download className="size-3.5" /> Download JSON
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <PlatformCard key={p.platform} post={p} />
        ))}
      </div>
    </div>
  );
}
