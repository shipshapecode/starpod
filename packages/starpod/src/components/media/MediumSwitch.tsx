import { HeadphonesIcon, VideoIcon } from '../icons';
import { type Medium, preferredMedium, setMedium } from '../state';

type Props = { compact?: boolean; shortcut?: boolean };

/**
 * Watch / Listen. A two-option radio group; the choice is the visitor's
 * standing preference and survives reloads. Render it only for episodes that
 * have video.
 */
export default function MediumSwitch({ compact = false, shortcut = false }: Props) {
  const medium = preferredMedium.value;

  // A radio group's keys: an arrow moves the choice (and focus) to the other
  // option; only the chosen one is a tab stop.
  const onKeyDown = (event: KeyboardEvent) => {
    if (!/^Arrow(Left|Right|Up|Down)$/.test(event.key)) {
      return;
    }
    event.preventDefault();
    const next: Medium = medium === 'watch' ? 'listen' : 'watch';
    setMedium(next);
    (event.currentTarget as HTMLElement)
      .querySelector<HTMLElement>(`[data-medium="${next}"]`)
      ?.focus();
  };

  return (
    <div
      aria-label="Watch or listen"
      class="medium-switch relative inline-grid grid-cols-[1fr_1fr] rounded-full border border-line-strong bg-ground p-[3px]"
      data-compact={compact ? '' : undefined}
      data-props-for="pointer-local"
      data-shortcut={shortcut ? 'medium' : undefined}
      onKeyDown={onKeyDown}
      role="radiogroup"
      title={shortcut ? 'Watch or listen (W)' : undefined}
    >
      <button
        aria-checked={medium === 'watch'}
        class="medium-option"
        data-medium="watch"
        onClick={() => setMedium('watch')}
        role="radio"
        tabIndex={medium === 'watch' ? 0 : -1}
        type="button"
      >
        <VideoIcon size={compact ? 16 : 18} />
        <span>Watch</span>
      </button>
      <button
        aria-checked={medium === 'listen'}
        class="medium-option"
        data-medium="listen"
        onClick={() => setMedium('listen')}
        role="radio"
        tabIndex={medium === 'listen' ? 0 : -1}
        type="button"
      >
        <HeadphonesIcon size={compact ? 16 : 18} />
        <span>Listen</span>
      </button>
      <span
        aria-hidden="true"
        class="medium-thumb absolute inset-[3px_auto_3px_3px] w-[calc(50%-3px)] rounded-full bg-ink transition-[translate] duration-520 ease-spring"
      />
    </div>
  );
}
