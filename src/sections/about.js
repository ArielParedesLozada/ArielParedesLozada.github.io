import { profile, companies, education, hobbies } from '../content/data.js';
import { t } from '../content/i18n.js';
import { escapeHtml, label, proseOr } from './helpers.js';

export function render(lang = 'en', assetPrefix = '') {
  const miniExperience = companies
    .map((c) => `<li>${escapeHtml(c.org)} — ${escapeHtml(c.period)}</li>`)
    .join('\n          ');

  const miniEducation = education
    .map(
      (e) =>
        `<li>${escapeHtml(e.institution)} — ${label(e.degreeKey, lang)} (${escapeHtml(e.period)})</li>`,
    )
    .join('\n          ');

  const hobbyItems = hobbies
    .map((id) => `<li class="chip">${label(`hobby.${id}`, lang)}</li>`)
    .join('\n          ');

  // A disabled button beats a link to a PDF that is not there yet.
  const cvButton = profile.cvAvailable
    ? `<a class="btn btn-primary" id="cv-download" href="${assetPrefix}${escapeHtml(profile.cvPath)}" download>${label('ui.downloadCv', lang)}</a>`
    : `<a class="btn btn-primary" id="cv-download" aria-disabled="true" download>${label('ui.downloadCv', lang)}</a>
          <p class="cv-note" data-i18n="ui.cvUnavailable">${escapeHtml(t('ui.cvUnavailable', lang))}</p>`;

  return `      <section class="section" aria-labelledby="about-heading">
        <h1 id="about-heading" class="section-heading" data-i18n="section.about.heading">${escapeHtml(t('section.about.heading', lang))}</h1>
        <div class="about-identity">
          <img class="portrait" src="${assetPrefix}${escapeHtml(profile.photo)}"
               alt="Portrait of Ariel Paredes Lozada" width="160" height="160">
          <div>
            <p class="about-name">${escapeHtml(profile.name)}</p>
            <p class="about-summary">${proseOr('section.about.summary', 'ui.summary', lang)}</p>
            <p class="about-objective">
              <span class="field-key">${label('ui.objective', lang)}</span>
              ${proseOr('section.about.objective', 'ui.objective', lang)}
            </p>
          </div>
        </div>

        <div class="about-mini">
          <div>
            <h2 data-i18n="section.companies.heading">${escapeHtml(t('section.companies.heading', lang))}</h2>
            <ul>
          ${miniExperience}
            </ul>
          </div>
          <div>
            <h2 data-i18n="section.uni.heading">${escapeHtml(t('section.uni.heading', lang))}</h2>
            <ul>
          ${miniEducation}
            </ul>
          </div>
        </div>
      </section>

      <section class="section" id="cv" aria-labelledby="cv-heading">
        <h2 id="cv-heading" class="section-heading" data-i18n="section.cv.heading">${escapeHtml(t('section.cv.heading', lang))}</h2>
        <div class="cv-block">
          ${cvButton}
        </div>
      </section>

      <section class="section" id="hobbies" aria-labelledby="hobbies-heading">
        <h2 id="hobbies-heading" class="section-heading" data-i18n="section.hobbies.heading">${escapeHtml(t('section.hobbies.heading', lang))}</h2>
        <ul class="chips">
          ${hobbyItems}
        </ul>
      </section>`;
}
