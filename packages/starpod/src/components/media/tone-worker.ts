/**
 * Reads a 16×16 video frame back and finds its colours, on its own thread.
 * Reading pixels back from the GPU waits for it, and while the page scrolls
 * hard that wait reached 40–65ms; here it holds up nothing on screen.
 */
export {}; // A module worker (publish.ts loads it with type: 'module').

const context = new OffscreenCanvas(16, 16).getContext('2d', { willReadFrequently: true });

self.onmessage = ({ data: frame }: MessageEvent<ImageBitmap>) => {
  // Scaled here too, in case an engine ignored the bitmap's resize options.
  context?.drawImage(frame, 0, 0, 16, 16);
  frame.close();
  self.postMessage(context ? tones(context.getImageData(0, 0, 16, 16).data) : null);
};

/** The most common colour in the frame, and the most vivid one that is not rare. */
function tones(pixels: Uint8ClampedArray) {
  const buckets = new Map<number, Array<number>>();
  for (let i = 0; i < pixels.length; i += 4) {
    const key = ((pixels[i] >> 5) << 6) | ((pixels[i + 1] >> 5) << 3) | (pixels[i + 2] >> 5);
    const sum = buckets.get(key) ?? [0, 0, 0, 0];
    sum[0] += pixels[i];
    sum[1] += pixels[i + 1];
    sum[2] += pixels[i + 2];
    sum[3]++;
    buckets.set(key, sum);
  }
  let dominant = [0, 0, 0];
  let accent = [0, 0, 0];
  let most = 0;
  let vivid = -1;
  for (const [r, g, b, n] of buckets.values()) {
    const colour = [r / n, g / n, b / n];
    const chroma = Math.max(...colour) - Math.min(...colour);
    if (n > most) {
      [most, dominant] = [n, colour];
    }
    if (chroma * Math.sqrt(n) > vivid) {
      [vivid, accent] = [chroma * Math.sqrt(n), colour];
    }
  }
  return { video: dominant, accent };
}
