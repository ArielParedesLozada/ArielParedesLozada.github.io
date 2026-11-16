import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DICT, LANGS, t } from '../src/content/i18n.js';
import { PLACEHOLDER, projects, skills, certifications } from '../src/content/data.js';

test('every key exists in every language', () => {
  const en = Object.keys(DICT.en).sort();
  const es = Object.keys(DICT.es).sort();
  assert.deepEqual(es, en);
});

test('no translated value is empty or undefined', () => {
  for (const lang of LANGS) {
    for (const [key, value] of Object.entries(DICT[lang])) {
      assert.equal(typeof value, 'string', `${lang}.${key} is not a string`);
      assert.notEqual(value.trim(), '', `${lang}.${key} is empty`);
    }
  }
});

test('t defaults to English and reads the requested language', () => {
  assert.equal(t('nav.about'), DICT.en['nav.about']);
  assert.equal(t('nav.about', 'es'), DICT.es['nav.about']);
});

test('t throws on an unknown key', () => {
  assert.throws(() => t('nope.nope'), /missing i18n key: nope\.nope/);
});

test('the four projects carry stack, role and at least one link', () => {
  assert.equal(projects.length, 4);
  for (const p of projects) {
    assert.ok(p.stack.length > 0, `${p.id} has an empty stack`);
    assert.ok(p.links.length > 0, `${p.id} has no links`);
    assert.ok(p.roleKey, `${p.id} has no roleKey`);
  }
});

test('skills are the four groups the spec names', () => {
  assert.deepEqual(skills.map((g) => g.id), ['backend', 'frontend', 'databases', 'devops']);
});

test('all six certifications are present', () => {
  assert.equal(certifications.length, 6);
});

test('unknown values use the sentinel, never a bare guess', () => {
  assert.equal(PLACEHOLDER, 'PLACEHOLDER_PAPU');
});
