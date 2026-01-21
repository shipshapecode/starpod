import { describe, expect, it } from 'vitest';
import {
  formatDuration,
  formatDate,
  cleanTranscript,
  truncateDescription,
  htmlToMarkdown,
  generateLlmsTxt,
  generateEpisodeMarkdown,
  generateEpisodesIndex,
  generateForLlmsMarkdown,
  generateAboutMarkdown
} from '../../src/lib/llms';
import type { Episode, Show } from '../../src/lib/rss';
import type { StarpodConfig } from '../../src/utils/config';

describe('LLM Utilities', () => {
  describe('formatDuration', () => {
    it('formats seconds to MM:SS when less than an hour', () => {
      expect(formatDuration(125)).toBe('2:05');
      expect(formatDuration(60)).toBe('1:00');
      expect(formatDuration(0)).toBe('0:00');
    });

    it('formats seconds to HH:MM:SS when an hour or more', () => {
      expect(formatDuration(3661)).toBe('1:01:01');
      expect(formatDuration(3600)).toBe('1:00:00');
      expect(formatDuration(7384)).toBe('2:03:04');
    });

    it('handles edge cases', () => {
      expect(formatDuration(59)).toBe('0:59');
      expect(formatDuration(3599)).toBe('59:59');
    });
  });

  describe('formatDate', () => {
    it('formats Unix timestamp to readable date', () => {
      const timestamp = new Date('2024-01-15T12:00:00Z').getTime();
      const result = formatDate(timestamp);
      expect(result).toContain('2024');
      expect(result).toContain('January');
    });

    it('handles different months correctly', () => {
      const timestamp = new Date('2023-12-25T12:00:00Z').getTime();
      const result = formatDate(timestamp);
      expect(result).toContain('2023');
      expect(result).toContain('December');
    });
  });

  describe('cleanTranscript', () => {
    it('removes timestamp patterns like [00:34]', () => {
      const input = '[00:34] Hello world\n[01:23] This is a test';
      const result = cleanTranscript(input);
      expect(result).not.toContain('[00:34]');
      expect(result).not.toContain('[01:23]');
      expect(result).toContain('Hello world');
      expect(result).toContain('This is a test');
    });

    it('removes timestamp patterns like [01:23:45]', () => {
      const input = '[01:23:45] Long format timestamp\n[00:01:02] Another one';
      const result = cleanTranscript(input);
      expect(result).not.toContain('[01:23:45]');
      expect(result).not.toContain('[00:01:02]');
      expect(result).toContain('Long format timestamp');
    });

    it('preserves speaker labels', () => {
      const input =
        '**Robbie Wagner:** [00:34] Hello\n**Chuck Carpenter:** [01:23] Hi there';
      const result = cleanTranscript(input);
      expect(result).toContain('**Robbie Wagner:**');
      expect(result).toContain('**Chuck Carpenter:**');
    });

    it('removes extra whitespace while preserving paragraphs', () => {
      const input = '[00:01] Line 1\n\n\n\n[00:02] Line 2\n\n[00:03] Line 3';
      const result = cleanTranscript(input);
      expect(result).not.toMatch(/\n{3,}/);
      expect(result).toContain('\n\n');
    });

    it('trims leading and trailing whitespace', () => {
      const input = '  \n\n[00:01] Content\n\n  ';
      const result = cleanTranscript(input);
      expect(result).toBe('Content');
    });
  });

  describe('truncateDescription', () => {
    it('truncates text longer than specified length', () => {
      const text = 'This is a long description that needs to be truncated';
      const result = truncateDescription(text, 20);
      expect(result.length).toBeLessThanOrEqual(23); // 20 + '...'
      expect(result).toContain('...');
    });

    it('returns original text if shorter than length', () => {
      const text = 'Short text';
      const result = truncateDescription(text, 50);
      expect(result).toBe(text);
    });

    it('removes HTML tags before truncating', () => {
      const text = '<p>This is <strong>HTML</strong> content</p>';
      const result = truncateDescription(text, 20);
      expect(result).not.toContain('<p>');
      expect(result).not.toContain('<strong>');
    });
  });

  describe('htmlToMarkdown', () => {
    it('converts HTML paragraphs to plain text', () => {
      const html = '<p>Hello world</p><p>Second paragraph</p>';
      const result = htmlToMarkdown(html);
      expect(result).not.toContain('<p>');
      expect(result).toContain('Hello world');
      expect(result).toContain('Second paragraph');
    });

    it('preserves links with href', () => {
      const html = '<a href="https://example.com">Click here</a>';
      const result = htmlToMarkdown(html);
      expect(result).toContain('example.com');
    });

    it('removes images', () => {
      const html = '<img src="test.jpg" alt="Test"> Text content';
      const result = htmlToMarkdown(html);
      expect(result).not.toContain('img');
      expect(result).toContain('Text content');
    });
  });

  describe('generateLlmsTxt', () => {
    const mockShow: Show = {
      title: 'Test Podcast',
      description: 'A test podcast description',
      image: 'https://example.com/image.jpg',
      link: 'https://example.com'
    };

    const mockConfig: StarpodConfig = {
      blurb: 'Test blurb',
      description: 'Test description',
      hosts: [
        {
          name: 'Host One',
          bio: 'Bio one',
          img: 'host1.jpg',
          twitter: 'https://twitter.com/host1'
        }
      ],
      platforms: {
        apple: 'https://apple.com/podcast',
        spotify: 'https://spotify.com/show'
      },
      rssFeed: 'https://example.com/rss.xml'
    };

    const mockEpisodes: Episode[] = [
      {
        id: 'ep1',
        title: 'Episode 1',
        published: Date.now(),
        description: 'First episode description',
        duration: 3600,
        content: 'Episode content',
        episodeSlug: 'episode-1',
        episodeNumber: '1',
        audio: { src: 'https://example.com/ep1.mp3', type: 'audio/mpeg' }
      }
    ];

    it('generates valid llms.txt with required sections', () => {
      const result = generateLlmsTxt(mockShow, mockEpisodes, mockConfig);

      expect(result).toContain('# Test Podcast');
      expect(result).toContain('> Test blurb');
      expect(result).toContain('Test description');
      expect(result).toContain('Hosted by: Host One');
      expect(result).toContain('## Main Documentation');
      expect(result).toContain('## Recent Episodes');
      expect(result).toContain('## Optional');
    });

    it('includes all platform links', () => {
      const result = generateLlmsTxt(mockShow, mockEpisodes, mockConfig);

      expect(result).toContain('https://apple.com/podcast');
      expect(result).toContain('https://spotify.com/show');
      expect(result).toContain('https://example.com/rss.xml');
    });

    it('includes recent episodes with truncated descriptions', () => {
      const result = generateLlmsTxt(mockShow, mockEpisodes, mockConfig);

      expect(result).toContain('Episode 1');
      expect(result).toContain('episode-1.html.md');
    });

    it('uses site URL when provided', () => {
      const siteUrl = new URL('https://podcast.example.com');
      const result = generateLlmsTxt(
        mockShow,
        mockEpisodes,
        mockConfig,
        siteUrl
      );

      expect(result).toContain('https://podcast.example.com');
      expect(result).toContain('/about.html.md');
    });
  });

  describe('generateEpisodeMarkdown', () => {
    const mockShow: Show = {
      title: 'Test Podcast',
      description: 'A test podcast',
      image: 'https://example.com/image.jpg',
      link: 'https://example.com'
    };

    const mockConfig: StarpodConfig = {
      blurb: 'Test blurb',
      description: 'Test description',
      hosts: [
        { name: 'Host One', bio: 'Bio', img: 'host.jpg' },
        { name: 'Host Two', bio: 'Bio 2', img: 'host2.jpg' }
      ],
      platforms: {},
      rssFeed: 'https://example.com/rss.xml'
    };

    const mockEpisode: Episode = {
      id: 'ep1',
      title: 'Test Episode',
      published: new Date('2024-01-15T12:00:00Z').getTime(),
      description: 'Episode description',
      duration: 3661,
      content: '<p>Episode HTML content</p>',
      episodeSlug: 'test-episode',
      episodeNumber: '42',
      audio: { src: 'https://example.com/ep.mp3', type: 'audio/mpeg' }
    };

    it('generates episode markdown with all metadata', () => {
      const result = generateEpisodeMarkdown(mockEpisode, mockShow, mockConfig);

      expect(result).toContain('# Episode 42: Test Episode');
      expect(result).toContain('**Show**: Test Podcast');
      expect(result).toContain('**Published**:');
      expect(result).toContain('2024');
      expect(result).toContain('**Duration**: 1:01:01');
      expect(result).toContain('**Episode Number**: 42');
    });

    it('includes host names', () => {
      const result = generateEpisodeMarkdown(mockEpisode, mockShow, mockConfig);

      expect(result).toContain('## Hosts');
      expect(result).toContain('Host One, Host Two');
    });

    it('converts HTML content to markdown', () => {
      const result = generateEpisodeMarkdown(mockEpisode, mockShow, mockConfig);

      expect(result).toContain('## Description');
      expect(result).not.toContain('<p>');
      expect(result).toContain('Episode HTML content');
    });

    it('includes audio link', () => {
      const result = generateEpisodeMarkdown(mockEpisode, mockShow, mockConfig);

      expect(result).toContain('## Audio');
      expect(result).toContain('https://example.com/ep.mp3');
    });

    it('includes transcript when provided', () => {
      const transcript = '**Speaker:** This is a transcript';
      const result = generateEpisodeMarkdown(
        mockEpisode,
        mockShow,
        mockConfig,
        transcript
      );

      expect(result).toContain('## Transcript');
      expect(result).toContain('This is a transcript');
    });

    it('shows not available message when no transcript', () => {
      const result = generateEpisodeMarkdown(mockEpisode, mockShow, mockConfig);

      expect(result).toContain('## Transcript');
      expect(result).toContain('Transcript not available');
    });
  });

  describe('generateEpisodesIndex', () => {
    const mockShow: Show = {
      title: 'Test Podcast',
      description: 'A test podcast',
      image: 'https://example.com/image.jpg',
      link: 'https://example.com'
    };

    const mockEpisodes: Episode[] = [
      {
        id: 'ep1',
        title: 'Episode 1',
        published: Date.now(),
        description: 'First episode',
        duration: 3600,
        content: 'Content 1',
        episodeSlug: 'episode-1',
        episodeNumber: '1',
        audio: { src: 'https://example.com/ep1.mp3', type: 'audio/mpeg' }
      },
      {
        id: 'ep2',
        title: 'Episode 2',
        published: Date.now() - 86400000,
        description: 'Second episode',
        duration: 1800,
        content: 'Content 2',
        episodeSlug: 'episode-2',
        episodeNumber: '2',
        audio: { src: 'https://example.com/ep2.mp3', type: 'audio/mpeg' }
      }
    ];

    it('generates index with episode count', () => {
      const result = generateEpisodesIndex(mockShow, mockEpisodes);

      expect(result).toContain('# Test Podcast - Episodes');
      expect(result).toContain('2 episodes');
    });

    it('lists all episodes with metadata', () => {
      const result = generateEpisodesIndex(mockShow, mockEpisodes);

      expect(result).toContain('## Episode 1: Episode 1');
      expect(result).toContain('## Episode 2: Episode 2');
      expect(result).toContain('**Published**:');
      expect(result).toContain('**Duration**:');
      expect(result).toContain('**Description**:');
    });

    it('includes links to episode markdown and audio', () => {
      const result = generateEpisodesIndex(mockShow, mockEpisodes);

      expect(result).toContain('episode-1.html.md');
      expect(result).toContain('episode-2.html.md');
      expect(result).toContain('https://example.com/ep1.mp3');
      expect(result).toContain('https://example.com/ep2.mp3');
    });

    it('uses site URL when provided', () => {
      const siteUrl = new URL('https://podcast.example.com');
      const result = generateEpisodesIndex(mockShow, mockEpisodes, siteUrl);

      expect(result).toContain('https://podcast.example.com');
    });
  });

  describe('generateForLlmsMarkdown', () => {
    const mockShow: Show = {
      title: 'Test Podcast',
      description: 'A test podcast',
      image: 'https://example.com/image.jpg',
      link: 'https://example.com'
    };

    const mockConfig: StarpodConfig = {
      blurb: 'Test blurb',
      description: 'Test description',
      hosts: [
        {
          name: 'Host One',
          bio: 'Bio one',
          img: 'host1.jpg',
          github: 'https://github.com/host1',
          twitter: 'https://twitter.com/host1',
          website: 'https://host1.com'
        }
      ],
      platforms: {
        apple: 'https://apple.com/podcast'
      },
      rssFeed: 'https://example.com/rss.xml'
    };

    const mockEpisodes: Episode[] = [
      {
        id: 'ep1',
        title: 'Episode 1',
        published: Date.now(),
        description: 'First episode',
        duration: 3600,
        content: 'Content',
        episodeSlug: 'episode-1',
        episodeNumber: '1',
        audio: { src: 'https://example.com/ep1.mp3', type: 'audio/mpeg' }
      }
    ];

    it('generates comprehensive for-llms page', () => {
      const result = generateForLlmsMarkdown(
        mockShow,
        mockEpisodes,
        mockConfig
      );

      expect(result).toContain('# Test Podcast - Guide for AI Assistants');
      expect(result).toContain('## Podcast Overview');
      expect(result).toContain('## Hosts');
      expect(result).toContain('## Episode Information');
      expect(result).toContain('## Recent Episodes');
      expect(result).toContain('## Transcript Availability');
      expect(result).toContain('## How to Listen');
      expect(result).toContain('## RSS Feed');
    });

    it('includes host information with all links', () => {
      const result = generateForLlmsMarkdown(
        mockShow,
        mockEpisodes,
        mockConfig
      );

      expect(result).toContain('### Host One');
      expect(result).toContain('Bio one');
      expect(result).toContain('https://github.com/host1');
      expect(result).toContain('https://twitter.com/host1');
      expect(result).toContain('https://host1.com');
    });

    it('calculates episode statistics', () => {
      const result = generateForLlmsMarkdown(
        mockShow,
        mockEpisodes,
        mockConfig
      );

      expect(result).toContain('**Total Episodes**: 1');
      expect(result).toContain('**Average Episode Duration**:');
    });
  });

  describe('generateAboutMarkdown', () => {
    const mockShow: Show = {
      title: 'Test Podcast',
      description: 'A test podcast',
      image: 'https://example.com/image.jpg',
      link: 'https://example.com'
    };

    const mockConfig: StarpodConfig = {
      blurb: 'Test blurb',
      description: 'Test description',
      hosts: [
        {
          name: 'Host One',
          bio: 'Bio one',
          img: 'host1.jpg',
          twitter: 'https://twitter.com/host1'
        }
      ],
      platforms: {
        spotify: 'https://spotify.com/show'
      },
      rssFeed: 'https://example.com/rss.xml'
    };

    it('generates about page with show info', () => {
      const result = generateAboutMarkdown(mockShow, mockConfig);

      expect(result).toContain('# About Test Podcast');
      expect(result).toContain('Test description');
    });

    it('includes host information', () => {
      const result = generateAboutMarkdown(mockShow, mockConfig);

      expect(result).toContain('## Meet the Hosts');
      expect(result).toContain('### Host One');
      expect(result).toContain('Bio one');
      expect(result).toContain('https://twitter.com/host1');
    });

    it('includes platform links', () => {
      const result = generateAboutMarkdown(mockShow, mockConfig);

      expect(result).toContain('## Listen to the Show');
      expect(result).toContain('https://spotify.com/show');
    });
  });
});
