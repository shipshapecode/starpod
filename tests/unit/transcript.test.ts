import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  getRssTranscriptParagraphs,
  getRssTranscriptText,
  parseCues
} from 'starpod/src/lib/transcript';
import { getRssCues } from 'starpod/src/lib/cues';
import type { Episode } from 'starpod/src/lib/rss';

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

  it('parses WebVTT cues, preserving the start time so timestamps stay clickable', async () => {
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

    // Short cues group into one paragraph tagged with the first cue's start.
    expect(paragraphs).toEqual([
      { start: 4.5, text: 'Hello there. Welcome to the show.' }
    ]);
  });

  it('decodes the character references in cue text exactly once', async () => {
    // WebVTT escapes &, < and > in cue text; the page escapes its text again
    // when it renders, so leaving them encoded showed "Web &amp; Whatnot".
    mockFetch({
      body: [
        'WEBVTT',
        '',
        '1',
        '00:00:01.000 --> 00:00:03.000',
        'Whiskey, Web &amp; Whatnot: &lt;b&gt; isn&#39;t &quot;bold&quot; &gt; 1',
        '',
        '2',
        '00:00:03.000 --> 00:00:05.000',
        'Written &amp;lt; once &#x26; done'
      ].join('\n')
    });
    const paragraphs = await getRssTranscriptParagraphs(
      makeEpisode({ transcriptType: 'text/vtt' })
    );
    expect(paragraphs).toEqual([
      {
        start: 1,
        text: 'Whiskey, Web & Whatnot: <b> isn\'t "bold" > 1 Written &lt; once & done'
      }
    ]);
  });

  it('parses SRT cues (comma milliseconds, HH:MM:SS) with start times', async () => {
    const longCue = 'word '.repeat(140).trim(); // forces a paragraph break
    const srt = [
      '1',
      '00:00:03,000 --> 00:00:30,000',
      longCue,
      '',
      '2',
      '01:02:03,000 --> 01:02:10,000',
      'Second cue.'
    ].join('\n');
    mockFetch({ body: srt });

    const paragraphs = await getRssTranscriptParagraphs(
      makeEpisode({ transcriptType: 'application/x-subrip' })
    );

    expect(paragraphs).toEqual([
      { start: 3, text: longCue },
      { start: 3723, text: 'Second cue.' } // 1h 2m 3s
    ]);
  });

  it('falls back to plain-text paragraphs when there are no cues', async () => {
    mockFetch({
      body: 'First paragraph.\n\nSecond paragraph.',
      contentType: 'text/plain'
    });

    const paragraphs = await getRssTranscriptParagraphs(
      makeEpisode({ transcriptType: 'text/plain' })
    );

    expect(paragraphs).toEqual([
      { text: 'First paragraph.' },
      { text: 'Second paragraph.' }
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

describe('shared transcript download', () => {
  it('reads the Podcast Namespace startTime/body fields', async () => {
    mockFetch({
      body: JSON.stringify({
        segments: [{ startTime: 1.5, body: 'Hello from the spec.', speaker: 'Alice' }]
      })
    });

    expect(await getRssTranscriptParagraphs(makeEpisode())).toEqual([
      { start: 1.5, text: 'Hello from the spec.' }
    ]);
  });

  it('downloads once for both the page transcript and the live lines', async () => {
    const fetchMock = mockFetch({
      body: JSON.stringify({ segments: [{ start: 0, text: 'Hi there.', speaker: 'Al' }] })
    });
    const episode = makeEpisode();

    await getRssTranscriptParagraphs(episode);
    expect(await getRssCues(episode)).toEqual([{ s: 0, t: 'Hi there.', v: 0, n: 'Al' }]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('treats a downloaded but unusable JSON body as no transcript', async () => {
    mockFetch({ body: 'null' });
    expect(await getRssTranscriptParagraphs(makeEpisode())).toBeNull();
  });

  it('retries a transcript whose download failed', async () => {
    const episode = makeEpisode();
    mockFetch({ ok: false });
    expect(await getRssTranscriptParagraphs(episode)).toBeNull();

    mockFetch({ body: JSON.stringify({ segments: [{ start: 2, text: 'Back again.' }] }) });
    expect(await getRssTranscriptParagraphs(episode)).toEqual([
      { start: 2, text: 'Back again.' }
    ]);
  });
});

describe('parseCues', () => {
  it('takes the speaker from a WebVTT voice span and drops every tag', () => {
    expect(
      parseCues(
        'WEBVTT\n\n00:00:02.500 --> 00:00:04.000\n<v.loud Jev>It&#39;s <i>87%</i> &amp; rising</v>'
      )
    ).toEqual([{ start: 2.5, text: "It's 87% & rising", speaker: 'Jev' }]);
  });

  it('decodes the voice name too', () => {
    expect(
      parseCues('WEBVTT\n\n00:00:01.000 --> 00:00:02.000\n<v Tom &amp; Jerry>Hi</v>')
    ).toEqual([{ start: 1, text: 'Hi', speaker: 'Tom & Jerry' }]);
  });

  it("strips only cue markup, keeping SRT's bare < and > as text", () => {
    expect(
      parseCues('1\n00:00:01,000 --> 00:00:02,000\nIf x < 5 and y > 3, then <i>stop</i>.')
    ).toEqual([{ start: 1, text: 'If x < 5 and y > 3, then stop.' }]);
    expect(
      parseCues('WEBVTT\n\n00:00:01.000 --> 00:00:03.000\nWord<00:00:01.500> by <c.yellow>word</c>')
    ).toEqual([{ start: 1, text: 'Word by word' }]);
  });

  it('decodes each reference once', () => {
    expect(
      parseCues('WEBVTT\n\n00:00:01.000 --> 00:00:02.000\nShip it &amp; see &amp;lt;3')
    ).toEqual([{ start: 1, text: 'Ship it & see &lt;3' }]);
  });

  it('never turns escaped text into a tag', () => {
    expect(
      parseCues('WEBVTT\n\n00:00:01.000 --> 00:00:02.000\n&lt;v Mallory&gt; hi')
    ).toEqual([{ start: 1, text: '<v Mallory> hi' }]);
  });
});
