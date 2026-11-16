import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readPref, writePref } from '../js/storage.js';
import { applyLang } from '../js/lang.js';
import { DICT } from '../src/content/i18n.js';

// Review Focus 5
test('readPref and writePref survive a localStorage that throws', () => {
  const original = globalThis.localStorage;
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() {
      throw new Error('access denied');
    },
  });
  try {
    assert.equal(readPref('portfolio.lang'), null);
    assert.equal(writePref('portfolio.lang', 'es'), false);
  } finally {
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: original });
  }
});

test('applyLang swaps every tagged node and reports the count', () => {
  const nodes = [{ dataset: { i18n: 'nav.about' }, textContent: 'About' }];
  const doc = { documentElement: { lang: 'en' }, querySelectorAll: () => nodes };
  assert.equal(applyLang(doc, 'es'), 1);
  assert.equal(nodes[0].textContent, DICT.es['nav.about']);
  assert.equal(doc.documentElement.lang, 'es');
});

test('applyLang leaves a node alone when its key is missing, never writing undefined', () => {
  const nodes = [{ dataset: { i18n: 'nope.nope' }, textContent: 'Keep me' }];
  const doc = { documentElement: { lang: 'en' }, querySelectorAll: () => nodes };
  assert.equal(applyLang(doc, 'es'), 0);
  assert.equal(nodes[0].textContent, 'Keep me');
});

test('applyLang refuses an unsupported language', () => {
  const doc = { documentElement: { lang: 'en' }, querySelectorAll: () => [] };
  assert.throws(() => applyLang(doc, 'fr'), /unsupported language/);
  assert.equal(doc.documentElement.lang, 'en', 'the document was mutated before the refusal');
});
