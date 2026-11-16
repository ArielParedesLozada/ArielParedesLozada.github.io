import { test } from 'node:test';
import assert from 'node:assert/strict';
import { render as renderExperience } from '../src/sections/experience.js';
import { render as renderContact } from '../src/sections/contact.js';
import { companies, projects, events, PLACEHOLDER } from '../src/content/data.js';
import { t } from '../src/content/i18n.js';
import { escapeHtml } from '../src/sections/helpers.js';

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const rendered = (s) => new RegExp(escapeRe(escapeHtml(s)));

test('both companies appear with their periods', () => {
  const html = renderExperience('en');
  for (const c of companies) {
    assert.match(html, rendered(c.org));
    assert.match(html, rendered(c.period));
  }
});

test('every project appears with stack, role and links', () => {
  const html = renderExperience('en');
  for (const p of projects) {
    assert.match(html, rendered(t(p.descriptionKey)));
    for (const tech of p.stack) {
      if (tech === PLACEHOLDER) continue;
      assert.match(html, rendered(tech));
    }
    for (const link of p.links) {
      if (link.url === PLACEHOLDER) continue;
      assert.match(html, rendered(link.url));
    }
  }
});

// Every role and stack is known now, in both languages.
test('nothing on the experience page is still pending', () => {
  for (const lang of ['en', 'es']) {
    const html = renderExperience(lang);
    assert.doesNotMatch(html, /PLACEHOLDER_PAPU/);
    assert.doesNotMatch(html, /class="placeholder"/, `${lang} still has a pending chip`);
  }
  assert.equal(projects.filter((p) => p.stack.includes(PLACEHOLDER)).length, 0);
});

test('both internship roles are stated', () => {
  const html = renderExperience('en');
  for (const c of companies) assert.match(html, rendered(t(c.roleKey)));
});

// Ariel asked for the repository screenshots to go: the cards are read for
// their prose, and an empty frame on every one of them said nothing.
test('project cards carry no screenshot at all', () => {
  const html = renderExperience('en');
  for (const card of html.matchAll(/<article class="card project-card">[\s\S]*?<\/article>/g)) {
    assert.doesNotMatch(card[0], /<img/, 'a project card still renders an image');
  }
  assert.doesNotMatch(html, /images\/projects\//);
});

test('events live at the experience anchor the command targets', () => {
  assert.match(renderExperience('en'), /id="events"/);
});

test('every event appears with its date, description and a logo', () => {
  const html = renderExperience('en');
  assert.ok(events.length >= 3, 'fixture no longer covers the event list');
  for (const e of events) {
    assert.match(html, rendered(e.name));
    assert.match(html, rendered(e.date));
    assert.match(html, rendered(t(e.descriptionKey)));
  }
  const logos = [...html.matchAll(/<img[^>]+class="event-logo"/g)];
  assert.equal(logos.length, events.length, 'not every event has a logo slot');
});

test('all event logos are real images, not placeholders', () => {
  for (const e of events) {
    assert.ok(e.logo, `${e.id} still has no logo`);
  }
});

test('contact lists both emails and LinkedIn as working links', () => {
  const html = renderContact('en');
  assert.match(html, /mailto:johanatreidesi66@gmail\.com/);
  assert.match(html, /mailto:aparedes3001@uta\.edu\.ec/);
  assert.match(html, /https:\/\/www\.linkedin\.com\/in\/ariel-paredes-lozada-377685409/);
});

test('no contact form survives the redesign', () => {
  const html = renderContact('en');
  assert.doesNotMatch(html, /<form/);
  assert.doesNotMatch(html, /formspree/i);
});

test('external links carry rel="noopener"', () => {
  const html = renderExperience('en') + renderContact('en');
  for (const m of html.matchAll(/<a[^>]+href="https?:[^"]*"[^>]*>/g)) {
    assert.match(m[0], /rel="[^"]*noopener/, `${m[0]} lacks noopener`);
  }
});
