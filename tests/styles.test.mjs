// The look is the product here: Ariel asked for the whole site to read as a
// terminal, not just the command line. These read the stylesheets as text,
// which is the only check available without a browser.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const css = (name) => readFile(new URL(`../css/${name}`, import.meta.url), 'utf8');

test('the monospace face is the default for the whole page', async () => {
  const base = await css('base.css');
  const body = base.slice(base.indexOf('body {'), base.indexOf('}', base.indexOf('body {')));
  assert.match(body, /font-family:\s*var\(--font-mono\)/);
});

test('the type scale is larger than the browser default', async () => {
  const base = await css('base.css');
  const root = base.match(/html\s*\{[^}]*font-size:\s*([\d.]+)%/);
  assert.ok(root, 'html has no explicit font-size');
  assert.ok(Number(root[1]) > 100, `root font-size is ${root[1]}%`);
});

test('the command line is set in its own, larger size', async () => {
  const terminal = await css('terminal.css');
  assert.match(terminal, /--terminal-size/);
  assert.doesNotMatch(terminal, /font-size:\s*var\(--step--1\)/);
});
