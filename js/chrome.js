import { menuMarkup } from '../src/sections/menu.js';
import { applyLang } from './lang.js';
import { LANGS } from '../src/content/i18n.js';

// The boot screen ships without a menu on purpose. Someone who has already
// run `start` and comes back to / should not be locked out again, so the menu
// is injected for them here.
export function initChrome(doc, state) {
  if (LANGS.includes(state.lang) && state.lang !== 'en') {
    applyLang(doc, state.lang);
  }

  if (state.page === 'boot' && state.entered && !doc.querySelector('.site-menu')) {
    const chrome = doc.querySelector('.window-chrome');
    if (chrome) chrome.insertAdjacentHTML('afterend', menuMarkup(null, '', state.lang));
  }
}
