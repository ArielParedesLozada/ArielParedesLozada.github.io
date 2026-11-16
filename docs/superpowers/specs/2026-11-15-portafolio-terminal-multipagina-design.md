# Terminal-navigated multipage portfolio — design

**Date:** 2026-11-15
**Branch:** `octavo`
**Supersedes:** `2026-11-15-portafolio-rebuild-design.md` (the single-page
rebuild). That design's content model, CSS tokens, test discipline and
link checker survive; its page structure and its contact form do not.
**Source of requirements:** `TODO.md`, section `CORRECCIONES Y
RECOMENDACIONES`.

---

## Intent and why

The first rebuild put a working terminal in the hero of a single scrolling
page. The terminal was decoration: it printed text and scrolled you to a
section you could have reached by scrolling yourself. Ariel's correction is
that the terminal should be *the* way the site is navigated — the site is a
machine you operate, not a page you scroll.

Two things follow, and they are the whole point of this redesign:

1. **The command line earns its place.** It is always present, at the
   bottom of every page, and typing a section name takes you there. The
   landing page is a boot screen that refuses to show you anything until
   you type `start`, which is a deliberate piece of theatre: it tells the
   visitor within two seconds that this portfolio is run by a developer
   who thinks in shells.
2. **Pages are real.** Each section is its own HTML file with its own URL,
   so a recruiter can be sent `…/experience/` directly, the back button
   works, and reloading lands you where you were.

The audience is recruiters and technical leads evaluating a software
engineering student for data analysis, DevOps, or systems roles. The
aesthetic is the argument: a Linux terminal, operated correctly, is a
claim about competence that a prose paragraph cannot make.

---

## Goals

- Every page carries the same terminal chrome: window frame, top navigation
  menu, and a persistent command line at the bottom.
- The landing page shows a `fastfetch`-style identity block (name,
  professional objective, technologies) and a hint to type `start`. Any
  other command answers `command not found` plus a nudge.
- `start` reveals the top navigation menu and moves the visitor into the
  site.
- Five sections, each reachable both by clicking the menu and by typing its
  name: `about`, `skills`, `education`, `experience`, `contact`.
- Subsections addressable by a second word: `education uni`,
  `education certs`, `about hobbies`, `experience events`.
- The visitor can switch language in place with `lang es` / `lang en`, and
  the choice persists as they move between pages.
- No broken links or missing images, enforced mechanically.
- One source of truth for both the chrome and the content: changing a menu
  item or a project description is a one-file edit, never a six-file edit.

## Non-goals

- A contact form. Explicitly withdrawn by Ariel; direct addresses only.
  Something better goes in later.
- Separate URLs per language (`/es/…`). Considered and declined: Ariel
  chose in-place switching.
- Server-side anything. GitHub Pages serves static files.
- Hobbies and events as top-level sections. They become subsections.
- A second pass over the remaining GitHub repositories. Four projects now;
  more later.

## Anti-goals

Things that would make this a failure even if it technically worked:

- **Invented facts.** Any unknown value is the literal string
  `PLACEHOLDER_PAPU`, visible as a "pending" chip. A plausible-sounding
  sentence Ariel never said is worse than a visible gap — he will be asked
  about this page in an interview.
- **A broken link.** `TODO.md` states this as the one hard requirement.
- **A terminal that is still decoration.** If the command line cannot
  navigate, the redesign failed.
- **A blank page without JavaScript.** The chrome and the English text are
  in the served HTML; JS adds the command line's behaviour and language
  switching, it does not create the page.
- **Dependencies in the critical path.** No framework at runtime, no CDN,
  no `node_modules` required to serve the site.

## Constraints

- Branch `octavo`. No merge or push without Ariel asking.
- Site copy in English by default; proper nouns stay in Spanish
  (*Universidad Técnica de Ambato*, *Junta de Agua de Santa Rosa*).
- Spanish copy is a translation layer, not a separate site.
- Zero runtime dependencies; zero installed dependencies, including for the
  build. The generator runs on Node's standard library alone.
- No code copied from `s4sahiko/tportfolio`. Credit stays in the footer.
- No GitHub API calls from the page.
- Dark theme only.
- `node --test` and `node tools/check-links.mjs` must both pass at the end
  of every task.
- The implementer does not start web servers; Ariel reviews with
  `live-server`.

---

## Approaches

Three ways to share the chrome across six pages without a framework were
put to Ariel, after examining the two portfolios he cited.

**What the examples actually do.** `DaGeus15.github.io` is Next.js 16 +
React 19 with `output: 'export'` and `trailingSlash: true`, deployed by
GitHub Actions — a real framework, genuinely viable on Pages.
`Elkinnn.github.io` is *not* a framework: its pages come from its own
`tools/build-pages.mjs` with a hand-written `tools/i18n.mjs` and a
`templates/` directory. Its only dependencies are `three` (for an unrelated
3D lab) and `esbuild`.

**(1) Next.js static export.** Routing, components and i18n libraries
solved for us. Cost: ~300MB of `node_modules`, a CI deploy, and discarding
the CSS token system, the terminal, the 31 passing tests and the link
checker already built.

**(2) Own static generator**, in the shape of Elkinnn's. A
`tools/build-pages.mjs` renders every page from one template plus the
content modules. Zero dependencies, nothing to install, everything already
built survives, and the duplication problem disappears.

**(3) No build step.** Chrome written by hand into each page. Simplest to
run, but six copies of the menu to keep in sync.

**Chosen: (2).** A page whose content is monospaced text inside a terminal
window has a trivial DOM and no shared state worth a component framework;
Next would charge its dependency surface and return little this site uses.
The generator supplies the one thing missing from (3) — a single source of
truth — and preserves the link checker, which enforces Ariel's hardest
requirement.

The honest argument for (1), raised and weighed: a Next.js repository is
itself a signal to a recruiter who opens the GitHub profile, and React is
on Ariel's skills list. Ariel chose the simpler, more robust site over the
repo-as-demonstration.

---

## How it is built

### Routes and files

Output committed to the repository; GitHub Pages serves it with no CI.

| URL | File | Contents |
|---|---|---|
| `/` | `index.html` | Boot screen. fastfetch block, `start` hint. No menu. |
| `/about/` | `about/index.html` | Name, who he is, objective, mini-summary of experience and education, CV download, `#hobbies`. |
| `/skills/` | `skills/index.html` | Four groups. |
| `/education/` | `education/index.html` | `#uni`, `#certs`. |
| `/experience/` | `experience/index.html` | Companies, projects, `#events`. |
| `/contact/` | `contact/index.html` | Gmail, university email, LinkedIn. |

Subsections are anchors within their section page, not separate pages
(*my call* — it keeps six files, and `/education/#certs` is still a real
shareable URL). The command `education certs` navigates to that anchor.

### Source layout

```
src/
  templates/page.html      one template: window frame, menu, command line
  content/profile.js       the content modules — imported by BOTH the
  content/sections.js      build script (Node) and the browser
  content/i18n.js          { en: {...}, es: {...} } keyed by data-i18n
tools/
  build-pages.mjs          template + content -> the six HTML files
  check-links.mjs          extended to walk subdirectories
js/                        runtime: terminal, language switch, chrome behaviour
css/                       unchanged token system, extended
```

The content modules are plain ES modules, so the same file is `import`ed by
the Node build script and by the browser. This is what makes one source of
truth possible without a bundler.

### How language switching works

The build writes the **English** text into the served HTML, and tags every
translatable element with `data-i18n="<key>"`. At runtime, `lang es` looks
each key up in the Spanish dictionary and swaps the text in place, then
stores the preference. On the next page load the stored preference is
applied before first paint.

Consequence, accepted deliberately: without JavaScript the site is in
English. The alternative — URLs per language — was declined by Ariel.

English is the default on first visit (*my call*: the previous design was
English-only and the target reader may not speak Spanish).

### The boot screen and `start`

`/` shows the identity block and the hint. Unknown commands print
`command not found: <name>` and a nudge toward `start`. `start` navigates
to `/about/` and marks the site as entered, which is what makes the menu
appear.

A visitor arriving directly at `/experience/` from a shared link sees the
menu immediately — making them type `start` to unlock a page they are
already reading would be theatre at the reader's expense.

### Commands

Navigation commands are links: `skills` goes to `/skills/`, from any page.
Beyond the five section names and their subsections: `help`, `clear`,
`lang`, `neofetch`, `cv`, `start`. The interpreter stays a pure
`resolve(input, context)` function returning a description of what should
happen, separate from the DOM wiring — the shape the current tests already
exercise.

### Content

Carried over verbatim from `TODO.md`, with existing values kept where they
still hold:

**Skills**, replacing the previous grouping entirely — backend (Spring
Boot, .NET, Django, Laravel), frontend (React, Angular, Flutter), databases
(Postgres, MySQL, Oracle), DevOps (Docker, GitHub Actions, Linux).

**Education** — UTA, Ingeniería de Software, 2022–present, academic
excellence recognition. Current semester remains unknown.

**Certifications**, six: Network Support and Security; Internet of Things;
VI Congreso Internacional CSEI 2024; Fundamentos de Python; Desarrollo Web
con Python y Django; IoT Design & Monitoring for Energy Systems with ESP32.

Three Google Drive links already exist. *My call, needs Ariel's check:* I
map them as Django → *Desarrollo Web con Python y Django*, Python básico →
*Fundamentos de Python*, Introducción a IoT → *Internet of Things*. The
other three have no link yet. Certificates may later be served from
`assets/certs/` as committed PDFs, which the link checker can verify
locally — preferable to Drive URLs, which the checker can only treat as
warnings because Drive blocks automated requests.

**Experience** — Galacorp (June–August 2025, built the Procoineec site,
`https://procoineec.com/`); ASSA (June–August 2026, PowerApps projects,
mentioned without a repository).

**Projects**, four:

- *Procoineec* — the Galacorp deliverable.
- *Odoo-DAS* — e-learning platform on Odoo 18 Community for the Academia
  Virtual de Tecnología: course e-commerce, Ecuadorian electronic invoicing
  with XAdES-BES signing and SRI integration, an LMS, and segmented email
  marketing. Python, Odoo, Postgres, Docker. Role: certificates module.
  `https://github.com/ArielParedesLozada/Odoo-DAS`
- *Junta de Agua de Santa Rosa* — deployed and in use. Electronic invoicing
  integrated with Ecuador's SRI, accounting module, multi-company support.
  NestJS, Prisma, MySQL, Docker, GitHub Actions. Role: backend lead, still
  maintaining it. `https://github.com/junta-agua-uta/ja-facturacion-back`
- *Asesor Conversacional CTT-FISEI* — hackathon project. Multi-agent
  conversational sales ecosystem for the FISEI technology transfer centre:
  a Telegram advisor over a real 21-course catalogue, per-message intent
  classification, transparent handover to a human operator via dashboard.
  TypeScript, React, Supabase, Google Gemini. Role: backend and the
  conversational agent. `https://github.com/ArielParedesLozada/mini-hackaton`

**Contact** — `johanatreidesi66@gmail.com`,
`aparedes3001@uta.edu.ec`,
`www.linkedin.com/in/ariel-paredes-lozada-377685409`.

**About** also holds the CV download and the hobbies subsection (swimming,
reading, mathematics, exercise). The CV button stays disabled with an
honest note until `assets/cv/cv-ariel-paredes-lozada.pdf` exists and
`cvAvailable` is set — a disabled button beats a 404.

**Events** becomes `/experience/#events`, currently the one hackathon.

### Details settled on the builder's behalf

A reading of this document from the implementer's chair raised six
questions it did not answer. All are settled here; none changes the shape
of the site.

- **"Entered" state.** `start` stores a flag alongside the language
  preference. A visitor who returns to `/` after entering sees the menu
  rather than the locked boot screen — re-locking a site someone has
  already explored would be hostile rather than playful.
- **The portrait.** `images/my_img.jpg` lives on `/about/`, next to the
  identity block. It is the only page where a photograph belongs, and it
  has to appear somewhere: the previous build declared it in the content
  model and then rendered it nowhere, which the final review caught.
- **`cv`.** The command navigates to `/about/#cv` rather than triggering a
  download, so it behaves the same whether or not the PDF exists yet.
- **`404.html`.** A styled page in the same terminal frame, phrased as a
  failed path lookup. Unknown URLs are the one place a visitor meets the
  site with no menu, and the default GitHub Pages 404 would break the
  illusion completely.
- **`.nojekyll`.** Committed, so Pages serves every file as-is and never
  decides on its own to hide one.
- **Generated files are committed and never hand-edited.** The six HTML
  files are build output living in git, which is what lets Pages work
  without CI. The build must be deterministic, and a hand edit to
  `about/index.html` is a change that the next build silently destroys.

### Still unknown

Rendered as visible `PLACEHOLDER_PAPU` chips: the professional objective,
the "who he is" summary, the current semester, three certificate links, the
hackathon's date and result, project screenshots, the CV PDF.

### What is removed

`js/contact.js` and the contact form markup, with their tests. The
single-page `index.html` body. The old skills grouping. The Formspree
manual step in `HANDOVER.md`.

---

## What is left to the builder

- Every CSS value not already in `css/tokens.css`; the exact glyphs of the
  fastfetch ASCII art and the window chrome.
- The template's exact substitution syntax, and the shape of
  `build-pages.mjs` beyond "template plus content modules in, six files
  out".
- Test names and file organisation, following the existing `tests/`
  pattern.
- How `check-links.mjs` walks subdirectories.
- Keyboard details of the command line: history, completion, focus.
- Whether `js/render.js` is refactored or replaced — it currently renders
  mount points for a page structure that no longer exists.
