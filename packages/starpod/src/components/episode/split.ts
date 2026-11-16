/*
  The episode stage, split (demos/split.html): the picture and its meta on
  one side, the live transcript on the other, and one divider between them
  that is the only anchor. Both sides are anchored to the divider, so the
  only layout state is one number: where it is (--ep-x). Dragging writes that
  number and nothing animates; letting go projects the throw, picks the snap
  stop it was heading for and flip()s the DIVIDER there. The sides ride the
  gliding line because anchor() follows its anchor's transform, and the
  picture, anchored to its slot on the near side, resizes for real. Grab it
  mid-glide and the layout freezes on the pixels you caught.

  A chosen preset is the state, not a fraction of the stage: as the window
  narrows or widens the divider keeps to that preset's stop, and the preset
  stays pressed, so its indicator stays put on it (by layout alone). Only a
  free drag holds a fraction. The indicator slides only when a choice moves
  it from one preset to another.

  Desktop only, and only where anchored-auto-layout's typed attr() works;
  everywhere else the stage keeps its grid.
*/
import { flip } from '../../motion/propflip';

const A = 'data-⚓️-';
const KEY = 'starpod:split';
/** Share of the stage the picture side takes at each preset. */
const PRESETS = { read: 0.36, balanced: 0.52, watch: 0.66 } as const;
type Preset = keyof typeof PRESETS;
const SIDE_MIN = 280;
const SCRIPT_MIN = 240;

// Each side spans from a stage edge to the divider.
const RECIPE = {
  side: { 'pin-leading': '', 'pin-top': '', before: '--ep-split' },
  script: { after: '--ep-split', 'pin-trailing': '', 'pin-y': '' }
};

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const nearest = (v: number, stops: Array<number>) =>
  stops.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a));

const KEYS = Object.keys(PRESETS) as Array<Preset>;

/** The saved choice: a preset, or a free share of the stage. */
function readChoice(): { chosen: Preset | null; share: number } {
  let saved: string | null = null;
  try {
    saved = localStorage.getItem(KEY);
  } catch {
    // No storage: the default.
  }
  if (KEYS.includes(saved as Preset)) {
    return { chosen: saved as Preset, share: PRESETS[saved as Preset] };
  }
  const share = Number(saved);
  if (!(share > 0 && share < 1)) {
    return { chosen: 'balanced', share: PRESETS.balanced };
  }
  // Saved as a share before presets were kept by name.
  return { chosen: KEYS.find((key) => PRESETS[key] === share) ?? null, share };
}

function saveChoice(chosen: Preset | null, share: number) {
  try {
    localStorage.setItem(KEY, chosen ?? share.toFixed(3));
  } catch {
    // No storage: the choice lasts for this page.
  }
}

let stop: AbortController | undefined;

function init() {
  stop?.abort();
  const stage = document.querySelector<HTMLElement>('[data-stage][data-split]');
  const divider = stage?.querySelector<HTMLElement>('.ep-split');
  const side = stage?.querySelector<HTMLElement>('.stage-side');
  const script = stage?.querySelector<HTMLElement>('.stage-script');
  if (
    stage &&
    divider &&
    side &&
    script &&
    CSS.supports('anchor-name', 'attr(data-a type(<custom-ident>))')
  ) {
    split(stage, divider, side, script);
  }
}

function split(
  stage: HTMLElement,
  divider: HTMLElement,
  side: HTMLElement,
  script: HTMLElement
) {
  stop = new AbortController();
  const { signal } = stop;
  const wide = matchMedia('(min-width: 1024px)');
  const presets = Array.from(
    stage.querySelectorAll<HTMLElement>('[data-preset]')
  );
  let { chosen, share } = readChoice();
  let on = false;

  const width = () => stage.clientWidth;
  const range = () =>
    [SIDE_MIN, Math.max(SIDE_MIN, width() - SCRIPT_MIN)] as const;
  const stops = () =>
    KEYS.map((key) => clamp(PRESETS[key] * width(), ...range()));
  // Where the divider is: the chosen preset's stop, or the free share.
  const position = () =>
    clamp((chosen ? PRESETS[chosen] : share) * width(), ...range());

  // The indicator is placed by layout alone (anchored to the pressed
  // preset); only a choice from one preset to another slides it, for that
  // one move, so a resize or a drag never starts an animation.
  const group = stage.querySelector<HTMLElement>('.ep-presets');
  const thumb = stage.querySelector<HTMLElement>('.ep-presets-on');
  function slide() {
    group?.setAttribute('data-sliding', '');
    const done = () => group?.removeAttribute('data-sliding');
    thumb?.addEventListener('transitionend', done, { once: true, signal });
    setTimeout(done, 1000);
  }

  // Reported straight after layout, in the same frame: the stage's width
  // (the divider keeps its share of it) and the picture side's height (the
  // side is anchored and out of flow, so the stage takes its height from it).
  // While the sidebar's divider is held (`html[data-rail-held]`) the stage
  // narrows every frame: the divider stays put meanwhile, and is placed once
  // on release.
  const root = document.documentElement;
  const held = () => root.hasAttribute('data-rail-held');
  let lastWidth = 0;
  const sizes = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === side) {
        stage.style.setProperty(
          '--ep-h',
          String(entry.borderBoxSize[0].blockSize)
        );
      } else if (entry.contentRect.width !== lastWidth && !held()) {
        lastWidth = entry.contentRect.width;
        apply();
      }
    }
  });
  // On release the stage is re-observed, so the divider is placed after the
  // next layout instead of forcing one in the release's pointerup.
  const released = new MutationObserver(() => {
    if (!held()) {
      sizes.unobserve(stage);
      sizes.observe(stage);
    }
  });
  released.observe(root, { attributeFilter: ['data-rail-held'] });

  function recipe(split: boolean) {
    for (const [el, attrs] of [
      [side, RECIPE.side],
      [script, RECIPE.script]
    ] as const) {
      for (const [name, value] of Object.entries(attrs)) {
        if (split) {
          el.setAttribute(A + name, value);
        } else {
          el.removeAttribute(A + name);
        }
      }
    }
    stage.toggleAttribute('data-split-on', split);
    if (split) {
      sizes.observe(side);
    } else {
      sizes.unobserve(side);
      stage.style.removeProperty('--ep-h');
    }
  }

  function apply() {
    const turningOn = wide.matches && !on;
    if (wide.matches !== on) {
      on = wide.matches;
      recipe(on);
    }
    if (!on) {
      return;
    }
    const x = position();
    stage.style.setProperty('--ep-x', x.toFixed(1));
    // The first height can't wait for the observer: one frame of a stage
    // with no height would throw everything below it up the page and back.
    if (turningOn) {
      stage.style.setProperty('--ep-h', String(side.offsetHeight));
    }
    divider.setAttribute(
      'aria-valuenow',
      String(Math.round((x / width()) * 100))
    );
    presets.forEach((button) =>
      button.setAttribute(
        'aria-pressed',
        String(button.dataset.preset === chosen)
      )
    );
  }

  // Everything that moves the divider goes through here: only the divider is
  // flipped, from wherever its pixels are. A choice that moves the pressed
  // preset slides the indicator with it (set before the flip's measure, so
  // the transition is in place when the anchor changes).
  const glide = (update = () => {}) => {
    const before = chosen;
    flip([divider], () => {
      update();
      if (before && chosen && before !== chosen) {
        slide();
      }
      apply();
    });
    saveChoice(chosen, share);
  };

  // Grabbing mid-glide: make the layout equal what is on screen, zero the
  // divider's transform without a transition, and carry on from there.
  // Caught between stops, no preset is chosen any more.
  function freeze() {
    const x =
      divider.getBoundingClientRect().left - stage.getBoundingClientRect().left;
    if (divider.getAnimations().length) {
      chosen = null;
    }
    divider.style.transition = 'none';
    for (const [name, value] of [
      ['--tx', 0],
      ['--ty', 0],
      ['--sx', 1],
      ['--sy', 1]
    ] as const) {
      divider.style.setProperty(name, String(value));
    }
    share = x / width();
    apply();
    void document.body.offsetHeight;
    divider.style.transition = '';
  }

  let drag: {
    x0: number;
    from: number;
    samples: Array<[number, number]>;
  } | null = null;

  divider.addEventListener(
    'pointerdown',
    (event) => {
      if (event.button) {
        return;
      }
      divider.setPointerCapture(event.pointerId);
      freeze();
      divider.dataset.held = '';
      drag = {
        x0: event.clientX,
        from: share * width(),
        samples: [[event.timeStamp, event.clientX]]
      };
    },
    { signal }
  );
  divider.addEventListener(
    'pointermove',
    (event) => {
      if (!drag) {
        return;
      }
      drag.samples.push([event.timeStamp, event.clientX]);
      chosen = null;
      while (
        drag.samples.length > 2 &&
        event.timeStamp - drag.samples[0][0] > 100
      ) {
        drag.samples.shift();
      }
      share = clamp(drag.from + event.clientX - drag.x0, ...range()) / width();
      apply();
    },
    { signal }
  );
  const release = (event: PointerEvent) => {
    if (!drag) {
      return;
    }
    const [[t0, x0], [t1, x1]] = [drag.samples[0], drag.samples.at(-1)!];
    // A pointer that stopped before letting go threw nothing.
    const velocity =
      t1 > t0 && event.timeStamp - t1 < 80 ? (x1 - x0) / (t1 - t0) : 0;
    const resting = share * width() + velocity * 220;
    drag = null;
    delete divider.dataset.held;
    glide(() => {
      const all = stops();
      chosen = KEYS[all.indexOf(nearest(resting, all))];
    });
  };
  divider.addEventListener('pointerup', release, { signal });
  divider.addEventListener('pointercancel', release, { signal });
  divider.addEventListener(
    'dblclick',
    () =>
      glide(
        () =>
          (chosen = position() / width() > PRESETS.balanced ? 'read' : 'watch')
      ),
    { signal }
  );
  divider.addEventListener(
    'keydown',
    (event) => {
      // Alt+Arrow is the browser's Back and Forward; leave modified keys be.
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }
      const all = stops();
      const at = chosen
        ? KEYS.indexOf(chosen)
        : all.indexOf(nearest(position(), all));
      const to = {
        ArrowLeft: at - 1,
        ArrowRight: at + 1,
        Home: 0,
        End: all.length - 1
      }[event.key];
      if (to === undefined) {
        return;
      }
      event.preventDefault();
      glide(() => (chosen = KEYS[clamp(to, 0, KEYS.length - 1)]));
    },
    { signal }
  );
  stage.addEventListener(
    'click',
    (event) => {
      const key = (event.target as Element).closest<HTMLElement>(
        '[data-preset]'
      )?.dataset.preset as Preset | undefined;
      if (key) {
        glide(() => (chosen = key));
      }
    },
    { signal }
  );

  sizes.observe(stage);
  signal.addEventListener('abort', () => {
    sizes.disconnect();
    released.disconnect();
  });
}

document.addEventListener('astro:page-load', init);
