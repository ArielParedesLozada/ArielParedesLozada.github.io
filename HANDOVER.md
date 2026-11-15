# Handover notes

The portfolio has been rebuilt from scratch on branch `octavo`: vanilla
HTML/CSS/JS, no framework, no build step, content driven by
`js/content.js`, rendered by `js/render.js`, with a functional hero
terminal (`js/terminal.js`). Everything unknown is marked with the
sentinel `PLACEHOLDER_PAPU` so it can be found with `grep`.

**Note on the sentinel:** most unknowns are referenced through the
exported `PLACEHOLDER` constant in `js/content.js` rather than the raw
string repeated by hand (so a future rename only touches one line).
`grep -rn PLACEHOLDER_PAPU` will only find the constant's own definition
and the contact form's `data-endpoint` attribute. To find every unknown
field, search for the identifier instead:

```bash
grep -n '\bPLACEHOLDER\b' js/content.js
```

That currently returns 24 lines in `js/content.js`, plus one more
occurrence of the literal string in the contact form markup
(`js/render.js`, `data-endpoint="PLACEHOLDER_PAPU"`) — 25 total.

## What's missing and where

1. **Objective wording** (`js/content.js`, `profile.objective`) — shown in
   the hero and in `cat whoami`/objective section. A two-line proposal is
   left as a comment directly above the placeholder; accept it by deleting
   the comment and pasting it in, or write your own.
2. **Current semester** (`js/content.js`, `education[0].detail`) — shown
   in the Education section under the UTA entry.
3. **Galacorp: what was built, role, stack** (`js/content.js`,
   `experience[0].role` / `.summary` / `.stack`) — shown in the Companies
   group of Experience.
4. **ASSA: the projects, role, stack** (`js/content.js`,
   `experience[1].role` / `.summary` / `.stack`) — same section, ASSA
   card.
5. **JuntaAgua: exact role, period, repo URL** (`js/content.js`,
   `experience[2].role` / `.period` / the GitHub link in `.links`, and the
   matching fields on the `projects[0]` entry) — shown in the Professional
   group and in Projects.
6. **Hackathon: name, date, team, result** (`js/content.js`,
   `experience[3]` and `events[0]`) — shown in the Personal group of
   Experience and in the Events section.
7. **Which academic projects to show** (`js/content.js`, `experience[4]`)
   — shown in the Academic group; currently a single placeholder entry
   standing in for "academic projects."
8. **LinkedIn URL** (`js/content.js`, `profile.linkedin`) — shown in the
   Contact section.
9. **Project screenshots** — drop real images into `images/projects/`
   and point `projects[].image` at them in `js/content.js`; until then,
   every project card falls back to `images/projects/placeholder.svg`
   with an honest "Screenshot pending" label.
10. **CV PDF** — see manual step below.
11. **Formspree endpoint** — see manual step below.

## Gaps found while reviewing against TODO.md's OBLIGACIONES

Noted, not silently fixed:

- The TODO separately lists "proyectos personales" as both *personal
  GitHub repos in general* and *the one hackathon*. Only the hackathon
  got its own `experience`/`events` entry; there is no entry representing
  "assorted personal GitHub projects" as a group. Decide whether that
  needs its own card or whether the GitHub profile link in Contact covers
  it.
- Several `experience[]` and `projects[]` entries have `stack: []` (empty
  array) rather than a placeholder marker, because the exact technologies
  for Galacorp/ASSA/JuntaAgua/the hackathon/academic projects are unknown.
  An empty array renders as nothing rather than a visible "pending" chip
  — so those cards currently look like they have no tech stack at all
  instead of looking like unfilled information. Worth a `PLACEHOLDER`
  string in each list, or filling in the real stacks once known.

Everything else on the OBLIGACIONES list (name, objective, higher-ed-only
education, CV control, skills incl. Linux/NixOS/Claude/Opencode,
experience across all four types, projects with description/access/
images/GitHub/stack/role, hobbies, events, contact form + professional
links) has a rendered section with real or placeholder content.

## Three manual steps

1. **CV PDF.** Save the file as
   `assets/cv/cv-ariel-paredes-lozada.pdf`, then in `js/content.js` set
   `profile.cvAvailable` to `true`. The Download CV button will pick up
   the real link automatically; until then it stays a disabled button
   with an honest note instead of a 404.
2. **Formspree.** Create a form at formspree.io, then put its full
   `https://...` endpoint into the `data-endpoint` attribute of the
   contact `<form>` in `js/render.js` (`renderContact`), replacing the
   `PLACEHOLDER_PAPU` literal. While it's unconfigured, submitting the
   form shows a status message pointing at the two direct email
   addresses instead of silently failing.
3. **Project screenshots.** Add images under `images/projects/` and set
   `projects[].image` to the matching path in `js/content.js`.

## Review this before merging

Run `node --test` and `node tools/check-links.mjs` after any content
edit — the test suite and the link checker are the safety net the plan
was built around. Then review the whole site with `live-server` at both
desktop and phone widths before merging `octavo` into `main`.
