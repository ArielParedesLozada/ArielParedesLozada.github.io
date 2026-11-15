import { mountAll } from './render.js';
import { initTerminal } from './terminal.js';
import { initContact } from './contact.js';
import { initUi } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  mountAll(document);

  const terminalRoot = document.getElementById('terminal-root');
  if (terminalRoot) initTerminal(terminalRoot);

  initContact(document);
  initUi(document);
});
