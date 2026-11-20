const NAMED: Record<string, string> = {
  amp: '&',
  apos: "'",
  gt: '>',
  lrm: '\u200e',
  lt: '<',
  nbsp: ' ',
  quot: '"',
  rlm: '\u200f'
};

/**
 * Decode character references (`&amp;`, `&#38;`, `&#x26;`, and the few named
 * ones feeds and captions use) in one pass, so each reference in the original
 * text is decoded exactly once: `&amp;lt;` stays the literal `&lt;`.
 */
export function decodeEntities(value: string): string {
  return value.replace(
    /&(?:#(\d+)|#x([\da-f]+)|(amp|apos|gt|lrm|lt|nbsp|quot|rlm));/gi,
    (reference, decimal?: string, hex?: string, name?: string) => {
      if (name) {
        return NAMED[name.toLowerCase()];
      }
      const codePoint = decimal ? Number(decimal) : parseInt(hex!, 16);
      return codePoint > 0 && codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : reference;
    }
  );
}
