import { SearchIcon } from './icons';
import { isSearchOpen } from './state';

type Props = { variant?: 'rail' | 'tab' };

export default function SearchButton({ variant = 'rail' }: Props) {
  if (variant === 'tab') {
    return (
      <button
        aria-label="Search episodes"
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
      onClick={() => (isSearchOpen.value = true)}
      type="button"
    >
      <SearchIcon size={18} />
      <span>Search episodes</span>
      <kbd>⌘K</kbd>
    </button>
  );
}
