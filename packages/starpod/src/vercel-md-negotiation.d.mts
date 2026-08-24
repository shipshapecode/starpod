interface VercelRoute {
  [key: string]: unknown;
}

interface VercelOutputConfig {
  routes?: VercelRoute[];
  [key: string]: unknown;
}

export function collectMarkdownPaths(staticDir: string): string[];
export function buildNegotiationRoutes(mdPaths: string[]): VercelRoute[];
export function patchConfig(
  config: VercelOutputConfig,
  mdPaths: string[]
): { config: VercelOutputConfig; inserted: number };
export function main(outputDir?: string): void;
