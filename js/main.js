import { mountAll } from './render.js';
import { initTerminal } from './terminal.js';
import { initContact } from './contact.js';

document.addEventListener('DOMContentLoaded', () => {
  mountAll(document);

  const terminalRoot = document.getElementById('terminal-root');
  if (terminalRoot) initTerminal(terminalRoot);

  initContact(document);

  // Task 7 (UI behaviour) wires in here.
});
