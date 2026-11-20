import '@testing-library/jest-dom';

// Anchored Auto Layout's attributes (data-⚓️-*) are valid HTML, and browsers
// set them from script, but jsdom still checks setAttribute() names against
// the older XML Name rule, which the anchor emoji fails. Let the parser make
// the attribute instead, as a page's own markup would.
const setAttribute = Element.prototype.setAttribute;
Element.prototype.setAttribute = function (name: string, value: string) {
  try {
    setAttribute.call(this, name, value);
  } catch (error) {
    if (!(error instanceof DOMException) || error.name !== 'InvalidCharacterError') {
      throw error;
    }
    const template = document.createElement('template');
    template.innerHTML = `<i ${name}=""></i>`;
    const attr = template.content.firstElementChild!.attributes[0]!.cloneNode() as Attr;
    attr.value = String(value);
    this.setAttributeNode(attr);
  }
};
