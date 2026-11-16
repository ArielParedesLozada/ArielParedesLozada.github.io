import { PLACEHOLDER } from '../content/data.js';
import { t } from '../content/i18n.js';

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// The label is an i18n KEY, not literal text, so the chip's two halves each
// carry their own data-i18n and translate with the rest of the page when the
// visitor runs `lang es`.
export function placeholderChip(labelKey, lang = 'en') {
  return (
    `<span class="placeholder">` +
    `<span data-i18n="${escapeHtml(labelKey)}">${escapeHtml(t(labelKey, lang))}</span>: ` +
    `<span data-i18n="ui.pending">${escapeHtml(t('ui.pending', lang))}</span>` +
    `</span>`
  );
}

export function fieldOr(value, labelKey, lang = 'en') {
  if (value === PLACEHOLDER || value === undefined || value === null) {
    return placeholderChip(labelKey, lang);
  }
  return escapeHtml(value);
}

// Prose from the dictionary: tagged for the runtime swap, or a chip when
// Ariel has not supplied the wording yet.
export function proseOr(key, labelKey, lang = 'en') {
  const value = t(key, lang);
  if (value === PLACEHOLDER) return placeholderChip(labelKey, lang);
  return `<span data-i18n="${escapeHtml(key)}">${escapeHtml(value)}</span>`;
}

export function label(key, lang = 'en') {
  return `<span data-i18n="${escapeHtml(key)}">${escapeHtml(t(key, lang))}</span>`;
}

export function isRealUrl(value) {
  return typeof value === 'string' && /^https?:\/\//.test(value);
}
