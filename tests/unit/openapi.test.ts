import { describe, expect, it } from 'vitest';

import { generateOpenApiSpec } from '../../src/lib/openapi';
import type { Show } from '../../src/lib/rss';
import type { StarpodConfig } from '../../src/utils/config';

const mockShow: Show = {
  title: 'Test Podcast',
  description: 'A test podcast',
  image: 'https://example.com/image.jpg',
  link: 'https://example.com'
};

const mockConfig: StarpodConfig = {
  blurb: 'Test blurb',
  description: 'Test description',
  hosts: [{ name: 'Host One', bio: 'Bio', img: 'host.jpg' }],
  platforms: {},
  rssFeed: 'https://example.com/rss.xml'
};

describe('generateOpenApiSpec', () => {
  const siteUrl = new URL('https://podcast.example.com');
  const spec = generateOpenApiSpec(mockShow, mockConfig, siteUrl);

  it('produces a valid OpenAPI 3.1 skeleton', () => {
    expect(spec.openapi).toBe('3.1.0');
    expect(spec.info.title).toBe('Test Podcast API');
    expect(spec.info.version).toBeTruthy();
    expect(spec.servers).toEqual([{ url: 'https://podcast.example.com' }]);
  });

  it('documents every public endpoint', () => {
    expect(Object.keys(spec.paths)).toEqual(
      expect.arrayContaining([
        '/api/episodes/search.json',
        '/api/episodes/{page}.json',
        '/api/contact',
        '/llms.txt',
        '/episodes-index.html.md',
        '/{episodeSlug}.html.md',
        '/openapi.json'
      ])
    );
  });

  it('documents the contact endpoint request and error responses', () => {
    const contact = spec.paths['/api/contact'].post;
    const formSchema =
      contact.requestBody.content['multipart/form-data'].schema;

    expect(formSchema.required).toEqual(['name', 'email', 'message']);
    expect(Object.keys(contact.responses)).toEqual(
      expect.arrayContaining(['200', '400', '405', '502'])
    );
  });

  it('defines Episode and Error schemas', () => {
    expect(spec.components.schemas.Episode.properties.episodeSlug).toBeTruthy();
    expect(spec.components.schemas.Error.properties.error).toBeTruthy();
  });

  it('is JSON-serializable', () => {
    expect(() => JSON.stringify(spec)).not.toThrow();
  });
});
