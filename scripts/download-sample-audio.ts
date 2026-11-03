/**
 * Populate public/sounds/ with royalty-free background music for the Remotion
 * video engine.
 *
 *   npm run setup:audio
 *
 * The repo ships short SILENT placeholder MP3s so previews/renders work out of
 * the box. This script replaces them with real tracks.
 *
 * Pixabay Music (https://pixabay.com/music/) is CC0-style: free for commercial
 * use, no attribution required. Pixabay does not expose a stable keyless
 * download API, so fill in direct MP3 URLs below (open a track on Pixabay, copy
 * its download link) or set them via env vars:
 *
 *   AUDIO_URL_BREAKING, AUDIO_URL_CORPORATE, AUDIO_URL_DRAMATIC,
 *   AUDIO_URL_UPBEAT, AUDIO_URL_AMBIENT
 *
 * Any track without a URL (or whose download fails) is left as a regenerated
 * silent placeholder, so the app keeps working either way.
 */
import { promises as fs } from "node:fs";
import path from "node:path";

import { AUDIO_TRACKS, type TrackKey } from "../src/lib/video/audio-config";

const OUT_DIR = path.join(process.cwd(), "public", "sounds");

// Fill these with direct .mp3 URLs (or use the AUDIO_URL_* env vars).
const SOURCES: Record<TrackKey, string> = {
  breaking: process.env.AUDIO_URL_BREAKING ?? "",
  corporate: process.env.AUDIO_URL_CORPORATE ?? "",
  dramatic: process.env.AUDIO_URL_DRAMATIC ?? "",
  upbeat: process.env.AUDIO_URL_UPBEAT ?? "",
  ambient: process.env.AUDIO_URL_AMBIENT ?? "",
};

/** Build a valid ~3s silent MPEG-1 Layer III file as a fallback. */
function silentMp3(seconds = 3): Buffer {
  const header = Buffer.from([0xff, 0xfb, 0x90, 0xc0]); // 128kbps, 44.1kHz, mono
  const frameLen = Math.floor((144 * 128000) / 44100); // 417 bytes
  const frames = Math.ceil((seconds * 44100) / 1152);
  const frame = Buffer.concat([header, Buffer.alloc(frameLen - header.length, 0)]);
  return Buffer.concat(Array.from({ length: frames }, () => frame));
}

async function downloadOne(key: TrackKey): Promise<"downloaded" | "placeholder"> {
  const { file } = AUDIO_TRACKS[key];
  const dest = path.join(OUT_DIR, file);
  const url = SOURCES[key];

  if (url) {
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 1024) throw new Error("file suspiciously small");
      await fs.writeFile(dest, buf);
      console.log(`✓ ${file}  (${(buf.length / 1024).toFixed(0)} KB)  ← ${url}`);
      return "downloaded";
    } catch (err) {
      console.warn(`! ${file}: download failed (${(err as Error).message}); writing silent placeholder`);
    }
  } else {
    console.warn(`· ${file}: no URL set; writing silent placeholder`);
  }

  await fs.writeFile(dest, silentMp3());
  return "placeholder";
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const results = await Promise.all((Object.keys(AUDIO_TRACKS) as TrackKey[]).map(downloadOne));

  const downloaded = results.filter((r) => r === "downloaded").length;
  console.log(`\nDone: ${downloaded}/${results.length} real tracks, ${results.length - downloaded} placeholder(s).`);
  if (downloaded < results.length) {
    console.log(
      "\nTo add real music: grab free tracks from https://pixabay.com/music/ and either\n" +
        "  • drop them in public/sounds/ with the exact filenames above, or\n" +
        "  • set AUDIO_URL_* env vars to their direct .mp3 links and rerun `npm run setup:audio`.",
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
