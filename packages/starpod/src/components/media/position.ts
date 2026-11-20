/**
 * Where the visitor left each episode. The media engine saves it; play
 * controls and the explorer read it. It imports nothing, so any script can
 * use it without loading the engine.
 */
export const POSITION_PREFIX = 'starpod:pos:';

/** Where the engine will resume this episode, in seconds (0 if never played). */
export function readPosition(id: string): number {
  try {
    return Number(localStorage.getItem(POSITION_PREFIX + id)) || 0;
  } catch {
    return 0;
  }
}
