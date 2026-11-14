import { HeadphonesIcon, VideoIcon } from '../icons';
import { preferredMedium, setMedium } from '../state';

type Props = { compact?: boolean; shortcut?: boolean };

/**
 * Watch / Listen. A two-option radio group; the choice is the visitor's
 * standing preference and survives reloads. Render it only for episodes that
 * have video.
 */
export default function MediumSwitch({ compact = false, shortcut = false }: Props) {
  const medium = preferredMedium.value;

  return (
    <div
      aria-label="Watch or listen"
      class="medium-switch"
      data-compact={compact ? '' : undefined}
      data-shortcut={shortcut ? 'medium' : undefined}
      role="radiogroup"
      title={shortcut ? 'Watch or listen (W)' : undefined}
    >
      <button
        aria-checked={medium === 'watch'}
        class="medium-option"
        onClick={() => setMedium('watch')}
        role="radio"
        type="button"
      >
        <VideoIcon size={compact ? 16 : 18} />
        <span>Watch</span>
      </button>
      <button
        aria-checked={medium === 'listen'}
        class="medium-option"
        onClick={() => setMedium('listen')}
        role="radio"
        type="button"
      >
        <HeadphonesIcon size={compact ? 16 : 18} />
        <span>Listen</span>
      </button>
      <span aria-hidden="true" class="medium-thumb" />
    </div>
  );
}
