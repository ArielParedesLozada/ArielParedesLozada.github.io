import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolve, COMMANDS } from '../js/terminal.js';

const boot = { page: 'boot', entered: false, lang: 'en' };
const inside = { page: 'about', entered: true, lang: 'en' };

test('start enters the site and navigates to about', () => {
  const r = resolve('start', boot);
  assert.equal(r.enter, true);
  assert.equal(r.navigate, '/about/');
});

test('before start, an ordinary command is not found and nudges toward start', () => {
  const r = resolve('skills', boot);
  assert.match(r.lines.join('\n'), /command not found: skills/);
  assert.match(r.lines.join('\n'), /start/);
  assert.equal(r.navigate, undefined);
});

test('lang works before start, so a Spanish reader is not locked out', () => {
  assert.equal(resolve('lang es', boot).setLang, 'es');
});

test('each section name navigates to its own page', () => {
  for (const id of ['about', 'skills', 'education', 'experience', 'contact']) {
    assert.equal(resolve(id, inside).navigate, `/${id}/`);
  }
});

test('a subsection navigates to its anchor', () => {
  assert.equal(resolve('education certs', inside).navigate, '/education/#certs');
  assert.equal(resolve('education uni', inside).navigate, '/education/#uni');
  assert.equal(resolve('about hobbies', inside).navigate, '/about/#hobbies');
  assert.equal(resolve('experience events', inside).navigate, '/experience/#events');
});

test('an unknown subsection reports usage without navigating', () => {
  const r = resolve('education nope', inside);
  assert.equal(r.navigate, undefined);
  assert.match(r.lines.join('\n'), /usage/i);
});

test('cv navigates to the about anchor rather than downloading', () => {
  assert.equal(resolve('cv', inside).navigate, '/about/#cv');
});

// Review Focus 3
test('lang rejects a garbage argument and never sets a bogus language', () => {
  for (const input of ['lang fr', 'lang', 'lang es en', 'lang ES!']) {
    const r = resolve(input, inside);
    assert.equal(r.setLang, undefined, `${input} set a language`);
    assert.match(r.lines.join('\n'), /usage: lang <en\|es>/);
  }
});

test('help lists every command once inside', () => {
  const text = resolve('help', inside).lines.join('\n');
  for (const name of Object.keys(COMMANDS)) assert.match(text, new RegExp(name));
});

test('empty and whitespace input produce no output and no navigation', () => {
  for (const input of ['', '   ', '\t']) {
    assert.deepEqual(resolve(input, inside), { lines: [] });
  }
});

test('clear clears and does not navigate', () => {
  const r = resolve('clear', inside);
  assert.equal(r.clear, true);
  assert.equal(r.navigate, undefined);
});

test('a 100k-character input is rejected without hanging', () => {
  const r = resolve('x'.repeat(100000), inside);
  assert.match(r.lines.join('\n'), /command not found/);
  assert.ok(
    r.lines.every((line) => line.length < 200),
    'the echoed command name was not truncated',
  );
});

test('command output follows the active language', () => {
  const r = resolve('nope', { ...inside, lang: 'es' });
  assert.notEqual(r.lines.join('\n'), resolve('nope', inside).lines.join('\n'));
});
