import { describe, expect, it } from 'vitest';

import {
  defineStarpodConfig,
  validateStarpodConfig,
  type StarpodConfig
} from 'starpod/src/utils/config';

const validConfig: StarpodConfig = {
  blurb: 'A test show.',
  description: 'A show for testing Starpod.',
  hosts: [{ name: 'Test Host', bio: 'Bio.', img: 'test-host.jpg' }],
  platforms: {},
  rssFeed: 'https://example.com/feed.xml'
};

describe('defineStarpodConfig', () => {
  it('returns a valid config unchanged', () => {
    expect(defineStarpodConfig(validConfig)).toEqual(validConfig);
  });

  it('accepts optional links and platform urls', () => {
    const config = defineStarpodConfig({
      ...validConfig,
      platforms: { spotify: 'https://open.spotify.com/show/abc' },
      links: [{ label: 'Store', href: 'https://example.com/store' }]
    });
    expect(config.links).toHaveLength(1);
  });

  it('rejects a non-URL rssFeed and names the field', () => {
    expect(() =>
      validateStarpodConfig({ ...validConfig, rssFeed: 'not a url' })
    ).toThrow(/rssFeed must be a valid URL/);
  });

  it('rejects an empty hosts array', () => {
    expect(() =>
      validateStarpodConfig({ ...validConfig, hosts: [] })
    ).toThrow(/at least one host/);
  });

  it('rejects a missing blurb with the field path', () => {
    const { blurb: _blurb, ...withoutBlurb } = validConfig;
    expect(() =>
      validateStarpodConfig(withoutBlurb as StarpodConfig)
    ).toThrow(/blurb/);
  });

  it('reports every problem at once', () => {
    const broken = {
      ...validConfig,
      rssFeed: 'nope',
      hosts: []
    } as StarpodConfig;
    let message = '';
    try {
      validateStarpodConfig(broken);
    } catch (error) {
      message = (error as Error).message;
    }
    expect(message).toMatch(/rssFeed/);
    expect(message).toMatch(/at least one host/);
  });

  it('rejects hosts missing an img with a helpful message', () => {
    expect(() =>
      validateStarpodConfig({
        ...validConfig,
        hosts: [{ name: 'X', bio: '', img: '' }]
      })
    ).toThrow(/src\/img\/people/);
  });
});
