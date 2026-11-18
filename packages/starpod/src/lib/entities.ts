const NAMED: Record<string, string> = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  nbsp: ' ',
  quot: '"'
};

/**
 * Decode character references (`&amp;`, `&#38;`, `&#x26;`, and the few named
 * ones feeds and captions use) in one pass, so each reference in the original
 * text is decoded exactly once: `&amp;lt;` stays the literal `&lt;`.
 */
export function decodeEntities(value: string): string {
  return value.replace(
    /&(?:#(\d+)|#x([\da-f]+)|(amp|apos|gt|lt|nbsp|quot));/gi,
    (reference, decimal?: string, hex?: string, name?: string) => {
      if (name) {
        return NAMED[name.toLowerCase()];
      }
      const codePoint = decimal ? Number(decimal) : parseInt(hex!, 16);
      return codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : reference;
    }
  );
}
