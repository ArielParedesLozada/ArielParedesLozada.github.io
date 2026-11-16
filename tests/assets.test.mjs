import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { skills } from '../src/content/data.js';

test('every skill icon path points at a file that exists', async () => {
  for (const group of skills) {
    for (const item of group.items) {
      if (!item.icon) continue;
      await access(new URL(`../${item.icon}`, import.meta.url));
    }
  }
});

test('the shared preview placeholder exists', async () => {
  await access(new URL('../images/placeholder.svg', import.meta.url));
});

test('every technology in every group has an icon', () => {
  for (const group of skills) {
    for (const item of group.items) {
      assert.ok(item.icon, `${item.name} has no icon`);
    }
  }
});
