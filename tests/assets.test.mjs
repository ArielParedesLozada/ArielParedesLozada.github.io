import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { skills } from '../js/content.js';

test('every declared skill icon exists on disk', async () => {
  for (const group of skills) {
    for (const item of group.items) {
      if (!item.icon) continue;
      await assert.doesNotReject(access(item.icon), `missing icon file: ${item.icon}`);
    }
  }
});
