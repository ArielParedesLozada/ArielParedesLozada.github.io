import { companies, projects, events, PLACEHOLDER } from '../content/data.js';
import { t } from '../content/i18n.js';
import {
  escapeHtml,
  label,
  labelledField,
  labelledProse,
  placeholderChip,
  isRealUrl,
} from './helpers.js';

const FALLBACK_IMAGE = 'images/projects/placeholder.svg';

function stackChips(stack, lang) {
  return stack
    .map((tech) =>
      tech === PLACEHOLDER
        ? `<li>${placeholderChip('ui.stack', lang)}</li>`
        : `<li class="chip">${escapeHtml(tech)}</li>`,
    )
    .join('\n              ');
}

function linkList(links, lang) {
  return links
    .filter((link) => isRealUrl(link.url))
    .map(
      (link) =>
        `<li><a href="${escapeHtml(link.url)}" rel="noopener" target="_blank">${label(link.labelKey, lang)}</a></li>`,
    )
    .join('\n              ');
}

function projectCard(project, lang, assetPrefix) {
  const src = `${assetPrefix}${project.image ?? FALLBACK_IMAGE}`;
  const missing = project.image ? '' : ' data-missing="true"';
  const caption = project.image
    ? ''
    : `<p class="card-meta" data-i18n="ui.screenshotPending">${escapeHtml(t('ui.screenshotPending', lang))}</p>`;

  return `        <article class="card project-card">
          <img src="${escapeHtml(src)}" alt="${escapeHtml(t(project.imageAltKey, lang))}"
               loading="lazy" width="1200" height="675"${missing}
               onerror="this.src='${assetPrefix}${FALLBACK_IMAGE}'">
          ${caption}
          <h3>${escapeHtml(project.name)}</h3>
          <p>${labelledProse('ui.summary', project.descriptionKey, lang)}</p>
          <p>${labelledProse('ui.role', project.roleKey, lang)}</p>
          <p class="field-key">${label('ui.stack', lang)}</p>
          <ul class="chips">
              ${stackChips(project.stack, lang)}
          </ul>
          <ul class="link-list">
              ${linkList(project.links, lang)}
          </ul>
        </article>`;
}

export function render(lang = 'en', assetPrefix = '') {
  const companyCards = companies
    .map(
      (c) => `        <article class="card">
          <h3>${escapeHtml(c.org)}</h3>
          <p class="card-meta">${escapeHtml(c.period)}</p>
          <p>${labelledProse('ui.role', c.roleKey, lang)}</p>
          <p>${labelledProse('ui.summary', c.summaryKey, lang)}</p>
        </article>`,
    )
    .join('\n');

  const projectCards = projects.map((p) => projectCard(p, lang, assetPrefix)).join('\n');

  const eventCards = events
    .map(
      (e) => `        <article class="card">
          <h3>${labelledProse('ui.summary', e.nameKey, lang)}</h3>
          <p class="card-meta">${labelledField('ui.date', e.date, lang)}</p>
          <p>${labelledProse('ui.result', e.resultKey, lang)}</p>
        </article>`,
    )
    .join('\n');

  return `      <section class="section" aria-labelledby="companies-heading">
        <h1 id="companies-heading" class="section-heading" data-i18n="section.companies.heading">${escapeHtml(t('section.companies.heading', lang))}</h1>
${companyCards}
      </section>

      <section class="section" id="projects" aria-labelledby="projects-heading">
        <h2 id="projects-heading" class="section-heading" data-i18n="section.projects.heading">${escapeHtml(t('section.projects.heading', lang))}</h2>
        <div class="project-grid">
${projectCards}
        </div>
      </section>

      <section class="section" id="events" aria-labelledby="events-heading">
        <h2 id="events-heading" class="section-heading" data-i18n="section.events.heading">${escapeHtml(t('section.events.heading', lang))}</h2>
${eventCards}
      </section>`;
}
