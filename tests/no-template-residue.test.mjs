import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const FORBIDDEN = [
  'chaudhari', 'adsbygoogle', 'pagead', 'typed.umd', 'aos@',
  'iconify', 'github-calendar', 'bootstrap-icons', 'colored-icons',
  'Gaur', 'Nitai', 'Om_Chaudhari_CV', 'wave-hello',
];

test('index.html carries no trace of the borrowed template', async () => {
  const html = (await readFile('index.html', 'utf8')).toLowerCase();
  for (const needle of FORBIDDEN) {
    assert.ok(!html.includes(needle.toLowerCase()), `found "${needle}" in index.html`);
  }
});

test('index.html declares English and the required sections', async () => {
  const html = await readFile('index.html', 'utf8');
  assert.match(html, /<html[^>]+lang="en"/);
  for (const id of ['home', 'objective', 'education', 'experience', 'projects', 'skills', 'events', 'contact']) {
    assert.ok(html.includes(`id="${id}"`), `missing section id="${id}"`);
  }
  assert.match(html, /<noscript>/);
});
