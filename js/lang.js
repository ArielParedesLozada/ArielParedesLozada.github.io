import { DICT, LANGS } from '../src/content/i18n.js';

// Swaps the text of every [data-i18n] node in place. Returns how many nodes
// changed, so the caller can tell a real swap from a no-op.
export function applyLang(doc, lang) {
  if (!LANGS.includes(lang)) throw new Error(`unsupported language: ${lang}`);

  const dict = DICT[lang];
  let swapped = 0;

  for (const node of doc.querySelectorAll('[data-i18n]')) {
    const value = dict[node.dataset.i18n];
    if (value === undefined) continue;
    node.textContent = value;
    swapped++;
  }

  doc.documentElement.lang = lang;
  return swapped;
}
