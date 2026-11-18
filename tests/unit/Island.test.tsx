import { act, fireEvent, render, screen, waitFor } from '@testing-library/preact';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Island from 'starpod/src/components/media/Island';
import MediumSwitch from 'starpod/src/components/media/MediumSwitch';
import {
  activeMedium,
  anchorPositioning,
  currentEpisode,
  currentTime,
  enqueue,
  isPlaying,
  miniClosed,
  phoneFloat,
  phoneScreen,
  pictureDocked,
  pipCorner,
  islandHome,
  pipDocked,
  playEpisode,
  playerExpanded,
  preferredMedium,
  queue,
  setMedium,
  wideScreen
} from 'starpod/src/components/state';

const audioOnly = {
  id: 'ep-1',
  title: 'Audio Only Episode',
  audio: { src: 'a.mp3', type: 'audio/mpeg' },
  episodeNumber: '1',
  slug: 'audio-only-episode'
};

const withVideo = {
  ...audioOnly,
  id: 'ep-2',
  title: 'Video Episode',
  episodeNumber: '2',
  slug: 'video-episode',
  video: { src: 'v.m3u8', type: 'application/x-mpegURL' }
};

describe('Island', () => {
  beforeEach(() => {
    currentEpisode.value = null;
    isPlaying.value = false;
    miniClosed.value = false;
    islandHome.value = 'dock';
    wideScreen.value = true;
    setMedium('watch');
  });

  it('renders nothing until an episode is loaded', () => {
    const { container } = render(<Island />);
    expect(container.firstChild).toBeNull();
  });

  it('shows the loaded episode and toggles playback', () => {
    currentEpisode.value = audioOnly;
    render(<Island />);

    expect(
      screen.getByRole('button', { name: 'Audio Only Episode. Open the now-playing card' })
    ).toBeInTheDocument();
    expect(screen.getByText(/Listening/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Play' }));
    expect(isPlaying.value).toBe(true);
  });

  it('offers Watch/Listen only for episodes with video', () => {
    currentEpisode.value = audioOnly;
    const { rerender } = render(<Island />);
    expect(screen.queryByRole('radiogroup', { name: 'Watch or listen' })).toBeNull();

    currentEpisode.value = withVideo;
    rerender(<Island />);
    expect(screen.getByRole('radiogroup', { name: 'Watch or listen' })).toBeInTheDocument();
  });

  it('links to the episode page from the island', () => {
    currentEpisode.value = withVideo;
    render(<Island />);
    expect(screen.getByRole('link', { name: 'Open the episode' })).toHaveAttribute(
      'href',
      '/video-episode'
    );
  });

  it('offers fullscreen on the floating video, not a switch to audio', () => {
    currentEpisode.value = withVideo;
    render(<Island />);
    // The video floats because no stage holds it in this test.
    expect(screen.getByRole('button', { name: 'Fullscreen' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Stop watching, keep listening' })).toBeNull();
  });

  it('goes to the home a number key or the home control names, and publishes it', () => {
    currentEpisode.value = withVideo;
    const { rerender } = render(<Island />);
    const island = () => document.getElementById('player')!;
    expect(island()).toHaveAttribute('data-state', 'dock');
    expect(island()).toHaveAttribute('data-⚓️-to', '--home-dock');
    expect(document.documentElement.dataset.island).toBe('dock');

    fireEvent.keyDown(document, { key: '1' });
    rerender(<Island />);
    expect(islandHome.value).toBe('pill');
    expect(island()).toHaveAttribute('data-state', 'pill');
    expect(island()).toHaveAttribute('data-⚓️-to', '--home-pill');
    expect(document.documentElement.dataset.island).toBe('pill');
    expect(localStorage.getItem('starpod:island')).toBe('"pill"');

    fireEvent.click(screen.getByRole('radio', { name: 'Rail' }));
    rerender(<Island />);
    expect(island()).toHaveAttribute('data-state', 'rail');
    expect(screen.getByRole('radio', { name: 'Rail' })).toBeChecked();
  });

  it('opens the card from its body and closes back to where it was, with Escape too', () => {
    currentEpisode.value = withVideo;
    islandHome.value = 'pill';
    const { rerender } = render(<Island />);
    const island = () => document.getElementById('player')!;

    // The body (not a control) toggles the card.
    fireEvent.click(island().querySelector('.island-eq')!);
    rerender(<Island />);
    expect(playerExpanded.value).toBe(true);
    expect(island()).toHaveAttribute('data-state', 'card');
    expect(screen.getByRole('heading', { name: 'Up next' })).toBeInTheDocument();
    // The floating picture's bar steps aside while the card is open.
    expect(screen.queryByRole('button', { name: 'Close video' })).toBeNull();

    fireEvent.keyDown(document, { key: 'Escape' });
    rerender(<Island />);
    expect(island()).toHaveAttribute('data-state', 'pill');

    // The title is the keyboard's way in, and says where it leads.
    const name = screen.getByRole('button', { name: /^Video Episode\. Open the now-playing card/ });
    expect(name).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(name);
    rerender(<Island />);
    expect(island()).toHaveAttribute('data-state', 'card');
    fireEvent.click(screen.getByRole('button', { name: /^Video Episode\. Close the now-playing card/ }));
    rerender(<Island />);
    expect(island()).toHaveAttribute('data-state', 'pill');
    // The card is never the remembered home.
    expect(localStorage.getItem('starpod:island')).toBe('"pill"');
  });

  it('takes keyboard focus to the home control when the card opens from the title', () => {
    currentEpisode.value = withVideo;
    islandHome.value = 'pill';
    const { rerender } = render(<Island />);
    const name = screen.getByRole('button', { name: /^Video Episode\. Open the now-playing card/ });
    name.focus();
    fireEvent.click(name);
    rerender(<Island />);
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'Card' }));
  });

  it('is a modal dialog while the card is open, the page behind it inert once it lands', async () => {
    const page = document.createElement('div');
    document.body.prepend(page);
    currentEpisode.value = withVideo;
    const { rerender } = render(<Island />);
    const island = () => document.getElementById('player')!;
    const landed = () => new Promise((done) => setTimeout(done, 80));
    expect(island()).not.toHaveAttribute('role');

    fireEvent.keyDown(document, { key: '2' });
    rerender(<Island />);
    expect(island()).toHaveAttribute('role', 'dialog');
    expect(island()).toHaveAttribute('aria-modal', 'true');
    expect(island()).toHaveAccessibleName('Now playing: Video Episode');
    // Opened from outside the island, focus goes into it at once…
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'Card' }));
    // …and the page is held once the island has landed (not mid-flight).
    expect(page).not.toHaveAttribute('inert');
    await landed();
    expect(page).toHaveAttribute('inert');

    fireEvent.keyDown(document, { key: 'Escape' });
    rerender(<Island />);
    expect(island()).not.toHaveAttribute('role');
    expect(page).toHaveAttribute('inert');
    await landed();
    expect(page).not.toHaveAttribute('inert');
    page.remove();
  });

  it('keeps Tab inside the card while it flies in, before the page is inert', () => {
    currentEpisode.value = withVideo;
    const { rerender } = render(<Island />);
    fireEvent.keyDown(document, { key: '2' });
    rerender(<Island />);
    const name = document.querySelector<HTMLElement>('.island-name')!;
    name.focus();
    // Back from the first stop wraps to the card's last…
    expect(fireEvent.keyDown(name, { key: 'Tab', shiftKey: true })).toBe(false);
    const last = document.activeElement as HTMLElement;
    expect(last).not.toBe(name);
    expect(document.getElementById('player')!.contains(last)).toBe(true);
    // …and on from the last wraps to the first.
    expect(fireEvent.keyDown(last, { key: 'Tab' })).toBe(false);
    expect(document.activeElement).toBe(name);
    // Focus that reaches the page another way comes back into the card.
    const outside = document.createElement('button');
    document.body.append(outside);
    outside.focus();
    expect(document.activeElement).toBe(screen.getByRole('radio', { name: 'Card' }));
    outside.remove();
    fireEvent.keyDown(document, { key: 'Escape' });
  });

  it('keeps the keys it handles to itself', () => {
    const behind = vi.fn();
    document.addEventListener('keydown', behind);
    currentEpisode.value = withVideo;
    const { rerender } = render(<Island />);
    expect(fireEvent.keyDown(document, { key: '2' })).toBe(false);
    rerender(<Island />);
    expect(fireEvent.keyDown(document, { key: 'Escape' })).toBe(false);
    rerender(<Island />);
    expect(behind).not.toHaveBeenCalled();
    // A second Escape, the card closed, is not the island's.
    expect(fireEvent.keyDown(document, { key: 'Escape' })).toBe(true);
    expect(behind).toHaveBeenCalledTimes(1);
    document.removeEventListener('keydown', behind);
  });

  it('keeps keyboard focus when a picture-bar button takes the bar away', () => {
    currentEpisode.value = withVideo;
    isPlaying.value = true;
    const { rerender } = render(<Island />);
    const inIsland = () => document.getElementById('player')!.contains(document.activeElement);

    const open = screen.getByRole('button', { name: 'Open the now-playing card' });
    open.focus();
    fireEvent.click(open);
    rerender(<Island />);
    expect(inIsland()).toBe(true);

    fireEvent.keyDown(document, { key: 'Escape' });
    rerender(<Island />);
    const close = screen.getByRole('button', { name: 'Close video' });
    close.focus();
    fireEvent.click(close);
    rerender(<Island />);
    expect(screen.queryByRole('button', { name: 'Close video' })).toBeNull();
    expect(inIsland()).toBe(true);
  });

  it('skips to the shelf once it arrives, and says Play next only for Up next', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          episodes: {
            data: [{ ...withVideo, id: 'ep-9', title: 'Shelf Episode', episodeSlug: 'shelf-episode' }]
          }
        })
      }))
    );
    currentEpisode.value = audioOnly;
    currentTime.value = 1;
    render(<Island />);
    const skip = () => document.querySelector('.island-skip button')!;
    expect(skip()).toHaveAccessibleName('Nothing to play next');
    expect(skip()).toBeDisabled();

    // The shelf lands after the island has rendered; the button follows it.
    await waitFor(() => expect(skip()).toHaveAccessibleName('Skip to Shelf Episode'));
    expect(skip()).toBeEnabled();

    act(() => enqueue(withVideo));
    expect(skip()).toHaveAccessibleName('Play next: Video Episode');

    queue.value = [];
    currentTime.value = 0;
    vi.unstubAllGlobals();
  });

  it('keeps the rail for screens that have one', () => {
    currentEpisode.value = withVideo;
    wideScreen.value = false;
    const { rerender } = render(<Island />);
    fireEvent.keyDown(document, { key: '4' });
    rerender(<Island />);
    expect(document.getElementById('player')).toHaveAttribute('data-state', 'dock');
  });

  it('moves the floating picture round the corners from the keyboard, and remembers', () => {
    currentEpisode.value = withVideo;
    pipCorner.value = 'se';
    const { rerender } = render(<Island />);

    fireEvent.click(screen.getByRole('button', { name: 'Move the picture to the bottom left corner' }));
    expect(pipCorner.value).toBe('sw');
    expect(localStorage.getItem('starpod:pip-corner')).toBe('"sw"');
    rerender(<Island />);
    expect(
      screen.getByRole('button', { name: 'Move the picture to the top left corner' })
    ).toBeInTheDocument();
  });

  it('docks the picture in the player and floats it again', () => {
    currentEpisode.value = withVideo;
    pipDocked.value = { watch: false, listen: true };
    const { rerender } = render(<Island />);
    const pip = () => screen.getByRole('button', { name: 'Picture-in-picture' });
    expect(pip()).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(pip());
    expect(pipDocked.value.watch).toBe(true);
    rerender(<Island />);
    expect(pip()).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(pip());
    expect(pipDocked.value.watch).toBe(false);
  });

  it('closes the floating video, pausing it, and brings it back on play', () => {
    currentEpisode.value = withVideo;
    isPlaying.value = true;
    const { rerender } = render(<Island />);

    fireEvent.click(screen.getByRole('button', { name: 'Close video' }));
    expect(isPlaying.value).toBe(false);
    expect(miniClosed.value).toBe(true);
    rerender(<Island />);
    expect(screen.queryByRole('button', { name: 'Close video' })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Play' }));
    expect(isPlaying.value).toBe(true);
    expect(miniClosed.value).toBe(false);
    rerender(<Island />);
    expect(screen.getByRole('button', { name: 'Close video' })).toBeInTheDocument();
  });
});

describe('on a phone', () => {
  beforeEach(() => {
    currentEpisode.value = withVideo;
    isPlaying.value = true;
    miniClosed.value = false;
    islandHome.value = 'dock';
    wideScreen.value = false;
    phoneScreen.value = true;
    phoneFloat.value = false;
    pipDocked.value = { watch: false, listen: true };
    setMedium('watch');
  });

  afterEach(() => {
    phoneScreen.value = false;
    phoneFloat.value = false;
    wideScreen.value = true;
  });

  it('keeps the picture in the dock, floating it only when asked, for this visit', () => {
    render(<Island />);
    expect(pictureDocked.value).toBe(true);
    const pip = screen.getAllByRole('button', { name: 'Picture-in-picture' })[0]!;
    expect(pip).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(pip);
    expect(phoneFloat.value).toBe(true);
    expect(pictureDocked.value).toBe(false);
    // What wider screens remember is left alone.
    expect(pipDocked.value.watch).toBe(false);
  });

  it('offers only the dock and the card: a remembered pill is the dock', () => {
    islandHome.value = 'pill';
    const { rerender } = render(<Island />);
    expect(document.getElementById('player')).toHaveAttribute('data-state', 'dock');

    islandHome.value = 'dock';
    rerender(<Island />);
    fireEvent.keyDown(document, { key: '1' });
    rerender(<Island />);
    expect(document.getElementById('player')).toHaveAttribute('data-state', 'dock');
  });

  it("closes the card from its own close, where focus starts", () => {
    islandHome.value = 'card';
    const { rerender } = render(<Island />);
    const close = screen.getByRole('button', { name: 'Close the now-playing card' });

    fireEvent.click(close);
    rerender(<Island />);
    expect(document.getElementById('player')).toHaveAttribute('data-state', 'dock');
  });

  it('closes the floating picture back into the dock, playing on', () => {
    phoneFloat.value = true;
    render(<Island />);
    fireEvent.click(screen.getByRole('button', { name: 'Put the video back in the player' }));
    expect(phoneFloat.value).toBe(false);
    expect(isPlaying.value).toBe(true);
    expect(miniClosed.value).toBe(false);
  });
});

describe('without anchor positioning', () => {
  beforeEach(() => {
    currentEpisode.value = withVideo;
    isPlaying.value = true;
    miniClosed.value = false;
    islandHome.value = 'pill';
    wideScreen.value = true;
    anchorPositioning.value = false;
  });

  afterEach(() => {
    anchorPositioning.value = true;
    islandHome.value = 'dock';
  });

  it('offers only the dock: no choice of home, no keys to the others, no card to open', () => {
    const { rerender } = render(<Island />);
    const island = () => document.getElementById('player')!;
    // A remembered pill is the dock.
    expect(island()).toHaveAttribute('data-state', 'dock');
    expect(screen.queryByRole('radiogroup', { name: 'Player home' })).toBeNull();

    for (const key of ['1', '2', '4']) {
      fireEvent.keyDown(document, { key });
      rerender(<Island />);
      expect(island()).toHaveAttribute('data-state', 'dock');
    }

    // The name goes to its episode instead of opening the card.
    expect(screen.queryByRole('button', { name: /now-playing card/ })).toBeNull();
    const name = island().querySelector('.island-name')!;
    expect(name.tagName).toBe('A');
    expect(name).toHaveAttribute('href', '/video-episode');
  });
});

describe('medium preference', () => {
  beforeEach(() => {
    currentEpisode.value = null;
    setMedium('watch');
  });

  it('plays audio for episodes without video, whatever the preference', () => {
    playEpisode(audioOnly);
    expect(activeMedium.value).toBe('listen');
  });

  it('follows the preference for episodes with video, and remembers it', () => {
    playEpisode(withVideo);
    expect(activeMedium.value).toBe('watch');

    render(<MediumSwitch />);
    fireEvent.click(screen.getByRole('radio', { name: 'Listen' }));
    expect(preferredMedium.value).toBe('listen');
    expect(activeMedium.value).toBe('listen');
    expect(localStorage.getItem('starpod:medium')).toBe('listen');
    expect(screen.getByRole('radio', { name: 'Listen' })).toHaveAttribute(
      'aria-checked',
      'true'
    );
  });
});
