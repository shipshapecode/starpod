import { fireEvent, render, screen } from '@testing-library/preact';
import { beforeEach, describe, expect, it } from 'vitest';
import SearchButton from 'starpod/src/components/SearchButton';
import { isSearchOpen } from 'starpod/src/components/state';

describe('SearchButton', () => {
  beforeEach(() => {
    isSearchOpen.value = false;
  });

  it('renders the rail search with its shortcut', () => {
    render(<SearchButton />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Search episodes (⌘K)');
    expect(screen.getByText('Search episodes')).toBeInTheDocument();
    expect(screen.getByText('⌘K')).toBeInTheDocument();
    // The palette grows out of whichever trigger is on screen.
    expect(button).toHaveAttribute('data-search-trigger');
  });

  it('opens search dialog when clicked', () => {
    render(<SearchButton />);
    fireEvent.click(screen.getByRole('button'));
    expect(isSearchOpen.value).toBe(true);
  });

  it('renders as a tab for the phone tab bar', () => {
    render(<SearchButton variant="tab" />);

    const button = screen.getByRole('button', { name: 'Search episodes' });
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(button).toHaveAttribute('data-search-trigger');
    fireEvent.click(button);
    expect(isSearchOpen.value).toBe(true);
  });
});
