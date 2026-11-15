import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as content from '../js/content.js';

test('the placeholder sentinel is exactly PLACEHOLDER_PAPU', () => {
  assert.equal(content.PLACEHOLDER, 'PLACEHOLDER_PAPU');
});

test('no placeholder sentinel other than PLACEHOLDER_PAPU appears', async () => {
  const src = await readFile('js/content.js', 'utf8');
  const offenders = [...src.matchAll(/(['"])(TODO|TBD|FIXME|PLACEHOLDER)\1/g)].map((m) => m[0]);
  assert.deepEqual(offenders, [], `unexpected sentinels: ${offenders.join(', ')}`);
});

test('every required collection is present and non-empty', () => {
  for (const key of ['education', 'certifications', 'experience', 'projects', 'skills', 'events', 'hobbies']) {
    assert.ok(Array.isArray(content[key]), `${key} must be an array`);
    assert.ok(content[key].length > 0, `${key} must not be empty`);
  }
});

test('the confirmed facts from the spec are present verbatim', () => {
  const uta = content.education.find((e) => e.institution.includes('Universidad Técnica de Ambato'));
  assert.ok(uta, 'UTA entry missing');
  assert.equal(uta.period, '2022 — present');
  assert.ok(!content.education.some((e) => /Luis A. Martínez/.test(e.institution)), 'secondary school must be excluded');

  const orgs = content.experience.map((e) => e.org);
  assert.ok(orgs.includes('Galacorp') && orgs.includes('ASSA'), 'internships missing');
  assert.ok(orgs.some((o) => /Junta de Agua/.test(o)), 'JuntaAgua missing');

  const skillNames = content.skills.flatMap((g) => g.items.map((i) => i.name));
  for (const required of ['Linux', 'NixOS', 'Claude', 'Opencode', 'Python', 'Java', 'C', 'SQL']) {
    assert.ok(skillNames.includes(required), `skill ${required} missing`);
  }
});

test('experience types are limited to the four kinds', () => {
  const allowed = new Set(['company', 'professional', 'academic', 'personal']);
  for (const e of content.experience) assert.ok(allowed.has(e.type), `bad type ${e.type}`);
});
