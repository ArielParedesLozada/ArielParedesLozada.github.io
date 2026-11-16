import { test } from 'node:test';
import assert from 'node:assert/strict';
import { render as renderSkills } from '../src/sections/skills.js';
import { render as renderEducation } from '../src/sections/education.js';
import { skills, certifications, education } from '../src/content/data.js';
import { t } from '../src/content/i18n.js';
import { escapeHtml } from '../src/sections/helpers.js';

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test('all four skill groups and every technology appear', () => {
  const html = renderSkills('en');
  for (const group of skills) {
    assert.match(html, new RegExp(escapeRe(t(`skills.${group.id}`))));
    for (const item of group.items) assert.match(html, new RegExp(escapeRe(item.name)));
  }
});

test('skill icons are local files only — no CDN in the critical path', () => {
  const html = renderSkills('en');
  for (const m of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
    assert.ok(!m[1].startsWith('http'), `${m[1]} is remote`);
  }
});

test('education has both anchors the commands target', () => {
  const html = renderEducation('en');
  assert.match(html, /id="uni"/);
  assert.match(html, /id="certs"/);
});

test('all six certifications are listed', () => {
  const html = renderEducation('en');
  for (const cert of certifications) {
    // The renderer escapes HTML, so "IoT Design & Monitoring" lands as &amp;.
    assert.match(html, new RegExp(escapeRe(escapeHtml(t(cert.titleKey)))));
  }
});

// All six documents are linked now: every card gets a real anchor, and no
// card gets a dead one.
test('every certification links to its document', () => {
  const html = renderEducation('en');
  for (const cert of certifications) {
    assert.match(html, new RegExp(escapeRe(`href="${cert.url}"`)), `${cert.id} has no link`);
  }
  assert.doesNotMatch(html, /href=""/);
  assert.doesNotMatch(html, /PLACEHOLDER_PAPU/);
  assert.doesNotMatch(html, /class="placeholder"/);
});

test('every certification names its issuer', () => {
  const html = renderEducation('en');
  for (const cert of certifications) {
    assert.match(html, new RegExp(escapeRe(escapeHtml(cert.issuer))), `${cert.id} has no issuer`);
  }
});

// Ariel will upload the scans; until then every certification shows the
// placeholder so the layout he reviews is the layout he will get.
test('every certification shows a preview image', () => {
  const html = renderEducation('en', '');
  const previews = [...html.matchAll(/<img[^>]+class="cert-preview"/g)];
  assert.equal(previews.length, certifications.length);
  assert.match(html, /images\/placeholder\.svg/);
});

test('certification previews honour the asset prefix', () => {
  assert.match(renderEducation('en', '../'), /src="\.\.\/images\//);
});

test('the current semester is stated', () => {
  const html = renderEducation('en');
  assert.match(html, new RegExp(escapeRe(escapeHtml(education[0].semester))));
});
