import {
  profile,
  education,
  certifications,
  experience,
  projects,
  skills,
  events,
  hobbies,
  PLACEHOLDER,
} from './content.js';

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function placeholderMarkup(label) {
  return `<span class="placeholder">${escapeHtml(label)}: pending</span>`;
}

export function fieldOrPlaceholder(value, label) {
  if (value === PLACEHOLDER) return placeholderMarkup(label);
  return escapeHtml(value);
}

function renderList(items) {
  if (!items || items.length === 0) return '';
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

export function renderObjective() {
  return `<p class="objective-text">${fieldOrPlaceholder(profile.objective, 'Objective')}</p>`;
}

export function renderEducation() {
  const educationHtml = education
    .map(
      (e) => `
    <article class="card">
      <h3>${escapeHtml(e.institution)}</h3>
      <p class="card-meta">${escapeHtml(e.degree)} — ${escapeHtml(e.period)}</p>
      <p>${fieldOrPlaceholder(e.detail, 'Detail')}</p>
      ${renderList(e.achievements)}
    </article>`
    )
    .join('');

  const certsHtml = certifications
    .map(
      (c) => `<li><a href="${escapeHtml(c.url)}">${escapeHtml(c.title)}</a> — ${escapeHtml(c.issuer)}</li>`
    )
    .join('');

  return `
    <div class="education-list">${educationHtml}</div>
    <h3>Certifications</h3>
    <ul class="certifications-list">${certsHtml}</ul>
  `;
}

const EXPERIENCE_GROUPS = [
  { type: 'company', label: 'Companies' },
  { type: 'professional', label: 'Professional' },
  { type: 'academic', label: 'Academic' },
  { type: 'personal', label: 'Personal' },
];

export function renderExperience() {
  return EXPERIENCE_GROUPS.map(({ type, label }) => {
    const items = experience.filter((e) => e.type === type);
    if (items.length === 0) return '';
    const cards = items
      .map(
        (e) => `
      <article class="card timeline-item">
        <h4>${fieldOrPlaceholder(e.org, 'Organization')}</h4>
        <p class="card-meta">${fieldOrPlaceholder(e.role, 'Role')} — ${fieldOrPlaceholder(e.period, 'Period')}</p>
        <p>${fieldOrPlaceholder(e.summary, 'Summary')}</p>
        ${e.stack.length ? `<p class="stack">${e.stack.map(escapeHtml).join(', ')}</p>` : ''}
        ${e.links.length ? `<ul class="links">${e.links.map((l) => `<li>${fieldOrPlaceholder(l.url, l.label)}</li>`).join('')}</ul>` : ''}
      </article>`
      )
      .join('');
    return `<section class="experience-group"><h3>${label}</h3><div class="timeline">${cards}</div></section>`;
  }).join('');
}

export function renderProjects() {
  return `<div class="project-grid">${projects
    .map((p) => {
      const src = p.image || 'images/projects/placeholder.svg';
      const alt = escapeHtml(p.imageAlt || `${p.name} screenshot`);
      return `
      <article class="card project-card">
        <img src="${escapeHtml(src)}" alt="${alt}" loading="lazy" onerror="this.onerror=null;this.src='images/projects/placeholder.svg';this.dataset.missing='true';">
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(p.description)}</p>
        <p class="card-meta">${fieldOrPlaceholder(p.role, 'Role')}</p>
        ${p.stack.length ? `<p class="stack">${p.stack.map(escapeHtml).join(', ')}</p>` : ''}
        ${p.links.length ? `<ul class="links">${p.links.map((l) => `<li>${fieldOrPlaceholder(l.url, l.label)}</li>`).join('')}</ul>` : ''}
      </article>`;
    })
    .join('')}</div>`;
}

export function renderSkills() {
  return skills
    .map(
      (group) => `
    <div class="skill-group">
      <h3>${escapeHtml(group.group)}</h3>
      <ul class="skill-chips">
        ${group.items
          .map((item) =>
            item.icon
              ? `<li class="skill-chip"><img src="${escapeHtml(item.icon)}" alt="" loading="lazy">${escapeHtml(item.name)}</li>`
              : `<li class="skill-chip">${escapeHtml(item.name)}</li>`
          )
          .join('')}
      </ul>
    </div>`
    )
    .join('');
}

export function renderEvents() {
  const eventsHtml = events
    .map(
      (e) => `
    <article class="card">
      <h4>${fieldOrPlaceholder(e.name, 'Event name')}</h4>
      <p class="card-meta">${escapeHtml(e.kind)} — ${fieldOrPlaceholder(e.date, 'Date')}</p>
      <p>${fieldOrPlaceholder(e.detail, 'Detail')}</p>
    </article>`
    )
    .join('');

  return `
    <section class="events-block">
      <h3>Events & Hackathons</h3>
      <div class="events-list">${eventsHtml}</div>
    </section>
    <section class="hobbies-block">
      <h3>Hobbies</h3>
      <ul class="hobbies-list">${hobbies.map((h) => `<li>${escapeHtml(h)}</li>`).join('')}</ul>
    </section>
  `;
}

export function renderContact() {
  return `
    <form id="contact-form" data-endpoint="PLACEHOLDER_PAPU" novalidate>
      <p role="status" id="contact-status" aria-live="polite"></p>
      <div class="form-field">
        <label for="contact-name">Name</label>
        <input type="text" id="contact-name" name="name" required autocomplete="name">
      </div>
      <div class="form-field">
        <label for="contact-email">Email</label>
        <input type="email" id="contact-email" name="email" required autocomplete="email">
      </div>
      <div class="form-field">
        <label for="contact-message">Message</label>
        <textarea id="contact-message" name="message" required autocomplete="off"></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Send</button>
    </form>
    <ul class="contact-links">
      <li><a href="mailto:${escapeHtml(profile.email)}">${escapeHtml(profile.email)}</a></li>
      <li><a href="mailto:${escapeHtml(profile.universityEmail)}">${escapeHtml(profile.universityEmail)}</a></li>
      <li><a href="${escapeHtml(profile.github)}">GitHub</a></li>
      <li>${fieldOrPlaceholder(profile.linkedin, 'LinkedIn')}</li>
    </ul>
  `;
}

export function mountAll(doc) {
  const mounts = {
    objective: renderObjective,
    education: renderEducation,
    experience: renderExperience,
    projects: renderProjects,
    skills: renderSkills,
    events: renderEvents,
    contact: renderContact,
  };
  for (const [id, render] of Object.entries(mounts)) {
    const target = doc.querySelector(`[data-mount="${id}"]`);
    if (target) target.innerHTML = render();
  }
}
