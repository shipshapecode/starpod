import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  getRssTranscriptParagraphs,
  getRssTranscriptText
} from '../../src/lib/transcript';
import type { Episode } from '../../src/lib/rss';

// Each test uses a unique transcript URL because the module caches parsed
// transcripts by URL — reusing a URL would return a previous test's cached
// result instead of re-fetching.
let urlCounter = 0;
function uniqueUrl() {
  urlCounter += 1;
  return `https://example.com/transcript-${urlCounter}.json`;
}

function makeEpisode(overrides: Partial<Episode> = {}): Episode {
  return {
    transcriptUrl: uniqueUrl(),
    transcriptType: 'application/json',
    ...overrides
  } as Episode;
}

function mockFetch(response: {
  ok?: boolean;
  body?: string;
  contentType?: string;
}) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: response.ok ?? true,
    text: async () => response.body ?? '',
    headers: { get: () => response.contentType ?? null }
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getRssTranscriptParagraphs', () => {
  it('returns null when the episode has no RSS transcript URL', async () => {
    const fetchMock = mockFetch({ body: '{}' });
    const episode = makeEpisode({ transcriptUrl: undefined });

    expect(await getRssTranscriptParagraphs(episode)).toBeNull();
    // No transcript URL means we should never hit the network.
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('parses JSON segments into paragraphs tagged with their start time', async () => {
    mockFetch({
      body: JSON.stringify({
        segments: [
          { start: 4.5, text: 'Hello there.' },
          { start: 8, text: 'Welcome to the show.' }
        ]
      })
    });

    const paragraphs = await getRssTranscriptParagraphs(makeEpisode());

    // Two short segments stay in a single paragraph, tagged with the first
    // segment's start time.
    expect(paragraphs).toEqual([
      { start: 4.5, text: 'Hello there. Welcome to the show.' }
    ]);
  });

  it('breaks into a new paragraph once a segment run gets long', async () => {
    const longText = 'word '.repeat(140).trim(); // ~700 chars, past the target
    mockFetch({
      body: JSON.stringify({
        segments: [
          { start: 0, text: longText },
          { start: 120, text: 'A second paragraph.' }
        ]
      })
    });

    const paragraphs = await getRssTranscriptParagraphs(makeEpisode());

    expect(paragraphs).toHaveLength(2);
    expect(paragraphs?.[0]).toEqual({ start: 0, text: longText });
    expect(paragraphs?.[1]).toEqual({ start: 120, text: 'A second paragraph.' });
  });

  it('falls back to the plain `text` field (no start times) when there are no segments', async () => {
    mockFetch({
      body: JSON.stringify({
        text: 'First paragraph.\n\nSecond paragraph.'
      })
    });

    const paragraphs = await getRssTranscriptParagraphs(makeEpisode());

    expect(paragraphs).toEqual([
      { text: 'First paragraph.' },
      { text: 'Second paragraph.' }
    ]);
  });

  it('strips WebVTT scaffolding for non-JSON transcripts', async () => {
    const vtt = [
      'WEBVTT',
      '',
      '1',
      '00:00:04.500 --> 00:00:08.000',
      'Hello there.',
      '',
      '2',
      '00:00:08.000 --> 00:00:12.000',
      'Welcome to the show.'
    ].join('\n');
    mockFetch({ body: vtt });

    const paragraphs = await getRssTranscriptParagraphs(
      makeEpisode({ transcriptType: 'text/vtt' })
    );

    expect(paragraphs).toEqual([
      { text: 'Hello there.' },
      { text: 'Welcome to the show.' }
    ]);
  });

  it('uses the response content-type when the feed omits a transcript type', async () => {
    mockFetch({
      contentType: 'application/json; charset=utf-8',
      body: JSON.stringify({ segments: [{ start: 1, text: 'Detected as JSON.' }] })
    });

    const paragraphs = await getRssTranscriptParagraphs(
      makeEpisode({ transcriptType: undefined })
    );

    expect(paragraphs).toEqual([{ start: 1, text: 'Detected as JSON.' }]);
  });

  it('returns null when the transcript response is not ok', async () => {
    mockFetch({ ok: false, body: 'Not Found' });

    expect(await getRssTranscriptParagraphs(makeEpisode())).toBeNull();
  });

  it('returns null when the fetch throws', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('network down'))
    );

    expect(await getRssTranscriptParagraphs(makeEpisode())).toBeNull();
  });

  it('returns null when the JSON transcript is malformed', async () => {
    mockFetch({ body: 'not json at all' });

    expect(await getRssTranscriptParagraphs(makeEpisode())).toBeNull();
  });

  it('returns null when a JSON transcript has neither segments nor text', async () => {
    mockFetch({ body: JSON.stringify({ word_count: 0 }) });

    expect(await getRssTranscriptParagraphs(makeEpisode())).toBeNull();
  });

  it('caches by URL so the same transcript is only fetched once', async () => {
    const fetchMock = mockFetch({
      body: JSON.stringify({ segments: [{ start: 0, text: 'Cached.' }] })
    });
    const episode = makeEpisode();

    const first = await getRssTranscriptParagraphs(episode);
    const second = await getRssTranscriptParagraphs(episode);

    expect(first).toEqual(second);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('getRssTranscriptText', () => {
  it('joins paragraphs with blank lines', async () => {
    mockFetch({
      body: JSON.stringify({
        text: 'First paragraph.\n\nSecond paragraph.'
      })
    });

    const text = await getRssTranscriptText(makeEpisode());

    expect(text).toBe('First paragraph.\n\nSecond paragraph.');
  });

  it('returns null when there is no usable transcript', async () => {
    const episode = makeEpisode({ transcriptUrl: undefined });

    expect(await getRssTranscriptText(episode)).toBeNull();
  });
});
