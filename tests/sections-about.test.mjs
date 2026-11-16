import { test } from 'node:test';
import assert from 'node:assert/strict';
import { render as renderBoot } from '../src/sections/boot.js';
import { render as renderAbout } from '../src/sections/about.js';
import { access } from 'node:fs/promises';
import { profile, skills } from '../src/content/data.js';
import { t } from '../src/content/i18n.js';
import { escapeHtml, placeholderChip } from '../src/sections/helpers.js';
import { resolve } from '../js/terminal.js';

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test('the boot screen shows name, objective and technologies, and hints at start', () => {
  const html = renderBoot('en');
  assert.match(html, /Ariel Paredes Lozada/);
  assert.match(html, /start/);
  for (const group of skills) assert.match(html, new RegExp(group.id));
});

// Ariel's objective and summary are written now, so the boot screen and
// /about/ carry real prose. The sentinel must never reach a page either way.
test('the boot screen states the objective, not a pending chip', () => {
  const html = renderBoot('en');
  assert.match(html, new RegExp(escapeRe(escapeHtml(t('section.about.objective')))));
  assert.doesNotMatch(html, /class="placeholder"/);
  assert.doesNotMatch(html, /PLACEHOLDER_PAPU/);
});

test('about states who Ariel is, in both languages', () => {
  for (const lang of ['en', 'es']) {
    const html = renderAbout(lang);
    for (const key of ['section.about.summary', 'section.about.objective']) {
      assert.match(html, new RegExp(escapeRe(escapeHtml(t(key, lang)))), `${key} missing in ${lang}`);
    }
    assert.doesNotMatch(html, /PLACEHOLDER_PAPU/);
    assert.doesNotMatch(html, /class="placeholder"/);
  }
});

// The honest-absence machinery still has to work for whatever goes unknown
// next, even with nothing unknown today.
test('the pending chip still renders a translated, sentinel-free chip', () => {
  const chip = placeholderChip('ui.stack', 'es');
  assert.match(chip, /class="placeholder"/);
  assert.match(chip, /data-i18n="ui.stack"/);
  assert.match(chip, /data-i18n="ui.pending"/);
  assert.doesNotMatch(chip, /PLACEHOLDER_PAPU/);
});

// A rebuild silently overwrote this logo once. These lines pin it: the
// backslashes are load-bearing, and one lost escape wrecks the drawing.
test('the boot screen keeps the logo Ariel drew', () => {
  const art = renderBoot('en').match(/<pre class="fetch-art"[^>]*>([\s\S]*?)<\/pre>/)[1];
  assert.match(art, /\+o\\ {2}\\ {2}\\ {2}\/ \\/);
  assert.match(art, /&lt;oooooooooo\\/);
  assert.match(art, /\\o\/ {2}\\s\+\\ {2}\\_\//);
  assert.equal(art.split('\n').length, 14);
});

test('about carries the portrait with real alt text and explicit dimensions', () => {
  const html = renderAbout('en');
  assert.match(html, /images\/my_img\.jpg/);
  assert.match(html, /alt="[^"]+"/);
  assert.match(html, /width="\d+"/);
});

test('about carries the cv anchor', () => {
  assert.match(renderAbout('en'), /id="cv"/);
});

// Ariel cut the hobbies section: no heading, no chips, no anchor to land on.
test('nothing about hobbies survives', () => {
  for (const lang of ['en', 'es']) {
    const html = renderAbout(lang);
    assert.doesNotMatch(html, /hobb/i, `${lang} still mentions hobbies`);
  }
  assert.equal(resolve('about hobbies', { page: 'about', entered: true }).navigate, undefined);
});

// The CV is published now, so the disabled-button path is no longer the one
// a visitor sees. What matters is that the href points at a file that is
// actually committed, and that the saved file carries Ariel's name.
test('the CV download points at a file that exists and names itself', async () => {
  const html = renderAbout('en', '../');
  assert.ok(profile.cvAvailable, 'fixture says the CV is unpublished');
  assert.doesNotMatch(html, /aria-disabled="true"/);
  assert.match(html, new RegExp(`href="\\.\\./${profile.cvPath}"`));
  assert.match(html, /download="[^"]*ariel-paredes-lozada[^"]*\.pdf"/);
  await access(new URL(`../${profile.cvPath}`, import.meta.url));
});

test('translatable text is tagged for the runtime swap', () => {
  assert.match(renderAbout('en'), /data-i18n="/);
});
