import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ATTR_RE = /\b(href|src)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;

export function collectReferences(html) {
  const refs = [];
  for (const match of html.matchAll(ATTR_RE)) {
    const kind = match[1].toLowerCase();
    const value = match[2] !== undefined ? match[2] : match[3];
    refs.push({ kind, value });
  }
  return refs;
}

export function classify(value) {
  if (value.startsWith('#')) return 'anchor';
  if (/^(mailto|tel):/i.test(value)) return 'mailto';
  if (/^https?:\/\//i.test(value)) return 'external';
  return 'local';
}

// `sourceFile` is the repo-relative page the reference was found in. A link
// like ../skills/ means something different depending on which directory it
// sits in, so it resolves against the page's own directory, not the root.
export async function checkLocal(value, rootDir, sourceFile = '') {
  const stripped = value.split('#')[0].split('?')[0];
  // A leading slash means the site's root, not the filesystem's.
  const base = stripped.startsWith('/')
    ? rootDir
    : path.resolve(rootDir, path.dirname(sourceFile));
  const resolved = path.resolve(base, `.${path.sep}${stripped.replace(/^\/+/, '')}`);
  try {
    await access(resolved);
    return { ok: true, resolved };
  } catch {
    return { ok: false, resolved };
  }
}

const SKIP_DIRS = new Set(['.git', '.superpowers', 'docs', 'node_modules', 'src']);

export async function collectHtmlFiles(rootDir, prefix = '') {
  const found = [];
  const entries = await readdir(path.join(rootDir, prefix), { withFileTypes: true });
  for (const entry of entries) {
    const rel = prefix === '' ? entry.name : `${prefix}/${entry.name}`;
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      found.push(...(await collectHtmlFiles(rootDir, rel)));
    } else if (entry.name.endsWith('.html')) {
      found.push(rel);
    }
  }
  return found.sort();
}

export function severityFor(status) {
  if (status >= 200 && status < 400) return 'ok';
  // 999 is LinkedIn's non-standard refusal of automated requests.
  if (status === 403 || status === 405 || status === 429 || status === 999) return 'warn';
  return 'error';
}

async function collectIds(html) {
  const ids = new Set();
  for (const match of html.matchAll(/\bid\s*=\s*"([^"]+)"/gi)) {
    ids.add(match[1]);
  }
  return ids;
}

async function run() {
  const rootDir = process.cwd();
  const htmlFiles = await collectHtmlFiles(rootDir);
  const sources = [
    ...htmlFiles,
    path.join('src', 'content', 'data.js'),
    path.join('src', 'content', 'i18n.js'),
  ];

  let hasError = false;
  let okCount = 0;
  let warnCount = 0;
  let errorCount = 0;

  for (const source of sources) {
    const fullPath = path.join(rootDir, source);
    let content;
    try {
      content = await readFile(fullPath, 'utf8');
    } catch {
      continue;
    }

    const refs = collectReferences(content);
    const ids = await collectIds(content);

    for (const ref of refs) {
      const kind = classify(ref.value);

      if (kind === 'mailto') continue;

      if (kind === 'anchor') {
        const targetId = ref.value.slice(1);
        if (targetId === '' || ids.has(targetId)) {
          console.log(`OK   [${source}] ${ref.value}`);
          okCount++;
        } else {
          console.log(`ERROR [${source}] ${ref.value} — no element with id="${targetId}"`);
          errorCount++;
          hasError = true;
        }
        continue;
      }

      if (kind === 'local') {
        const result = await checkLocal(ref.value, rootDir, source);
        if (result.ok) {
          console.log(`OK   [${source}] ${ref.value}`);
          okCount++;
        } else {
          console.log(`ERROR [${source}] ${ref.value} — file not found`);
          errorCount++;
          hasError = true;
        }
        continue;
      }

      // external
      let status;
      try {
        const res = await fetch(ref.value, { method: 'HEAD' });
        status = res.status;
        if (status >= 400) {
          const retry = await fetch(ref.value, { method: 'GET' });
          status = retry.status;
        }
      } catch (err) {
        console.log(`ERROR [${source}] ${ref.value} — ${err.message}`);
        errorCount++;
        hasError = true;
        continue;
      }

      const severity = severityFor(status);
      if (severity === 'ok') {
        console.log(`OK   [${source}] ${ref.value} (${status})`);
        okCount++;
      } else if (severity === 'warn') {
        console.log(`WARN [${source}] ${ref.value} (${status})`);
        warnCount++;
      } else {
        console.log(`ERROR [${source}] ${ref.value} (${status})`);
        errorCount++;
        hasError = true;
      }
    }
  }

  console.log(`\nSummary: ${okCount} ok, ${warnCount} warn, ${errorCount} error`);
  process.exit(hasError ? 1 : 0);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  run();
}
