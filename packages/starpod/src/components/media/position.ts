/**
 * Where the visitor left each episode. The media engine saves it; play
 * controls and the explorer read it. It imports nothing, so any script can
 * use it without loading the engine.
 */
export const POSITION_PREFIX = 'starpod:pos:';

/** Where the visitor left this episode, in seconds (0 if never played). */
export function readPosition(id: string): number {
  try {
    // Storage may hold anything: only a real place in an episode counts.
    const seconds = Number(localStorage.getItem(POSITION_PREFIX + id));
    return Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
  } catch {
    return 0;
  }
}

/** Less than this into an episode starts it over rather than resuming. */
export const RESUME_MIN_SECONDS = 30;

/**
 * Where playing this episode starts: where it was left, once that is past
 * the first half minute; otherwise 0. The engine and every label share it.
 */
export function resumePoint(id: string): number {
  const seconds = readPosition(id);
  return seconds > RESUME_MIN_SECONDS ? seconds : 0;
}
