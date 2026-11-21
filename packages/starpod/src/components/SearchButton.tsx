import { SearchIcon } from './icons';
import { isSearchOpen } from './state';

type Props = { variant?: 'rail' | 'tab' };

// Every trigger is marked so the palette can grow out of whichever is on
// screen, and return to it.
export default function SearchButton({ variant = 'rail' }: Props) {
  if (variant === 'tab') {
    return (
      <button
        aria-label="Search episodes"
        data-search-trigger
        onClick={() => (isSearchOpen.value = true)}
        type="button"
      >
        <SearchIcon />
        <span>Search</span>
      </button>
    );
  }

  return (
    <button
      aria-label="Search episodes (⌘K)"
      class="search-trigger halo"
      data-search-trigger
      onClick={() => (isSearchOpen.value = true)}
      type="button"
    >
      <SearchIcon size={18} />
      <span>Search episodes</span>
      <kbd>⌘K</kbd>
    </button>
  );
}
