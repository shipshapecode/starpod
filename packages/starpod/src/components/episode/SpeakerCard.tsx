import type { RefObject } from 'preact';
import { effect } from '@preact/signals';
import { useLayoutEffect, useRef } from 'preact/hooks';

import { flip } from '../../motion/propflip';
import { speakingNow } from './speaking';

export type Speaker = {
  /** The line that says something about them (`personFact`). */
  fact: string;
  name: string;
  src: string;
  /** Transcript voice 0 or 1, for their ring. */
  voice?: number;
};

type Props = {
  root: RefObject<HTMLElement>;
  /** People on the episode, by the name the transcript gives them. */
  speakers: Record<string, Speaker>;
};

/**
 * Who is speaking: hover a speaker's name in the transcript's gutter (or
 * focus the turn's timestamp) for the person behind the name. One card
 * serves every turn, anchored to whichever turn's head (timestamp and name)
 * is active, so it never sits over the timestamp; it takes no pointer
 * events either, so it can't take a click meant for one. Moving to another
 * name flips the card across (PropFLIP); near the top of the screen, where
 * stuck heads sit, the browser flips it below the head instead and an
 * anchored container query turns the caret. Scrolling puts it away, so
 * nothing is measured while the page moves.
 */
export default function SpeakerCard({ root, speakers }: Props) {
  const card = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLImageElement>(null);
  const name = useRef<HTMLElement>(null);
  const fact = useRef<HTMLSpanElement>(null);

  // Listening from hydration on, not after the next frame (a still page in
  // WebKit may not paint one for a while).
  useLayoutEffect(() => {
    const article = root.current;
    const tip = card.current;
    if (!article || !tip) {
      return;
    }
    let anchor: HTMLElement | null = null;
    let shown: string | null = null;
    let hide = 0;
    // The card's ring lights while the person it shows is speaking.
    const light = () => {
      box.current?.toggleAttribute(
        'data-speaking',
        shown !== null && speakingNow.value === shown
      );
    };
    const stopLight = effect(light);
    const close = () => tip.matches(':popover-open') && tip.hidePopover();
    const later = () => {
      clearTimeout(hide);
      hide = window.setTimeout(close, 150);
    };

    const show = (head: Element | null) => {
      const label = head?.querySelector('strong');
      const key = head?.getAttribute('data-speaker') ?? '';
      const person = speakers[key];
      if (!label || !person) {
        later();
        return;
      }
      clearTimeout(hide);
      if (head === anchor && tip.matches(':popover-open')) {
        return;
      }
      const move = () => {
        anchor?.style.removeProperty('anchor-name');
        anchor = head as HTMLElement;
        anchor.style.setProperty('anchor-name', '--ep-who');
        photo.current!.src = person.src;
        name.current!.textContent = person.name;
        fact.current!.textContent = person.fact;
        shown = key;
        light();
        if (person.voice === undefined) {
          box.current!.removeAttribute('data-voice');
        } else {
          box.current!.dataset.voice = String(person.voice);
        }
      };
      if (tip.matches(':popover-open')) {
        flip([box.current], move);
      } else {
        move();
        tip.showPopover();
      }
    };

    // A pointer opens it from the name only, and a pointer on a timestamp
    // puts it away at once; focus opens it from the timestamp.
    const point = (event: Event) => {
      const target = event.target as Element;
      if (target.closest('[data-seek]')) {
        clearTimeout(hide);
        close();
        return;
      }
      show(
        target.closest('.ep-turn-head strong')?.closest('.ep-turn-head') ?? null
      );
    };
    const focus = (event: Event) =>
      show((event.target as Element).closest('.ep-turn-head'));
    article.addEventListener('pointerover', point);
    article.addEventListener('focusin', focus);
    article.addEventListener('pointerleave', later);
    article.addEventListener('focusout', later);
    addEventListener('scroll', close, { passive: true });
    return () => {
      stopLight();
      removeEventListener('scroll', close);
      article.removeEventListener('pointerover', point);
      article.removeEventListener('focusin', focus);
      article.removeEventListener('pointerleave', later);
      article.removeEventListener('focusout', later);
    };
  }, [root, speakers]);

  return (
    <div aria-hidden="true" class="ep-who" popover="manual" ref={card}>
      <div class="ep-who-box PropFLIP" ref={box}>
        <span class="person-face" style="--person-size: 48px">
          <img alt="" height="48" ref={photo} width="48" />
        </span>
        <span class="ep-who-text">
          <strong ref={name} />
          <span class="person-fact" ref={fact} />
        </span>
        <i class="ep-who-caret" />
      </div>
    </div>
  );
}
