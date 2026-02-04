import { isSearchOpen } from './state';

export default function SearchButton() {
  return (
    <button
      type="button"
      class="flex items-center gap-2 px-3 py-2 text-sm text-light-text-body dark:text-dark-text-body bg-light-input-bg dark:bg-dark-input-bg rounded-lg border border-light-input-border dark:border-dark-input-border hover:border-light-input-border-focused dark:hover:border-dark-input-border-focused transition-colors"
      onClick={() => (isSearchOpen.value = true)}
      aria-label="Search episodes (⌘K)"
    >
      <svg
        class="h-4 w-4"
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
      <span class="hidden sm:inline">Search</span>
      <kbd class="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-light-card dark:bg-dark-card rounded border border-light-input-border dark:border-dark-input-border">
        <span class="text-xs">⌘</span>K
      </kbd>
    </button>
  );
}
