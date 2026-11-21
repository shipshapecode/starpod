import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  afterEach
} from 'vitest';
import SearchDialog from 'starpod/src/components/SearchDialog';
import { isSearchOpen } from 'starpod/src/components/state';
import { navigate } from 'astro:transitions/client';

vi.mock('astro:transitions/client', () => ({ navigate: vi.fn() }));

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
  // jsdom has the <dialog> element but not its modal methods, nor scrolling.
  beforeAll(() => {
    Element.prototype.scrollIntoView ??= () => {};
    HTMLDialogElement.prototype.showModal ??= function (
      this: HTMLDialogElement
    ) {
      this.open = true;
    };
    HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
      this.open = false;
    };
  });

  beforeEach(() => {
    isSearchOpen.value = false;
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockEpisodes)
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.mocked(navigate).mockClear();
  });

  it('renders nothing when search is closed', () => {
    isSearchOpen.value = false;
    const { container } = render(<SearchDialog />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the search dialog when open', async () => {
    isSearchOpen.value = true;
    render(<SearchDialog />);

    const dialog = await screen.findByRole('dialog');
    expect(dialog.tagName).toBe('DIALOG');
    expect(dialog).toHaveAttribute('open');
    expect(
      screen.getByPlaceholderText('Search episodes...')
    ).toBeInTheDocument();
  });

  it('focuses the search field when it opens', async () => {
    isSearchOpen.value = true;
    render(<SearchDialog />);

    expect(
      await screen.findByPlaceholderText('Search episodes...')
    ).toHaveFocus();
  });

  it('filters episodes based on search query', async () => {
    isSearchOpen.value = true;
    render(<SearchDialog />);

    // Wait for episodes to load
    await screen.findByRole('dialog');

    const input = screen.getByPlaceholderText('Search episodes...');
    fireEvent.input(input, { target: { value: 'Episode' } });

    // Should show Episode One and Episode Two, but not Different Title
    await waitFor(() =>
      expect(
        screen.getAllByRole('option').map((option) => option.textContent)
      ).toEqual([
        expect.stringContaining('Episode One'),
        expect.stringContaining('Episode Two')
      ])
    );
    expect(screen.getByText('2 results')).toBeInTheDocument();
    // The typed part stays plain; the completion is bold.
    // An episode row glides too, and is not a person row.
    expect([...screen.getAllByRole('option')[0]!.classList]).toEqual([
      'sp-row',
      'PropFLIP'
    ]);
    const title = screen.getAllByRole('option')[0]!.querySelector('.sp-title')!;
    expect(title.querySelector('b')?.textContent).toBe(' One');
  });

  it('shows no results message when no matches found', async () => {
    isSearchOpen.value = true;
    render(<SearchDialog />);

    await screen.findByRole('dialog');

    const input = screen.getByPlaceholderText('Search episodes...');
    fireEvent.input(input, { target: { value: 'nonexistent query' } });

    expect(await screen.findByText('Nothing found')).toBeInTheDocument();
  });

  const people = [
    {
      value: 'robbie',
      label: 'RobbieTheWagner',
      count: 106,
      avatar: '/r.webp',
      host: true,
      voice: 0
    },
    { value: 'adam', label: 'Adam Argyle', count: 29, avatar: '/a.webp' },
    { value: 'ada', label: 'Ada Lovelace', count: 1, avatar: '/l.webp' }
  ];

  it('offers the people most on the show before anything is typed', async () => {
    isSearchOpen.value = true;
    render(<SearchDialog people={people} />);

    await screen.findByRole('dialog');
    const options = await screen.findAllByRole('option');
    expect(options.map((option) => option.textContent)).toEqual([
      expect.stringContaining('RobbieTheWagner'),
      expect.stringContaining('Adam Argyle'),
      expect.stringContaining('Ada Lovelace')
    ]);
    // The shared fact line carries the count.
    expect(options[0]).toHaveTextContent('Host · 106 episodes');
    // A host wears their voice's ring; a guest the plain one.
    expect(options[0]!.querySelector('.person-face')).toHaveAttribute(
      'data-voice',
      '0'
    );
    expect(options[1]!.querySelector('.person-face')).not.toHaveAttribute(
      'data-voice'
    );
    expect(options[1]).toHaveTextContent('Guest · 29 episodes');
    // Person rows take part in the active descendant like episode rows.
    const input = screen.getByRole('combobox', { name: 'Search episodes' });
    expect(new Set(options.map((option) => option.id)).size).toBe(3);
    expect(input).toHaveAttribute('aria-activedescendant', options[0]!.id);
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    await waitFor(() =>
      expect(input).toHaveAttribute('aria-activedescendant', options[1]!.id)
    );
    expect(options[1]).toHaveAttribute('aria-selected', 'true');
    // Each person row keeps the row, glide and person classes apart.
    for (const option of options) {
      expect([...option.classList]).toEqual([
        'sp-row',
        'PropFLIP',
        'sp-person'
      ]);
    }
    expect(screen.getByText('People')).toBeInTheDocument();
    // No count until something is asked.
    expect(screen.queryByText(/results?$/)).not.toBeInTheDocument();
  });

  it('puts matching people above episodes and opens their episodes', async () => {
    isSearchOpen.value = true;
    render(<SearchDialog people={people} />);

    const input = await screen.findByPlaceholderText('Search episodes...');
    fireEvent.input(input, { target: { value: 'lovelace' } });

    await waitFor(() =>
      expect(screen.getAllByRole('option')[0]).toHaveTextContent('Ada Lovelace')
    );
    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveTextContent('Ada Lovelace');
    expect(options[0]).toHaveAttribute('href', '/?guest=ada');

    fireEvent.keyDown(document, { key: 'Enter' });
    expect(navigate).toHaveBeenCalledWith('/?guest=ada');
  });

  it('closes when Escape is pressed', async () => {
    isSearchOpen.value = true;
    render(<SearchDialog />);

    await screen.findByRole('dialog');

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(isSearchOpen.value).toBe(false);
    // With no trigger on screen to fly back to, it closes at once.
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    );
  });

  it('closes when the scrim around the panel is clicked', async () => {
    isSearchOpen.value = true;
    render(<SearchDialog />);

    fireEvent.click(await screen.findByRole('dialog'));

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
    // The input is the combobox that owns the list.
    expect(screen.getByRole('combobox', { name: 'Search episodes' })).toBe(
      input
    );
  });

  it('moves the selection with the arrow keys and opens it with Enter', async () => {
    isSearchOpen.value = true;
    render(<SearchDialog />);

    await waitFor(() =>
      expect(screen.getAllByRole('option')[0]).toHaveTextContent('Episode One')
    );
    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
    // The selection is announced through the input's active descendant,
    // which names the selected option's own id.
    const input = screen.getByRole('combobox', { name: 'Search episodes' });
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(options[0]!.id).not.toBe('');
    expect(input).toHaveAttribute('aria-activedescendant', options[0]!.id);

    fireEvent.keyDown(document, { key: 'ArrowDown' });
    await waitFor(() =>
      expect(screen.getAllByRole('option')[1]).toHaveAttribute(
        'aria-selected',
        'true'
      )
    );
    expect(input).toHaveAttribute(
      'aria-activedescendant',
      screen.getAllByRole('option')[1]!.id
    );

    fireEvent.keyDown(document, { key: 'ArrowUp' });
    await waitFor(() =>
      expect(screen.getAllByRole('option')[0]).toHaveAttribute(
        'aria-selected',
        'true'
      )
    );

    fireEvent.keyDown(document, { key: 'Enter' });
    // Client-side navigation, so playback survives.
    expect(navigate).toHaveBeenCalledWith('/episode-one');
    expect(isSearchOpen.value).toBe(false);
  });
});
