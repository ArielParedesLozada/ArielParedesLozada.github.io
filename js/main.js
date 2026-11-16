import { initTerminal } from './terminal.js';
import { initChrome } from './chrome.js';
import { readPref } from './storage.js';
import { LANGS } from '../src/content/i18n.js';

function currentState(doc) {
  const stored = readPref('portfolio.lang');
  return {
    page: doc.body.dataset.page ?? 'boot',
    entered: readPref('portfolio.entered') === '1',
    lang: LANGS.includes(stored) ? stored : 'en',
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const state = currentState(document);
  initChrome(document, state);

  const root = document.getElementById('terminal-root');
  if (root) initTerminal(root, state);
});
