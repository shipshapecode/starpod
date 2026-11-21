import { activeMedium, currentEpisode, isMuted, isPlaying, setMedium } from '../state';
import { enterFullscreen, skip } from './engine';

const FLASH_MS = 700;

/**
 * Draw the gradient outline around the control a key stood in for, so the
 * keyboard gets the same acknowledgement a click would.
 */
function flash(name: string) {
  const control = document.querySelector<HTMLElement>(`.dock [data-shortcut="${name}"]`);
  if (!control) {
    return;
  }
  control.setAttribute('data-flash', '');
  window.clearTimeout(Number(control.dataset.flashTimer));
  control.dataset.flashTimer = String(
    window.setTimeout(() => control.removeAttribute('data-flash'), FLASH_MS)
  );
}

function isTyping(target: EventTarget | null) {
  const element = target as HTMLElement | null;
  return Boolean(
    element?.closest?.('input, textarea, select, [contenteditable=""], [contenteditable="true"]')
  );
}

/**
 * App-player keys, active once an episode is loaded: K or space (when nothing
 * else has focus) plays and pauses, J and L skip, M mutes, W switches between
 * watching and listening, F goes fullscreen while watching.
 */
export function installShortcuts() {
  document.addEventListener('keydown', (event) => {
    const episode = currentEpisode.value;
    if (
      !episode ||
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      isTyping(event.target)
    ) {
      return;
    }

    const onPage = event.target === document.body || event.target === document.documentElement;
    switch (event.key.toLowerCase()) {
      case ' ':
        if (!onPage) {
          return;
        }
      // falls through
      case 'k':
        isPlaying.value = !isPlaying.value;
        flash('play');
        break;
      case 'j':
        skip(-15);
        flash('back');
        break;
      case 'l':
        skip(30);
        flash('forward');
        break;
      case 'm':
        isMuted.value = !isMuted.value;
        flash('mute');
        break;
      case 'f':
        if (!episode.video || activeMedium.value !== 'watch') {
          return;
        }
        enterFullscreen();
        break;
      case 'w':
        if (!episode.video) {
          return;
        }
        setMedium(activeMedium.value === 'watch' ? 'listen' : 'watch');
        flash('medium');
        break;
      default:
        return;
    }
    event.preventDefault();
  });
}
