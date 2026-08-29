import type { Show } from './rss';
import type { StarpodConfig } from '../utils/config';

/**
 * Generate an OpenAPI 3.1 specification describing every public machine-usable
 * endpoint the site exposes, so agents can discover the API surface
 * automatically at /openapi.json.
 */
export function generateOpenApiSpec(
  show: Show,
  config: StarpodConfig,
  siteUrl?: URL
) {
  const baseUrl = siteUrl?.origin || '';

  return {
    openapi: '3.1.0',
    info: {
      title: `${show.title} API`,
      description:
        `Public API and machine-readable content endpoints for ${show.title}. ` +
        `${config.blurb} ` +
        `Content pages also serve markdown via the Accept header (Accept: text/markdown) or at their .html.md twin URL. ` +
        `See ${baseUrl}/llms.txt for a structured overview of all resources.`,
      version: '1.0.0',
      contact: {
        url: `${baseUrl}/contact`
      }
    },
    servers: [{ url: baseUrl }],
    paths: {
      '/api/episodes/search.json': {
        get: {
          operationId: 'listAllEpisodes',
          summary: 'List every episode as a single JSON array',
          description:
            'Returns all episodes with title, description, publish date, duration, slug, and audio URL. Intended for search and lookup.',
          responses: {
            '200': {
              description: 'All episodes',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Episode' }
                  }
                }
              }
            }
          }
        }
      },
      '/api/episodes/{page}.json': {
        get: {
          operationId: 'listEpisodesPage',
          summary: 'List episodes in pages of 15',
          parameters: [
            {
              name: 'page',
              in: 'path',
              required: true,
              description: '1-based page number',
              schema: { type: 'integer', minimum: 1 }
            }
          ],
          responses: {
            '200': {
              description: 'One page of episodes',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      canLoadMore: { type: 'boolean' },
                      episodes: {
                        type: 'object',
                        description:
                          'Astro pagination object; episodes are in the data property',
                        properties: {
                          data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Episode' }
                          },
                          currentPage: { type: 'integer' },
                          lastPage: { type: 'integer' },
                          total: { type: 'integer' }
                        }
                      }
                    }
                  }
                }
              }
            },
            '404': {
              description: 'Page number out of range',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        }
      },
      '/api/contact': {
        post: {
          operationId: 'sendContactMessage',
          summary: 'Send a message to the show',
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'message'],
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    message: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Message delivered',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: { message: { type: 'string' } }
                  }
                }
              }
            },
            '400': {
              description: 'Missing or invalid fields',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            },
            '405': {
              description: 'Method not allowed (only POST is supported)',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            },
            '502': {
              description: 'Message could not be delivered upstream',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        }
      },
      '/llms.txt': {
        get: {
          operationId: 'getLlmsTxt',
          summary: 'llms.txt overview of all resources for AI agents',
          responses: {
            '200': {
              description: 'llms.txt content',
              content: { 'text/plain': { schema: { type: 'string' } } }
            }
          }
        }
      },
      '/episodes-index.html.md': {
        get: {
          operationId: 'getEpisodesIndexMarkdown',
          summary: 'Complete episode listing as markdown',
          responses: {
            '200': {
              description: 'Markdown listing of every episode',
              content: { 'text/markdown': { schema: { type: 'string' } } }
            }
          }
        }
      },
      '/{episodeSlug}.html.md': {
        get: {
          operationId: 'getEpisodeMarkdown',
          summary:
            'Single episode as markdown, including the full transcript when available',
          parameters: [
            {
              name: 'episodeSlug',
              in: 'path',
              required: true,
              description:
                'Episode slug or episode number, as listed in the episodes index',
              schema: { type: 'string' }
            }
          ],
          responses: {
            '200': {
              description: 'Episode details and transcript as markdown',
              content: { 'text/markdown': { schema: { type: 'string' } } }
            },
            '404': {
              description: 'Unknown episode',
              content: { 'text/markdown': { schema: { type: 'string' } } }
            }
          }
        }
      },
      '/openapi.json': {
        get: {
          operationId: 'getOpenApiSpec',
          summary: 'This OpenAPI specification',
          responses: {
            '200': {
              description: 'OpenAPI 3.1 specification',
              content: { 'application/json': { schema: { type: 'object' } } }
            }
          }
        }
      }
    },
    components: {
      schemas: {
        Episode: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            published: {
              type: 'integer',
              description: 'Publish date as a Unix timestamp in milliseconds'
            },
            description: { type: 'string' },
            duration: { type: 'integer', description: 'Duration in seconds' },
            content: {
              type: 'string',
              description: 'Full show notes as HTML'
            },
            episodeNumber: { type: 'string' },
            episodeSlug: { type: 'string' },
            episodeImage: { type: 'string' },
            episodeThumbnail: { type: 'string' },
            audio: {
              type: 'object',
              properties: {
                src: { type: 'string', format: 'uri' },
                type: { type: 'string' }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  description: 'Stable machine-readable error code'
                },
                message: { type: 'string' },
                hint: {
                  type: 'string',
                  description: 'How to resolve the error'
                }
              }
            }
          }
        }
      }
    }
  };
}
