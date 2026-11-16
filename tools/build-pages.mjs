// Renders every page from one template plus the content modules.
// Output is committed and must never be hand-edited: the next build
// overwrites it without asking.
//
// Run: node tools/build-pages.mjs

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { t } from '../src/content/i18n.js';
import * as boot from '../src/sections/boot.js';
import * as about from '../src/sections/about.js';
import * as skills from '../src/sections/skills.js';
import * as education from '../src/sections/education.js';
import * as experience from '../src/sections/experience.js';
import * as contact from '../src/sections/contact.js';
import * as notfound from '../src/sections/notfound.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const NAV_IDS = ['about', 'skills', 'education', 'experience', 'contact'];

export const PAGES = [
  { id: 'boot', dir: '', file: 'index.html', menu: false, render: boot.render },
  { id: 'about', dir: 'about', file: 'index.html', menu: true, render: about.render },
  { id: 'skills', dir: 'skills', file: 'index.html', menu: true, render: skills.render },
  { id: 'education', dir: 'education', file: 'index.html', menu: true, render: education.render },
  { id: 'experience', dir: 'experience', file: 'index.html', menu: true, render: experience.render },
  { id: 'contact', dir: 'contact', file: 'index.html', menu: true, render: contact.render },
  { id: 'notfound', dir: '', file: '404.html', menu: true, render: notfound.render },
];

export function renderTemplate(template, vars) {
  let out = template;
  for (const [key, value] of Object.entries(vars)) {
    out = out.split(`{{${key}}}`).join(value);
  }
  const leftover = out.match(/\{\{(\w+)\}\}/);
  if (leftover) throw new Error(`unsubstituted template token: ${leftover[1]}`);
  return out;
}

export function menuMarkup(activeId, assetPrefix, lang = 'en') {
  const items = NAV_IDS.map((id) => {
    const key = `nav.${id}`;
    const current = id === activeId ? ' aria-current="page"' : '';
    return (
      `        <li><a href="${assetPrefix}${id}/" data-i18n="${key}"${current}>` +
      `${t(key, lang)}</a></li>`
    );
  }).join('\n');

  return [
    '    <nav class="site-menu" aria-label="Primary">',
    '      <ul>',
    items,
    '      </ul>',
    '    </nav>',
  ].join('\n');
}

export function pageVars(page, template, lang = 'en') {
  const assetPrefix = page.dir === '' ? '' : '../';
  const promptPath = page.dir === '' ? '~' : `~/${page.id}`;
  return {
    lang,
    pageId: page.id,
    assetPrefix,
    bodyClass: page.menu ? 'has-menu' : 'is-boot',
    title: t(`page.${page.id}.title`, lang),
    description: t(`page.${page.id}.description`, lang),
    windowTitle: `## ariel@portfolio ${promptPath}`,
    skipLink: t('ui.skipLink', lang),
    noscript: t('ui.noscript', lang),
    credit: t('ui.credit', lang),
    creditTail: t('ui.creditTail', lang),
    menu: page.menu ? menuMarkup(NAV_IDS.includes(page.id) ? page.id : null, assetPrefix, lang) : '',
    body: page.render(lang),
  };
}

async function build() {
  const template = await readFile(path.join(ROOT, 'src/templates/page.html'), 'utf8');

  for (const page of PAGES) {
    const html = renderTemplate(template, pageVars(page, template));
    const dir = path.join(ROOT, page.dir);
    if (page.dir !== '') await mkdir(dir, { recursive: true });
    const target = path.join(dir, page.file);
    await writeFile(target, html, 'utf8');
    console.log(`wrote ${path.relative(ROOT, target)}`);
  }

  // Tells GitHub Pages to serve every file as-is rather than running Jekyll.
  await writeFile(path.join(ROOT, '.nojekyll'), '', 'utf8');
  console.log('wrote .nojekyll');
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  build().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
