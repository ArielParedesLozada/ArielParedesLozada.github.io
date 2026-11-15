import { mountAll } from './render.js';
import { initTerminal } from './terminal.js';

document.addEventListener('DOMContentLoaded', () => {
  mountAll(document);

  const terminalRoot = document.getElementById('terminal-root');
  if (terminalRoot) initTerminal(terminalRoot);

  // Task 6 (contact/CV), Task 7 (UI behaviour) wire in here.
});
