/**
 * Move focus to the start of a section without scrolling (the page is
 * already on its way there): its heading, made focusable for the purpose,
 * else the section itself. The next Tab then goes on from inside it.
 * `visible: false` keeps the focus ring off it (focus that followed a
 * pointer, which WebKit would otherwise ring); left out, the browser decides.
 */
export function focusInto(
  section: Element | null | undefined,
  { visible }: { visible?: boolean } = {}
) {
  const target =
    section?.querySelector<HTMLElement>('h1, h2, h3') ??
    (section as HTMLElement | null | undefined);
  if (!target) {
    return;
  }
  if (!target.hasAttribute('tabindex')) {
    target.tabIndex = -1;
  }
  // focusVisible is newer than TypeScript's DOM types.
  const options: FocusOptions & { focusVisible?: boolean } = {
    focusVisible: visible,
    preventScroll: true
  };
  target.focus(options);
}
