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
      class="search-trigger halo flex w-full cursor-pointer items-center gap-[0.6rem] rounded-full border border-line bg-ground px-3 py-[0.6rem] text-md text-muted transition-[color] duration-200 ease-(--ease-out) hover:text-text"
      data-search-trigger
      onClick={() => (isSearchOpen.value = true)}
      type="button"
    >
      <SearchIcon size={18} />
      <span>Search episodes</span>
      <kbd class="ml-auto rounded-[6px] border border-line px-[0.4rem] py-[0.1rem] [font-family:inherit] text-xs">⌘K</kbd>
    </button>
  );
}
