import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolve, COMMANDS } from '../js/terminal.js';

test('help lists every command', () => {
  const { lines } = resolve('help');
  for (const name of Object.keys(COMMANDS)) {
    assert.ok(lines.some((l) => l.includes(name)), `help omits ${name}`);
  }
});

test('empty and whitespace-only input produce no output and no error', () => {
  assert.deepEqual(resolve(''), { lines: [] });
  assert.deepEqual(resolve('   '), { lines: [] });
});

test('unknown commands report not found and suggest help', () => {
  const { lines } = resolve('sudo rm -rf /');
  assert.match(lines[0], /command not found: sudo/);
  assert.ok(lines.some((l) => /help/.test(l)));
});

test('very long input is handled without throwing', () => {
  assert.doesNotThrow(() => resolve('x'.repeat(100000)));
});

test('ls projects scrolls to the projects section and lists project names', () => {
  const out = resolve('ls projects');
  assert.equal(out.scrollTo, 'projects');
  assert.ok(out.lines.length > 0);
});

test('cat cv reports honestly while the PDF is absent', () => {
  const { lines } = resolve('cat cv');
  assert.ok(lines.join(' ').length > 0);
  assert.ok(!lines.join(' ').includes('PLACEHOLDER_PAPU'), 'sentinel must not leak into terminal output');
});

test('clear signals a clear rather than printing', () => {
  assert.equal(resolve('clear').clear, true);
});

test('whoami prints the real name', () => {
  assert.ok(resolve('whoami').lines.join(' ').includes('Ariel Paredes Lozada'));
});
