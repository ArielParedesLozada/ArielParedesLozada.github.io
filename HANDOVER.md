# Handover notes

The portfolio is now six real pages, navigated by a command line, generated
from one template. No framework, no dependencies, no `package.json`, no CI.

## How the build works

```bash
node tools/build-pages.mjs    # writes the pages
node --test                   # the whole suite (bare: `node --test tests/` fails on Node 24)
node tools/check-links.mjs    # must exit 0
```

`tools/build-pages.mjs` renders `src/templates/page.html` once per entry in
its `PAGES` list, filling the body from the matching module in
`src/sections/`, and writes:

```
index.html              about/index.html     skills/index.html
education/index.html    experience/index.html
contact/index.html      404.html             .nojekyll
```

**Those eight files are build output. Never edit them by hand** — the next
build overwrites your change without saying anything. Edit the content
modules or the template instead, then rebuild.

Content lives in two files, split so every string exists in one place:

- `src/content/data.js` — language-neutral facts: URLs, dates, periods,
  tech lists, proper nouns. Prose is referenced by key (`roleKey`,
  `descriptionKey`, `titleKey`).
- `src/content/i18n.js` — all prose and UI copy, under `DICT.en` and
  `DICT.es`. A test enforces that both languages carry exactly the same
  keys, so adding one to `en` and forgetting `es` fails the suite rather
  than rendering `undefined` on the page.

## How the language switch works

The build writes **English** into the HTML and tags every translatable
element with `data-i18n="<key>"`. At runtime `lang es` looks each key up in
the Spanish dictionary, swaps the text in place, and stores the preference,
which is reapplied on the next page.

Consequence, chosen deliberately: **without JavaScript the site is in
English.** Everything else still works without it — the window frame, the
menu links, and all the English content are in the served HTML. The command
line and the language switch are the only parts that need JS.

To add a string: put it in both `DICT.en` and `DICT.es`, then reference it
from a section module through `label()`, `labelledProse()` or `proseOr()` so
it gets its `data-i18n` tag automatically.

## The sentinel, and how to actually find the unknowns

Unknown values are the literal string `PLACEHOLDER_PAPU`, rendered as a
visible amber "pending" chip. The sentinel is **never printed raw** on the
page, and nothing is ever filled in with a plausible-sounding guess.

Most unknowns reference the exported `PLACEHOLDER` constant rather than
repeating the string, so this finds almost nothing:

```bash
grep -rn PLACEHOLDER_PAPU        # only 2 hits: the constant's definition and a test
```

Search for the identifier instead:

```bash
grep -n '\bPLACEHOLDER\b' src/content/data.js src/content/i18n.js
```

## What is still missing, and where

| # | What | Where | Shows up on |
|---|------|-------|-------------|
| 1 | Professional objective | `i18n.js`, `section.about.objective` (both languages) | boot screen and `/about/` |
| 2 | "Who you are" summary | `i18n.js`, `section.about.summary` | `/about/` |
| 3 | Current semester | `data.js`, `education[0].semester` | `/education/#uni` |
| 4 | Galacorp role | `i18n.js`, `company.galacorp.role` | `/experience/` |
| 5 | ASSA role | `i18n.js`, `company.assa.role` | `/experience/` |
| 6 | Procoineec role and stack | `i18n.js` `project.procoineec.role`; `data.js` `projects[0].stack` | `/experience/#projects` |
| 7 | Hackathon name, date, result | `i18n.js` `event.ctt-fisei.name`/`.result`; `data.js` `events[0].date` | `/experience/#events` |
| 8 | Three certification links | `data.js`, `certifications[]` — Network Support and Security, VI Congreso CSEI 2024, ESP32 | `/education/#certs` |
| 9 | ESP32 certificate issuer | `data.js`, `certifications[5].issuer` | `/education/#certs` |
| 10 | Project screenshots | `data.js`, `projects[].image` | `/experience/#projects` |
| 11 | CV PDF | see below | `/about/#cv` |

## Two manual steps

1. **CV PDF.** Save it as `assets/cv/cv-ariel-paredes-lozada.pdf`, set
   `profile.cvAvailable` to `true` in `src/content/data.js`, rebuild. Until
   then the Download button stays disabled with an honest note rather than
   linking to a 404.
2. **Certification documents.** Three of the six have Google Drive links;
   three have none. Prefer committing the PDFs under `assets/certs/` and
   pointing `certifications[].url` at them: the link checker can verify a
   local file, while a Drive URL can only ever be a warning because Drive
   refuses automated requests. A certification with no link renders a
   "Certificate: pending" chip — never a dead anchor.

## Things worth knowing before you trust a red result

- **The link checker refetches every external URL on every run, with no
  caching or retry budget.** Back-to-back runs occasionally report transient
  errors that pass on the next run. Re-run before believing a failure.
- **LinkedIn always reports `WARN (999)`.** That is LinkedIn refusing
  robots, not a broken link; 999 is classified alongside 403/405/429.
- The three Google Drive certificate links behave the same way if Drive
  decides to rate-limit.

## Decisions you may want to revisit

- **Before `start`, only `start` and `lang` are recognised** on the landing
  page; everything else, including `help`, answers "command not found" with
  a nudge. `lang` is exempt so a Spanish-only visitor is not held behind an
  English boot screen.
- **Arriving by a shared link bypasses the gate.** Someone who lands on
  `/experience/` directly gets the menu and working commands — the gate is
  theatre on the landing page, not a lock.
- **Terminal navigation uses root-relative paths** (`/skills/`). Correct for
  a GitHub *user* site served at the domain root. If this ever moves under a
  subpath, those break while the menu links keep working.
- **Hobbies live under `/about/#hobbies`** and events under
  `/experience/#events`, since the five-section menu had no room for them.

## Before merging

```bash
node tools/build-pages.mjs && node --test && node tools/check-links.mjs
git status --short    # expect clean: generated output is committed
```

Then review with `live-server` at both desktop and phone widths. Worth
checking by hand, because no test covers them: that the command line stays
reachable on a phone when the keyboard is up, that `lang es` leaves no
English text behind, and that `start` followed by the back button does not
trap you on the boot screen.
