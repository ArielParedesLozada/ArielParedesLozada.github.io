// The command interpreter. `resolve` is pure: it takes what the visitor
// typed plus the page's context and returns a description of what should
// happen. All DOM work lives in the runtime task's wiring.

import { t } from '../src/content/i18n.js';
import { profile, skills } from '../src/content/data.js';

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
  const allowed = command && (ctx.entered || PRE_ENTRY.has(name));

  if (!allowed) {
    const echo = name.length > MAX_ECHO ? `${name.slice(0, MAX_ECHO)}…` : name;
    return {
      lines: [
        `${t('cmd.notFound', ctx.lang)} ${echo}`,
        ctx.entered ? t('cmd.notFound.hint', ctx.lang) : t('boot.nudge', ctx.lang),
      ],
    };
  }

  return command.run(args, ctx);
}
