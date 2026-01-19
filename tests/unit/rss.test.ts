import { describe, expect, it } from 'vitest';
import {
  escapeHtml,
  looksLikeHtml,
  transformPlainTextToHtml
} from '../../src/lib/rss-transform';

describe('RSS Transformation Functions', () => {
  describe('escapeHtml', () => {
    it('escapes multiple special characters', () => {
      expect(escapeHtml('<script>alert("XSS & stuff")</script>')).toBe(
        '&lt;script&gt;alert(&quot;XSS &amp; stuff&quot;)&lt;/script&gt;'
      );
    });

    it('returns unchanged string without special characters', () => {
      expect(escapeHtml('Hello World')).toBe('Hello World');
    });
  });

  describe('looksLikeHtml', () => {
    it('detects HTML tags vs plain text', () => {
      expect(looksLikeHtml('<p>Hello</p>')).toBe(true);
      expect(looksLikeHtml('Just plain text')).toBe(false);
      expect(looksLikeHtml('5 < 10 and 10 > 5')).toBe(false);
    });
  });

  describe('transformPlainTextToHtml', () => {
    it('handles mixed content with lists, headers, and paragraphs', () => {
      const input = `**Episode Summary**

This episode covers many topics & details.

**Timestamps**

(00:00) - Introduction
(05:30) - Main discussion
(00:00:15) - With seconds

**Links**

GitHub: https://github.com/example
https://example.com
Company & Co: https://example.com?foo=bar&baz=qux

Thanks for listening!`;

      const output = transformPlainTextToHtml(input);

      expect(output).toContain('<p><strong>Episode Summary</strong></p>');
      expect(output).toContain('<p>This episode covers many topics &amp; details.</p>');
      expect(output).toContain('<li>(00:00) - Introduction</li>');
      expect(output).toContain('<li>(00:00:15) - With seconds</li>');
      expect(output.match(/<ul>/g)).toHaveLength(2);
      expect(output).toContain(
        '<li>GitHub: <a href="https://github.com/example">https://github.com/example</a></li>'
      );
      expect(output).toContain(
        '<li>Company &amp; Co: <a href="https://example.com?foo=bar&amp;baz=qux">https://example.com?foo=bar&amp;baz=qux</a></li>'
      );
      expect(output).toContain('<p>Thanks for listening!</p>');
    });

    it('separates non-consecutive timestamp groups', () => {
      const input = `(00:00) - Intro
(05:00) - Part 1

Some text in between

(10:00) - Part 2
(15:00) - Part 3`;
      const output = transformPlainTextToHtml(input);
      expect(output.match(/<ul>/g)).toHaveLength(2);
    });

    it('returns empty string for blank input', () => {
      expect(transformPlainTextToHtml('')).toBe('');
      expect(transformPlainTextToHtml('   \n  \n  ')).toBe('');
    });
  });
});
