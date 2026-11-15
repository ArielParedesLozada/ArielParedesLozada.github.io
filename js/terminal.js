import { profile, projects, skills, experience, PLACEHOLDER } from './content.js';

function pendingOr(value) {
  return value === PLACEHOLDER ? '(pending)' : value;
}

export const COMMANDS = {
  help: {
    summary: 'list available commands',
    run() {
      return {
        lines: [
          'Available commands:',
          ...Object.entries(COMMANDS).map(([name, cmd]) => `  ${name} — ${cmd.summary}`),
        ],
      };
    },
  },
  whoami: {
    summary: 'show who this portfolio belongs to',
    run() {
      return { lines: [profile.name, pendingOr(profile.headline)] };
    },
  },
  ls: {
    summary: 'list a section (try: ls projects)',
    run(args) {
      const target = args[0];
      if (target === 'projects') {
        return {
          lines: projects.map((p) => `- ${p.name}`),
          scrollTo: 'projects',
        };
      }
      if (target === 'skills') {
        return {
          lines: skills.flatMap((g) => g.items.map((i) => i.name)),
          scrollTo: 'skills',
        };
      }
      if (target === 'experience') {
        return {
          lines: experience.map((e) => `- ${pendingOr(e.org)} (${e.type})`),
          scrollTo: 'experience',
        };
      }
      return { lines: ['usage: ls <projects|skills|experience>'] };
    },
  },
  cat: {
    summary: 'read a file (try: cat cv)',
    run(args) {
      const target = args[0];
      if (target === 'cv') {
        return profile.cvAvailable
          ? { lines: [`CV available at ${profile.cvPath}`], scrollTo: 'home' }
          : { lines: ['CV is not published yet. Check back soon, or reach out directly.'] };
      }
      return { lines: ['usage: cat cv'] };
    },
  },
  skills: {
    summary: 'jump to the skills section',
    run() {
      return {
        lines: skills.flatMap((g) => g.items.map((i) => i.name)),
        scrollTo: 'skills',
      };
    },
  },
  contact: {
    summary: 'jump to the contact section',
    run() {
      return {
        lines: [pendingOr(profile.email), pendingOr(profile.universityEmail), pendingOr(profile.github)],
        scrollTo: 'contact',
      };
    },
  },
  clear: {
    summary: 'clear the terminal output',
    run() {
      return { lines: [], clear: true };
    },
  },
  neofetch: {
    summary: 'show a quick system-style summary',
    run() {
      return {
        lines: [
          `${profile.name}@portfolio`,
          '-------------------',
          `OS: NixOS-inspired portfolio`,
          `Shell: resolve()`,
          `Focus: data analysis / DevOps / systems`,
        ],
      };
    },
  },
};

export function resolve(input) {
  const trimmed = input.trim();
  if (trimmed === '') return { lines: [] };

  const [name, ...args] = trimmed.split(/\s+/);
  const command = COMMANDS[name];
  if (!command) {
    return { lines: [`command not found: ${name}`, "type 'help' for the list"] };
  }

  const result = command.run(args);
  if (result.clear) return { lines: [], clear: true };
  return { lines: result.lines, ...(result.scrollTo ? { scrollTo: result.scrollTo } : {}) };
}

export function initTerminal(root) {
  const output = root.querySelector('#terminal-output');
  const input = root.querySelector('#terminal-input');
  if (!output || !input) return;

  const history = [];
  let historyIndex = -1;

  function appendLine(text) {
    const line = document.createElement('div');
    line.appendChild(document.createTextNode(text));
    output.appendChild(line);
  }

  function runCommand(value) {
    const result = resolve(value);
    if (result.clear) {
      output.textContent = '';
      return;
    }
    for (const line of result.lines) appendLine(line);
    if (result.scrollTo) {
      const target = document.getElementById(result.scrollTo);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
    output.scrollTop = output.scrollHeight;
  }

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const value = input.value;
      appendLine(`$ ${value}`);
      runCommand(value);
      if (value.trim() !== '') {
        history.push(value);
        historyIndex = history.length;
      }
      input.value = '';
    } else if (event.key === 'ArrowUp') {
      if (historyIndex > 0) {
        historyIndex--;
        input.value = history[historyIndex];
      }
      event.preventDefault();
    } else if (event.key === 'ArrowDown') {
      if (historyIndex < history.length - 1) {
        historyIndex++;
        input.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        input.value = '';
      }
      event.preventDefault();
    } else if (event.key === 'Tab') {
      event.preventDefault();
      const [partial] = input.value.split(/\s+/);
      const match = Object.keys(COMMANDS).find((name) => name.startsWith(partial));
      if (match) input.value = match;
    }
  });

  if (window.matchMedia('(pointer: fine)').matches) {
    input.focus();
  }
}
