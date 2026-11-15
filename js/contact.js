import { profile } from './content.js';

export function isConfigured(endpoint) {
  return /^https:\/\//.test(endpoint);
}

export function cvState(profile) {
  if (profile.cvAvailable) {
    return { available: true, href: profile.cvPath, label: 'Download CV', note: null };
  }
  return {
    available: false,
    href: null,
    label: 'CV not published yet',
    note: 'The CV is not published yet. Reach out directly by email in the meantime.',
  };
}

export function initContact(doc) {
  const cvControl = doc.getElementById('cv-download');
  if (cvControl) {
    const state = cvState(profile);
    if (state.available) {
      cvControl.href = state.href;
      cvControl.removeAttribute('aria-disabled');
      cvControl.textContent = state.label;
    } else {
      cvControl.removeAttribute('href');
      cvControl.setAttribute('aria-disabled', 'true');
      cvControl.textContent = state.label;
      const note = doc.createElement('p');
      note.className = 'cv-note';
      note.textContent = state.note;
      cvControl.insertAdjacentElement('afterend', note);
    }
  }

  const form = doc.getElementById('contact-form');
  const status = doc.getElementById('contact-status');
  if (!form) return;

  const endpoint = form.dataset.endpoint || '';
  if (isConfigured(endpoint)) {
    form.action = endpoint;
    form.method = 'POST';
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (status) {
      status.textContent =
        'The contact form is not wired up yet. Email directly instead: ' +
        'mateoparedeskt1800@gmail.com or aparedes3001@uta.edu.ec.';
    }
  });
}
