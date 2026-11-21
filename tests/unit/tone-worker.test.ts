import { afterEach, describe, expect, it, vi } from 'vitest';

describe('the tone worker', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('draws the frame at 16×16 itself, whatever size the bitmap came in', async () => {
    const drawImage = vi.fn();
    vi.stubGlobal(
      'OffscreenCanvas',
      class {
        getContext() {
          return { drawImage, getImageData: () => ({ data: new Uint8ClampedArray(16 * 16 * 4) }) };
        }
      }
    );
    const posted = vi.fn();
    vi.spyOn(self, 'postMessage').mockImplementation(posted);
    await import('starpod/src/components/media/tone-worker');
    const frame = { close: vi.fn() };
    (self.onmessage as (event: { data: unknown }) => void)({ data: frame });
    expect(drawImage).toHaveBeenCalledWith(frame, 0, 0, 16, 16);
    expect(frame.close).toHaveBeenCalled();
    expect(posted).toHaveBeenCalled();
  });
});
