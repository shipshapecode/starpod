import { isMuted } from '../../state';
import './styles.css';

export default function MuteButton() {
  return (
    <button
      class={`gradient-icon group h-4 w-4 relative md:order-none ${isMuted.value ? 'unmute-button' : 'mute-button'}`}
      type="button"
      onClick={() => (isMuted.value = !isMuted.value)}
      aria-label={isMuted.value ? 'Unmute' : 'Mute'}
    >
      <div class="absolute -inset-4 md:hidden" />
    </button>
  );
}
