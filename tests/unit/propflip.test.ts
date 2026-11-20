import { afterEach, describe, expect, it } from 'vitest';
import {
  flip,
  flipLayout,
  registerFlipTargets
} from 'starpod/src/motion/propflip';

// A box whose rect is whatever the test says it is right now.
function box(rect: { left: number; top: number }, log?: string[], name = '') {
  const el = document.createElement('div');
  el.getBoundingClientRect = () => {
    log?.push(`measure ${name}`);
    return { ...rect, width: 100, height: 50 } as DOMRect;
  };
  document.body.append(el);
  return { el, rect };
}

describe('flipLayout registrations', () => {
  const off: Array<() => void> = [];
  afterEach(() => {
    off.splice(0).forEach((unregister) => unregister());
    document.body.replaceChildren();
  });

  it('runs a settle after the change and before the boxes are measured again', () => {
    const log: string[] = [];
    const card = box({ left: 0, top: 0 }, log, 'card');
    off.push(
      registerFlipTargets(() => [card.el], {
        settle: () => {
          log.push('settle');
          // The size the feature derives from the new layout.
          card.rect.top = 40;
        }
      })
    );

    const moves = flipLayout(() => {
      log.push('mutate');
    });

    expect(log).toEqual(['measure card', 'mutate', 'settle', 'measure card']);
    // The move is measured from the settled box, not a stale one.
    expect(moves.map((m) => m.last.top)).toEqual([40]);
  });

  it('changes nothing for a registration without options', () => {
    const log: string[] = [];
    const card = box({ left: 0, top: 0 }, log, 'card');
    off.push(registerFlipTargets(() => [card.el]));

    const moves = flipLayout(() => {
      log.push('mutate');
      card.rect.left = 30;
    });

    expect(log).toEqual(['measure card', 'mutate', 'measure card']);
    expect(moves.map((m) => m.last.left)).toEqual([30]);
  });

  it("measures a viewport registration's boxes in the viewport, the rest against the frame", () => {
    const frame = box({ left: 200, top: 0 });
    const inColumn = box({ left: 210, top: 0 });
    const held = box({ left: 210, top: 0 });
    off.push(registerFlipTargets(() => [inColumn.el]));
    off.push(registerFlipTargets(() => [held.el], { viewport: true }));

    const moves = flipLayout(
      () => {
        inColumn.rect.top = 10;
        held.rect.top = 10;
      },
      { frame: () => frame.el }
    );

    const last = new Map(moves.map((m) => [m.el, m.last]));
    expect(last.get(inColumn.el)!.left).toBe(10);
    expect(last.get(held.el)!.left).toBe(210);
  });
});

describe('flip commit', () => {
  afterEach(() => document.body.replaceChildren());

  it('holds only the flip while it writes the lie: what --also lists keeps running', () => {
    const card = box({ left: 0, top: 0 });
    // What the element's transition is each time the lie or the play is written.
    const seen: Array<[string, string]> = [];
    const setProperty = card.el.style.setProperty.bind(card.el.style);
    card.el.style.setProperty = (name: string, value: string | null) => {
      if (name === '--tx') {
        seen.push([value ?? '', card.el.style.transition]);
      }
      setProperty(name, value);
    };

    const moves = flip([card.el], () => {
      card.rect.left = 40;
    });

    expect(moves).toHaveLength(1);
    // The lie (-40) is written under the element's own --also list, never
    // `transition: none`, which would cancel a layout transition the update
    // started; the play (0) under its full list again.
    expect(seen).toEqual([
      ['-40', 'var(--also, visibility 0s)'],
      ['0', '']
    ]);
  });
});
