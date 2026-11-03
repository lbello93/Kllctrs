"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Player } from "@remotion/player";
import { ArrowLeft, Clapperboard, Download, Film, Loader2, Music, Sparkles } from "lucide-react";

import { NewsBreaking } from "../../../remotion/compositions/NewsBreaking";
import { SponsorSpotlight } from "../../../remotion/compositions/SponsorSpotlight";
import { EventPreview } from "../../../remotion/compositions/EventPreview";
import { WeeklyRecap } from "../../../remotion/compositions/WeeklyRecap";
import {
  ANIMATION_STYLES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_META,
  VIDEO_WIDTH,
  type AnimationStyle,
  type VideoType,
} from "../../../remotion/constants";
import { AUDIO_TRACKS, AUDIO_TRACK_KEYS, type TrackKey } from "@/lib/video/audio-config";

export interface EventOption {
  id: string;
  name: string;
  date: string;
  city: string;
  state: string;
  sponsors: string[];
}
export interface SponsorOption {
  id: string;
  name: string;
  category: string;
  eventCount: number;
  states: string[];
  topEvents: string[];
}
export interface VideoItem {
  id: string;
  title: string | null;
  video_url: string | null;
  video_type: string | null;
  video_duration: number | null;
  status: string | null;
}

interface Props {
  events: EventOption[];
  sponsors: SponsorOption[];
  videos: VideoItem[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COMPONENTS: Record<VideoType, React.ComponentType<any>> = {
  news: NewsBreaking,
  sponsor: SponsorSpotlight,
  event: EventPreview,
  recap: WeeklyRecap,
};

// Thumbnail gradients mirror each composition's GradientBg variant.
const THUMB: Record<VideoType, string> = {
  news: "linear-gradient(135deg, #1a0505, #7f1010)",
  sponsor: "linear-gradient(135deg, #1a0a3d, #5f2eea)",
  event: "linear-gradient(135deg, #0a1a3d, #2e6cea)",
  recap: "linear-gradient(135deg, #1a0a3d, #7c3aed)",
};

const field =
  "w-full rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm text-[#1a0a3d] focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/30";
const labelCls = "mb-1 block text-xs font-bold text-[#4a3f6b]/70";

export default function VideoStudioClient({ events, sponsors, videos }: Props) {
  const router = useRouter();
  const [type, setType] = useState<VideoType>("news");
  const [audioTrack, setAudioTrack] = useState<TrackKey>(VIDEO_META.news.defaultTrack);
  const [animationStyle, setAnimationStyle] = useState<AnimationStyle>("kinetic");

  // Selecting a type resets the music to that type's default track.
  const selectType = (t: VideoType) => {
    setType(t);
    setAudioTrack(VIDEO_META[t].defaultTrack);
  };

  // Per-type prop state.
  const [news, setNews] = useState({
    headline: "Record-Breaking Card Sale Shakes the Hobby",
    body: "A rare rookie card crosses the block as collectors watch history unfold.",
    source: "KLLCTRS",
    category: "Breaking News",
  });
  const [sponsorProps, setSponsorProps] = useState({
    sponsorName: "PSA",
    category: "Grading",
    eventCount: 48,
    states: "CA, TX, FL, NY, IL",
    topEvents: "National Sports Collectors Convention, Dallas Card Show, Chantilly Show",
  });
  const [eventProps, setEventProps] = useState({
    eventName: "Dallas Card Show",
    date: "2026-12-12",
    city: "Dallas",
    state: "TX",
    sponsors: "PSA, Topps, Panini, Fanatics",
  });
  const [recapProps, setRecapProps] = useState({
    newEvents: 23,
    topSponsor: "PSA",
    trendingState: "Texas",
    events: "Dallas Card Show | Dec 12\nChantilly Show | Dec 14\nChicago Sun-Times Show | Dec 18",
  });

  const [rendering, setRendering] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "info" | "err"; text: string; url?: string } | null>(null);

  const toList = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

  // Build the inputProps for the selected composition from the form state,
  // including the shared audio-track + animation-style controls so the live
  // preview matches what will be rendered.
  const inputProps = useMemo(() => {
    const shared = { audioTrack, animationStyle };
    switch (type) {
      case "news":
        return { ...news, ...shared };
      case "sponsor":
        return {
          sponsorName: sponsorProps.sponsorName,
          category: sponsorProps.category,
          eventCount: Number(sponsorProps.eventCount) || 0,
          states: toList(sponsorProps.states),
          topEvents: toList(sponsorProps.topEvents),
          ...shared,
        };
      case "event":
        return {
          eventName: eventProps.eventName,
          date: eventProps.date,
          city: eventProps.city,
          state: eventProps.state,
          sponsors: toList(eventProps.sponsors),
          ...shared,
        };
      case "recap":
        return {
          weekStats: {
            newEvents: Number(recapProps.newEvents) || 0,
            topSponsor: recapProps.topSponsor,
            trendingState: recapProps.trendingState,
          },
          events: recapProps.events
            .split("\n")
            .map((line) => {
              const [name, date] = line.split("|").map((x) => x.trim());
              return name ? { name, date: date ?? "" } : null;
            })
            .filter((x): x is { name: string; date: string } => Boolean(x)),
          ...shared,
        };
    }
  }, [type, news, sponsorProps, eventProps, recapProps, audioTrack, animationStyle]);

  const meta = VIDEO_META[type];
  const durationSeconds = Math.round(meta.durationInFrames / VIDEO_FPS);

  const fillFromEvent = (id: string) => {
    const ev = events.find((e) => e.id === id);
    if (!ev) return;
    setEventProps({
      eventName: ev.name,
      date: ev.date,
      city: ev.city,
      state: ev.state,
      sponsors: ev.sponsors.join(", "),
    });
  };
  const fillFromSponsor = (id: string) => {
    const sp = sponsors.find((s) => s.id === id);
    if (!sp) return;
    setSponsorProps({
      sponsorName: sp.name,
      category: sp.category,
      eventCount: sp.eventCount,
      states: sp.states.join(", "),
      topEvents: sp.topEvents.join(", "),
    });
  };

  const render = async () => {
    setRendering(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/content/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          data: inputProps,
          audioTrack,
          animationStyle,
          title: `${meta.label} — ${new Date().toLocaleDateString()}`,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({
          kind: res.status === 503 ? "info" : "err",
          text: data.error ?? "Rendering failed.",
        });
        return;
      }
      setMessage({ kind: "ok", text: "Video rendered and saved as a draft.", url: data.videoUrl });
      router.refresh();
    } catch {
      setMessage({ kind: "err", text: "Something went wrong. Try again." });
    } finally {
      setRendering(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <Link href="/admin/content" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#5B18BE] hover:underline">
        <ArrowLeft className="h-4 w-4" /> Content Engine
      </Link>

      <header className="mb-5">
        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-[#1a0a3d]">
          <Clapperboard className="h-6 w-6 text-[#5f2eea]" /> Video Studio
        </h1>
        <p className="mt-1 text-sm text-[#4a3f6b]/60">
          Beat-synced motion graphics with Remotion — pick a format, fill the details, preview live, then render to MP4.
        </p>
      </header>

      {/* Video type picker */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Object.values(VIDEO_META).map((m) => {
          const selected = type === m.type;
          return (
            <button
              key={m.type}
              onClick={() => selectType(m.type)}
              className={`flex items-center gap-4 rounded-2xl border-2 bg-white p-3 text-left transition ${
                selected
                  ? "border-[#5f2eea] shadow-[0_8px_30px_rgba(95,46,234,0.18)]"
                  : "border-violet-100 hover:border-violet-300"
              }`}
            >
              <div
                className="flex h-16 w-24 flex-shrink-0 items-center justify-center rounded-xl text-3xl"
                style={{ background: THUMB[m.type] }}
              >
                {m.emoji}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-black text-[#1a0a3d]">{m.label}</p>
                  <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-[#5f2eea]">
                    ~{Math.round(m.durationInFrames / VIDEO_FPS)}s
                  </span>
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs text-[#4a3f6b]/60">{m.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.1fr]">
        {/* Form */}
        <section className="space-y-3 rounded-2xl border border-violet-100 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-[#5f2eea]">
            {meta.emoji} {meta.label} · {durationSeconds}s
          </p>

          {type === "news" && (
            <>
              <Labeled label="Headline"><input className={field} value={news.headline} onChange={(e) => setNews({ ...news, headline: e.target.value })} /></Labeled>
              <Labeled label="Body"><textarea rows={3} className={field} value={news.body} onChange={(e) => setNews({ ...news, body: e.target.value })} /></Labeled>
              <div className="grid grid-cols-2 gap-3">
                <Labeled label="Source"><input className={field} value={news.source} onChange={(e) => setNews({ ...news, source: e.target.value })} /></Labeled>
                <Labeled label="Category"><input className={field} value={news.category} onChange={(e) => setNews({ ...news, category: e.target.value })} /></Labeled>
              </div>
            </>
          )}

          {type === "sponsor" && (
            <>
              {sponsors.length > 0 && (
                <Labeled label="Auto-fill from sponsor">
                  <select className={field} defaultValue="" onChange={(e) => fillFromSponsor(e.target.value)}>
                    <option value="">Choose a sponsor…</option>
                    {sponsors.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </Labeled>
              )}
              <div className="grid grid-cols-2 gap-3">
                <Labeled label="Sponsor name"><input className={field} value={sponsorProps.sponsorName} onChange={(e) => setSponsorProps({ ...sponsorProps, sponsorName: e.target.value })} /></Labeled>
                <Labeled label="Category"><input className={field} value={sponsorProps.category} onChange={(e) => setSponsorProps({ ...sponsorProps, category: e.target.value })} /></Labeled>
              </div>
              <Labeled label="Event count"><input type="number" className={field} value={sponsorProps.eventCount} onChange={(e) => setSponsorProps({ ...sponsorProps, eventCount: Number(e.target.value) })} /></Labeled>
              <Labeled label="States (comma-separated)"><input className={field} value={sponsorProps.states} onChange={(e) => setSponsorProps({ ...sponsorProps, states: e.target.value })} /></Labeled>
              <Labeled label="Top events (comma-separated)"><input className={field} value={sponsorProps.topEvents} onChange={(e) => setSponsorProps({ ...sponsorProps, topEvents: e.target.value })} /></Labeled>
            </>
          )}

          {type === "event" && (
            <>
              {events.length > 0 && (
                <Labeled label="Auto-fill from event">
                  <select className={field} defaultValue="" onChange={(e) => fillFromEvent(e.target.value)}>
                    <option value="">Choose an event…</option>
                    {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
                  </select>
                </Labeled>
              )}
              <Labeled label="Event name"><input className={field} value={eventProps.eventName} onChange={(e) => setEventProps({ ...eventProps, eventName: e.target.value })} /></Labeled>
              <div className="grid grid-cols-3 gap-3">
                <Labeled label="Date"><input type="date" className={field} value={eventProps.date} onChange={(e) => setEventProps({ ...eventProps, date: e.target.value })} /></Labeled>
                <Labeled label="City"><input className={field} value={eventProps.city} onChange={(e) => setEventProps({ ...eventProps, city: e.target.value })} /></Labeled>
                <Labeled label="State"><input className={field} value={eventProps.state} onChange={(e) => setEventProps({ ...eventProps, state: e.target.value })} /></Labeled>
              </div>
              <Labeled label="Sponsors (comma-separated)"><input className={field} value={eventProps.sponsors} onChange={(e) => setEventProps({ ...eventProps, sponsors: e.target.value })} /></Labeled>
            </>
          )}

          {type === "recap" && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <Labeled label="New events"><input type="number" className={field} value={recapProps.newEvents} onChange={(e) => setRecapProps({ ...recapProps, newEvents: Number(e.target.value) })} /></Labeled>
                <Labeled label="Top sponsor"><input className={field} value={recapProps.topSponsor} onChange={(e) => setRecapProps({ ...recapProps, topSponsor: e.target.value })} /></Labeled>
                <Labeled label="Trending state"><input className={field} value={recapProps.trendingState} onChange={(e) => setRecapProps({ ...recapProps, trendingState: e.target.value })} /></Labeled>
              </div>
              <Labeled label="Events (one per line: Name | Date)">
                <textarea rows={4} className={field} value={recapProps.events} onChange={(e) => setRecapProps({ ...recapProps, events: e.target.value })} />
              </Labeled>
            </>
          )}

          {/* Shared presentation controls */}
          <div className="grid grid-cols-2 gap-3 border-t border-violet-100 pt-3">
            <Labeled label={<span className="inline-flex items-center gap-1"><Music className="h-3 w-3" /> Audio track</span>}>
              <select className={field} value={audioTrack} onChange={(e) => setAudioTrack(e.target.value as TrackKey)}>
                {AUDIO_TRACK_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {key} · {AUDIO_TRACKS[key].mood} ({AUDIO_TRACKS[key].bpm} BPM)
                  </option>
                ))}
              </select>
            </Labeled>
            <Labeled label={<span className="inline-flex items-center gap-1"><Sparkles className="h-3 w-3" /> Animation style</span>}>
              <select className={field} value={animationStyle} onChange={(e) => setAnimationStyle(e.target.value as AnimationStyle)}>
                {ANIMATION_STYLES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label} — {s.hint}
                  </option>
                ))}
              </select>
            </Labeled>
          </div>

          <button
            onClick={render}
            disabled={rendering}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #5f2eea, #4a1fa8)" }}
          >
            {rendering ? <Loader2 className="h-4 w-4 animate-spin" /> : <Film className="h-4 w-4" />}
            {rendering ? "Rendering… (this can take a minute)" : "Render Video"}
          </button>

          {message && (
            <div
              className={`rounded-xl border p-3 text-sm ${
                message.kind === "ok"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : message.kind === "info"
                    ? "border-violet-200 bg-violet-50 text-[#4a3f6b]"
                    : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message.text}
              {message.url && (
                <a href={message.url} target="_blank" rel="noreferrer" className="ml-2 inline-flex items-center gap-1 font-semibold text-[#5B18BE] hover:underline">
                  <Download className="h-3.5 w-3.5" /> Open video
                </a>
              )}
            </div>
          )}
        </section>

        {/* Live preview */}
        <section className="rounded-2xl border border-violet-100 bg-black p-3">
          <div className="overflow-hidden rounded-xl">
            <Player
              component={COMPONENTS[type]}
              inputProps={inputProps}
              durationInFrames={meta.durationInFrames}
              fps={VIDEO_FPS}
              compositionWidth={VIDEO_WIDTH}
              compositionHeight={VIDEO_HEIGHT}
              style={{ width: "100%" }}
              controls
              loop
            />
          </div>
          <p className="mt-2 px-1 text-xs text-white/50">
            Preview plays music too — unmute with the player controls. Beats drive the flashes, pulses and stat timing.
          </p>
        </section>
      </div>

      {/* Gallery */}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-black text-[#1a0a3d]">Generated videos ({videos.length})</h2>
        {videos.length === 0 ? (
          <p className="rounded-2xl border border-violet-100 bg-white p-5 text-sm text-[#4a3f6b]/50">
            No videos yet. Render one above to see it here.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => (
              <div key={v.id} className="overflow-hidden rounded-2xl border border-violet-100 bg-white">
                {v.video_url ? (
                  <video src={v.video_url} controls className="aspect-video w-full bg-black" preload="metadata" />
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-violet-50 text-sm text-[#4a3f6b]/50">No file</div>
                )}
                <div className="p-3">
                  <p className="truncate text-sm font-bold text-[#1a0a3d]">{v.title ?? "Untitled"}</p>
                  <p className="text-xs text-[#4a3f6b]/50">
                    {v.video_type ?? "video"} · {v.video_duration ?? "?"}s · {v.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Labeled({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <span className={labelCls}>{label}</span>
      {children}
    </div>
  );
}
