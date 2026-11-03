/**
 * Beat-sync helpers — turn a frame + fps + BPM into animation values that line
 * up with a music track's beat grid. Pure math (no React), so they're cheap to
 * call every frame from any composition or component.
 *
 * A "beat" is one quarter note: its length in frames is `fps * 60 / bpm`.
 */

/** Length of one beat in frames. */
export function framesPerBeat(fps: number, bpm: number): number {
  const safeBpm = bpm > 0 ? bpm : 110;
  return (fps * 60) / safeBpm;
}

/**
 * Progress through the current beat, 0 (just hit a beat) → 1 (about to hit the
 * next). Useful for driving a repeating ease over each beat.
 */
export function getBeatProgress(frame: number, fps: number, bpm: number): number {
  const fpb = framesPerBeat(fps, bpm);
  return (frame % fpb) / fpb;
}

/**
 * True when `frame` is within `tolerance` frames of a beat boundary. Default
 * tolerance of 1 frame means "fires on the frame the beat lands".
 */
export function isOnBeat(frame: number, fps: number, bpm: number, tolerance = 1): boolean {
  const fpb = framesPerBeat(fps, bpm);
  const since = frame % fpb;
  return since < tolerance || fpb - since < tolerance;
}

/**
 * A scale value that "thumps" on every beat: snaps up right on the beat then
 * eases back to 1 before the next. `intensity` is the extra scale at the peak
 * (0.12 → pulses between 1.0 and ~1.12).
 */
export function beatScale(frame: number, fps: number, bpm: number, intensity = 0.1): number {
  const p = getBeatProgress(frame, fps, bpm);
  // Fast attack, slow decay: 1 at p=0, easing to 0 by p=1.
  const pulse = Math.pow(1 - p, 2.2);
  return 1 + intensity * pulse;
}

/**
 * Opacity that flashes bright on the beat (1) and fades toward `floor` before
 * the next beat — for strobing overlays / "breaking" flashes.
 */
export function beatOpacity(frame: number, fps: number, bpm: number, floor = 0): number {
  const p = getBeatProgress(frame, fps, bpm);
  const flash = Math.pow(1 - p, 3);
  return floor + (1 - floor) * flash;
}
