# Video background music (`public/sounds/`)

These MP3s are the royalty-free soundtracks for the Remotion video engine. They
are referenced from compositions via Remotion's `staticFile('sounds/<file>')`
and registered in [`src/lib/video/audio-config.ts`](../../src/lib/video/audio-config.ts).

| File                   | Track key   | Mood         | BPM |
| ---------------------- | ----------- | ------------ | --- |
| `breaking-news.mp3`    | `breaking`  | urgent       | 120 |
| `corporate-upbeat.mp3` | `corporate` | professional | 110 |
| `dramatic-reveal.mp3`  | `dramatic`  | cinematic    | 90  |
| `upbeat-energy.mp3`    | `upbeat`    | energetic    | 128 |
| `ambient-tech.mp3`     | `ambient`   | calm         | 80  |

## What ships in the repo

Short **silent placeholder** MP3s, so previews and renders work immediately with
no setup. Replace them with real music before publishing videos.

## Adding real royalty-free music

Use [Pixabay Music](https://pixabay.com/music/) — CC0-style, free for commercial
use, **no attribution required**. Then either:

1. **Manual:** download tracks you like and save them here with the **exact
   filenames** in the table above, or
2. **Script:** run the downloader

   ```bash
   npm run setup:audio
   ```

   Set direct `.mp3` links first (open a Pixabay track, copy its download link):

   ```bash
   AUDIO_URL_BREAKING=... AUDIO_URL_CORPORATE=... AUDIO_URL_DRAMATIC=... \
   AUDIO_URL_UPBEAT=... AUDIO_URL_AMBIENT=... npm run setup:audio
   ```

   Any track without a URL is left as a silent placeholder, so the app keeps
   working.

## Keep BPM accurate

If you swap in a track at a different tempo, update its `bpm` in
`src/lib/video/audio-config.ts` — the beat-synced animations (flashes, pulses,
stat stagger) are driven by that number.
