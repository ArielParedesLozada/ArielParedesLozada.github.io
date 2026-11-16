import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { renderTemplate, menuMarkup, PAGES } from '../tools/build-pages.mjs';

test('renderTemplate substitutes every token', () => {
  assert.equal(renderTemplate('<p>{{a}}/{{b}}</p>', { a: 'x', b: 'y' }), '<p>x/y</p>');
});

test('renderTemplate refuses to emit an unsubstituted token', () => {
  assert.throws(() => renderTemplate('<p>{{missing}}</p>', {}), /missing/);
});

test('the menu marks the active section and nothing else', () => {
  const html = menuMarkup('skills', '../');
  assert.match(html, /aria-current="page"/);
  assert.equal(html.match(/aria-current/g).length, 1);
});

test('menu links are real hrefs through the asset prefix', () => {
  assert.match(menuMarkup(null, '../'), /href="\.\.\/skills\/"/);
  assert.match(menuMarkup(null, ''), /href="skills\/"/);
});

test('PAGES covers the boot page and the five sections', () => {
  assert.deepEqual(
    PAGES.map((p) => p.id),
    ['boot', 'about', 'skills', 'education', 'experience', 'contact', 'notfound'],
  );
});

// Review Focus 1 and 2 — asserted against built output, no script executed.
test('every section page ships the menu and the command line in its HTML', async () => {
  for (const dir of ['about', 'skills', 'education', 'experience', 'contact']) {
    const html = await readFile(new URL(`../${dir}/index.html`, import.meta.url), 'utf8');
    assert.match(html, /class="site-menu"/, `${dir} has no menu`);
    assert.match(html, /id="terminal-input"/, `${dir} has no command line`);
    assert.match(html, /<html lang="en">/, `${dir} is not declared English`);
  }
});

test('the boot page ships the command line but no menu', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /id="terminal-input"/);
  assert.doesNotMatch(html, /class="site-menu"/);
});

// Final review finding: a visitor with JavaScript disabled landed on / with a
// dead command line, no menu, and a notice claiming the page works without JS.
test('the boot page offers navigation to a visitor without JavaScript', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const noscript = html.slice(html.indexOf('<noscript>'), html.indexOf('</noscript>'));
  for (const id of ['about', 'skills', 'education', 'experience', 'contact']) {
    assert.match(noscript, new RegExp(`href="${id}/"`), `no ${id} link for a no-JS visitor`);
  }
});

// Final review finding: GitHub Pages serves 404.html at the URL that was
// requested, so relative asset paths resolve against that missing directory.
test('404.html addresses its assets and links from the domain root', async () => {
  const html = await readFile(new URL('../404.html', import.meta.url), 'utf8');
  assert.match(html, /href="\/css\/tokens\.css"/);
  assert.match(html, /src="\/js\/main\.js"/);
  assert.match(html, /href="\/about\/"/);
  assert.doesNotMatch(html, /href="css\//);
});

test('generated pages contain no unsubstituted template token', async () => {
  for (const file of ['index.html', '404.html', 'about/index.html']) {
    const html = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
    assert.doesNotMatch(html, /\{\{/, `${file} has a leftover token`);
  }
});
