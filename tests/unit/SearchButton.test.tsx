import { render, screen, fireEvent } from '@testing-library/preact';
import { beforeEach, describe, expect, it } from 'vitest';
import SearchButton from '../../src/components/SearchButton';
import { isSearchOpen } from '../../src/components/state';

describe('SearchButton', () => {
  beforeEach(() => {
    isSearchOpen.value = false;
  });

  it('renders the search button', () => {
    render(<SearchButton />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Search episodes (⌘K)');
  });

  it('opens search dialog when clicked', () => {
    render(<SearchButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(isSearchOpen.value).toBe(true);
  });

  it('contains search text', () => {
    render(<SearchButton />);

    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('displays keyboard shortcut hint', () => {
    render(<SearchButton />);

    expect(screen.getByText('⌘')).toBeInTheDocument();
    expect(screen.getByText('K')).toBeInTheDocument();
  });

  it('contains search icon', () => {
    render(<SearchButton />);

    const svg = screen.getByRole('button').querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});
