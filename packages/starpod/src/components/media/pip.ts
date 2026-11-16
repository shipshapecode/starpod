/**
 * Picture-in-picture you can throw. Grab the floating picture (even
 * mid-flight: hold() freezes it where its pixels are), drag it, and let go:
 * it is tossed to the nearest corner, or into the player bar when dropped on
 * it, with a PropFLIP from the pixels under the pointer. Corners are anchors
 * in CSS (player.css); this only decides which one.
 *
 * Client-only; started once by the media engine.
 */
import { hold, nudge, reducedMotion, type FlipProps } from '../../motion/propflip';
import { dockPicture, pipCorner, pipDocked, activeMedium, type Corner } from '../state';

const THRESHOLD = 5;

/** The corner of the room the point is nearest to, or the bar below the room. */
function zoneAt(room: DOMRect, x: number, y: number): Corner | 'dock' {
  if (y > room.bottom) {
    return 'dock';
  }
  const north = y < room.top + room.height / 2;
  const west = x < room.left + room.width / 2;
  return north ? (west ? 'nw' : 'ne') : west ? 'sw' : 'se';
}

export function startPip(outer: HTMLElement, place: (mode?: 'again') => void) {
  const flyer = outer.firstElementChild as HTMLElement;
  let drag: {
    x: number;
    y: number;
    p: FlipProps | null;
    zone: Corner | 'dock' | null;
  } | null = null;
  let dragged = false;
  // The room's rect, read once per drag before anything moves (reading it
  // after each nudge would lay the page out on every move), and again only
  // if the page scrolls or resizes under the drag.
  let room: DOMRect | null = null;
  const forget = () => (room = null);

  const mark = (zone: Corner | 'dock' | null) => {
    for (const target of document.querySelectorAll<HTMLElement>('[data-pip-zone]')) {
      target.toggleAttribute('data-hot', target.dataset.pipZone === zone);
    }
  };

  flyer.addEventListener('pointerdown', (event) => {
    if (event.button || outer.dataset.station !== 'corner') {
      return;
    }
    flyer.setPointerCapture(event.pointerId);
    drag = { x: event.clientX, y: event.clientY, p: null, zone: null };
    dragged = false;
  });

  flyer.addEventListener('pointermove', (event) => {
    if (!drag) {
      return;
    }
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    room ??= document.querySelector('[data-player-room]')!.getBoundingClientRect();
    if (!drag.p) {
      if (Math.hypot(dx, dy) < THRESHOLD) {
        return;
      }
      drag.p = hold(flyer);
      outer.dataset.held = '';
      addEventListener('scroll', forget, { capture: true, passive: true });
      addEventListener('resize', forget, { passive: true });
    }
    nudge(flyer, { ...drag.p, tx: drag.p.tx + dx, ty: drag.p.ty + dy });
    const zone = zoneAt(room, event.clientX, event.clientY);
    if (zone !== drag.zone) {
      drag.zone = zone;
      mark(zone);
    }
  });

  const drop = () => {
    if (!drag) {
      return;
    }
    const { p, zone } = drag;
    drag = null;
    forget();
    removeEventListener('scroll', forget, { capture: true });
    removeEventListener('resize', forget);
    mark(null);
    if (!p || !zone) {
      return;
    }
    dragged = true;
    delete outer.dataset.held;
    if (reducedMotion()) {
      flyer.style.transition = '';
      nudge(flyer, { tx: 0, ty: 0, sx: 1, sy: 1 });
    }
    const before = [pipCorner.value, pipDocked.value[activeMedium.value]].join();
    if (zone === 'dock') {
      dockPicture(true);
    } else {
      pipCorner.value = zone;
    }
    // Let go where it came from: nothing changed, so fly it home explicitly.
    if ([pipCorner.value, pipDocked.value[activeMedium.value]].join() === before) {
      place('again');
    }
  };
  flyer.addEventListener('pointerup', drop);
  flyer.addEventListener('pointercancel', drop);

  // A drag is not a click: the picture opens its episode only when tapped.
  flyer.addEventListener(
    'click',
    (event) => {
      if (dragged) {
        dragged = false;
        event.stopImmediatePropagation();
      }
    },
    true
  );
}
