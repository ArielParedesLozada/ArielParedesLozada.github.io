# Terminal-Navigated Multipage Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single scrolling page with six real pages, generated from one template, navigated by a persistent command line, switchable between English and Spanish in place.

**Architecture:** Language-neutral facts live in `src/content/data.js`; all prose and UI strings live in `src/content/i18n.js` as `{ en, es }` under flat keys. Seven section modules render HTML strings from those two sources. `tools/build-pages.mjs` runs each section through `src/templates/page.html` and writes the committed output files. At runtime the browser loads only the i18n dictionary and three small modules: the command interpreter, the language swapper, and the chrome wiring.

**Tech Stack:** Vanilla ES modules, Node ≥18 standard library only (no dependencies, no bundler), Node's built-in test runner, static files served by GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-11-15-portafolio-terminal-multipagina-design.md`

## Global Constraints

- Branch `octavo`. No merge or push without Ariel asking.
- Zero dependencies — runtime *and* build. The repository has no `package.json` and does not acquire one; the build is `node tools/build-pages.mjs`. Verified on Node v24.22.1: a `.mjs` test imports a `.js` ES module without one, via Node's module-syntax detection.
- Site copy English by default; proper nouns stay Spanish (*Universidad Técnica de Ambato*, *Junta de Agua de Santa Rosa*).
- Every unknown value is the literal string `PLACEHOLDER_PAPU`, referenced through the exported `PLACEHOLDER` constant, rendered as a visible "pending" chip. Never invent content.
- No code copied from `s4sahiko/tportfolio`; footer credit stays.
- No GitHub API calls from the page. No CDN. Dark theme only.
- The six generated HTML files plus `404.html` are build output: committed, never hand-edited.
- `node --test` (bare, auto-discovery — `node --test tests/` fails on Node 24) and `node tools/check-links.mjs` must both pass at the end of every task.
- The implementer does not start web servers.

## Review Focus

Five failure modes the spec implies that no feature step naturally exercises. Each has a test pinned to the task that owns the code.

1. **JavaScript absent or broken.** The served HTML must already contain the window chrome, the menu as real `<a href>` links, and the English prose — Task 2 asserts this against build output, with no script executed.
2. **Arrival by shared link at `/experience/`.** No `start` gate, menu visible — Task 2 asserts every section page ships the menu.
3. **`lang` with a garbage argument** (`lang fr`, bare `lang`, `lang es en`). Must print usage, never set a bogus language — Task 3.
4. **A key present in `en` and missing in `es`.** Must never render `undefined` into the page — Task 1 asserts key-set parity in both directions.
5. **`localStorage` throwing** (private mode, storage disabled). Reading or writing the language and entered-state preferences must not throw and kill the terminal — Task 7.

---

## File Structure

| File | Responsibility |
|---|---|
| `src/content/data.js` | Language-neutral facts: URLs, dates, tech lists, proper nouns, `PLACEHOLDER` |
| `src/content/i18n.js` | `DICT = { en, es }` flat-keyed prose and UI strings; `t(key, lang)` |
| `src/sections/helpers.js` | `escapeHtml`, `placeholderChip`, `fieldOr` |
| `src/sections/{boot,about,skills,education,experience,contact,notfound}.js` | One `render(lang)` each, returning an HTML string |
| `src/templates/page.html` | Window frame, top menu slot, command line, script tags |
| `tools/build-pages.mjs` | `renderTemplate`, `menuMarkup`, `PAGES`, CLI writing output |
| `tools/check-links.mjs` | Extended to walk subdirectories |
| `js/terminal.js` | `resolve(input, context)` pure interpreter + DOM wiring |
| `js/storage.js` | Preference read/write that never throws |
| `js/lang.js` | `applyLang(doc, lang)` — swaps `[data-i18n]` text |
| `js/chrome.js` | Menu and entered-state wiring |
| `js/main.js` | Wiring only |

Deleted in Task 2: `js/content.js`, `js/render.js`, `js/contact.js`, `js/ui.js` and their tests — they render a page structure that no longer exists.

This layout refines the illustrative `src/` tree in the spec: facts and prose split into `data.js` and `i18n.js` rather than `profile.js` and `sections.js`, and section rendering gets a module per page. The split is what lets one key live in exactly one place.

**Test conventions used throughout.** Every section module exports the same name, so tests alias on import: `import { render as renderAbout } from '../src/sections/about.js'`. Tests that build a regex from content data escape it first with a local helper — `const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')` — because stacks contain `.NET` and `C++`-style names where `.` and `+` are regex metacharacters.

---

### Task 1: Content model and translation core

**Files:**
- Create: `src/content/data.js`, `src/content/i18n.js`
- Test: `tests/i18n.test.mjs`

**Interfaces:**
- Consumes: nothing.
- Produces: `PLACEHOLDER` (string `'PLACEHOLDER_PAPU'`), `profile`, `education`, `certifications`, `companies`, `projects`, `skills`, `events`, `hobbies` from `data.js`; `LANGS` (`['en','es']`), `DICT`, `t(key: string, lang?: string) -> string` from `i18n.js`. `t` defaults `lang` to `'en'` and throws `Error('missing i18n key: ' + key)` for an unknown key — a build-time crash is the cheapest way to catch a typo'd key.

- [ ] **Step 1: Write the failing tests**

```javascript
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
```

- [ ] **Step 2: Run the tests and watch them fail**

Run: `node --test tests/i18n.test.mjs`
Expected: FAIL — cannot find module `../src/content/i18n.js`

- [ ] **Step 3: Write `src/content/data.js`**

Language-neutral facts only. Prose belongs in `i18n.js`; each record carries `*Key` fields naming its i18n keys.

- `profile`: `name` `'Ariel Paredes Lozada'`, `location` `'Ambato, Ecuador'`, `email` `'johanatreidesi66@gmail.com'`, `universityEmail` `'aparedes3001@uta.edu.ec'`, `linkedin` `'https://www.linkedin.com/in/ariel-paredes-lozada-377685409'`, `github` `'https://github.com/ArielParedesLozada'`, `photo` `'images/my_img.jpg'`, `cvPath` `'assets/cv/cv-ariel-paredes-lozada.pdf'`, `cvAvailable: false`.
- `education`: one entry — UTA, `period: '2022 — present'`, `semester: PLACEHOLDER`, one achievement (`'Academic excellence recognition, September 2023 – February 2024'`).
- `certifications`: six, in the spec's order — Network Support and Security; Internet of Things; VI Congreso Internacional CSEI 2024; Fundamentos de Python; Desarrollo Web con Python y Django; IoT Design & Monitoring for Energy Systems with ESP32. Carry over the three existing Drive URLs per the spec's mapping (Internet of Things, Fundamentos de Python, Desarrollo Web con Python y Django); the other three get `url: PLACEHOLDER`.
- `companies`: Galacorp (`'June 2025 — August 2025'`) and ASSA (`'June 2026 — August 2026'`, no repository).
An unknown list is `[PLACEHOLDER]`, never `[]`. The previous build's handover recorded this as a real defect: an empty array renders as nothing, so a card with an unknown stack looked like a project built with no technologies instead of one with information still pending. Procoineec's stack is one of these — `TODO.md` names the deliverable and its URL but no technologies.

- `projects`: four, with `id`, `stack`, `links`, `roleKey`, `descriptionKey`, `image: null` — Procoineec (`https://procoineec.com/`), Odoo-DAS (`https://github.com/ArielParedesLozada/Odoo-DAS`; Python, Odoo, Postgres, Docker), Junta de Agua de Santa Rosa (`https://github.com/junta-agua-uta/ja-facturacion-back` plus the live URL from the spec; NestJS, Prisma, MySQL, Docker, GitHub Actions), Asesor Conversacional CTT-FISEI (`https://github.com/ArielParedesLozada/mini-hackaton`; TypeScript, React, Supabase, Google Gemini).
- `skills`: four groups with ids `backend` (Spring Boot, .NET, Django, Laravel), `frontend` (React, Angular, Flutter), `databases` (Postgres, MySQL, Oracle), `devops` (Docker, GitHub Actions, Linux). Reuse `images/tech/*.svg` where a matching icon already exists; `icon: null` otherwise — Task 8 adds the missing ones.
- `events`: one hackathon entry, `date: PLACEHOLDER`, `resultKey`.
- `hobbies`: four ids — `swimming`, `reading`, `mathematics`, `exercise`.

- [ ] **Step 4: Write `src/content/i18n.js`**

`DICT` with flat dotted keys under `en` and `es`, covering: `nav.*` (the five section labels), `page.*.title` and `page.*.description` for all seven pages, `boot.*` (the hint, the command-not-found nudge), `cmd.*` (every command's one-line summary, usage and error strings), section headings, the hobby labels, every project `descriptionKey`/`roleKey`, and the CV-unavailable note.

English project descriptions are the spec's wording verbatim. Spanish is a faithful translation; tech names and proper nouns are not translated. Prose Ariel has not supplied — the professional objective, the "who he is" summary, the hackathon result — is the `PLACEHOLDER` sentinel in **both** languages.

- [ ] **Step 5: Run the tests and watch them pass**

Run: `node --test tests/i18n.test.mjs`
Expected: PASS (8 tests)

- [ ] **Step 6: Run the whole suite and the link checker**

Run: `node --test && node tools/check-links.mjs`
Expected: both pass — the old suite still passes, nothing is wired up yet.

- [ ] **Step 7: Commit**

```bash
git add src/content tests/i18n.test.mjs
git commit -m "feat: add language-neutral content model and i18n dictionary"
```

---

### Task 2: The generator, and the clean break from the single page

This task is the pivot: once it lands the site is generated, and the single-page runtime is gone. The seven section modules are created here as explicit stubs (`export function render(lang) { return ''; }`) so the build has something to call; Tasks 4–6 fill them.

**Files:**
- Create: `src/templates/page.html`, `src/sections/helpers.js`, `src/sections/{boot,about,skills,education,experience,contact,notfound}.js`, `tools/build-pages.mjs`
- Modify: `tools/check-links.mjs` (recursive walk), `js/main.js` (reduce to a stub Task 7 fills)
- Delete: `js/content.js`, `js/render.js`, `js/contact.js`, `js/ui.js`, `tests/content.test.mjs`, `tests/render.test.mjs`, `tests/contact.test.mjs`, `tests/ui.test.mjs`, `tests/no-template-residue.test.mjs`
- Generate (committed): `index.html`, `{about,skills,education,experience,contact}/index.html`, `404.html`, `.nojekyll`
- Test: `tests/build.test.mjs`, `tests/check-links.test.mjs` (extend)

**Interfaces:**
- Consumes: `t`, `LANGS` from Task 1.
- Produces: `renderTemplate(template: string, vars: object) -> string` (substitutes `{{key}}`, throws on any token left unsubstituted); `menuMarkup(activeId: string|null, assetPrefix: string) -> string`; `PAGES` — an array of `{ id, dir, render }` where `dir` is `''` for the boot page; `escapeHtml(value) -> string`, `placeholderChip(label) -> string`, `fieldOr(value, label) -> string` from `helpers.js`; `collectHtmlFiles(rootDir) -> Promise<string[]>` from `check-links.mjs`.

`{{assetPrefix}}` is `''` for `/` and `'../'` for every section directory. Every CSS, JS, image and menu href in the template goes through it — this is what makes relative links work one directory down.

- [ ] **Step 1: Write the failing tests**

```javascript
// tests/build.test.mjs
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
  assert.deepEqual(PAGES.map((p) => p.id),
    ['boot', 'about', 'skills', 'education', 'experience', 'contact', 'notfound']);
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

test('generated pages contain no unsubstituted template token', async () => {
  for (const file of ['index.html', '404.html', 'about/index.html']) {
    const html = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
    assert.doesNotMatch(html, /\{\{/, `${file} has a leftover token`);
  }
});
```

Extend `tests/check-links.test.mjs` with:

```javascript
test('collectHtmlFiles finds pages one directory down', async () => {
  const files = await collectHtmlFiles(new URL('..', import.meta.url).pathname);
  assert.ok(files.includes('index.html'));
  assert.ok(files.includes('about/index.html'));
  assert.ok(!files.some((f) => f.startsWith('docs/')));
});
```

- [ ] **Step 2: Run the tests and watch them fail**

Run: `node --test tests/build.test.mjs tests/check-links.test.mjs`
Expected: FAIL — cannot find module `../tools/build-pages.mjs`

- [ ] **Step 3: Write `src/templates/page.html`**

Tokens: `{{lang}}`, `{{title}}`, `{{description}}`, `{{assetPrefix}}`, `{{menu}}`, `{{body}}`, `{{bodyClass}}`. Contains: the head (meta, OG tags, the three existing favicons, the five stylesheets), the outer window frame with its chrome bar, the `{{menu}}` slot, `<main>{{body}}</main>`, the command line at the bottom (`#terminal-output`, `#terminal-input`, both inside `#terminal-root`), the footer crediting `s4sahiko/tportfolio`, and `<script type="module" src="{{assetPrefix}}js/main.js">`.

- [ ] **Step 4: Write `src/sections/helpers.js` and the seven stub section modules**

`helpers.js` carries the escaping rules the deleted `js/render.js` had: `escapeHtml` neutralises `& < > " '`; `placeholderChip(label)` returns `<span class="placeholder">LABEL: pending</span>` and must never print the sentinel itself; `fieldOr(value, label)` returns the chip when `value === PLACEHOLDER` and the escaped value otherwise.

Each section module is `export function render(lang) { return ''; }` — a stub, filled by Tasks 4–6.

- [ ] **Step 5: Write `tools/build-pages.mjs`**

`renderTemplate` and `menuMarkup` per the Interfaces block, `PAGES` wiring each id to its section module, and a CLI (guarded by the `import.meta.url === pathToFileURL(process.argv[1]).href` check the existing `check-links.mjs` uses) that renders every page in English and writes it to `<dir>/index.html` (or `index.html` / `404.html`), creating directories as needed.

- [ ] **Step 6: Extend `tools/check-links.mjs` with `collectHtmlFiles`**

Recursive walk from the repo root, skipping `.git`, `docs`, `node_modules`, `src`. Replace the hardcoded source list (`tools/check-links.mjs:51-53`) — the `js/content.js` it names is deleted in this task — with the walk's result plus `src/content/data.js`.

- [ ] **Step 7: Delete the superseded single-page runtime**

Remove the files listed under **Delete** above, and reduce `js/main.js` to a stub importing nothing. `index.html` is overwritten by the build.

- [ ] **Step 8: Run the build, then the whole suite and the link checker**

Run: `node tools/build-pages.mjs && node --test && node tools/check-links.mjs`
Expected: seven files written; all tests pass; link checker exits 0.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: generate pages from one template, retire the single-page runtime"
```

---

### Task 3: The command interpreter

Pure function, no DOM. This is where the site's navigation lives.

**Files:**
- Rewrite: `js/terminal.js` (the `resolve` half; `initTerminal` is Task 7)
- Test: `tests/terminal.test.mjs` (rewrite)

**Interfaces:**
- Consumes: `t` from Task 1.
- Produces: `COMMANDS` (object keyed by command name, each with a `summaryKey`), and
  `resolve(input: string, context: { page: string, entered: boolean, lang: string }) -> Result`
  where `Result` is `{ lines: string[], navigate?: string, clear?: true, setLang?: 'en'|'es', enter?: true }`.
  `navigate` is a site-root-relative path such as `'/skills/'` or `'/education/#certs'`; the DOM layer resolves it against the asset prefix.

**Decision this plan makes, which the spec left open:** before `start`, only `start` and `lang` are recognised; everything else — including `help` — answers command-not-found plus the nudge. `lang` is exempt because a Spanish-only visitor would otherwise be locked out by an English boot screen, which is a real barrier rather than theatre.

- [ ] **Step 1: Write the failing tests**

```javascript
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
});

test('command output follows the active language', () => {
  const r = resolve('nope', { ...inside, lang: 'es' });
  assert.notEqual(r.lines.join('\n'), resolve('nope', inside).lines.join('\n'));
});
```

- [ ] **Step 2: Run the tests and watch them fail**

Run: `node --test tests/terminal.test.mjs`
Expected: FAIL — the old `resolve` takes one argument and knows nothing of `navigate`

- [ ] **Step 3: Rewrite the `resolve` half of `js/terminal.js`**

Commands: the five section names (each accepting its subsection argument), `help`, `clear`, `lang`, `neofetch`, `cv`, `start`. Every user-facing string comes from `t(key, context.lang)` — no English literals in this file.

- [ ] **Step 4: Run the tests and watch them pass**

Run: `node --test tests/terminal.test.mjs`
Expected: PASS (13 tests)

- [ ] **Step 5: Run the whole suite and the link checker**

Run: `node --test && node tools/check-links.mjs`
Expected: both pass

- [ ] **Step 6: Commit**

```bash
git add js/terminal.js tests/terminal.test.mjs src/content/i18n.js
git commit -m "feat: make the command line navigate the site"
```

---

### Task 4: Boot screen and About

**Files:**
- Rewrite: `src/sections/boot.js`, `src/sections/about.js`, `src/sections/notfound.js`
- Modify: `css/terminal.css`, `css/components.css`
- Test: `tests/sections-about.test.mjs`

**Interfaces:**
- Consumes: `helpers.js`, `data.js`, `t`.
- Produces: nothing new; `render(lang)` now returns real markup.

- [ ] **Step 1: Write the failing tests**

```javascript
test('the boot screen shows name, objective and technologies, and hints at start', () => {
  const html = renderBoot('en');
  assert.match(html, /Ariel Paredes Lozada/);
  assert.match(html, /start/);
  for (const group of skills) assert.match(html, new RegExp(group.id));
});

test('the boot screen shows a pending chip for the objective, never the sentinel', () => {
  const html = renderBoot('en');
  assert.match(html, /class="placeholder"/);
  assert.doesNotMatch(html, /PLACEHOLDER_PAPU/);
});

test('about carries the portrait with real alt text and explicit dimensions', () => {
  const html = renderAbout('en');
  assert.match(html, /images\/my_img\.jpg/);
  assert.match(html, /alt="[^"]+"/);
  assert.match(html, /width="\d+"/);
});

test('about carries the cv anchor and the hobbies anchor', () => {
  const html = renderAbout('en');
  assert.match(html, /id="cv"/);
  assert.match(html, /id="hobbies"/);
});

test('with no CV published the download is disabled and says so', () => {
  const html = renderAbout('en');
  assert.match(html, /aria-disabled="true"/);
  assert.doesNotMatch(html, /href="[^"]*cv-ariel-paredes-lozada\.pdf"/);
});

test('every hobby is listed', () => {
  const html = renderAbout('en');
  for (const id of hobbies) assert.match(html, new RegExp(t(`hobby.${id}`)));
});

test('translatable text is tagged for the runtime swap', () => {
  assert.match(renderAbout('en'), /data-i18n="/);
});
```

- [ ] **Step 2: Run the tests and watch them fail**

Run: `node --test tests/sections-about.test.mjs`
Expected: FAIL — the stubs return `''`

- [ ] **Step 3: Implement the three `render(lang)` functions**

Boot: a fastfetch-style two-column block — ASCII art beside `name`, objective, location, and the four skill-group names. The art's exact glyphs are the implementer's call; NixOS-flavoured suits the aesthetic.

About: portrait, name, the "who he is" summary and the objective (both pending chips), a mini-summary of experience and education drawn from `companies` and `education`, the CV block at `#cv`, hobbies at `#hobbies`.

Not-found: the same frame, phrased as a failed path lookup, with menu links out.

Every element whose text is translatable carries `data-i18n="<key>"` so Task 7's swap can find it.

- [ ] **Step 4: Run the tests and watch them pass**

Run: `node --test tests/sections-about.test.mjs`
Expected: PASS (7 tests)

- [ ] **Step 5: Rebuild, run the whole suite and the link checker**

Run: `node tools/build-pages.mjs && node --test && node tools/check-links.mjs`
Expected: all pass

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: render the boot screen, about page and 404"
```

---

### Task 5: Skills and Education

**Files:**
- Rewrite: `src/sections/skills.js`, `src/sections/education.js`
- Modify: `css/components.css`
- Test: `tests/sections-skills-education.test.mjs`

**Interfaces:**
- Consumes: `helpers.js`, `data.js`, `t`.

- [ ] **Step 1: Write the failing tests**

```javascript
test('all four skill groups and every technology appear', () => {
  const html = renderSkills('en');
  for (const group of skills) {
    assert.match(html, new RegExp(t(`skills.${group.id}`)));
    for (const item of group.items) assert.match(html, new RegExp(escapeRe(item.name)));
  }
});

test('skill icons are local files only — no CDN in the critical path', () => {
  const html = renderSkills('en');
  for (const m of html.matchAll(/<img[^>]+src="([^"]+)"/g)) {
    assert.ok(!m[1].startsWith('http'), `${m[1]} is remote`);
  }
});

test('education has both anchors the commands target', () => {
  const html = renderEducation('en');
  assert.match(html, /id="uni"/);
  assert.match(html, /id="certs"/);
});

test('all six certifications are listed', () => {
  const html = renderEducation('en');
  for (const cert of certifications) assert.match(html, new RegExp(escapeRe(cert.title)));
});

test('a certification without a link shows a pending chip, not a dead anchor', () => {
  const html = renderEducation('en');
  assert.doesNotMatch(html, /href="PLACEHOLDER_PAPU"/);
  assert.doesNotMatch(html, /href=""/);
});

test('the unknown semester renders as a chip', () => {
  assert.match(renderEducation('en'), /class="placeholder"/);
});
```

- [ ] **Step 2: Run the tests and watch them fail**

Run: `node --test tests/sections-skills-education.test.mjs`
Expected: FAIL — stubs return `''`

- [ ] **Step 3: Implement both `render(lang)` functions**

Skills: one block per group, chips carrying the icon when `item.icon` is set. Education: the UTA entry and achievements at `#uni`; the six certifications at `#certs`, each link rendered only when its `url` is a real URL — a `PLACEHOLDER` url becomes a chip, because a dead anchor is the one thing `TODO.md` forbids outright.

- [ ] **Step 4: Run the tests and watch them pass**

Run: `node --test tests/sections-skills-education.test.mjs`
Expected: PASS (6 tests)

- [ ] **Step 5: Rebuild, run the whole suite and the link checker**

Run: `node tools/build-pages.mjs && node --test && node tools/check-links.mjs`
Expected: all pass

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: render the skills and education pages"
```

---

### Task 6: Experience and Contact

**Files:**
- Rewrite: `src/sections/experience.js`, `src/sections/contact.js`
- Create: `images/projects/placeholder.svg` is already present — reuse it
- Modify: `css/components.css`
- Test: `tests/sections-experience-contact.test.mjs`

**Interfaces:**
- Consumes: `helpers.js`, `data.js`, `t`.

- [ ] **Step 1: Write the failing tests**

```javascript
test('both companies appear with their periods', () => {
  const html = renderExperience('en');
  for (const c of companies) {
    assert.match(html, new RegExp(escapeRe(c.org)));
    assert.match(html, new RegExp(escapeRe(c.period)));
  }
});

test('all four projects appear with stack, role and links', () => {
  const html = renderExperience('en');
  for (const p of projects) {
    assert.match(html, new RegExp(escapeRe(t(p.descriptionKey))));
    for (const tech of p.stack) {
      if (tech === PLACEHOLDER) continue;
      assert.match(html, new RegExp(escapeRe(tech)));
    }
    for (const link of p.links) {
      if (link.url === PLACEHOLDER) continue;
      assert.match(html, new RegExp(escapeRe(link.url)));
    }
  }
});

test('an unknown stack renders a pending chip, never the sentinel', () => {
  const html = renderExperience('en');
  assert.doesNotMatch(html, /PLACEHOLDER_PAPU/);
  const unknown = projects.filter((p) => p.stack.includes(PLACEHOLDER));
  assert.ok(unknown.length > 0, 'fixture no longer covers this case');
  assert.match(html, /class="placeholder"/);
});

test('project images are lazy and fall back when the screenshot is missing', () => {
  const html = renderExperience('en');
  assert.match(html, /loading="lazy"/);
  assert.match(html, /images\/projects\/placeholder\.svg/);
});

test('events live at the experience anchor the command targets', () => {
  assert.match(renderExperience('en'), /id="events"/);
});

test('contact lists both emails and LinkedIn as working links', () => {
  const html = renderContact('en');
  assert.match(html, /mailto:johanatreidesi66@gmail\.com/);
  assert.match(html, /mailto:aparedes3001@uta\.edu\.ec/);
  assert.match(html, /https:\/\/www\.linkedin\.com\/in\/ariel-paredes-lozada-377685409/);
});

test('no contact form survives the redesign', () => {
  const html = renderContact('en');
  assert.doesNotMatch(html, /<form/);
  assert.doesNotMatch(html, /formspree/i);
});

test('external links carry rel="noopener"', () => {
  const html = renderExperience('en') + renderContact('en');
  for (const m of html.matchAll(/<a[^>]+href="https?:[^"]*"[^>]*>/g)) {
    assert.match(m[0], /rel="[^"]*noopener/, `${m[0]} lacks noopener`);
  }
});
```

- [ ] **Step 2: Run the tests and watch them fail**

Run: `node --test tests/sections-experience-contact.test.mjs`
Expected: FAIL — stubs return `''`

- [ ] **Step 3: Implement both `render(lang)` functions**

Experience: the two companies, then the four projects as cards (description, stack chips, role, links, screenshot or the existing `images/projects/placeholder.svg` fallback), then events at `#events`. Contact: the three direct links, no form.

- [ ] **Step 4: Run the tests and watch them pass**

Run: `node --test tests/sections-experience-contact.test.mjs`
Expected: PASS (8 tests)

- [ ] **Step 5: Rebuild, run the whole suite and the link checker**

Run: `node tools/build-pages.mjs && node --test && node tools/check-links.mjs`
Expected: all pass — the link checker now verifies every project and certification URL

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: render the experience and contact pages"
```

---

### Task 7: Runtime — language switching, entered state, command line wiring

**Files:**
- Create: `js/storage.js`, `js/lang.js`, `js/chrome.js`
- Modify: `js/main.js`, `js/terminal.js` (the `initTerminal` half)
- Test: `tests/runtime.test.mjs`

**Interfaces:**
- Consumes: `resolve` (Task 3), `DICT`/`LANGS` (Task 1).
- Produces: `readPref(key: string) -> string|null` and `writePref(key: string, value: string) -> boolean` from `storage.js`, neither ever throwing; `applyLang(doc: Document, lang: string) -> number` from `js/lang.js`, returning how many nodes it swapped; `initChrome(doc, state)` from `js/chrome.js`; `initTerminal(root, context)` from `js/terminal.js`.

Preference keys: `portfolio.lang` and `portfolio.entered`.

`applyLang` walks `[data-i18n]`, sets `textContent` from `DICT[lang][key]`, and sets `doc.documentElement.lang`. It is tested against a hand-built fake document — three objects with `querySelectorAll` and `textContent` — rather than a DOM library, because the project has no dependencies.

- [ ] **Step 1: Write the failing tests**

```javascript
// Review Focus 5
test('readPref and writePref survive a localStorage that throws', () => {
  const original = globalThis.localStorage;
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() { throw new Error('access denied'); },
  });
  try {
    assert.equal(readPref('portfolio.lang'), null);
    assert.equal(writePref('portfolio.lang', 'es'), false);
  } finally {
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: original });
  }
});

test('applyLang swaps every tagged node and reports the count', () => {
  const nodes = [{ dataset: { i18n: 'nav.about' }, textContent: 'About' }];
  const doc = { documentElement: { lang: 'en' }, querySelectorAll: () => nodes };
  assert.equal(applyLang(doc, 'es'), 1);
  assert.equal(nodes[0].textContent, DICT.es['nav.about']);
  assert.equal(doc.documentElement.lang, 'es');
});

test('applyLang leaves a node alone when its key is missing, never writing undefined', () => {
  const nodes = [{ dataset: { i18n: 'nope.nope' }, textContent: 'Keep me' }];
  const doc = { documentElement: { lang: 'en' }, querySelectorAll: () => nodes };
  assert.equal(applyLang(doc, 'es'), 0);
  assert.equal(nodes[0].textContent, 'Keep me');
});

test('applyLang refuses an unsupported language', () => {
  const doc = { documentElement: { lang: 'en' }, querySelectorAll: () => [] };
  assert.throws(() => applyLang(doc, 'fr'), /unsupported language/);
});
```

- [ ] **Step 2: Run the tests and watch them fail**

Run: `node --test tests/runtime.test.mjs`
Expected: FAIL — cannot find module `../js/storage.js`

- [ ] **Step 3: Implement `js/storage.js` and `js/lang.js`**

- [ ] **Step 4: Run the tests and watch them pass**

Run: `node --test tests/runtime.test.mjs`
Expected: PASS (4 tests)

- [ ] **Step 5: Implement `initTerminal(root, context)`, `initChrome(doc, state)` and wire `js/main.js`**

`initTerminal` appends output as text nodes only, never `innerHTML` — command echo includes whatever the visitor typed. It keeps history on the arrow keys and Tab-completes command names, acts on a `Result` by navigating (`navigate`, resolved against the page's asset prefix), clearing, calling `applyLang` (`setLang`, then persisting), or setting the entered flag (`enter`), and autofocuses only on `(pointer: fine)`.

`initChrome` applies the stored language before first paint and reveals the menu on the boot page when the entered flag is set.

`js/main.js` on `DOMContentLoaded`: read preferences, `initChrome`, then `initTerminal` with `{ page, entered, lang }`.

- [ ] **Step 6: Rebuild, run the whole suite and the link checker**

Run: `node tools/build-pages.mjs && node --test && node tools/check-links.mjs`
Expected: all pass

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: wire language switching, entered state and the command line"
```

---

### Task 8: Icons, styling pass, and handover

**Files:**
- Create: `images/tech/*.svg` for the technologies Task 1 left at `icon: null`
- Modify: `css/tokens.css`, `css/base.css`, `css/layout.css`, `css/components.css`, `css/terminal.css`, `src/content/data.js` (point the new icons), `HANDOVER.md`, `TODO.md`
- Test: `tests/assets.test.mjs` (extend)

**Interfaces:**
- Consumes: `skills` from Task 1.

New icons needed: Spring Boot, .NET, React, Angular, Flutter, Postgres, MySQL, Oracle, Docker, GitHub Actions. Fetch each from `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/...` into `images/tech/`, verifying each URL returns 200 and the file is real SVG markup before committing it — they ship as local files, never as CDN references.

- [ ] **Step 1: Write the failing test**

```javascript
test('every skill icon path points at a file that exists', async () => {
  for (const group of skills) {
    for (const item of group.items) {
      if (!item.icon) continue;
      await access(new URL(`../${item.icon}`, import.meta.url));
    }
  }
});

test('every technology in every group has an icon', () => {
  for (const group of skills) {
    for (const item of group.items) {
      assert.ok(item.icon, `${item.name} has no icon`);
    }
  }
});
```

- [ ] **Step 2: Run the test and watch it fail**

Run: `node --test tests/assets.test.mjs`
Expected: FAIL — technologies still carry `icon: null`

- [ ] **Step 3: Download the icons and point `data.js` at them**

- [ ] **Step 4: Run the test and watch it pass**

Run: `node --test tests/assets.test.mjs`
Expected: PASS

- [ ] **Step 5: Complete the styling pass across the five stylesheets**

The window frame, menu, command line, cards, chips and the fastfetch columns, at phone and desktop widths. Honour `prefers-reduced-motion` for the caret and any reveal. Keep the existing token names; add tokens rather than hardcoding new colours.

- [ ] **Step 6: Rewrite `HANDOVER.md` and update `TODO.md`**

`HANDOVER.md` covers: how the build works and that generated HTML is never hand-edited; the `PLACEHOLDER_PAPU`-versus-`PLACEHOLDER`-identifier distinction with the grep that actually finds the unknowns; every remaining unknown with its file, field and where it shows on the page; how to add a language key; and the two manual steps (the CV PDF plus `cvAvailable: true`, and the three missing certification links — noting that committed PDFs under `assets/certs/` are verifiable by the link checker while Drive URLs can only ever be warnings). `TODO.md` gets a new `## ESTADO` entry pointing at it. Record gaps rather than silently filling them.

- [ ] **Step 7: Rebuild, run the whole suite and the link checker**

Run: `node tools/build-pages.mjs && node --test && node tools/check-links.mjs`
Expected: all pass, link checker exits 0

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: complete icons, styling and handover documentation"
```

---

## Verification after the last task

```bash
node tools/build-pages.mjs && node --test && node tools/check-links.mjs
git status --short   # expected: clean — generated output is committed
grep -rn '\bPLACEHOLDER\b' src/content/   # every remaining unknown, by field
```

Then Ariel reviews with `live-server` at desktop and phone widths.
