#!/usr/bin/env node
/**
 * The starpod CLI. Currently one command: scaffold a podcast website powered
 * by the starpod Astro integration. Dependency-free on purpose — prompts use
 * node:readline.
 *
 * Usage:
 *   npx starpod new [dir] [--name "My Show"] [--rss <url>] [--database]
 *     [--yes]
 */

import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  writeFileSync
} from 'node:fs';
import { join, resolve } from 'node:path';
import process from 'node:process';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const TEMPLATE_DIR = fileURLToPath(new URL('./template', import.meta.url));

const HELP = `starpod — podcast websites from an RSS feed

Usage:
  npx starpod new [dir] [options]

Options:
  --name "My Show"   Podcast name
  --rss <url>        RSS feed URL
  --database         Enable the guests & sponsors database (Turso)
  --yes              Skip prompts, accept defaults
`;

const [command, ...args] = process.argv.slice(2);

if (command !== 'new') {
  console.log(HELP);
  process.exit(command === '--help' || command === undefined ? 0 : 1);
}

const flags = new Set(args.filter((a) => a.startsWith('--')));
const positional = args.filter((a) => !a.startsWith('--'));

const flagValue = (name) => {
  const index = args.indexOf(name);
  return index !== -1 && args[index + 1] && !args[index + 1].startsWith('--')
    ? args[index + 1]
    : undefined;
};

// A --flag with a following value keeps that value out of positionals.
for (const name of ['--name', '--rss']) {
  const value = flagValue(name);
  if (value) {
    positional.splice(positional.indexOf(value), 1);
  }
}

const dasherize = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'my-podcast';

async function collectAnswers() {
  const skipPrompts = flags.has('--yes');
  const rl = skipPrompts
    ? null
    : readline.createInterface({ input: process.stdin, output: process.stdout });

  const ask = async (question, fallback) => {
    if (!rl) {
      return fallback;
    }
    const answer = (await rl.question(`${question} (${fallback}) `)).trim();
    return answer || fallback;
  };

  const name =
    flagValue('--name') ?? (await ask('What is your podcast called?', 'My Podcast'));
  const dir = positional[0] ?? (await ask('Where should we create it?', dasherize(name)));
  const rssFeed =
    flagValue('--rss') ??
    (await ask('RSS feed URL?', 'https://example.com/feed.xml'));
  const database = flags.has('--database')
    ? true
    : skipPrompts
      ? false
      : (await ask('Enable the guests & sponsors database (Turso)?', 'no'))
          .toLowerCase()
          .startsWith('y');

  rl?.close();
  return { name, dir, rssFeed, database };
}

function generatePackageJson({ name, database }) {
  const pkg = {
    name: dasherize(name),
    private: true,
    type: 'module',
    version: '0.0.1',
    scripts: {
      astro: 'astro',
      build: 'astro check && astro build',
      dev: 'astro dev',
      preview: 'astro preview',
      ...(database && {
        'db:push': 'drizzle-kit push',
        'db:seed': 'tsx db/seed.ts',
        'db:studio': 'drizzle-kit studio'
      })
    },
    dependencies: {
      '@astrojs/preact': '^5.1.4',
      '@astrojs/vercel': '^10.0.8',
      astro: '^6.4.2',
      preact: '^10.29.2',
      starpod: '^0.1.0'
    },
    devDependencies: {
      '@astrojs/check': '^0.9.9',
      sharp: '^0.34.5',
      typescript: '^5.9.3',
      ...(database && {
        dotenv: '^17.4.2',
        'drizzle-kit': '^0.31.10',
        'drizzle-orm': '^0.45.2',
        tsx: '^4.22.4'
      })
    },
    // rss-to-json hardcodes its parser options, and newer fast-xml-parser
    // versions enforce an entity-expansion limit that real podcast feeds
    // exceed. Pin the version rss-to-json was built against.
    // (pnpm reads `pnpm.overrides`; npm reads `overrides`.)
    pnpm: {
      overrides: {
        'fast-xml-parser': '4.5.4'
      },
      onlyBuiltDependencies: ['@tailwindcss/oxide', 'esbuild', 'sharp']
    },
    overrides: {
      'fast-xml-parser': '4.5.4'
    }
  };
  return JSON.stringify(pkg, null, 2) + '\n';
}

function generateStarpodConfig({ name, rssFeed }) {
  return `import { defineStarpodConfig } from 'starpod/config';

export default defineStarpodConfig({
  blurb: 'A short one-line tagline for ${name}.',
  description:
    'A couple of sentences describing what ${name} is about. Shown on the about page and in metadata.',
  hosts: [
    {
      name: 'Your Name',
      bio: 'A short bio.',
      // Drop a photo into src/img/people/ and reference its filename here.
      img: 'your-name.jpg'
    }
  ],
  platforms: {
    // Add the platforms your show is published on; unset ones are hidden.
    // apple: 'https://podcasts.apple.com/us/podcast/your-show/id0000000000',
    // spotify: 'https://open.spotify.com/show/...',
    // overcast: 'https://overcast.fm/itunes0000000000',
    // pocketCasts: 'https://pca.st/...',
    // youtube: 'https://www.youtube.com/@yourshow'
  },
  rssFeed: '${rssFeed}'
});
`;
}

function generateAstroConfig({ database }) {
  return `import vercel from '@astrojs/vercel';
import { defineConfig } from 'astro/config';
import starpod from 'starpod';

import starpodConfig from './starpod.config';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: vercel(),
  // Set this to your production URL.
  site: 'https://example.com',
  integrations: [
    starpod(starpodConfig${
      database
        ? `, {
      // Per-episode guests and sponsors from Turso. Requires
      // ASTRO_DB_REMOTE_URL and ASTRO_DB_APP_TOKEN (see .env.example).
      database: true
    }`
        : `, {
      // Options you can enable later:
      // database: true, // per-episode guests/sponsors via Turso + Drizzle
      // components: { Hosts: './src/components/MyHosts.astro' },
      // customCss: ['./src/styles/theme.css']
    }`
    })
  ]
});
`;
}

async function main() {
  const answers = await collectAnswers();
  const target = resolve(process.cwd(), answers.dir);

  if (existsSync(target) && readdirSync(target).length > 0) {
    console.error(`\n✖ ${answers.dir} already exists and is not empty.`);
    process.exit(1);
  }

  mkdirSync(target, { recursive: true });
  cpSync(join(TEMPLATE_DIR, 'base'), target, { recursive: true });
  if (answers.database) {
    cpSync(join(TEMPLATE_DIR, 'database'), target, { recursive: true });
  }

  // npm strips dotfiles from published packages, so these ship undotted.
  renameSync(join(target, 'gitignore'), join(target, '.gitignore'));
  renameSync(join(target, 'env.example'), join(target, '.env.example'));

  writeFileSync(join(target, 'package.json'), generatePackageJson(answers));
  writeFileSync(join(target, 'starpod.config.ts'), generateStarpodConfig(answers));
  writeFileSync(join(target, 'astro.config.mjs'), generateAstroConfig(answers));

  console.log(`\n✔ Scaffolded ${answers.name} in ${answers.dir}\n`);
  console.log('Next steps:');
  console.log(`  cd ${answers.dir}`);
  console.log('  pnpm install   (or npm install / yarn)');
  console.log('  pnpm dev');
  if (answers.database) {
    console.log('\nDatabase setup:');
    console.log('  1. Create a Turso database and copy .env.example to .env');
    console.log('  2. pnpm db:push   (create the schema)');
    console.log('  3. Edit db/data/*.ts, then pnpm db:seed');
  }
  console.log('');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
