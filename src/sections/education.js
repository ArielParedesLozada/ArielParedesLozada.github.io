import { education, certifications } from '../content/data.js';
import { t } from '../content/i18n.js';
import { escapeHtml, label, fieldOr, labelledField, isRealUrl, placeholderChip } from './helpers.js';

export function render(lang = 'en') {
  const uni = education
    .map((e) => {
      const achievements = e.achievementKeys
        .map((key) => `<li>${label(key, lang)}</li>`)
        .join('\n              ');
      return `        <article class="card">
          <h3>${escapeHtml(e.institution)}</h3>
          <p class="card-meta">${label(e.degreeKey, lang)} · ${escapeHtml(e.period)}</p>
          <p>${labelledField('ui.semester', e.semester, lang)}</p>
          <ul>
              ${achievements}
          </ul>
        </article>`;
    })
    .join('\n');

  // A certification whose document Ariel has not linked yet gets a chip. A
  // dead anchor is the one thing TODO.md forbids outright.
  const certs = certifications
    .map((cert) => {
      const access = isRealUrl(cert.url)
        ? `<a href="${escapeHtml(cert.url)}" rel="noopener" target="_blank">${label('ui.viewCertificate', lang)}</a>`
        : placeholderChip('ui.certificate', lang);
      return `        <li class="card">
          <h3>${label(cert.titleKey, lang)}</h3>
          <p class="card-meta">${labelledField('ui.issuer', cert.issuer, lang)}</p>
          ${access}
        </li>`;
    })
    .join('\n');

  return `      <section class="section" id="uni" aria-labelledby="uni-heading">
        <h1 id="uni-heading" class="section-heading" data-i18n="section.uni.heading">${escapeHtml(t('section.uni.heading', lang))}</h1>
${uni}
      </section>

      <section class="section" id="certs" aria-labelledby="certs-heading">
        <h2 id="certs-heading" class="section-heading" data-i18n="section.certs.heading">${escapeHtml(t('section.certs.heading', lang))}</h2>
        <ul class="card-grid">
${certs}
        </ul>
      </section>`;
}
