// The command interpreter. `resolve` is pure: it takes what the visitor
// typed plus the page's context and returns a description of what should
// happen. All DOM work lives in the runtime task's wiring.

import { t } from '../src/content/i18n.js';
import { profile, skills } from '../src/content/data.js';
import { applyLang } from './lang.js';
import { writePref } from './storage.js';

const MAX_ECHO = 40;

// Subsections are anchors on their section's page.
const SECTIONS = {
  about: ['hobbies', 'cv'],
  skills: [],
  education: ['uni', 'certs'],
  experience: ['events'],
  contact: [],
};

// Before `start`, only these work. `lang` is exempt on purpose: a visitor who
// reads only Spanish would otherwise be held behind an English boot screen,
// which is a barrier rather than theatre.
const PRE_ENTRY = new Set(['start', 'lang']);

function sectionCommand(id) {
  return {
    summaryKey: `cmd.${id}.summary`,
    run(args, ctx) {
      if (args.length === 0) return { lines: [], navigate: `/${id}/` };
      if (args.length === 1 && SECTIONS[id].includes(args[0])) {
        return { lines: [], navigate: `/${id}/#${args[0]}` };
      }
      return { lines: [t(`cmd.${id}.usage`, ctx.lang)] };
    },
  };
}

export const COMMANDS = {
  start: {
    summaryKey: 'cmd.start.summary',
    run() {
      return { lines: [], navigate: '/about/', enter: true };
    },
  },
  help: {
    summaryKey: 'cmd.help.summary',
    run(args, ctx) {
      return {
        lines: [
          t('cmd.help.header', ctx.lang),
          ...Object.entries(COMMANDS).map(
            ([name, cmd]) => `  ${name} — ${t(cmd.summaryKey, ctx.lang)}`,
          ),
        ],
      };
    },
  },
  clear: {
    summaryKey: 'cmd.clear.summary',
    run() {
      return { lines: [], clear: true };
    },
  },
  lang: {
    summaryKey: 'cmd.lang.summary',
    run(args, ctx) {
      const usage = { lines: [t('cmd.lang.usage', ctx.lang)] };
      if (args.length !== 1) return usage;
      if (args[0] !== 'en' && args[0] !== 'es') return usage;
      return { lines: [], setLang: args[0] };
    },
  },
  neofetch: {
    summaryKey: 'cmd.neofetch.summary',
    run(args, ctx) {
      return {
        lines: [
          `${profile.name}@portfolio`,
          '-------------------',
          `OS: ${t('cmd.neofetch.os', ctx.lang)}`,
          `Shell: ${t('cmd.neofetch.shell', ctx.lang)}`,
          `Focus: ${t('cmd.neofetch.focus', ctx.lang)}`,
          `Stack: ${skills.map((g) => t(`skills.${g.id}`, ctx.lang)).join(' / ')}`,
          `Location: ${profile.location}`,
        ],
      };
    },
  },
  cv: {
    summaryKey: 'cmd.cv.summary',
    run() {
      return { lines: [], navigate: '/about/#cv' };
    },
  },
  about: sectionCommand('about'),
  skills: sectionCommand('skills'),
  education: sectionCommand('education'),
  experience: sectionCommand('experience'),
  contact: sectionCommand('contact'),
};

export function resolve(input, context) {
  const ctx = { page: 'boot', entered: false, lang: 'en', ...context };
  const trimmed = String(input).trim();
  if (trimmed === '') return { lines: [] };

  const [name, ...args] = trimmed.split(/\s+/);
  const command = COMMANDS[name];
  // The gate is theatre on the boot screen only. Someone who followed a
  // shared link into a section is already reading the site.
  const entered = ctx.entered || ctx.page !== 'boot';
  const allowed = command && (entered || PRE_ENTRY.has(name));

  if (!allowed) {
    const echo = name.length > MAX_ECHO ? `${name.slice(0, MAX_ECHO)}…` : name;
    return {
      lines: [
        `${t('cmd.notFound', ctx.lang)} ${echo}`,
        entered ? t('cmd.notFound.hint', ctx.lang) : t('boot.nudge', ctx.lang),
      ],
    };
  }

  return command.run(args, ctx);
}

export function initTerminal(root, context) {
  const output = root.querySelector('#terminal-output');
  const input = root.querySelector('#terminal-input');
  if (!output || !input) return;

  const ctx = { ...context };
  const history = [];
  let historyIndex = 0;

  // Text nodes only: the echoed line contains whatever the visitor typed.
  function appendLine(text) {
    const line = document.createElement('div');
    line.appendChild(document.createTextNode(text));
    output.appendChild(line);
  }

  function act(result) {
    if (result.clear) {
      output.textContent = '';
      return;
    }
    for (const line of result.lines) appendLine(line);

    if (result.setLang) {
      applyLang(document, result.setLang);
      writePref('portfolio.lang', result.setLang);
      ctx.lang = result.setLang;
    }

    if (result.enter) {
      writePref('portfolio.entered', '1');
      ctx.entered = true;
    }

    // Root-relative: this is a GitHub user site served at the domain root.
    if (result.navigate) window.location.assign(result.navigate);

    output.scrollTop = output.scrollHeight;
  }

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const value = input.value;
      appendLine(`$ ${value}`);
      act(resolve(value, ctx));
      if (value.trim() !== '') history.push(value);
      historyIndex = history.length;
      input.value = '';
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = history[historyIndex];
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        input.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        input.value = '';
      }
    } else if (event.key === 'Tab') {
      event.preventDefault();
      const [partial] = input.value.split(/\s+/);
      const match = Object.keys(COMMANDS).find((name) => name.startsWith(partial));
      if (match) input.value = match;
    }
  });

  if (window.matchMedia('(pointer: fine)').matches) input.focus();
}
