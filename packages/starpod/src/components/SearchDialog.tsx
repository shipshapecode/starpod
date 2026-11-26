import { Fragment, type TargetedEvent, type TargetedMouseEvent } from 'preact';
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'preact/hooks';
import { navigate } from 'astro:transitions/client';
import { flipFrom, layoutRect, nudge, reducedMotion } from '../motion/propflip';
import { isSearchOpen, islandAt, islandBack } from './state';
import { personFact } from '../lib/cast';
import type { Episode } from '../lib/rss';

/** A host or guest, as the explorer's With filter lists them. */
export interface PalettePerson {
  value: string;
  label: string;
  count: number;
  avatar?: string;
  host?: boolean;
  /** The show's first two hosts wear their voice's ring colour. */
  voice?: number;
}

type Item =
  | { kind: 'person'; key: string; person: PalettePerson }
  | { kind: 'episode'; key: string; episode: Episode };

/** A row's element id, stable across re-filters, for the input's
 * aria-activedescendant. */
const optionId = (item: Item) => `sp-option-${item.key}`;

/** The text with what the visitor typed left plain and the rest in bold:
 * the completion carries the weight, as in a search suggestion. */
function Completion({ text, query }: { text: string; query: string }) {
  const typed = query.trim();
  if (!typed) {
    return <>{text}</>;
  }
  const at = text.toLowerCase().indexOf(typed.toLowerCase());
  if (at < 0) {
    return <b class="font-bold">{text}</b>;
  }
  const end = at + typed.length;
  return (
    <>
      {at > 0 && <b class="font-bold">{text.slice(0, at)}</b>}
      {text.slice(at, end)}
      {end < text.length && <b class="font-bold">{text.slice(end)}</b>}
    </>
  );
}

/** The search trigger on screen (rail pill, rail icon or tab): where the palette grows from and returns to. */
function findTrigger() {
  const shown = [
    ...document.querySelectorAll<HTMLElement>('[data-search-trigger]')
  ].filter((el) => el.getBoundingClientRect().width > 0);
  return shown.find((el) => el === document.activeElement) ?? shown[0];
}

/**
 * The command palette. A modal <dialog> whose panel grows out of the search
 * trigger and flies back into it (PropFLIP: a start that was never in the
 * layout). Its contents are un-squished, so they are revealed rather than
 * scaled. Results glide to their new places as the list re-filters, and the
 * selection is an anchored highlight that slides from row to row.
 */
export default function SearchDialog({
  people = []
}: {
  people?: Array<PalettePerson>;
}) {
  const [query, setQuery] = useState('');
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  // Mounted from opening until the panel has flown back into its trigger.
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const rowsBefore = useRef(new Map<string, DOMRect>());
  const leaving = useRef(false);
  const open = isSearchOpen.value;

  // Load episodes as the island hydrates (not after a painted frame).
  useLayoutEffect(() => {
    fetch('/api/episodes/search.json')
      .then((res) => res.json())
      .then((data) => setEpisodes(data))
      .catch(console.error);
  }, []);

  // Before typing: the people most on the show. Typing: up to three people
  // whose names match, then up to eight episodes.
  const items = useMemo((): Array<Item> => {
    const asPerson = (person: PalettePerson): Item => ({
      kind: 'person',
      key: `p:${person.value}`,
      person
    });
    const asEpisode = (episode: Episode): Item => ({
      kind: 'episode',
      key: `e:${episode.id}`,
      episode
    });
    const lowerQuery = query.trim().toLowerCase();
    if (!lowerQuery) {
      return people.length
        ? people.slice(0, 6).map(asPerson)
        : episodes.slice(0, 8).map(asEpisode);
    }
    return [
      ...people
        .filter((person) => person.label.toLowerCase().includes(lowerQuery))
        .slice(0, 3)
        .map(asPerson),
      ...episodes
        .filter(
          (episode) =>
            episode.title.toLowerCase().includes(lowerQuery) ||
            episode.description.toLowerCase().includes(lowerQuery) ||
            (episode.episodeNumber?.toLowerCase().includes(lowerQuery) ?? false)
        )
        .slice(0, 8)
        .map(asEpisode)
    ];
  }, [query, episodes, people]);
  const hasPeople = items[0]?.kind === 'person';
  const firstEpisode = items.findIndex((item) => item.kind === 'episode');

  // Opening mounts the panel in the same commit (a layout effect): a passive
  // effect waits for a painted frame, and on an idle page in WebKit that
  // frame could be seconds away, so ⌘K seemed to do nothing.
  useLayoutEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setMounted(true);
    }
  }, [open]);

  // Grow out of the trigger, or fly back into it and close.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const box = boxRef.current;
    if (!dialog || !box) {
      return;
    }
    const trigger = findTrigger();
    if (open) {
      // Reopened mid-return: carry on from where the panel is.
      const first =
        dialog.dataset.state === 'closing'
          ? box.getBoundingClientRect()
          : trigger?.getBoundingClientRect();
      if (!dialog.open) {
        dialog.showModal();
      }
      if (first) {
        flipFrom(box, first);
      }
      dialog.dataset.state = 'open';
      inputRef.current?.focus();
      return;
    }
    dialog.dataset.state = 'closing';
    const done = () => {
      if (!isSearchOpen.value) {
        dialog.close();
        setMounted(false);
      }
    };
    if (!trigger || leaving.current || reducedMotion()) {
      leaving.current = false;
      done();
      return;
    }
    const last = layoutRect(box);
    const to = trigger.getBoundingClientRect();
    nudge(box, {
      tx: to.left - last.left,
      ty: to.top - last.top,
      sx: to.width / last.width,
      sy: to.height / last.height
    });
    Promise.all(
      box.getAnimations().map((animation) => animation.finished)
    ).then(
      done,
      () => {} // interrupted by reopening
    );
  }, [open, mounted]);

  // Rows that stay in the list glide from where they were; new ones fade in.
  useLayoutEffect(() => {
    const before = rowsBefore.current;
    rowsBefore.current = new Map();
    resultsRef.current
      ?.querySelectorAll<HTMLElement>('[data-id]')
      .forEach((row) => {
        const first = before.get(row.dataset.id!);
        if (first) {
          flipFrom(row, first);
        }
      });
  }, [items]);

  const onInput = (e: TargetedEvent<HTMLInputElement>) => {
    rowsBefore.current = new Map(
      [
        ...(resultsRef.current?.querySelectorAll<HTMLElement>('[data-id]') ??
          [])
      ].map((row) => [row.dataset.id!, row.getBoundingClientRect()])
    );
    setQuery(e.currentTarget.value);
    setSelectedIndex(0);
  };

  // Leaving for an episode, or for a person's episodes in the explorer:
  // close at once, the page is changing anyway.
  const hrefFor = (item: Item) =>
    item.kind === 'person'
      ? `/#guest=${encodeURIComponent(item.person.value)}`
      : `/${item.episode.episodeSlug}`;
  const choose = (item: Item) => {
    leaving.current = true;
    isSearchOpen.value = false;
    void navigate(hrefFor(item));
  };

  // Handle keyboard shortcuts. One document listener for the component's
  // life, always reading the latest results and selection.
  const handleKeyDown = useRef((_e: KeyboardEvent) => {});
  handleKeyDown.current = (e: KeyboardEvent) => {
    // Open search with cmd+k or ctrl+k
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      // The now-playing card is a modal that leaves the rest of the page
      // inert: the shortcut closes it first (the island's own way home,
      // loaded lazily so the palette doesn't carry the player), then opens
      // the palette on the next frame. The island lifts inert only once it
      // has landed, but a modal <dialog> escapes its ancestors' inert, so
      // the palette takes typing at once.
      if (!isSearchOpen.value && islandAt.value === 'card') {
        void import('./media/Island').then(({ go }) => {
          go(islandBack.value);
          requestAnimationFrame(() => (isSearchOpen.value = true));
        });
        return;
      }
      isSearchOpen.value = !isSearchOpen.value;
      return;
    }

    // Close on escape
    if (e.key === 'Escape' && isSearchOpen.value) {
      e.preventDefault();
      isSearchOpen.value = false;
      return;
    }

    // Moving through and choosing results belong to the field (the
    // combobox): Enter on Cancel cancels.
    if (
      isSearchOpen.value &&
      items.length > 0 &&
      e.target === inputRef.current
    ) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = items[selectedIndex];
        if (selected) {
          choose(selected);
        }
      }
    }
  };

  // Listen from the moment the island hydrates (a layout effect runs inside
  // hydration), not after a painted frame: passive effects waited ~0.7s
  // behind other islands here, and longer on an idle page in WebKit.
  useLayoutEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => handleKeyDown.current(e);
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // Scroll selected item into view
  useEffect(() => {
    resultsRef.current
      ?.querySelector(`[data-index="${selectedIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  // Clicking the scrim (the dialog around the panel) closes it.
  const handleBackdropClick = (e: TargetedMouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) {
      isSearchOpen.value = false;
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <dialog
      ref={dialogRef}
      class="sp-pal fixed inset-0 m-0 size-full max-h-none max-w-none border-0 bg-transparent px-4 pt-[max(10vh,env(safe-area-inset-top))] pb-0 text-text open:flex open:flex-col open:items-center"
      data-state="from"
      onClick={handleBackdropClick}
      onCancel={(e) => {
        e.preventDefault();
        isSearchOpen.value = false;
      }}
      aria-modal="true"
      aria-label="Search episodes"
    >
      <div ref={boxRef} class="sp-box PropFLIP fix-kids w-full max-w-xl overflow-clip bg-surface shadow-[var(--shadow-float)] outline-1 -outline-offset-1 outline-line [--r:20px]">
        <div class="sp-in">
          <i
            aria-hidden="true"
            class="sp-light pointer-events-none absolute inset-0 -z-1 bg-[radial-gradient(16rem_circle_at_calc(var(--live-local-pointer-x-ratio)*100%)_calc(var(--live-local-pointer-y-ratio)*100%),color-mix(in_oklch,var(--glow-a)_14%,transparent),transparent_70%)] opacity-(--live-local-pointer-inside) [transition:opacity_calc(0.3s*var(--slomo))_ease]"
            data-props-for="pointer-local"
          />
          {/* Search Input */}
          <div class="sp-field flex items-center border-b border-line px-3 transition-[border-color] duration-200 ease-(--ease-out) focus-within:border-accent">
            <span
              class="search-icon text-muted h-5 w-5 shrink-0"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="text"
              class="text-ink placeholder-muted min-w-0 flex-1 border-none bg-transparent px-3 py-4 outline-none! focus:ring-0"
              placeholder="Search episodes..."
              value={query}
              onInput={onInput}
              autocapitalize="off"
              autocomplete="off"
              autocorrect="off"
              enterkeyhint="search"
              spellcheck={false}
              role="combobox"
              aria-label="Search episodes"
              aria-autocomplete="list"
              aria-controls="search-results"
              aria-expanded={items.length > 0}
              aria-activedescendant={
                items[selectedIndex] && optionId(items[selectedIndex])
              }
            />
            <kbd class="sp-esc text-text bg-raised border-line hidden items-center gap-1 rounded border px-2 py-1 text-xs sm:inline-flex pointer-coarse:hidden">
              <span class="text-xs">ESC</span>
            </kbd>
            {/* On touch, where there is no Escape key to show. */}
            <button
              class="sp-cancel hidden pointer-coarse:-me-2 pointer-coarse:inline-flex pointer-coarse:min-h-11 pointer-coarse:flex-none pointer-coarse:cursor-pointer pointer-coarse:items-center pointer-coarse:rounded-(--r-thumb) pointer-coarse:border-0 pointer-coarse:bg-transparent pointer-coarse:px-2 pointer-coarse:text-[0.9375rem] pointer-coarse:font-semibold pointer-coarse:text-accent-ink"
              onClick={() => (isSearchOpen.value = false)}
              type="button"
            >
              Cancel
            </button>
          </div>

          {/* Results */}
          <div
            ref={resultsRef}
            id="search-results"
            class="sp-results relative h-[min(20rem,46dvh)] overflow-y-auto overscroll-contain p-2"
            role="listbox"
            aria-label="Results"
          >
            {items.length === 0 ? (
              <div class="text-text p-4 text-center">
                {query ? 'Nothing found' : 'Start typing to search episodes...'}
              </div>
            ) : (
              <>
                <i class="sp-hl" aria-hidden="true" />
                {items.map((item, index) => {
                  const selected = index === selectedIndex;
                  const caption =
                    index === 0 && hasPeople
                      ? 'People'
                      : index === firstEpisode && hasPeople
                        ? 'Episodes'
                        : null;
                  return (
                    <Fragment key={item.key}>
                      {caption && (
                        <p aria-hidden="true" class="sp-group mx-2 mt-1.5 mb-1 not-nth-2:mt-3 text-[0.75rem] font-semibold text-muted">
                          {caption}
                        </p>
                      )}
                      <a
                        href={hrefFor(item)}
                        id={optionId(item)}
                        data-id={item.key}
                        data-index={index}
                        class={
                          // Whole class strings: the Tailwind Prettier plugin
                          // trims the space a template would join them by.
                          item.kind === 'person'
                            ? 'sp-row PropFLIP sp-person relative z-1 box-border flex min-h-11 cursor-pointer items-center gap-3 p-2 py-1 text-inherit no-underline decoration-auto [--r:var(--r-tile)]'
                            : 'sp-row PropFLIP relative z-1 flex cursor-pointer items-center gap-3 p-2 text-inherit no-underline decoration-auto [--r:var(--r-tile)]'
                        }
                        role="option"
                        aria-selected={selected}
                        onClick={(e) => {
                          e.preventDefault();
                          choose(item);
                        }}
                        onPointerMove={() =>
                          !selected && setSelectedIndex(index)
                        }
                      >
                        {item.kind === 'person' ? (
                          <>
                            <span
                              class="person-face"
                              data-voice={item.person.voice}
                              style="--person-size: 32px"
                            >
                              <img
                                alt=""
                                height="32"
                                loading="lazy"
                                src={item.person.avatar}
                                width="32"
                              />
                            </span>
                            <span class="sp-text grid min-w-0 flex-1 gap-0.5">
                              <span class="sp-name min-w-0 truncate text-[0.875rem] leading-[1.125rem] font-medium text-ink">
                                <Completion
                                  query={query}
                                  text={item.person.label}
                                />
                              </span>
                              <span class="person-fact">
                                {personFact({
                                  host: Boolean(item.person.host),
                                  count: item.person.count
                                })}
                              </span>
                            </span>
                          </>
                        ) : (
                          <>
                            <img
                              alt=""
                              class="sp-thumb size-10 flex-none rounded-(--r-thumb) object-cover outline-1 -outline-offset-1 outline-(--hairline)"
                              height="40"
                              loading="lazy"
                              src={item.episode.episodeThumbnail}
                              width="40"
                            />
                            <span class="sp-text grid min-w-0 flex-1 gap-0.5">
                              <span class="sp-head flex min-w-0 items-baseline gap-2">
                                <span class="sp-num text-[0.75rem] font-medium text-muted">
                                  #{item.episode.episodeNumber}
                                </span>
                                <span class="sp-title truncate text-[0.875rem] font-medium text-ink max-sm:line-clamp-2 max-sm:whitespace-normal">
                                  <Completion
                                    query={query}
                                    text={item.episode.title}
                                  />
                                </span>
                              </span>
                              <span class="sp-desc truncate text-[0.75rem] text-text">
                                {item.episode.description}
                              </span>
                            </span>
                          </>
                        )}
                        {selected && (
                          <kbd class="text-text bg-surface border-line hidden items-center rounded border px-2 py-1 text-xs sm:inline-flex">
                            ↵
                          </kbd>
                        )}
                      </a>
                    </Fragment>
                  );
                })}
              </>
            )}
          </div>

          {/* Footer */}
          <div class="border-line text-text flex items-center justify-between border-t px-4 py-2 text-xs">
            <div class="flex items-center gap-4">
              <span class="hidden items-center gap-1 sm:inline-flex">
                <kbd class="bg-raised border-line rounded border px-1.5 py-0.5">
                  ↑
                </kbd>
                <kbd class="bg-raised border-line rounded border px-1.5 py-0.5">
                  ↓
                </kbd>
                <span>to navigate</span>
              </span>
              <span class="hidden items-center gap-1 sm:inline-flex">
                <kbd class="bg-raised border-line rounded border px-1.5 py-0.5">
                  ↵
                </kbd>
                <span>to select</span>
              </span>
            </div>
            {/* A count only once there is something asked. */}
            <span aria-live="polite">
              {query.trim() &&
                `${items.length} ${items.length === 1 ? 'result' : 'results'}`}
            </span>
          </div>
        </div>
      </div>
    </dialog>
  );
}
