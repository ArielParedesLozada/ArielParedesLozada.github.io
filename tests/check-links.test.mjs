import { test } from 'node:test';
import assert from 'node:assert/strict';
import { collectReferences, classify, checkLocal, severityFor, collectHtmlFiles } from '../tools/check-links.mjs';

const repoRoot = new URL('..', import.meta.url).pathname;

test('collectHtmlFiles finds pages one directory down', async () => {
  const files = await collectHtmlFiles(repoRoot);
  assert.ok(files.includes('index.html'));
  assert.ok(files.includes('about/index.html'));
  assert.ok(!files.some((f) => f.startsWith('docs/')));
});

test('a root-relative link is resolved against the repo root, not the filesystem', async () => {
  // 404.html addresses everything from the domain root. Handing "/css/..." to
  // path.resolve discards the base and looks for it at the filesystem root.
  const hit = await checkLocal('/css/tokens.css', repoRoot, '404.html');
  assert.equal(hit.ok, true);
  const miss = await checkLocal('/css/nope.css', repoRoot, '404.html');
  assert.equal(miss.ok, false);
});

test('a local link is resolved against the page that contains it', async () => {
  // about/index.html links up and over to ../skills/ — resolving that against
  // the repo root instead of the page's own directory escapes the repo.
  const hit = await checkLocal('../skills/', repoRoot, 'about/index.html');
  assert.equal(hit.ok, true);
  const miss = await checkLocal('../nope/', repoRoot, 'about/index.html');
  assert.equal(miss.ok, false);
});

test('collectReferences finds href and src in order', () => {
  const html = '<a href="#home">h</a><img src="images/a.png"><link href="css/t.css">';
  assert.deepEqual(collectReferences(html), [
    { kind: 'href', value: '#home' },
    { kind: 'src', value: 'images/a.png' },
    { kind: 'href', value: 'css/t.css' },
  ]);
});

test('classify separates the four kinds', () => {
  assert.equal(classify('#about'), 'anchor');
  assert.equal(classify('mailto:a@b.com'), 'mailto');
  assert.equal(classify('https://example.com/x'), 'external');
  assert.equal(classify('images/a.png'), 'local');
});

test('checkLocal ignores query and hash', async () => {
  const hit = await checkLocal('tools/check-links.mjs?v=2#top', process.cwd());
  assert.equal(hit.ok, true);
  const miss = await checkLocal('images/does-not-exist.png', process.cwd());
  assert.equal(miss.ok, false);
});

test('severityFor downgrades bot-blocking statuses to warn', () => {
  assert.equal(severityFor(200), 'ok');
  assert.equal(severityFor(403), 'warn');
  assert.equal(severityFor(405), 'warn');
  assert.equal(severityFor(429), 'warn');
  // LinkedIn answers automated requests with a non-standard 999. The link is
  // good; only the robot is unwelcome.
  assert.equal(severityFor(999), 'warn');
  assert.equal(severityFor(404), 'error');
  assert.equal(severityFor(500), 'error');
});
