"use client";

import { useState } from "react";
import { Loader2, Plus, Search, Sparkles, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  researchTopic,
  type ContentResearch,
  type StudioInput,
} from "@/lib/content-studio";

import { TopicForm } from "./topic-form";
import { StatInput } from "./stat-input";

interface Props {
  input: StudioInput;
  patch: (p: Partial<StudioInput>) => void;
}

export function SearchPanel({ input, patch }: Props) {
  const [loading, setLoading] = useState(false);
  const [research, setResearch] = useState<ContentResearch | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runSearch = async () => {
    if (!input.topic.trim()) {
      setError("Enter a topic first.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const r = await researchTopic({
        topic: input.topic,
        contentType: input.contentType,
        audience: input.audience,
        tone: input.tone,
      });
      setResearch(r);
      patch({
        keyPoints: r.keyPoints.length ? r.keyPoints : input.keyPoints,
        stats: r.stats.length ? r.stats : input.stats,
        hashtags: r.hashtags.length ? r.hashtags : input.hashtags,
      });
    } catch {
      setError("Search failed. Using offline generation.");
    } finally {
      setLoading(false);
    }
  };

  const setPoint = (i: number, v: string) =>
    patch({ keyPoints: input.keyPoints.map((p, idx) => (idx === i ? v : p)) });
  const removePoint = (i: number) =>
    patch({ keyPoints: input.keyPoints.filter((_, idx) => idx !== i) });
  const addPoint = (v = "") => patch({ keyPoints: [...input.keyPoints, v] });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      {/* Inputs */}
      <div className="space-y-5 rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <TopicForm input={input} patch={patch} />

        <Button
          onClick={runSearch}
          disabled={loading}
          className="w-full"
          style={{ background: input.accent, color: "#FEF9FF" }}
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
          {loading ? "Researching…" : "Search trending content"}
        </Button>
        {error && <p className="text-sm text-amber-400">{error}</p>}

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <Label className="text-white/70">Key points</Label>
            <Button variant="ghost" size="xs" onClick={() => addPoint()}>
              <Plus className="size-3" /> Add
            </Button>
          </div>
          <div className="space-y-2">
            {input.keyPoints.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input value={p} onChange={(e) => setPoint(i, e.target.value)} />
                <Button variant="ghost" size="icon-sm" onClick={() => removePoint(i)} aria-label="Remove point">
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            {input.keyPoints.length === 0 && (
              <p className="text-sm text-white/40">No key points yet — search or add your own.</p>
            )}
          </div>
        </div>

        <div>
          <Label className="mb-1.5 text-white/70">Stats</Label>
          <StatInput stats={input.stats} onChange={(stats) => patch({ stats })} />
        </div>

        <div>
          <Label className="mb-1.5 text-white/70">Hashtags (comma-separated)</Label>
          <Input
            value={input.hashtags.join(", ")}
            onChange={(e) =>
              patch({
                hashtags: e.target.value
                  .split(",")
                  .map((h) => h.trim())
                  .filter(Boolean)
                  .map((h) => (h.startsWith("#") ? h : `#${h}`)),
              })
            }
            placeholder="#tech, #innovation"
          />
        </div>
      </div>

      {/* Results */}
      <div className="space-y-5">
        {!research ? (
          <div className="flex h-full min-h-60 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 p-8 text-center">
            <Sparkles className="mb-3 size-8 text-white/30" />
            <p className="text-sm text-white/50">
              Run a search to discover trending angles, stats and hashtags.
              <br />You can edit anything before generating.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <span className="rounded-full border border-white/10 px-2 py-0.5 uppercase tracking-wide">
                source: {research.source}
              </span>
            </div>

            <section>
              <h3 className="mb-2 text-sm font-semibold text-white/80">Trending angles</h3>
              <div className="space-y-2">
                {research.trending.map((t, i) => (
                  <div key={i} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-white">{t.title}</p>
                        {t.snippet && <p className="mt-0.5 text-xs text-white/50">{t.snippet}</p>}
                        {t.url && (
                          <a href={t.url} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs text-amethyst-300 hover:underline">
                            {t.source || "source"} ↗
                          </a>
                        )}
                      </div>
                      <Button variant="ghost" size="xs" onClick={() => addPoint(t.title)}>
                        <Plus className="size-3" /> Use
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {research.relatedTopics.length > 0 && (
              <section>
                <h3 className="mb-2 text-sm font-semibold text-white/80">Related topics</h3>
                <div className="flex flex-wrap gap-2">
                  {research.relatedTopics.map((rt, i) => (
                    <button
                      key={i}
                      onClick={() => patch({ topic: rt })}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/70 transition hover:border-amethyst-500/50 hover:text-white"
                    >
                      {rt}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {research.hashtags.length > 0 && (
              <section>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white/80">
                  Discovered hashtags
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {research.hashtags.map((h, i) => (
                    <span key={i} className="inline-flex items-center gap-1 rounded-md bg-white/[0.04] px-2 py-0.5 text-xs text-white/60">
                      {h}
                      <X
                        className="size-3 cursor-pointer hover:text-white"
                        onClick={() => patch({ hashtags: input.hashtags.filter((x) => x !== h) })}
                      />
                    </span>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
