import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isConfigured, cvState } from '../js/contact.js';

test('the placeholder endpoint counts as unconfigured', () => {
  assert.equal(isConfigured('PLACEHOLDER_PAPU'), false);
  assert.equal(isConfigured(''), false);
  assert.equal(isConfigured('formspree.io/f/abc'), false);
  assert.equal(isConfigured('https://formspree.io/f/abc'), true);
});

test('an absent CV yields no link and an honest note', () => {
  const state = cvState({ cvAvailable: false, cvPath: 'assets/cv/cv.pdf' });
  assert.equal(state.available, false);
  assert.equal(state.href, null);
  assert.ok(state.note && state.note.length > 0);
  assert.ok(!state.note.includes('PLACEHOLDER_PAPU'));
});

test('a present CV yields the path', () => {
  const state = cvState({ cvAvailable: true, cvPath: 'assets/cv/cv.pdf' });
  assert.equal(state.href, 'assets/cv/cv.pdf');
  assert.equal(state.available, true);
});
