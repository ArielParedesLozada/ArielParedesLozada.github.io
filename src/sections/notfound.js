import { t } from '../content/i18n.js';
import { escapeHtml } from './helpers.js';

export function render(lang = 'en') {
  return `      <section class="section" aria-labelledby="notfound-heading">
        <h1 id="notfound-heading" class="section-heading" data-i18n="page.notfound.title">${escapeHtml(t('page.notfound.title', lang))}</h1>
        <p class="terminal-line" aria-hidden="true">$ cd ${escapeHtml('<unknown path>')}</p>
        <p data-i18n="ui.notfoundMessage">${escapeHtml(t('ui.notfoundMessage', lang))}</p>
      </section>`;
}
