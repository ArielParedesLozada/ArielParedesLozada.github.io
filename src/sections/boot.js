import { profile, skills } from '../content/data.js';
import { t } from '../content/i18n.js';
import { escapeHtml, label, proseOr } from './helpers.js';

// A NixOS-flavoured snowflake, drawn so it stays legible in a monospace cell.
const ART = [
  '          ▗▄▄▄       ',
  '      ▜█▙ ▜███▙   ▟█▛',
  '       ▜███▙ ▜███▙▟█▛',
  '        ▜███▙ ▜██████▙',
  ' ▟█████████████████████▛',
  '▟███████████████████████▛',
  '       ▟██████████████▛ ',
  '      ▟███▛ ▟███▛▜███▙  ',
  '     ▟███▛▟███▛  ▜███▙  ',
  '    ▟███▛ ▜▛      ▜███▙ ',
  '   ▝▀▀▀            ▀▀▀▘ ',
];

function row(labelKey, value, lang) {
  return (
    `<div class="fetch-row">` +
    `<span class="fetch-key">${label(labelKey, lang)}</span>` +
    `<span class="fetch-value">${value}</span>` +
    `</div>`
  );
}

export function render(lang = 'en') {
  const groups = skills.map((g) => t(`skills.${g.id}`, lang)).join(' · ');

  return `      <div class="fetch">
        <pre class="fetch-art" aria-hidden="true">${escapeHtml(ART.join('\n'))}</pre>
        <div class="fetch-info">
          <p class="fetch-title">${escapeHtml(profile.name)}<span class="fetch-at">@portfolio</span></p>
          <p class="fetch-rule" aria-hidden="true">${'-'.repeat(28)}</p>
          ${row('boot.objective', proseOr('section.about.objective', 'ui.objective', lang), lang)}
          ${row('boot.location', escapeHtml(profile.location), lang)}
          ${row('boot.technologies', escapeHtml(groups), lang)}
        </div>
      </div>
      <p class="boot-hint" data-i18n="boot.hint">${escapeHtml(t('boot.hint', lang))}</p>`;
}
