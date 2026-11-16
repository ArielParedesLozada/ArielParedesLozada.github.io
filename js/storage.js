// Preference storage that never throws. In private mode, or with storage
// disabled by policy, touching localStorage raises — and an exception here
// would take the command line down with it.

export function readPref(key) {
  try {
    return globalThis.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writePref(key, value) {
  try {
    globalThis.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}
