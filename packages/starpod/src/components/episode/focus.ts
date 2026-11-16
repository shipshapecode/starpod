/**
 * Move focus to the start of a section without scrolling (the page is
 * already on its way there): its heading, made focusable for the purpose,
 * else the section itself. The next Tab then goes on from inside it.
 */
export function focusInto(section: Element | null | undefined) {
  const target =
    section?.querySelector<HTMLElement>('h1, h2, h3') ??
    (section as HTMLElement | null | undefined);
  if (!target) {
    return;
  }
  if (!target.hasAttribute('tabindex')) {
    target.tabIndex = -1;
  }
  target.focus({ preventScroll: true });
}
