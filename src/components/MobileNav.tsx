import { useEffect, useRef } from 'preact/hooks';

import { isMenuOpen, isSearchOpen } from './state';

type LinkItem = {
  label: string;
  href: string;
};

type Props = {
  showTitle: string;
  showImage: string;
  blurb: string;
  navLinks: Array<LinkItem>;
  platformLinks: Array<LinkItem>;
  hosts: Array<string>;
  cta: LinkItem;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

function SearchIcon() {
  return <span class="search-icon h-4 w-4" aria-hidden="true" />;
}

function MenuIcon() {
  return (
    <svg
      class="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      aria-hidden="true"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      class="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      aria-hidden="true"
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

export default function MobileNav({
  showTitle,
  showImage,
  blurb,
  navLinks,
  platformLinks,
  hosts,
  cta
}: Props) {
  const open = isMenuOpen.value;
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  // Manage the slide-over as an accessible dialog: focus trap, Escape to
  // close, body-scroll lock, and focus restoration to the trigger on close.
  useEffect(() => {
    if (!open) {
      return;
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;

    closeRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        isMenuOpen.value = false;
        return;
      }
      if (event.key !== 'Tab' || !panel) {
        return;
      }
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((el) => el.offsetParent !== null);
      if (focusables.length === 0) {
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [open]);

  return (
    <div class="lg:hidden">
      <header
        class="bg-light-player/90 dark:bg-dark-player/90 sticky top-0 z-40 flex items-center gap-3 border-b border-light-input-border/60 px-4 py-3 backdrop-blur-xs dark:border-dark-border/60"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <a href="/" class="flex min-w-0 flex-1 items-center gap-3" aria-label="Homepage">
          <img
            src={showImage}
            alt=""
            width={36}
            height={36}
            class="h-9 w-9 flex-none rounded-md"
          />
          <span class="text-light-text-heading truncate text-sm font-bold dark:text-white">
            {showTitle}
          </span>
        </a>

        <button
          type="button"
          class="text-light-text-heading flex h-11 w-11 items-center justify-center rounded-full dark:text-white"
          aria-label="Search episodes"
          onClick={() => (isSearchOpen.value = true)}
        >
          <SearchIcon />
        </button>

        <a class="btn flex-none" href={cta.href}>
          <span class="text-light-text-heading flex items-center rounded-full px-3 py-2 text-sm font-bold dark:text-white">
            {cta.label}
          </span>
        </a>

        <button
          type="button"
          class="text-light-text-heading flex h-11 w-11 items-center justify-center rounded-full dark:text-white"
          aria-label="Open menu"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => (isMenuOpen.value = true)}
        >
          <MenuIcon />
        </button>
      </header>

      {open && (
        <div class="fixed inset-0 z-50">
          <button
            type="button"
            class="menu-scrim absolute inset-0 bg-black/50"
            aria-label="Close menu"
            tabIndex={-1}
            onClick={() => (isMenuOpen.value = false)}
          />
          <div
            ref={panelRef}
            class="menu-panel bg-light-card dark:bg-dark-card absolute inset-y-0 right-0 flex w-[85%] max-w-sm flex-col overflow-y-auto p-6 shadow-lg"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))' }}
          >
            <div class="mb-6 flex items-center justify-between">
              <span class="section-heading">Menu</span>
              <button
                ref={closeRef}
                type="button"
                class="text-light-text-heading flex h-11 w-11 items-center justify-center rounded-full dark:text-white"
                aria-label="Close menu"
                onClick={() => (isMenuOpen.value = false)}
              >
                <CloseIcon />
              </button>
            </div>

            <img
              src={showImage}
              alt=""
              width={120}
              height={120}
              class="mb-4 h-28 w-28 rounded-xl"
            />
            <p class="text-light-text-heading text-lg font-bold dark:text-white">
              {showTitle}
            </p>
            <p class="mt-1 mb-6 text-sm">{blurb}</p>

            <a class="btn mb-8 self-start" href={cta.href}>
              <span class="text-light-text-heading flex items-center rounded-full px-5 py-2.5 text-sm font-bold dark:text-white">
                {cta.label}
              </span>
            </a>

            <h3 class="section-heading pb-3">Listen</h3>
            <ul class="mb-8 flex flex-col">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <a
                    class="text-light-text-heading block py-2 font-bold dark:text-white"
                    href={link.href}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <nav aria-label="Site">
              <ul class="mb-8 flex flex-col">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      class="text-light-text-heading block py-2 font-bold dark:text-white"
                      href={link.href}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {hosts.length > 0 && (
              <>
                <h3 class="section-heading pb-3">Hosted by</h3>
                <ul class="flex flex-col gap-1">
                  {hosts.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
