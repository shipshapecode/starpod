/**
 * PropFLIP, the script half. A typed port of Adam Argyle's PropFLIP kit
 * (https://nerdy.dev/prop-flip); the styles are in ./propflip.css.
 *
 * Elements that flip carry the `PropFLIP` class. The invert is written to
 * four typed custom properties (--tx, --ty, --sx, --sy) and the play is a CSS
 * transition, so a flip is interruptible and composes with any layout
 * transition listed in `--also` (the anchored-auto-layout hybrid).
 *
 * Client-only at call time. Importing it on the server is safe.
 */

export interface FlipProps {
  tx: number;
  ty: number;
  sx: number;
  sy: number;
}

export interface FlipRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface FlipMove {
  el: HTMLElement;
  first: FlipRect;
  last: FlipRect;
  moving?: boolean;
  delay?: number;
}

export interface FlipOptions {
  /** Element to measure relative to (a counter-scaled wrapper). */
  frame?: (el: HTMLElement) => Element | null | undefined;
  /** Milliseconds between each moving element. */
  stagger?: number;
  /** Animate even if the layout box didn't change (a drag release). */
  force?: boolean | ((el: HTMLElement) => boolean);
  /** Sort moving elements before staggering. */
  order?: (a: HTMLElement, b: HTMLElement) => number;
}

export interface WatchJumpsOptions {
  threshold?: number;
  onJump?: (el: HTMLElement) => void;
  /** Milliseconds after the last wake() before the watcher sleeps. */
  idle?: number;
}

export type StopWatching = (() => void) & { wake: () => void };

function setProps(el: HTMLElement, { tx, ty, sx, sy }: FlipProps) {
  el.style.setProperty('--tx', String(tx));
  el.style.setProperty('--ty', String(ty));
  el.style.setProperty('--sx', String(sx));
  el.style.setProperty('--sy', String(sy));
}

const IDENTITY: FlipProps = { tx: 0, ty: 0, sx: 1, sy: 1 };

/** True when the visitor (or `<html data-motion="reduce">`) asks for less motion. */
export function reducedMotion(): boolean {
  return (
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.dataset.motion === 'reduce'
  );
}

/** The current (possibly mid-transition) values of the four props. */
export function props(el: Element): FlipProps {
  const cs = getComputedStyle(el);
  const n = (k: string, d: number) => {
    const v = parseFloat(cs.getPropertyValue(k));
    return Number.isFinite(v) ? v : d;
  };
  return { tx: n('--tx', 0), ty: n('--ty', 0), sx: n('--sx', 1), sy: n('--sy', 1) };
}

function rect(el: Element, frame?: Element | null): FlipRect {
  const r = el.getBoundingClientRect();
  if (!frame) {
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  }
  const f = frame.getBoundingClientRect();
  return { left: r.left - f.left, top: r.top - f.top, width: r.width, height: r.height };
}

/** A visual rect minus the element's own PropFLIP transform: its layout box. */
export function strip(v: FlipRect, p: FlipProps): FlipRect {
  return {
    left: v.left - p.tx,
    top: v.top - p.ty,
    width: v.width / p.sx,
    height: v.height / p.sy
  };
}

export function layoutRect(el: Element, frame?: Element | null): FlipRect {
  return strip(rect(el, frame), props(el));
}

function close(a: FlipRect, b: FlipRect, eps = 0.5) {
  return (
    Math.abs(a.left - b.left) < eps &&
    Math.abs(a.top - b.top) < eps &&
    Math.abs(a.width - b.width) < eps &&
    Math.abs(a.height - b.height) < eps
  );
}

function inFlight(p: FlipProps) {
  return (
    Math.abs(p.tx) > 0.5 ||
    Math.abs(p.ty) > 0.5 ||
    Math.abs(p.sx - 1) > 0.005 ||
    Math.abs(p.sy - 1) > 0.005
  );
}

type FlipListener = (moves: FlipMove[]) => void;
const listeners = new Set<FlipListener>();
const resynced = new WeakSet<Element>();

/** Hear about every committed flip. Returns the unsubscribe. */
export function onFlip(fn: FlipListener) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function commit(moves: FlipMove[]) {
  if (!moves.length) {
    return;
  }
  // Hold only the flip's own four: whatever its `--also` lists (a layout
  // transition the update just started) keeps running.
  for (const { el, first, last } of moves) {
    el.style.transition = 'var(--also, visibility 0s)';
    setProps(el, {
      tx: first.left - last.left,
      ty: first.top - last.top,
      sx: last.width ? first.width / last.width : 1,
      sy: last.height ? first.height / last.height : 1
    });
  }
  void document.body.offsetHeight; // commit the lie
  for (const { el, delay } of moves) {
    el.style.transition = '';
    el.style.setProperty('--flip-delay', `${delay || 0}ms`);
    setProps(el, IDENTITY);
    resynced.add(el);
  }
  listeners.forEach((fn) => fn(moves));
}

/**
 * A flip never cancels a running transition to measure: it reads each element's live --tx/--ty/--sx/--sy, strips that
 * transform from its rect to find the layout box, then inverts from the exact
 * pixels on screen. Elements already in flight never get a stagger re-applied.
 *
 * Targets must not nest: each is inverted on its own, so a child flipped with
 * its parent would carry the parent's invert twice.
 */
export function flip(
  targets: Iterable<HTMLElement | null | undefined>,
  update: () => void = () => {},
  opts: FlipOptions = {}
): FlipMove[] {
  const els = [...targets].filter((el): el is HTMLElement => Boolean(el));
  if (reducedMotion()) {
    update();
    // Reset with transitions off: `data-motion="reduce"` alone doesn't stop
    // the stylesheet's, so a held box would otherwise glide home.
    els.forEach((el) => {
      el.style.transition = 'none';
      setProps(el, IDENTITY);
    });
    if (els.length) {
      void document.body.offsetHeight;
    }
    els.forEach((el) => (el.style.transition = ''));
    return [];
  }
  const before = els.map((el) => {
    const f = opts.frame?.(el) || null;
    const p = props(el);
    const v = rect(el, f);
    return { el, f, p, v, l: strip(v, p) };
  });
  update();
  const moves: FlipMove[] = [];
  for (const b of before) {
    if (!b.el.isConnected) {
      continue;
    }
    const last = strip(rect(b.el, b.f), b.p);
    if (!last.width || !last.height || !b.v.width || !b.v.height) {
      continue;
    }
    const forced = typeof opts.force === 'function' ? opts.force(b.el) : opts.force;
    if (!forced && close(b.l, last)) {
      continue;
    }
    moves.push({ el: b.el, first: b.v, last, moving: inFlight(b.p) });
  }
  if (opts.order) {
    const order = opts.order;
    moves.sort((a, b) => order(a.el, b.el));
  }
  // Stagger only things at rest: re-delaying a box that's mid-flight would
  // freeze it in place on every interrupt.
  moves.forEach((m, i) => (m.delay = m.moving ? 0 : (opts.stagger || 0) * i));
  commit(moves);
  return moves;
}

/** Animate an element from an arbitrary visual rect to wherever layout has it. */
export function flipFrom(el: HTMLElement, first: FlipRect, frame?: Element | null) {
  if (reducedMotion()) {
    return;
  }
  const last = strip(rect(el, frame), props(el));
  // Nothing to scale from or to: a box with no size isn't on screen.
  if (!first.width || !first.height || !last.width || !last.height) {
    return;
  }
  commit([{ el, first, last }]);
}

/** Freeze an element where its pixels are right now (a drag pickup mid-flight). */
export function hold(el: HTMLElement): FlipProps {
  const p = props(el);
  el.style.transition = 'none';
  setProps(el, p);
  return p;
}

export function nudge(el: HTMLElement, p: FlipProps) {
  setProps(el, p);
}

/**
 * Watch for layout jumps nobody asked for: a position-try fallback flipping,
 * the anchor changing size, a container query re-laying content. Layout is
 * tracked relative to the anchor, so an anchor being dragged (the target
 * following it every frame) is not a jump, but a fallback flip is.
 *
 * Measuring every frame is not free. Pass `idle` (ms) and the watcher sleeps
 * that long after the last wake(); call wake() from whatever can cause a jump
 * (a drag, a toggle, a resize).
 */
export function watchJumps(
  getEl: () => HTMLElement | null | undefined,
  getAnchor: () => Element | null | undefined,
  { threshold = 4, onJump, idle }: WatchJumpsOptions = {}
): StopWatching {
  type Snapshot = { rel: FlipRect; vis: FlipRect };
  let prev: Snapshot | null = null;
  let prevEl: Element | null = null;
  let stopped = false;
  let until = 0;
  let running = true;

  const measure = (now: number) => {
    const el = getEl();
    const anchor = getAnchor();
    if (!el?.isConnected || !anchor?.isConnected) {
      prev = null;
      return;
    }
    const a = anchor.getBoundingClientRect();
    const p = props(el);
    // Never fall asleep on a box that is still in flight: its pixels would be
    // stale on waking.
    if (inFlight(p)) {
      until = now + (idle || 0);
    }
    const v = el.getBoundingClientRect();
    const l = strip(v, p);
    const cur: Snapshot = {
      rel: { left: l.left - a.left, top: l.top - a.top, width: l.width, height: l.height },
      vis: { left: v.left - a.left, top: v.top - a.top, width: v.width, height: v.height }
    };
    if (el !== prevEl || resynced.has(el) || el.dataset.held != null || reducedMotion()) {
      resynced.delete(el);
      prevEl = el;
      prev = cur;
      return;
    }
    if (prev && !close(prev.rel, cur.rel, threshold) && l.width && l.height && prev.vis.width) {
      const first = {
        left: prev.vis.left + a.left,
        top: prev.vis.top + a.top,
        width: prev.vis.width,
        height: prev.vis.height
      };
      commit([{ el, first, last: l }]);
      resynced.delete(el);
      cur.vis = { ...prev.vis };
      onJump?.(el);
    }
    prev = cur;
  };

  const tick = (now: number) => {
    running = false;
    if (stopped) {
      return;
    }
    measure(now);
    if (!idle || now < until) {
      running = true;
      requestAnimationFrame(tick);
    }
  };
  requestAnimationFrame(tick);

  const stop = (() => {
    stopped = true;
  }) as StopWatching;
  stop.wake = () => {
    until = performance.now() + (idle || 0);
    if (!running && !stopped) {
      running = true;
      requestAnimationFrame(tick);
    }
  };
  return stop;
}

/*
  Layout flips across features. A feature registers a collector for the boxes
  it wants carried through any shell-level layout change (visible episode
  cards, the stage frame…); whoever changes the layout (the sidebar toggle, a
  view switch) wraps the change in flipLayout() and every registered box
  glides to its new place.
*/
type Collector = () => Iterable<HTMLElement | null | undefined>;
export interface FlipTargetOptions {
  /**
   * Runs after the layout change and before the new boxes are measured: the
   * place for a feature to write sizes it derives from the new layout (its
   * own ResizeObserver's work, done now), so the flip measures where its
   * boxes will really be rather than one frame stale.
   */
  settle?: () => void;
  /**
   * Measure this feature's boxes in the viewport, not against the frame the
   * caller passes (the page column): for a feature that scrolls in settle()
   * to hold the reader's place, which a frame-relative box can't see.
   */
  viewport?: boolean;
}
const registrations = new Set<{ collect: Collector } & FlipTargetOptions>();

/** Register boxes to carry through shell-level layout changes. Returns the unregister. */
export function registerFlipTargets(collect: Collector, opts: FlipTargetOptions = {}) {
  const registration = { collect, ...opts };
  registrations.add(registration);
  return () => registrations.delete(registration);
}

/** Run a layout change and flip every registered box (plus `extra`) through it. */
export function flipLayout(
  mutate: () => void,
  opts: FlipOptions & { extra?: Iterable<HTMLElement | null | undefined> } = {}
): FlipMove[] {
  const all = [...registrations];
  const inViewport = new Set<HTMLElement | null | undefined>();
  const targets = all.flatMap(({ collect, viewport }) => {
    const els = [...collect()];
    if (viewport) {
      els.forEach((el) => inViewport.add(el));
    }
    return els;
  });
  return flip(
    [...targets, ...(opts.extra ?? [])],
    () => {
      mutate();
      all.forEach(({ settle }) => settle?.());
    },
    { ...opts, frame: (el) => (inViewport.has(el) ? null : opts.frame?.(el)) }
  );
}

/** The kit under its original name. */
export const PropFLIP = {
  reducedMotion,
  props,
  strip,
  layoutRect,
  onFlip,
  flip,
  flipFrom,
  hold,
  nudge,
  watchJumps
};
