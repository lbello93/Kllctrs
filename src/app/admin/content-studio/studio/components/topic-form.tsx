"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CONTENT_TYPES,
  DEFAULT_TOPIC,
  type Audience,
  type ContentType,
  type StudioInput,
  type Tone,
} from "@/lib/content-studio";

const AUDIENCES: Audience[] = ["tech", "founders", "general", "creators", "marketers", "students"];
const TONES: Tone[] = ["educational", "promotional", "trending", "storytelling", "tutorial", "engagement"];

interface Props {
  input: StudioInput;
  patch: (p: Partial<StudioInput>) => void;
}

/** Content type + topic + optional KLLCTRS event/drop context. */
export function TopicForm({ input, patch }: Props) {
  const selectType = (id: ContentType) => {
    // Pre-fill the topic from the content type if it's empty or still a default.
    const isDefaultTopic = !input.topic.trim() || Object.values(DEFAULT_TOPIC).includes(input.topic);
    patch({ contentType: id, ...(isDefaultTopic ? { topic: DEFAULT_TOPIC[id] } : {}) });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-2 text-white/70">Content type</Label>
        <div className="grid grid-cols-2 gap-2">
          {CONTENT_TYPES.map((c) => {
            const active = input.contentType === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => selectType(c.id)}
                title={c.description}
                className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-xs transition ${
                  active
                    ? "border-amethyst-500 bg-amethyst-500/15 text-white"
                    : "border-white/10 bg-white/[0.02] text-white/70 hover:border-white/20"
                }`}
              >
                <span className="text-base">{c.icon}</span>
                <span className="font-medium leading-tight">{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Label className="mb-1.5 text-white/70">Topic *</Label>
        <Input
          placeholder="e.g. Upcoming card show in Dallas"
          value={input.topic}
          onChange={(e) => patch({ topic: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="mb-1.5 text-white/70">Audience</Label>
          <Select value={input.audience} onValueChange={(v) => patch({ audience: v as Audience })}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AUDIENCES.map((a) => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1.5 text-white/70">Tone</Label>
          <Select value={input.tone} onValueChange={(v) => patch({ tone: v as Tone })}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TONES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <details className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
        <summary className="cursor-pointer text-sm font-medium text-white/70">
          Event / drop details (optional)
        </summary>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <Label className="mb-1.5 text-white/60">Event / drop name</Label>
            <Input value={input.eventName ?? ""} onChange={(e) => patch({ eventName: e.target.value })} />
          </div>
          <div>
            <Label className="mb-1.5 text-white/60">Location</Label>
            <Input value={input.location ?? ""} onChange={(e) => patch({ location: e.target.value })} />
          </div>
          <div>
            <Label className="mb-1.5 text-white/60">Date</Label>
            <Input type="date" value={input.date ?? ""} onChange={(e) => patch({ date: e.target.value })} />
          </div>
          <div>
            <Label className="mb-1.5 text-white/60">Vendor count</Label>
            <Input value={input.vendorCount ?? ""} onChange={(e) => patch({ vendorCount: e.target.value })} />
          </div>
          <div className="col-span-2">
            <Label className="mb-1.5 text-white/60">Card / set name</Label>
            <Input value={input.cardSet ?? ""} onChange={(e) => patch({ cardSet: e.target.value })} />
          </div>
        </div>
      </details>
    </div>
  );
}
