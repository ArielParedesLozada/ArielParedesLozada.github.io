import { test } from 'node:test';
import assert from 'node:assert/strict';
import { render as renderBoot } from '../src/sections/boot.js';
import { render as renderAbout } from '../src/sections/about.js';
import { skills, hobbies } from '../src/content/data.js';
import { t } from '../src/content/i18n.js';

test('the boot screen shows name, objective and technologies, and hints at start', () => {
  const html = renderBoot('en');
  assert.match(html, /Ariel Paredes Lozada/);
  assert.match(html, /start/);
  for (const group of skills) assert.match(html, new RegExp(group.id));
});

test('the boot screen shows a pending chip for the objective, never the sentinel', () => {
  const html = renderBoot('en');
  assert.match(html, /class="placeholder"/);
  assert.doesNotMatch(html, /PLACEHOLDER_PAPU/);
});

test('about carries the portrait with real alt text and explicit dimensions', () => {
  const html = renderAbout('en');
  assert.match(html, /images\/my_img\.jpg/);
  assert.match(html, /alt="[^"]+"/);
  assert.match(html, /width="\d+"/);
});

test('about carries the cv anchor and the hobbies anchor', () => {
  const html = renderAbout('en');
  assert.match(html, /id="cv"/);
  assert.match(html, /id="hobbies"/);
});

test('with no CV published the download is disabled and says so', () => {
  const html = renderAbout('en');
  assert.match(html, /aria-disabled="true"/);
  assert.doesNotMatch(html, /href="[^"]*cv-ariel-paredes-lozada\.pdf"/);
});

test('every hobby is listed', () => {
  const html = renderAbout('en');
  for (const id of hobbies) assert.match(html, new RegExp(t(`hobby.${id}`)));
});

test('translatable text is tagged for the runtime swap', () => {
  assert.match(renderAbout('en'), /data-i18n="/);
});
