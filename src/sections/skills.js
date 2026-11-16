import { skills } from '../content/data.js';
import { t } from '../content/i18n.js';
import { escapeHtml, label } from './helpers.js';

export function render(lang = 'en', assetPrefix = '') {
  const groups = skills
    .map((group) => {
      const items = group.items
        .map((item) => {
          const icon = item.icon
            ? `<img src="${assetPrefix}${escapeHtml(item.icon)}" alt="" width="16" height="16" loading="lazy">`
            : '';
          return `<li class="chip skill-chip">${icon}${escapeHtml(item.name)}</li>`;
        })
        .join('\n            ');

      return `        <div class="skill-group">
          <h2 data-i18n="skills.${group.id}">${escapeHtml(t(`skills.${group.id}`, lang))}</h2>
          <ul class="chips">
            ${items}
          </ul>
        </div>`;
    })
    .join('\n');

  return `      <section class="section" aria-labelledby="skills-heading">
        <h1 id="skills-heading" class="section-heading" data-i18n="section.skills.heading">${escapeHtml(t('section.skills.heading', lang))}</h1>
${groups}
      </section>`;
}
