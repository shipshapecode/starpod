import { useEffect, useState, useRef, useCallback } from 'preact/hooks';
import { isSearchOpen } from './state';

interface SearchableEpisode {
  id: string;
  title: string;
  description: string;
  episodeNumber: string;
  episodeSlug: string;
  episodeThumbnail?: string;
}

export default function SearchDialog() {
  const [query, setQuery] = useState('');
  const [episodes, setEpisodes] = useState<SearchableEpisode[]>([]);
  const [filteredEpisodes, setFilteredEpisodes] = useState<SearchableEpisode[]>(
    []
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Load episodes on mount
  useEffect(() => {
    fetch('/api/episodes/search.json')
      .then((res) => res.json())
      .then((data) => setEpisodes(data))
      .catch(console.error);
  }, []);

  // Filter episodes based on query
  useEffect(() => {
    if (!query.trim()) {
      setFilteredEpisodes(episodes.slice(0, 8));
      setSelectedIndex(0);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = episodes
      .filter(
        (episode) =>
          episode.title.toLowerCase().includes(lowerQuery) ||
          episode.description.toLowerCase().includes(lowerQuery) ||
          episode.episodeNumber.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 8);

    setFilteredEpisodes(filtered);
    setSelectedIndex(0);
  }, [query, episodes]);

  // Focus input when dialog opens
  useEffect(() => {
    if (isSearchOpen.value) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isSearchOpen.value]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Open search with cmd+k or ctrl+k
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isSearchOpen.value = !isSearchOpen.value;
        return;
      }

      // Close on escape
      if (e.key === 'Escape' && isSearchOpen.value) {
        e.preventDefault();
        isSearchOpen.value = false;
        return;
      }

      // Navigation and selection when dialog is open
      if (isSearchOpen.value && filteredEpisodes.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredEpisodes.length - 1 ? prev + 1 : prev
          );
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const selected = filteredEpisodes[selectedIndex];
          if (selected) {
            window.location.href = `/${selected.episodeSlug}`;
          }
        }
      }
    },
    [filteredEpisodes, selectedIndex]
  );

  // Add global keyboard listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current) {
      const selectedEl = resultsRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      );
      selectedEl?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // Handle backdrop click
  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      isSearchOpen.value = false;
    }
  };

  if (!isSearchOpen.value) {
    return null;
  }

  return (
    <div
      class="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 backdrop-blur-sm pt-[10vh]"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Search episodes"
    >
      <div class="bg-light-card dark:bg-dark-card w-full max-w-xl mx-4 rounded-lg shadow-2xl border border-light-input-border dark:border-dark-border overflow-hidden">
        {/* Search Input */}
        <div class="flex items-center border-b border-light-input-border dark:border-dark-border px-4">
          <svg
            class="h-5 w-5 text-light-icon dark:text-dark-icon shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            class="flex-1 bg-transparent px-4 py-4 text-light-text-heading dark:text-white placeholder-light-text-body dark:placeholder-dark-text-body outline-none border-none focus:ring-0"
            placeholder="Search episodes..."
            value={query}
            onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
            aria-label="Search episodes"
            aria-autocomplete="list"
            aria-controls="search-results"
          />
          <kbd class="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-light-text-body dark:text-dark-text-body bg-light-input-bg dark:bg-dark-input-bg rounded border border-light-input-border dark:border-dark-input-border">
            <span class="text-xs">ESC</span>
          </kbd>
        </div>

        {/* Results */}
        <div
          ref={resultsRef}
          id="search-results"
          class="max-h-80 overflow-y-auto p-2"
          role="listbox"
        >
          {filteredEpisodes.length === 0 ? (
            <div class="p-4 text-center text-light-text-body dark:text-dark-text-body">
              {query
                ? 'No episodes found'
                : 'Start typing to search episodes...'}
            </div>
          ) : (
            filteredEpisodes.map((episode, index) => (
              <a
                key={episode.id}
                href={`/${episode.episodeSlug}`}
                data-index={index}
                class={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  index === selectedIndex
                    ? 'bg-light-input-bg dark:bg-dark-input-bg'
                    : 'hover:bg-light-input-bg dark:hover:bg-dark-input-bg'
                }`}
                role="option"
                aria-selected={index === selectedIndex}
                onClick={() => (isSearchOpen.value = false)}
              >
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-medium text-light-icon dark:text-dark-icon">
                      #{episode.episodeNumber}
                    </span>
                    <span class="text-sm font-semibold text-light-text-heading dark:text-white truncate">
                      {episode.title}
                    </span>
                  </div>
                  <p class="text-xs text-light-text-body dark:text-dark-text-body truncate mt-1">
                    {episode.description}
                  </p>
                </div>
                {index === selectedIndex && (
                  <kbd class="hidden sm:inline-flex items-center px-2 py-1 text-xs text-light-text-body dark:text-dark-text-body bg-light-card dark:bg-dark-card rounded border border-light-input-border dark:border-dark-input-border">
                    ↵
                  </kbd>
                )}
              </a>
            ))
          )}
        </div>

        {/* Footer */}
        <div class="flex items-center justify-between px-4 py-2 border-t border-light-input-border dark:border-dark-border text-xs text-light-text-body dark:text-dark-text-body">
          <div class="flex items-center gap-4">
            <span class="hidden sm:inline-flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 bg-light-input-bg dark:bg-dark-input-bg rounded border border-light-input-border dark:border-dark-input-border">
                ↑
              </kbd>
              <kbd class="px-1.5 py-0.5 bg-light-input-bg dark:bg-dark-input-bg rounded border border-light-input-border dark:border-dark-input-border">
                ↓
              </kbd>
              <span>to navigate</span>
            </span>
            <span class="hidden sm:inline-flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 bg-light-input-bg dark:bg-dark-input-bg rounded border border-light-input-border dark:border-dark-input-border">
                ↵
              </kbd>
              <span>to select</span>
            </span>
          </div>
          <span>{filteredEpisodes.length} results</span>
        </div>
      </div>
    </div>
  );
}
