import { afterEach, describe, expect, it } from 'vitest';
import { POSITION_PREFIX, readPosition } from 'starpod/src/components/media/position';

describe('saved positions', () => {
  afterEach(() => localStorage.clear());

  it('reads where an episode was left, and 0 for anything else', () => {
    localStorage.setItem(`${POSITION_PREFIX}ep-1`, '754');
    localStorage.setItem(`${POSITION_PREFIX}ep-2`, 'junk');
    expect(readPosition('ep-1')).toBe(754);
    expect(readPosition('ep-2')).toBe(0);
    expect(readPosition('ep-3')).toBe(0);
  });
});
