import { profile } from '../content/data.js';
import { t } from '../content/i18n.js';
import { escapeHtml, label } from './helpers.js';

// No form. Ariel withdrew it; direct addresses only until something better
// takes its place.
export function render(lang = 'en') {
  const entries = [
    { labelKey: 'ui.email', href: `mailto:${profile.email}`, text: profile.email, external: false },
    {
      labelKey: 'ui.universityEmail',
      href: `mailto:${profile.universityEmail}`,
      text: profile.universityEmail,
      external: false,
    },
    { labelKey: 'ui.linkedin', href: profile.linkedin, text: profile.linkedin, external: true },
    { labelKey: 'ui.github', href: profile.github, text: profile.github, external: true },
  ];

  const items = entries
    .map((e) => {
      const rel = e.external ? ' rel="noopener" target="_blank"' : '';
      return `          <li>
            <span class="field-key">${label(e.labelKey, lang)}</span>
            <a href="${escapeHtml(e.href)}"${rel}>${escapeHtml(e.text)}</a>
          </li>`;
    })
    .join('\n');

  return `      <section class="section" aria-labelledby="contact-heading">
        <h1 id="contact-heading" class="section-heading" data-i18n="section.contact.heading">${escapeHtml(t('section.contact.heading', lang))}</h1>
        <ul class="link-list contact-list">
${items}
        </ul>
      </section>`;
}
