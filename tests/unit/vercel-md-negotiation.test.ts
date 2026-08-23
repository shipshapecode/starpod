import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

import {
  buildNegotiationRoutes,
  collectMarkdownPaths,
  patchConfig
} from '../../scripts/vercel-md-negotiation.mjs';

const ACCEPT_MD = [{ type: 'header', key: 'accept', value: '.*text/markdown.*' }];

describe('vercel-md-negotiation', () => {
  describe('collectMarkdownPaths', () => {
    const dir = mkdtempSync(join(tmpdir(), 'starpod-md-'));

    afterAll(() => {
      rmSync(dir, { recursive: true, force: true });
    });

    it('finds every .html.md twin, including nested ones', () => {
      writeFileSync(join(dir, 'index.html.md'), '# home');
      writeFileSync(join(dir, 'about.html.md'), '# about');
      writeFileSync(join(dir, 'about.html'), '<html>');
      writeFileSync(join(dir, 'llms.txt'), 'llms');
      mkdirSync(join(dir, 'nested'));
      writeFileSync(join(dir, 'nested', 'page.html.md'), '# nested');

      expect(collectMarkdownPaths(dir)).toEqual([
        '/about',
        '/index',
        '/nested/page'
      ]);
    });
  });

  describe('buildNegotiationRoutes', () => {
    it('emits Vary stamps and Accept-conditional rewrites', () => {
      const routes = buildNegotiationRoutes(['/index', '/about', '/contact']);

      // Vary stamps come first and continue to later routes.
      expect(routes[0]).toEqual({
        src: '^/$',
        headers: { vary: 'Accept' },
        continue: true
      });
      expect(routes[1]).toEqual({
        src: '^/(?:about|contact)$',
        headers: { vary: 'Accept' },
        continue: true
      });

      // Rewrites only fire for markdown-accepting clients.
      expect(routes[2]).toEqual({
        src: '^/$',
        has: ACCEPT_MD,
        dest: '/index.html.md'
      });
      expect(routes[3]).toEqual({
        src: '^/(about|contact)$',
        has: ACCEPT_MD,
        dest: '/$1.html.md'
      });
    });

    it('escapes regex metacharacters in slugs', () => {
      const routes = buildNegotiationRoutes(['/what+is.this']);
      expect(routes[0].src).toBe('^/(?:what\\+is\\.this)$');
    });

    it('chunks large slug lists into multiple routes', () => {
      const paths = Array.from({ length: 120 }, (_, i) => `/episode-${i}`);
      const routes = buildNegotiationRoutes(paths);

      // 3 chunks of Vary stamps + 3 chunks of rewrites, no homepage.
      expect(routes).toHaveLength(6);
      expect(routes.every((r) => r.src.startsWith('^/'))).toBe(true);
    });

    it('returns no routes when there are no markdown twins', () => {
      expect(buildNegotiationRoutes([])).toEqual([]);
    });
  });

  describe('patchConfig', () => {
    const baseConfig = () => ({
      version: 3,
      routes: [
        { src: '^/old-path$', headers: { Location: '/new-path' }, status: 308 },
        { handle: 'filesystem' },
        { src: '^/.*$', dest: '_render' }
      ]
    });

    it('inserts negotiation routes before the filesystem handler', () => {
      const { config, inserted } = patchConfig(baseConfig(), [
        '/index',
        '/about'
      ]);

      expect(inserted).toBe(4);
      const filesystemIndex = config.routes.findIndex(
        (r: { handle?: string }) => r.handle === 'filesystem'
      );
      const rewriteIndex = config.routes.findIndex(
        (r: { dest?: string }) => r.dest === '/about.html.md' || r.dest === '/$1.html.md'
      );

      // Redirects stay first, negotiation routes go before filesystem.
      expect(config.routes[0].status).toBe(308);
      expect(rewriteIndex).toBeGreaterThan(0);
      expect(rewriteIndex).toBeLessThan(filesystemIndex);
    });

    it('is idempotent', () => {
      const { config } = patchConfig(baseConfig(), ['/index', '/about']);
      const { config: again, inserted } = patchConfig(config, [
        '/index',
        '/about'
      ]);

      expect(inserted).toBe(0);
      expect(again.routes).toHaveLength(config.routes.length);
    });

    it('throws when the filesystem handler is missing', () => {
      expect(() =>
        patchConfig({ version: 3, routes: [] }, ['/about'])
      ).toThrow(/filesystem/);
    });
  });
});
