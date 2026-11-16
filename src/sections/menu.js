import { t } from '../content/i18n.js';

export const NAV_IDS = ['about', 'skills', 'education', 'experience', 'contact'];

// Shared by the build (which writes it into every section page) and by the
// runtime (which injects it into the boot screen once the visitor has run
// `start`).
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
