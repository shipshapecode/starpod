import { isSearchOpen } from './state';

export default function SearchButton() {
  return (
    <button
      type="button"
      class="btn"
      onClick={() => (isSearchOpen.value = true)}
      aria-label="Search episodes (⌘K)"
    >
      <span class="text-light-text-heading flex items-center gap-2 rounded-full px-3 py-2 text-sm dark:text-white">
        <span class="search-icon h-4 w-4" aria-hidden="true" />
        <span class="hidden sm:inline">Search</span>
        <kbd class="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-light-card dark:bg-dark-card rounded border border-light-input-border dark:border-dark-input-border">
          <span class="text-xs">⌘</span>K
        </kbd>
      </span>
    </button>
  );
}
