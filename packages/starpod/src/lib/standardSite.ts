/**
 * Build-time helpers for standard.site document verification.
 *
 * Episodes are published to ATProto as `site.standard.document` records by
 * `scripts/publish-episodes.ts`. Each record stores its `path` (matching an
 * episode's slug) but gets a random TID record key, so the only way to emit the
 * per-page `<link rel="site.standard.document">` verification tag is to look up
 * the published records and map their `path` back to their record key.
 *
 * This module resolves the configured DID's PDS, lists its document records
 * (unauthenticated — listRecords is public), and returns a `path -> rkey` map.
 * The result is memoized so the lookup runs once per build despite the page
 * being rendered for many episodes.
 */

const DOCUMENT_COLLECTION = 'site.standard.document';

interface PlcService {
  id?: string;
  type?: string;
  serviceEndpoint?: string;
}

async function resolvePds(did: string): Promise<string> {
  if (did.startsWith('did:plc:')) {
    const res = await fetch(`https://plc.directory/${did}`);
    if (!res.ok) throw new Error(`Failed to resolve DID: ${did}`);
    const doc = (await res.json()) as { service?: PlcService[] };
    const pds = doc.service?.find(
      (s) => s.type === 'AtprotoPersonalDataServer' || s.id === '#atproto_pds'
    );
    if (!pds?.serviceEndpoint) {
      throw new Error(`No PDS found in DID document for ${did}`);
    }
    return pds.serviceEndpoint;
  }

  if (did.startsWith('did:web:')) {
    const domain = did.replace('did:web:', '');
    const res = await fetch(`https://${domain}/.well-known/did.json`);
    if (!res.ok) throw new Error(`Failed to resolve DID: ${did}`);
    const doc = (await res.json()) as { service?: PlcService[] };
    const pds = doc.service?.find(
      (s) => s.type === 'AtprotoPersonalDataServer' || s.id === '#atproto_pds'
    );
    if (!pds?.serviceEndpoint) {
      throw new Error(`No PDS found in DID document for ${did}`);
    }
    return pds.serviceEndpoint;
  }

  throw new Error(`Unsupported DID method: ${did}`);
}

async function buildDocumentRkeyMap(did: string): Promise<Map<string, string>> {
  const pds = await resolvePds(did);
  const map = new Map<string, string>();
  let cursor: string | undefined;

  do {
    const url = new URL(`${pds}/xrpc/com.atproto.repo.listRecords`);
    url.searchParams.set('repo', did);
    url.searchParams.set('collection', DOCUMENT_COLLECTION);
    url.searchParams.set('limit', '100');
    if (cursor) url.searchParams.set('cursor', cursor);

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to list standard.site documents: ${res.status}`);
    }

    const data = (await res.json()) as {
      records: { uri: string; value: { path?: string } }[];
      cursor?: string;
    };

    for (const record of data.records) {
      const path = record.value.path;
      const rkey = record.uri.split('/').pop();
      if (path && rkey) map.set(path, rkey);
    }

    cursor = data.cursor;
  } while (cursor);

  return map;
}

let cache: Promise<Map<string, string>> | null = null;

/**
 * Returns a `path -> rkey` map of the published standard.site documents for the
 * configured DID, or an empty map if standard.site is not configured (or the
 * lookup fails). Memoized for the lifetime of the build.
 */
export function getDocumentRkeys(): Promise<Map<string, string>> {
  if (cache) return cache;

  const did = import.meta.env.STANDARD_SITE_DID;
  if (!did) {
    cache = Promise.resolve(new Map());
    return cache;
  }

  cache = buildDocumentRkeyMap(did).catch((err) => {
    console.warn(
      `[standard.site] Could not load document records for verification: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
    return new Map<string, string>();
  });

  return cache;
}
