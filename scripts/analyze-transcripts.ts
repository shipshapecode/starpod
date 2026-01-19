import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { getAllEpisodes } from '../src/lib/rss';

// Keywords for "Building with LLMs" collection
const LLM_KEYWORDS = [
  'llm',
  'large language model',
  'language model',
  'gpt',
  'openai',
  'claude',
  'anthropic',
  'agent',
  'agentic',
  'workflow',
  'ai agent',
  'langchain',
  'langgraph',
  'llamaindex',
  'autogen',
  'crewai',
  'framework',
  'tool',
  'prompt engineering',
  'fine-tuning',
  'rag',
  'retrieval augmented',
  'vector database',
  'embeddings',
  'semantic search',
  'ai application',
  'ai tool',
  'ai framework',
  'ai library',
  'ai sdk',
  'ai platform',
  'ai service',
  'ai api',
  'ai model',
  'transformer',
  'neural network',
  'machine learning',
  'deep learning',
  'natural language processing',
  'nlp',
  'chatbot',
  'assistant',
  'copilot',
  'ai coding',
  'code generation',
  'ai development',
  'ai engineering'
];

// Common stopwords to filter out
const STOPWORDS = new Set([
  'the',
  'a',
  'an',
  'and',
  'or',
  'but',
  'in',
  'on',
  'at',
  'to',
  'for',
  'of',
  'with',
  'by',
  'from',
  'as',
  'is',
  'was',
  'are',
  'were',
  'be',
  'been',
  'being',
  'have',
  'has',
  'had',
  'do',
  'does',
  'did',
  'will',
  'would',
  'should',
  'could',
  'may',
  'might',
  'must',
  'can',
  'this',
  'that',
  'these',
  'those',
  'i',
  'you',
  'he',
  'she',
  'it',
  'we',
  'they',
  'what',
  'which',
  'who',
  'whom',
  'whose',
  'where',
  'when',
  'why',
  'how',
  'all',
  'each',
  'every',
  'both',
  'few',
  'more',
  'most',
  'other',
  'some',
  'such',
  'no',
  'nor',
  'not',
  'only',
  'own',
  'same',
  'so',
  'than',
  'too',
  'very',
  'just',
  'now',
  'then',
  'here',
  'there',
  'up',
  'down',
  'out',
  'off',
  'over',
  'under',
  'again',
  'further',
  'once',
  'about',
  'into',
  'through',
  'during',
  'before',
  'after',
  'above',
  'below',
  'between',
  'among',
  'around',
  'against',
  'within',
  'without'
]);

// Extract words from text (simple tokenization)
function extractWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOPWORDS.has(word));
}

// Count word frequencies
function countWords(words: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const word of words) {
    counts.set(word, (counts.get(word) || 0) + 1);
  }
  return counts;
}

// Check if text matches LLM keywords
function matchesLLMKeywords(text: string): boolean {
  const lowerText = text.toLowerCase();
  return LLM_KEYWORDS.some((keyword) => lowerText.includes(keyword.toLowerCase()));
}

// Score episode relevance to LLM topic
function scoreLLMRelevance(text: string): number {
  const lowerText = text.toLowerCase();
  let score = 0;
  for (const keyword of LLM_KEYWORDS) {
    const regex = new RegExp(keyword.toLowerCase(), 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      score += matches.length;
    }
  }
  return score;
}

// Common tech topics to look for
const topicKeywords: Record<string, string[]> = {
    'react': ['react', 'jsx', 'component', 'hooks', 'next.js', 'remix', 'gatsby'],
    'vue': ['vue', 'nuxt', 'vuex', 'pinia', 'composition api'],
    'angular': ['angular', 'typescript', 'rxjs', 'ngrx'],
    'svelte': ['svelte', 'sveltekit', 'svelte store'],
    'typescript': ['typescript', 'ts', 'type system', 'generics', 'interface'],
    'testing': ['test', 'testing', 'jest', 'vitest', 'cypress', 'playwright', 'tdd', 'bdd', 'unit test', 'e2e'],
    'css': ['css', 'tailwind', 'styled-components', 'sass', 'scss', 'css-in-js', 'styling'],
    'performance': ['performance', 'optimization', 'lighthouse', 'core web vitals', 'bundle size', 'lazy loading'],
    'security': ['security', 'authentication', 'authorization', 'oauth', 'jwt', 'encryption', 'xss', 'csrf', 'sql injection'],
    'devops': ['devops', 'ci/cd', 'docker', 'kubernetes', 'github actions', 'deployment', 'infrastructure'],
    'database': ['database', 'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'prisma', 'drizzle', 'orm'],
    'api': ['api', 'rest', 'graphql', 'rpc', 'endpoint', 'fetch', 'axios'],
    'webassembly': ['webassembly', 'wasm', 'rust', 'go', 'assemblyscript'],
    'ai-ml': ['ai', 'machine learning', 'ml', 'neural network', 'tensorflow', 'pytorch', 'model'],
    'accessibility': ['accessibility', 'a11y', 'aria', 'screen reader', 'wcag', 'semantic html'],
    'mobile': ['mobile', 'responsive', 'pwa', 'progressive web app', 'ios', 'android', 'react native'],
    'architecture': ['architecture', 'design pattern', 'microservices', 'monolith', 'scalability', 'system design']
};

// Group episodes by potential topics
function extractTopics(
  episodes: Array<{ episodeNumber: string; episodeSlug: string; title: string; transcript: string }>
): Map<string, Array<{ episodeNumber: string; episodeSlug: string; title: string; score: number }>> {
  const topicMap = new Map<
    string,
    Array<{ episodeNumber: string; episodeSlug: string; title: string; score: number }>
  >();

  for (const episode of episodes) {
    const lowerText = episode.transcript.toLowerCase();
    const words = extractWords(episode.transcript);
    const wordCounts = countWords(words);

    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      let score = 0;
      for (const keyword of keywords) {
        const regex = new RegExp(keyword.toLowerCase(), 'gi');
        const matches = lowerText.match(regex);
        if (matches) {
          score += matches.length * 2; // Keyword matches are weighted
        }
        // Also check word frequency
        const wordFreq = wordCounts.get(keyword.toLowerCase()) || 0;
        score += wordFreq;
      }

      if (score > 3) {
        // Threshold for inclusion
        if (!topicMap.has(topic)) {
          topicMap.set(topic, []);
        }
        topicMap.get(topic)!.push({
          episodeNumber: episode.episodeNumber,
          episodeSlug: episode.episodeSlug,
          title: episode.title,
          score
        });
      }
    }
  }

  // Sort episodes by score within each topic
  for (const [topic, episodes] of topicMap.entries()) {
    episodes.sort((a, b) => b.score - a.score);
  }

  return topicMap;
}

async function main() {
  console.log('Analyzing transcripts...\n');

  // Get all episodes
  const allEpisodes = await getAllEpisodes();
  console.log(`Found ${allEpisodes.length} episodes\n`);

  // Create a map of episode number to episode data
  const episodeMap = new Map<string, { episodeSlug: string; title: string }>();
  for (const episode of allEpisodes) {
    if (episode.episodeNumber && episode.episodeNumber !== 'Bonus') {
      episodeMap.set(episode.episodeNumber, {
        episodeSlug: episode.episodeSlug,
        title: episode.title
      });
    }
  }

  // Load transcripts directly from filesystem
  const transcriptsDir = join(process.cwd(), 'src/content/transcripts');
  const transcriptFiles = readdirSync(transcriptsDir).filter((f) => f.endsWith('.md'));

  const episodesWithTranscripts: Array<{
    episodeNumber: string;
    episodeSlug: string;
    title: string;
    transcript: string;
  }> = [];

  for (const file of transcriptFiles) {
    const episodeNumber = file.replace('.md', '');
    const episodeData = episodeMap.get(episodeNumber);
    if (episodeData) {
      try {
        const transcriptPath = join(transcriptsDir, file);
        const transcriptText = readFileSync(transcriptPath, 'utf-8');
        episodesWithTranscripts.push({
          episodeNumber,
          episodeSlug: episodeData.episodeSlug,
          title: episodeData.title,
          transcript: transcriptText
        });
      } catch (error) {
        console.error(`Error reading ${file}:`, error);
      }
    }
  }

  console.log(`Loaded ${episodesWithTranscripts.length} transcripts\n`);

  // Find episodes matching LLM keywords
  const llmEpisodes = episodesWithTranscripts
    .map((ep) => ({
      ...ep,
      score: scoreLLMRelevance(ep.transcript)
    }))
    .filter((ep) => ep.score > 0)
    .sort((a, b) => b.score - a.score);

  console.log('=== Building with LLMs Collection ===');
  console.log(`Found ${llmEpisodes.length} episodes matching LLM keywords:\n`);
  console.log('Episode slugs for collection:');
  const llmSlugs = llmEpisodes.map((ep) => ep.episodeSlug);
  console.log(JSON.stringify(llmSlugs, null, 2));
  console.log('\nTop matches:');
  llmEpisodes.slice(0, 10).forEach((ep) => {
    console.log(`  ${ep.episodeNumber}: ${ep.title} (score: ${ep.score})`);
  });

  // Extract potential topics
  console.log('\n\n=== Potential Collections ===\n');
  const topics = extractTopics(episodesWithTranscripts);

  const topicSuggestions: Array<{
    slug: string;
    title: string;
    subtitle?: string;
    episodeCount: number;
    topEpisodes: Array<{ title: string; score: number }>;
  }> = [];

  for (const [topic, episodes] of topics.entries()) {
    if (episodes.length >= 3) {
      // Only suggest topics with at least 3 episodes
      const slug = topic.replace(/\s+/g, '-').toLowerCase();
      const title = topic
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      topicSuggestions.push({
        slug,
        title,
        episodeCount: episodes.length,
        topEpisodes: episodes.slice(0, 5).map((ep) => ({
          title: ep.title,
          score: ep.score
        }))
      });
    }
  }

  // Sort by episode count
  topicSuggestions.sort((a, b) => b.episodeCount - a.episodeCount);

  console.log(`Found ${topicSuggestions.length} potential collections:\n`);
  topicSuggestions.slice(0, 10).forEach((topic, index) => {
    console.log(`${index + 1}. ${topic.title}`);
    console.log(`   Slug: ${topic.slug}`);
    console.log(`   Episodes: ${topic.episodeCount}`);
    console.log(`   Top episodes:`);
    topic.topEpisodes.forEach((ep) => {
      console.log(`     - ${ep.title} (score: ${ep.score})`);
    });
    console.log('');
  });

  // Output the LLM collection data
  console.log('\n=== Collection Data ===\n');
  console.log('LLM Collection slugs:');
  console.log(JSON.stringify(llmSlugs, null, 2));

  // Extract episodes for specific collections
  console.log('\n\n=== Specific Collection Episodes ===\n');

  // CSS Collection
  const cssEpisodes = episodesWithTranscripts
    .map((ep) => ({
      ...ep,
      score: scoreTopicRelevance(ep.transcript, topicKeywords['css'])
    }))
    .filter((ep) => ep.score > 5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 30); // Top 30

  console.log('CSS Collection:');
  console.log(JSON.stringify(cssEpisodes.map((ep) => ep.episodeSlug), null, 2));

  // TypeScript Collection
  const tsEpisodes = episodesWithTranscripts
    .map((ep) => ({
      ...ep,
      score: scoreTopicRelevance(ep.transcript, topicKeywords['typescript'])
    }))
    .filter((ep) => ep.score > 5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 30); // Top 30

  console.log('\nTypeScript Collection:');
  console.log(JSON.stringify(tsEpisodes.map((ep) => ep.episodeSlug), null, 2));

  // Testing Collection
  const testingEpisodes = episodesWithTranscripts
    .map((ep) => ({
      ...ep,
      score: scoreTopicRelevance(ep.transcript, topicKeywords['testing'])
    }))
    .filter((ep) => ep.score > 5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 30); // Top 30

  console.log('\nTesting Collection:');
  console.log(JSON.stringify(testingEpisodes.map((ep) => ep.episodeSlug), null, 2));

  // Accessibility Collection
  const a11yEpisodes = episodesWithTranscripts
    .map((ep) => ({
      ...ep,
      score: scoreTopicRelevance(ep.transcript, [
        'accessibility',
        'a11y',
        'aria',
        'screen reader',
        'wcag',
        'semantic html',
        'inclusive design',
        'accessible',
        'keyboard navigation',
        'focus management'
      ])
    }))
    .filter((ep) => ep.score > 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, 25); // Top 25

  console.log('\nAccessibility Collection:');
  console.log(JSON.stringify(a11yEpisodes.map((ep) => ep.episodeSlug), null, 2));

  // AI/ML Collection (broader than LLMs)
  const aiMlEpisodes = episodesWithTranscripts
    .map((ep) => ({
      ...ep,
      score: scoreTopicRelevance(ep.transcript, [
        'ai',
        'artificial intelligence',
        'machine learning',
        'ml',
        'neural network',
        'deep learning',
        'tensorflow',
        'pytorch',
        'model',
        'training',
        'inference',
        'data science',
        'mlops'
      ])
    }))
    .filter((ep) => ep.score > 5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 30); // Top 30

  console.log('\nAI/ML Collection:');
  console.log(JSON.stringify(aiMlEpisodes.map((ep) => ep.episodeSlug), null, 2));
}

// Helper function to score topic relevance
function scoreTopicRelevance(text: string, keywords: string[]): number {
  const lowerText = text.toLowerCase();
  let score = 0;
  for (const keyword of keywords) {
    const regex = new RegExp(keyword.toLowerCase(), 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      score += matches.length * 2;
    }
  }
  return score;
}

main().catch(console.error);
