interface VercelRoute {
  src?: string;
  dest?: string;
  headers?: Record<string, string>;
  status?: number;
  handle?: string;
  has?: Array<{ type: string; key: string; value: string }>;
  continue?: boolean;
}

interface NegotiationRoute extends VercelRoute {
  src: string;
}

interface VercelOutputConfig {
  routes: VercelRoute[];
  [key: string]: unknown;
}

export function collectMarkdownPaths(staticDir: string): string[];
export function pagesToMarkdownPaths(pathnames: string[]): string[];
export function buildNegotiationRoutes(mdPaths: string[]): NegotiationRoute[];
export function patchConfig(
  config: VercelOutputConfig,
  mdPaths: string[]
): { config: VercelOutputConfig; inserted: number };
export function main(outputDir?: string, mdPaths?: string[] | null): void;
