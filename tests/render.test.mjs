import { test } from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml, placeholderMarkup, fieldOrPlaceholder, renderProjects, renderExperience, renderSkills } from '../js/render.js';

test('escapeHtml neutralises markup', () => {
  assert.equal(escapeHtml('<img src=x onerror="a">'), '&lt;img src=x onerror=&quot;a&quot;&gt;');
});

test('a placeholder value renders the placeholder chip, not the raw sentinel', () => {
  const out = fieldOrPlaceholder('PLACEHOLDER_PAPU', 'Role');
  assert.match(out, /class="placeholder"/);
  assert.ok(!out.includes('PLACEHOLDER_PAPU'), 'the sentinel must not reach the page');
  assert.match(out, /Role/);
});

test('a real value renders escaped, with no chip', () => {
  const out = fieldOrPlaceholder('Backend developer', 'Role');
  assert.equal(out, 'Backend developer');
});

test('every project card has an image with non-empty alt and falls back to the placeholder image', () => {
  const html = renderProjects();
  const imgs = [...html.matchAll(/<img[^>]*>/g)].map((m) => m[0]);
  assert.ok(imgs.length > 0, 'no project images rendered');
  for (const img of imgs) {
    assert.match(img, /alt="[^"]+"/, `image without alt: ${img}`);
    assert.match(img, /loading="lazy"/);
    assert.match(img, /onerror="/, 'missing broken-image fallback');
  }
});

test('experience is grouped by the four types with visible labels', () => {
  const html = renderExperience();
  for (const label of ['Companies', 'Professional', 'Academic', 'Personal']) {
    assert.ok(html.includes(label), `missing group label ${label}`);
  }
});

test('skills render local icon paths only', () => {
  const html = renderSkills();
  assert.ok(!/src="https?:/.test(html), 'skill icons must be local');
});
