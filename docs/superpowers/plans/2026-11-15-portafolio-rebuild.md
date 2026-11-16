# Portfolio Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `ArielParedesLozada.github.io` from scratch as an English-language, dependency-free static portfolio with a Linux/NixOS look and a working terminal widget in the hero.

**Architecture:** One `index.html` with a static hero and empty section shells; all repeated content lives in `js/content.js` and is painted by `js/render.js` at load. Behaviour is split into `js/terminal.js` (hero command interpreter) and `js/ui.js` (nav, scroll-spy, reveal). Styling is layered across five CSS files, driven by custom properties in `css/tokens.css`. Pure logic is unit-tested with Node's built-in test runner; presentation is verified by a link checker and by Ariel's visual review in `live-server`.

**Tech Stack:** Vanilla HTML5, CSS custom properties, native ES modules. Node >= 18 for `node --test` and for `tools/check-links.mjs`. Zero installed dependencies — no `package.json` with dependencies, no bundler, no framework.

**Spec:** `docs/superpowers/specs/2026-11-15-portafolio-rebuild-design.md`

## Global Constraints

- Branch: `octavo`. Do not merge or push.
- Site language is **English**, `<html lang="en">`. Navigation, prose, terminal output, form labels, `alt` text — all English.
- Proper nouns stay in Spanish: `Universidad Técnica de Ambato`, `Junta de Agua de Santa Rosa`, certificate titles. Add a short English gloss in parentheses where it helps. Never translate an institution's name.
- Every unknown value is the literal string `PLACEHOLDER_PAPU`, never invented content, never the bare word `PLACEHOLDER`.
- No installed dependencies, no build step, no framework, no CDN in the critical path. Fonts come from the system stack; tech logos are local files under `images/tech/`.
- No GitHub API calls anywhere in the shipped site.
- No code copied from `s4sahiko/tportfolio` (it has no license). The footer carries one credit line to Sahiko for the idea.
- Dark theme only. No light/dark toggle, no language toggle.
- Zero broken links or images: `node tools/check-links.mjs` must exit 0 at the end of every task.
- The implementer does not start web servers. Ariel reviews visually with `live-server`.

## Review Focus

These are the conditions the spec implies but does not assign to a feature. Each has a test in the task that owns the code.

1. **The CV PDF does not exist yet** (Ariel uploads it later). A visitor clicking "Download CV" must get an honest "not available yet" state, not a 404. — Task 6.
2. **Formspree is not configured yet.** Submitting the contact form must show the direct email addresses and must never appear to have sent a message. — Task 6.
3. **Project screenshots are missing.** Missing images must render a styled placeholder with real `alt` text, never a broken-image icon. — Task 4.
4. **Unknown, empty, and very long terminal input.** The interpreter must answer "command not found", ignore empty input, and never throw or hang. — Task 5.
5. **Google Drive and LinkedIn reject automated `HEAD` requests.** The link checker must report those as warnings, not failures, or its output becomes noise and gets ignored. — Task 1.

---

### Task 1: Link checker

The tooling every later task verifies against, so it comes first.

**Files:**
- Create: `tools/check-links.mjs`
- Test: `tests/check-links.test.mjs`

**Interfaces:**
- Produces:
  - `collectReferences(html: string): Array<{ kind: 'href'|'src', value: string }>` — every `href` and `src` attribute value, in document order, duplicates kept.
  - `classify(value: string): 'local' | 'external' | 'anchor' | 'mailto'` — `#...` is anchor, `mailto:`/`tel:` is mailto, anything matching `^https?://` is external, everything else is local.
  - `checkLocal(value: string, rootDir: string): Promise<{ ok: boolean, resolved: string }>` — strips query and hash, resolves relative to `rootDir`, `ok` is whether the file exists.
  - `severityFor(status: number): 'ok' | 'warn' | 'error'` — 200-399 is ok, 403/405/429 is warn, everything else is error.
  - Default export not required; the file is both a module and a CLI (`import.meta.url` guard).

- [ ] **Step 1: Write the failing tests**

```javascript
// tests/check-links.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { collectReferences, classify, checkLocal, severityFor } from '../tools/check-links.mjs';

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
  assert.equal(severityFor(404), 'error');
  assert.equal(severityFor(500), 'error');
});
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `node --test tests/check-links.test.mjs`
Expected: FAIL — cannot resolve `../tools/check-links.mjs`.

- [ ] **Step 3: Implement the four exported functions in `tools/check-links.mjs`**

Parse attributes with a regex over the raw HTML — no DOM, no parser dependency. Use `node:fs/promises` `access` for `checkLocal`.

- [ ] **Step 4: Run the tests and confirm they pass**

Run: `node --test tests/check-links.test.mjs`
Expected: PASS, 4 tests.

- [ ] **Step 5: Add the CLI behaviour**

Under an `import.meta.url === pathToFileURL(process.argv[1]).href` guard: read every `.html` file at the repo root plus `js/content.js`, collect references, check locals against the repo root, and `fetch` externals with `method: 'HEAD'` then retry once with `GET` on a non-ok status. Print one line per reference as `OK`, `WARN`, or `ERROR` with the value and the reason, then a summary. Exit 1 if any error, 0 otherwise. Skip anchors and mailto in the network phase; verify anchors against `id="..."` occurrences in the HTML and treat a missing target as an error.

- [ ] **Step 6: Verify the CLI runs on the current repo**

Run: `node tools/check-links.mjs; echo "exit=$?"`
Expected: a report naming the known-broken `images/wave-hello.gif` and the `assets/images/favicon-*.svg` references from the old template, with `exit=1`. This proves the checker detects real breakage before anything is cleaned up.

- [ ] **Step 7: Commit**

```bash
git add tools/check-links.mjs tests/check-links.test.mjs
git commit -m "tools: add link and image checker"
```

---

### Task 2: Purge the old template and scaffold the page

**Files:**
- Delete: `script/typed.js`, `script/download.js`, `script/repos.js`, `css/style.css`, `css/timeline.css`
- Create: `index.html` (replacing the old one entirely), `css/tokens.css`, `css/base.css`
- Test: `tests/no-template-residue.test.mjs`

**Interfaces:**
- Produces: `index.html` with one `<section>` per content area, each with a stable `id` that later tasks render into: `home`, `objective`, `education`, `experience`, `projects`, `skills`, `events`, `contact`. Each section contains an empty mount point `<div data-mount="<id>"></div>`. `css/tokens.css` exposes the custom properties later CSS consumes: `--bg`, `--bg-elevated`, `--fg`, `--fg-muted`, `--accent`, `--accent-dim`, `--warn`, `--border`, `--font-mono`, `--font-sans`, `--step--1` through `--step-4`, `--space-1` through `--space-8`, `--radius`, `--shadow`.

- [ ] **Step 1: Write the failing test**

```javascript
// tests/no-template-residue.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const FORBIDDEN = [
  'chaudhari', 'adsbygoogle', 'pagead', 'typed.umd', 'aos@',
  'iconify', 'github-calendar', 'bootstrap-icons', 'colored-icons',
  'Gaur', 'Nitai', 'Om_Chaudhari_CV', 'wave-hello',
];

test('index.html carries no trace of the borrowed template', async () => {
  const html = (await readFile('index.html', 'utf8')).toLowerCase();
  for (const needle of FORBIDDEN) {
    assert.ok(!html.includes(needle.toLowerCase()), `found "${needle}" in index.html`);
  }
});

test('index.html declares English and the required sections', async () => {
  const html = await readFile('index.html', 'utf8');
  assert.match(html, /<html[^>]+lang="en"/);
  for (const id of ['home', 'objective', 'education', 'experience', 'projects', 'skills', 'events', 'contact']) {
    assert.ok(html.includes(`id="${id}"`), `missing section id="${id}"`);
  }
  assert.match(html, /<noscript>/);
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `node --test tests/no-template-residue.test.mjs`
Expected: FAIL on `chaudhari` and on `lang="en"`.

- [ ] **Step 3: Delete the old template files**

```bash
git rm script/typed.js script/download.js script/repos.js css/style.css css/timeline.css
```

- [ ] **Step 4: Write `index.html`**

A single page: `<head>` with `lang="en"`, Ariel's own `description`, `author`, `theme-color`, and Open Graph tags pointing at `images/android-chrome-512x512.png`; the three existing favicons from `images/`; the five stylesheets; `<script type="module" src="js/main.js">` deferred by nature. Body: skip link, nav with the eight section links and a CSS-only mobile toggle, a scroll progress bar, the **static** hero (full name, the objective line, Download CV button, GitHub and email links, the terminal container), then one `<section>` per id with a window-chrome header and an empty `data-mount` div. `<noscript>` block above the sections explaining that the detail sections need JavaScript, with direct mailto and GitHub links. Footer with the Sahiko credit line and no third-party credits.

- [ ] **Step 5: Write `css/tokens.css` and `css/base.css`**

`tokens.css` is `:root { ... }` only — the custom properties listed in Interfaces. Palette: near-black background, two Nix blues as `--accent` and `--accent-dim`, amber `--warn` for placeholders. Font stacks use system mono and sans, no webfont. `base.css` is reset, `box-sizing`, body typography, link and focus-visible styles, `.visually-hidden`, and a `@media (prefers-reduced-motion: reduce)` block that disables transitions.

- [ ] **Step 6: Run the test and the checker**

Run: `node --test tests/no-template-residue.test.mjs && node tools/check-links.mjs; echo "exit=$?"`
Expected: tests PASS; checker `exit=0` — the broken references are gone with the old markup.

- [ ] **Step 7: Commit**

```bash
git add -A index.html css tests/no-template-residue.test.mjs script
git commit -m "feat: replace borrowed template with own English scaffold"
```

---

### Task 3: Content model

**Files:**
- Create: `js/content.js`
- Test: `tests/content.test.mjs`

**Interfaces:**
- Produces named exports consumed by Task 4 and Task 5:
  - `profile: { name, headline, objective, location, email, universityEmail, github, linkedin, cvPath, cvAvailable: boolean, photo }`
  - `education: Array<{ institution, degree, period, detail, achievements: string[] }>`
  - `certifications: Array<{ title, issuer, url }>`
  - `experience: Array<{ type: 'company'|'professional'|'academic'|'personal', org, role, period, summary, stack: string[], links: Array<{ label, url }> }>`
  - `projects: Array<{ name, description, role, stack: string[], image, imageAlt, links: Array<{ label, url }>, tags: string[] }>`
  - `skills: Array<{ group: string, items: Array<{ name, icon }> }>` — `icon` is a path under `images/tech/` or `null`
  - `events: Array<{ name, kind: 'hackathon'|'conference'|'course', date, detail }>`
  - `hobbies: string[]`
  - `PLACEHOLDER = 'PLACEHOLDER_PAPU'` — every unknown value references this constant rather than repeating the literal.

- [ ] **Step 1: Write the failing test**

```javascript
// tests/content.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as content from '../js/content.js';

test('the placeholder sentinel is exactly PLACEHOLDER_PAPU', () => {
  assert.equal(content.PLACEHOLDER, 'PLACEHOLDER_PAPU');
});

test('no placeholder sentinel other than PLACEHOLDER_PAPU appears', async () => {
  const src = await readFile('js/content.js', 'utf8');
  const offenders = [...src.matchAll(/\bTODO\b|\bTBD\b|\bFIXME\b|\bPLACEHOLDER(?!_PAPU)\b/g)].map((m) => m[0]);
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
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `node --test tests/content.test.mjs`
Expected: FAIL — cannot resolve `../js/content.js`.

- [ ] **Step 3: Write `js/content.js`**

Fill every confirmed fact from the spec's "Contenido e inventario de placeholders" section: UTA and the three certifications with their existing Drive URLs, Galacorp (June–August 2025), ASSA (June–August 2026), Junta de Agua de Santa Rosa with its Northflank deployment URL, the full skill list including NixOS, Claude and Opencode, and the four hobbies. Everything the spec lists as a placeholder gets `PLACEHOLDER` as its value: the final objective wording, the current semester, what was built at Galacorp and at ASSA, the JuntaAgua role and repo URL, the hackathon details, which academic projects to show, the LinkedIn URL, and the Formspree endpoint. Set `cvAvailable: false` and `cvPath: 'assets/cv/cv-ariel-paredes-lozada.pdf'`. For the objective, put a proposed two-line draft in a comment directly above the placeholder so Ariel can accept it by deleting one line.

- [ ] **Step 4: Run the tests and confirm they pass**

Run: `node --test tests/content.test.mjs`
Expected: PASS, 5 tests.

- [ ] **Step 5: List what is still unknown**

Run: `grep -c PLACEHOLDER_PAPU js/content.js`
Expected: at least 11 — one per spec placeholder.

- [ ] **Step 6: Commit**

```bash
git add js/content.js tests/content.test.mjs
git commit -m "feat: add content model with PLACEHOLDER_PAPU sentinels"
```

---

### Task 4: Section rendering

**Files:**
- Create: `js/render.js`, `js/main.js`, `css/layout.css`, `css/components.css`, `images/projects/placeholder.svg`
- Test: `tests/render.test.mjs`

**Interfaces:**
- Consumes: every export from `js/content.js` (Task 3); the `data-mount` points and token names from `index.html` and `css/tokens.css` (Task 2).
- Produces:
  - `escapeHtml(value: string): string`
  - `placeholderMarkup(label: string): string` — the amber `<span class="placeholder">` chip, used wherever a value equals `PLACEHOLDER_PAPU`.
  - `fieldOrPlaceholder(value: string, label: string): string`
  - `renderEducation()`, `renderExperience()`, `renderProjects()`, `renderSkills()`, `renderEvents()`, `renderObjective()`, `renderContact()` — each returns an HTML string, takes no arguments, reads from `content.js`. `renderEducation` also renders the certifications list. `renderEvents` renders the events list **and** the hobbies, as two blocks inside the `events` section, since the TODO pairs them.
  - `mountAll(doc: Document): void` — writes each render result into its matching `[data-mount]`.
  - `js/main.js` is the entry point: calls `mountAll(document)`, then the Task 5 and Task 6 initialisers.

- [ ] **Step 1: Write the failing tests**

```javascript
// tests/render.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml, placeholderMarkup, fieldOrPlaceholder, renderProjects, renderExperience, renderSkills } from '../js/render.js';

test('escapeHtml neutralises markup', () => {
  assert.equal(escapeHtml('<img src=x onerror="a">'), '&lt;img src=x onerror=&quot;a&quot;&gt;');
});

test('a placeholder value renders the placeholder chip, not the raw sentinel', () => {
  const out = fieldOrPlaceholder('PLACEHOLDER_PAPU', 'Role');
  assert.match(out, /class="placeholder"/);
  assert.ok(!out.includes('PLACEHOLDER_PAPU'), 'the sentinel must not reach the page');
  assert.match(out, /Role/);
});

test('a real value renders escaped, with no chip', () => {
  const out = fieldOrPlaceholder('Backend developer', 'Role');
  assert.equal(out, 'Backend developer');
});

test('every project card has an image with non-empty alt and falls back to the placeholder image', () => {
  const html = renderProjects();
  const imgs = [...html.matchAll(/<img[^>]*>/g)].map((m) => m[0]);
  assert.ok(imgs.length > 0, 'no project images rendered');
  for (const img of imgs) {
    assert.match(img, /alt="[^"]+"/, `image without alt: ${img}`);
    assert.match(img, /loading="lazy"/);
    assert.match(img, /onerror="/, 'missing broken-image fallback');
  }
});

test('experience is grouped by the four types with visible labels', () => {
  const html = renderExperience();
  for (const label of ['Companies', 'Professional', 'Academic', 'Personal']) {
    assert.ok(html.includes(label), `missing group label ${label}`);
  }
});

test('skills render local icon paths only', () => {
  const html = renderSkills();
  assert.ok(!/src="https?:/.test(html), 'skill icons must be local');
});
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `node --test tests/render.test.mjs`
Expected: FAIL — cannot resolve `../js/render.js`.

- [ ] **Step 3: Implement `js/render.js`**

Template-literal functions, no DOM APIs beyond `mountAll`. Every interpolated content value passes through `escapeHtml` or `fieldOrPlaceholder`. Project images get `loading="lazy"` and an inline `onerror` that swaps to `images/projects/placeholder.svg` and adds a `data-missing` attribute — this is Review Focus 3.

- [ ] **Step 4: Implement `js/main.js`**

Import `mountAll` and call it on `DOMContentLoaded`. Leave the Task 5 and Task 6 imports to be added by those tasks.

- [ ] **Step 5: Write `css/layout.css` and `css/components.css`**

`layout.css`: centred container with a max width, the section rhythm, the nav bar and its mobile behaviour at a single breakpoint, the footer, and the scroll progress bar. `components.css`: the window chrome (title bar with `─ □ ×` and a `## path/` label), cards, the experience timeline, skill chips, buttons, the `.placeholder` amber chip, and the project grid. Use only `var(--...)` tokens for colour, spacing and type size — no literal colours outside `tokens.css`.

- [ ] **Step 6: Create `images/projects/placeholder.svg`**

A dark panel with the Nix accent and the words "Screenshot pending", sized 1200×675 via `viewBox`.

- [ ] **Step 7: Run the tests and the checker**

Run: `node --test tests/render.test.mjs && node tools/check-links.mjs; echo "exit=$?"`
Expected: tests PASS; `exit=0`.

- [ ] **Step 8: Commit**

```bash
git add js/render.js js/main.js css/layout.css css/components.css images/projects/placeholder.svg tests/render.test.mjs
git commit -m "feat: render sections from the content model"
```

- [ ] **Step 9: Hand over for visual review**

Tell Ariel the sections are rendering and ask him to open the site with `live-server`. Report that the terminal, the contact form and the local tech icons are still pending (Tasks 5–7).

---

### Task 5: Hero terminal

**Files:**
- Create: `js/terminal.js`, `css/terminal.css`
- Modify: `js/main.js`
- Test: `tests/terminal.test.mjs`

**Interfaces:**
- Consumes: `profile`, `projects`, `skills`, `experience` from `js/content.js`; the hero terminal container from `index.html`.
- Produces:
  - `COMMANDS: Record<string, { summary: string, run: (args: string[]) => { lines: string[], scrollTo?: string } }>` — keys are `help`, `whoami`, `ls`, `cat`, `skills`, `contact`, `clear`, `neofetch`.
  - `resolve(input: string): { lines: string[], scrollTo?: string, clear?: boolean }` — pure, no DOM. Trims input, splits on whitespace, returns `{ lines: [] }` for empty input, and `{ lines: ['command not found: <name>', "type 'help' for the list"] }` for anything unknown.
  - `initTerminal(root: Element): void` — wires the input, keeps a history array navigable with ArrowUp/ArrowDown, completes on Tab, appends output, and calls `scrollIntoView` on the target section when `scrollTo` is set.

- [ ] **Step 1: Write the failing tests**

```javascript
// tests/terminal.test.mjs
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
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `node --test tests/terminal.test.mjs`
Expected: FAIL — cannot resolve `../js/terminal.js`.

- [ ] **Step 3: Implement `resolve` and `COMMANDS` in `js/terminal.js`**

Each command's `run` reads from `content.js` and returns short lines. Any value equal to `PLACEHOLDER_PAPU` is rendered in terminal output as `(pending)` — the sentinel never reaches the screen. `cat cv` checks `profile.cvAvailable` and says the CV is not published yet when it is false.

- [ ] **Step 4: Run the tests and confirm they pass**

Run: `node --test tests/terminal.test.mjs`
Expected: PASS, 8 tests.

- [ ] **Step 5: Implement `initTerminal` and wire it up**

Append the output lines as text nodes, never `innerHTML`, so terminal input cannot inject markup. Autofocus only on pointer-capable viewports so mobile keyboards do not pop open on load. Import and call `initTerminal` from `js/main.js`, guarded on the container existing.

- [ ] **Step 6: Write `css/terminal.css`**

Window chrome matching the sections, monospace output, a blinking caret that stops under `prefers-reduced-motion`, a fixed max height with internal scroll, and a visible hint line listing `help`, `whoami`, `ls projects`, `cat cv`.

- [ ] **Step 7: Run everything**

Run: `node --test tests/ && node tools/check-links.mjs; echo "exit=$?"`
Expected: all tests PASS; `exit=0`.

- [ ] **Step 8: Commit**

```bash
git add js/terminal.js css/terminal.css js/main.js tests/terminal.test.mjs
git commit -m "feat: add hero terminal with its own command interpreter"
```

---

### Task 6: CV download and contact form

**Files:**
- Create: `js/contact.js`, `assets/cv/.gitkeep`
- Modify: `index.html` (hero CV button, contact section), `js/main.js`, `js/render.js`
- Test: `tests/contact.test.mjs`

**Interfaces:**
- Consumes: `profile.cvPath`, `profile.cvAvailable`, `profile.email`, `profile.universityEmail`, `profile.linkedin`, and the Formspree endpoint placeholder from `js/content.js`.
- Produces:
  - `isConfigured(endpoint: string): boolean` — false for `PLACEHOLDER_PAPU`, empty, and any value not matching `^https://`.
  - `cvState(profile): { available: boolean, href: string|null, label: string, note: string|null }` — when unavailable, `href` is null and `note` explains the CV is not published yet.
  - `initContact(doc: Document): void` — sets the form's `action` when configured; otherwise intercepts `submit`, prevents default, and reveals a status region naming both email addresses.

- [ ] **Step 1: Write the failing tests**

```javascript
// tests/contact.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isConfigured, cvState } from '../js/contact.js';

test('the placeholder endpoint counts as unconfigured', () => {
  assert.equal(isConfigured('PLACEHOLDER_PAPU'), false);
  assert.equal(isConfigured(''), false);
  assert.equal(isConfigured('formspree.io/f/abc'), false);
  assert.equal(isConfigured('https://formspree.io/f/abc'), true);
});

test('an absent CV yields no link and an honest note', () => {
  const state = cvState({ cvAvailable: false, cvPath: 'assets/cv/cv.pdf' });
  assert.equal(state.available, false);
  assert.equal(state.href, null);
  assert.ok(state.note && state.note.length > 0);
  assert.ok(!state.note.includes('PLACEHOLDER_PAPU'));
});

test('a present CV yields the path', () => {
  const state = cvState({ cvAvailable: true, cvPath: 'assets/cv/cv.pdf' });
  assert.equal(state.href, 'assets/cv/cv.pdf');
  assert.equal(state.available, true);
});
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `node --test tests/contact.test.mjs`
Expected: FAIL — cannot resolve `../js/contact.js`.

- [ ] **Step 3: Implement `js/contact.js`**

`initContact` renders the CV control from `cvState`: an `<a download>` when available, otherwise a disabled button with `aria-disabled="true"` and the note beside it — Review Focus 1. The form's `action` carries the literal `PLACEHOLDER_PAPU` in the markup so `grep` finds it; `initContact` replaces it only when `isConfigured` passes, and otherwise intercepts the submit and shows the mailto fallback — Review Focus 2.

- [ ] **Step 4: Add the contact markup**

The form takes name, email and message, each with a real `<label>`, `required`, and `autocomplete`. Below it, always-visible `mailto:` links for both addresses, the GitHub link, and the LinkedIn link rendered through `fieldOrPlaceholder` from Task 4. A `role="status"` region holds the fallback message. Do not add a `method="POST"` that would submit to the placeholder.

- [ ] **Step 5: Run the tests and the checker**

Run: `node --test tests/ && node tools/check-links.mjs; echo "exit=$?"`
Expected: all tests PASS; `exit=0` — the absent CV must not appear as a broken local link, because no `href` to it is emitted.

- [ ] **Step 6: Commit**

```bash
git add js/contact.js index.html js/main.js js/render.js assets/cv/.gitkeep tests/contact.test.mjs
git commit -m "feat: add contact form fallback and honest CV state"
```

---

### Task 7: UI behaviour and local tech icons

**Files:**
- Create: `js/ui.js`, `images/tech/` (one SVG per skill with an icon)
- Modify: `js/main.js`, `js/content.js` (icon paths)
- Test: `tests/ui.test.mjs`, `tests/assets.test.mjs`

**Interfaces:**
- Consumes: the nav and progress-bar markup from Task 2; `skills` from Task 3.
- Produces:
  - `scrollProgress(scrollTop: number, scrollHeight: number, clientHeight: number): number` — clamped 0–100, returns 0 when the page does not scroll (no division by zero).
  - `activeSection(positions: Array<{ id: string, top: number }>, scrollY: number): string` — the id of the last section whose `top` is at or above `scrollY`, the first id otherwise.
  - `initUi(doc: Document): void` — wires scroll-spy, the progress bar, mobile menu close-on-navigate, and `IntersectionObserver` reveals that are skipped entirely under `prefers-reduced-motion`.

- [ ] **Step 1: Write the failing tests**

```javascript
// tests/ui.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scrollProgress, activeSection } from '../js/ui.js';

test('scrollProgress is clamped and safe on a non-scrolling page', () => {
  assert.equal(scrollProgress(0, 1000, 1000), 0);
  assert.equal(scrollProgress(0, 2000, 1000), 0);
  assert.equal(scrollProgress(1000, 2000, 1000), 100);
  assert.equal(scrollProgress(5000, 2000, 1000), 100);
  assert.equal(scrollProgress(-50, 2000, 1000), 0);
});

test('activeSection picks the current section', () => {
  const pos = [{ id: 'home', top: 0 }, { id: 'about', top: 500 }, { id: 'contact', top: 1500 }];
  assert.equal(activeSection(pos, 0), 'home');
  assert.equal(activeSection(pos, 600), 'about');
  assert.equal(activeSection(pos, 9999), 'contact');
});
```

```javascript
// tests/assets.test.mjs
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
```

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `node --test tests/ui.test.mjs tests/assets.test.mjs`
Expected: both FAIL — `js/ui.js` missing, icon files missing.

- [ ] **Step 3: Implement `js/ui.js` and wire it from `js/main.js`**

Throttle the scroll handler with `requestAnimationFrame`. Mark the active nav item with `aria-current="page"`.

- [ ] **Step 4: Download the tech icons once into `images/tech/`**

Fetch each logo from the devicon CDN with `curl` into `images/tech/<slug>.svg`, then set each skill's `icon` to that local path in `js/content.js`. Skills with no suitable logo keep `icon: null` and render as a text chip. Nothing in the shipped site may reference the CDN.

- [ ] **Step 5: Run everything**

Run: `node --test tests/ && node tools/check-links.mjs; echo "exit=$?"`
Expected: all tests PASS; `exit=0`.

- [ ] **Step 6: Commit**

```bash
git add js/ui.js js/main.js js/content.js images/tech tests/ui.test.mjs tests/assets.test.mjs
git commit -m "feat: add scroll behaviour and self-hosted tech icons"
```

---

### Task 8: Final sweep and handover

**Files:**
- Modify: `TODO.md` (mark what is done), `docs/superpowers/specs/2026-11-15-portafolio-rebuild-design.md` (only if a decision changed during the build)
- Create: `HANDOVER.md`

- [ ] **Step 1: Run the full verification set**

```bash
node --test tests/
node tools/check-links.mjs; echo "link-exit=$?"
grep -rni "chaudhari\|adsbygoogle\|pagead\|typed.umd\|aos@\|iconify\|github-calendar\|Gaur\|Nitai" index.html css js || echo "no residue"
grep -rn "api.github.com" index.html css js || echo "no github api"
grep -rn "PLACEHOLDER_PAPU" js/content.js index.html | wc -l
```

Expected: all tests pass, `link-exit=0`, "no residue", "no github api", and a placeholder count of at least 11.

- [ ] **Step 2: Check every section the TODO requires exists**

Walk the TODO's "OBLIGACIONES" list against the rendered sections and confirm each one is present: name, professional objective, higher education only, CV download, skills, experience across the four types, projects with description / access / images / GitHub / stack / role, hobbies and events, contact with a form and professional networks. Note any gap rather than fixing it silently.

- [ ] **Step 3: Write `HANDOVER.md`**

One section per `PLACEHOLDER_PAPU`, each naming the file, the field, what Ariel has to supply, and where it shows up on the page. Add short instructions for the three manual steps: uploading the CV to `assets/cv/cv-ariel-paredes-lozada.pdf` and flipping `cvAvailable` to `true`; creating the Formspree form and pasting the endpoint; dropping screenshots into `images/projects/`.

- [ ] **Step 4: Commit**

```bash
git add TODO.md HANDOVER.md docs
git commit -m "docs: add handover notes and mark TODO progress"
```

- [ ] **Step 5: Hand over**

Ask Ariel to review the whole site with `live-server` at desktop and phone widths and to confirm it looks the way he wants before anything is merged into `main`.
