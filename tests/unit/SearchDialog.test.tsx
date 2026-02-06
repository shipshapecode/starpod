import { render, screen, fireEvent } from '@testing-library/preact';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import SearchDialog from '../../src/components/SearchDialog';
import { isSearchOpen } from '../../src/components/state';

// Mock fetch for episodes
const mockEpisodes = [
  {
    id: 'episode-1',
    title: 'Episode One',
    description: 'This is the first episode',
    episodeNumber: '1',
    episodeSlug: 'episode-one',
    episodeThumbnail: '/thumb1.jpg'
  },
  {
    id: 'episode-2',
    title: 'Episode Two',
    description: 'This is the second episode',
    episodeNumber: '2',
    episodeSlug: 'episode-two',
    episodeThumbnail: '/thumb2.jpg'
  },
  {
    id: 'episode-3',
    title: 'Different Title',
    description: 'Something completely different',
    episodeNumber: '3',
    episodeSlug: 'different-title',
    episodeThumbnail: '/thumb3.jpg'
  }
];

describe('SearchDialog', () => {
  beforeEach(() => {
    isSearchOpen.value = false;
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockEpisodes)
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders nothing when search is closed', () => {
    isSearchOpen.value = false;
    const { container } = render(<SearchDialog />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the search dialog when open', async () => {
    isSearchOpen.value = true;
    render(<SearchDialog />);

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search episodes...')).toBeInTheDocument();
  });

  it('filters episodes based on search query', async () => {
    isSearchOpen.value = true;
    render(<SearchDialog />);

    // Wait for episodes to load
    await screen.findByRole('dialog');

    const input = screen.getByPlaceholderText('Search episodes...');
    fireEvent.input(input, { target: { value: 'Episode' } });

    // Should show Episode One and Episode Two, but not Different Title
    expect(await screen.findByText('Episode One')).toBeInTheDocument();
    expect(screen.getByText('Episode Two')).toBeInTheDocument();
    expect(screen.queryByText('Different Title')).not.toBeInTheDocument();
  });

  it('shows no results message when no matches found', async () => {
    isSearchOpen.value = true;
    render(<SearchDialog />);

    await screen.findByRole('dialog');

    const input = screen.getByPlaceholderText('Search episodes...');
    fireEvent.input(input, { target: { value: 'nonexistent query' } });

    expect(await screen.findByText('No episodes found')).toBeInTheDocument();
  });

  it('closes when Escape is pressed', async () => {
    isSearchOpen.value = true;
    render(<SearchDialog />);

    await screen.findByRole('dialog');

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(isSearchOpen.value).toBe(false);
  });

  it('opens and closes with cmd+k keyboard shortcut', async () => {
    isSearchOpen.value = false;
    render(<SearchDialog />);

    // Open with cmd+k
    fireEvent.keyDown(document, { key: 'k', metaKey: true });
    expect(isSearchOpen.value).toBe(true);

    // Close with cmd+k
    fireEvent.keyDown(document, { key: 'k', metaKey: true });
    expect(isSearchOpen.value).toBe(false);
  });

  it('opens with ctrl+k keyboard shortcut', async () => {
    isSearchOpen.value = false;
    render(<SearchDialog />);

    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    expect(isSearchOpen.value).toBe(true);
  });

  it('has proper accessibility attributes', async () => {
    isSearchOpen.value = true;
    render(<SearchDialog />);

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-label', 'Search episodes');

    const input = screen.getByPlaceholderText('Search episodes...');
    expect(input).toHaveAttribute('aria-label', 'Search episodes');
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
    expect(input).toHaveAttribute('aria-controls', 'search-results');

    const results = screen.getByRole('listbox');
    expect(results).toBeInTheDocument();
  });

  it('supports keyboard navigation', async () => {
    isSearchOpen.value = true;
    render(<SearchDialog />);

    await screen.findByRole('dialog');

    // Wait for episodes to load
    await screen.findByText('Episode One');

    // Verify arrow key events don't throw errors
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    fireEvent.keyDown(document, { key: 'ArrowUp' });

    // Verify Enter navigates (won't actually navigate in test, but verifies no crash)
    fireEvent.keyDown(document, { key: 'Enter' });
  });
});
