import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scrollProgress, activeSection } from '../js/ui.js';

test('scrollProgress is clamped and safe on a non-scrolling page', () => {
  assert.equal(scrollProgress(0, 1000, 1000), 0);
  assert.equal(scrollProgress(0, 2000, 1000), 0);
  assert.equal(scrollProgress(1000, 2000, 1000), 100);
  assert.equal(scrollProgress(5000, 2000, 1000), 100);
  assert.equal(scrollProgress(-50, 2000, 1000), 0);
});

test('activeSection picks the current section', () => {
  const pos = [{ id: 'home', top: 0 }, { id: 'about', top: 500 }, { id: 'contact', top: 1500 }];
  assert.equal(activeSection(pos, 0), 'home');
  assert.equal(activeSection(pos, 600), 'about');
  assert.equal(activeSection(pos, 9999), 'contact');
});
