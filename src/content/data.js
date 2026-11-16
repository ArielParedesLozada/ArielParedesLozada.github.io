// Language-neutral facts only. Every piece of prose lives in i18n.js and is
// referenced here by key, so a sentence exists in exactly one place.
//
// An unknown value is PLACEHOLDER, never a guess and never an empty list:
// an empty array renders as nothing, which reads as "built with no
// technologies" rather than "still pending".

export const PLACEHOLDER = 'PLACEHOLDER_PAPU';

export const profile = {
  name: 'Ariel Paredes Lozada',
  location: 'Ambato, Ecuador',
  email: 'johanatreidesi66@gmail.com',
  universityEmail: 'aparedes3001@uta.edu.ec',
  linkedin: 'https://www.linkedin.com/in/ariel-paredes-lozada-377685409',
  github: 'https://github.com/ArielParedesLozada',
  photo: 'images/my_img.jpg',
  cvPath: 'assets/cv/cv-ariel-paredes-lozada.pdf',
  cvAvailable: false,
};

export const education = [
  {
    id: 'uta',
    institution: 'Universidad Técnica de Ambato',
    degreeKey: 'education.uta.degree',
    period: '2022 — present',
    semester: PLACEHOLDER,
    achievementKeys: ['education.uta.achievement'],
  },
];

export const certifications = [
  { id: 'network-support', titleKey: 'cert.network-support', issuer: 'Cisco Networking Academy', url: PLACEHOLDER },
  {
    id: 'iot',
    titleKey: 'cert.iot',
    issuer: 'Cisco Networking Academy',
    url: 'https://drive.google.com/file/d/1A3UR8xqxwFKHUbnLmWi-nqWhFtsWoNCH/view?usp=drive_link',
  },
  { id: 'csei-2024', titleKey: 'cert.csei-2024', issuer: 'Universidad Técnica de Ambato', url: PLACEHOLDER },
  {
    id: 'python-basics',
    titleKey: 'cert.python-basics',
    issuer: 'Cisco-FISEI',
    url: 'https://drive.google.com/file/d/1g9zp9OHS-JB7UTB1fk4sPmgb817q-Ygd/view?usp=drive_link',
  },
  {
    id: 'django-web',
    titleKey: 'cert.django-web',
    issuer: 'Universidad Técnica de Ambato',
    url: 'https://drive.google.com/file/d/1boMu6_79RG7XmIyXS4iV47I9eefMN2r6/view?usp=drive_link',
  },
  { id: 'esp32', titleKey: 'cert.esp32', issuer: PLACEHOLDER, url: PLACEHOLDER },
];

export const companies = [
  {
    id: 'galacorp',
    org: 'Galacorp',
    period: 'June 2025 — August 2025',
    roleKey: 'company.galacorp.role',
    summaryKey: 'company.galacorp.summary',
  },
  {
    id: 'assa',
    org: 'ASSA',
    period: 'June 2026 — August 2026',
    roleKey: 'company.assa.role',
    summaryKey: 'company.assa.summary',
  },
];

export const projects = [
  {
    id: 'procoineec',
    name: 'Procoineec',
    descriptionKey: 'project.procoineec.description',
    roleKey: 'project.procoineec.role',
    stack: [PLACEHOLDER],
    image: null,
    imageAltKey: 'project.procoineec.imageAlt',
    links: [{ labelKey: 'ui.liveSite', url: 'https://procoineec.com/' }],
  },
  {
    id: 'odoo-das',
    name: 'Odoo-DAS',
    descriptionKey: 'project.odoo-das.description',
    roleKey: 'project.odoo-das.role',
    stack: ['Python', 'Odoo', 'Postgres', 'Docker'],
    image: null,
    imageAltKey: 'project.odoo-das.imageAlt',
    links: [{ labelKey: 'ui.github', url: 'https://github.com/ArielParedesLozada/Odoo-DAS' }],
  },
  {
    id: 'juntagua',
    name: 'Junta de Agua de Santa Rosa',
    descriptionKey: 'project.juntagua.description',
    roleKey: 'project.juntagua.role',
    stack: ['NestJS', 'Prisma', 'MySQL', 'Docker', 'GitHub Actions'],
    image: null,
    imageAltKey: 'project.juntagua.imageAlt',
    links: [
      {
        labelKey: 'ui.liveSite',
        url: 'https://juntagua--prod-ja-facturacion-front--7hvtmf7r9vh5.code.run/login',
      },
      { labelKey: 'ui.github', url: 'https://github.com/junta-agua-uta/ja-facturacion-back' },
    ],
  },
  {
    id: 'ctt-fisei',
    name: 'Asesor Conversacional CTT-FISEI',
    descriptionKey: 'project.ctt-fisei.description',
    roleKey: 'project.ctt-fisei.role',
    stack: ['TypeScript', 'React', 'Supabase', 'Google Gemini'],
    image: null,
    imageAltKey: 'project.ctt-fisei.imageAlt',
    links: [{ labelKey: 'ui.github', url: 'https://github.com/ArielParedesLozada/mini-hackaton' }],
  },
];

export const skills = [
  {
    id: 'backend',
    items: [
      { name: 'Spring Boot', icon: null },
      { name: '.NET', icon: null },
      { name: 'Django', icon: 'images/tech/django.svg' },
      { name: 'Laravel', icon: 'images/tech/laravel.svg' },
    ],
  },
  {
    id: 'frontend',
    items: [
      { name: 'React', icon: null },
      { name: 'Angular', icon: null },
      { name: 'Flutter', icon: null },
    ],
  },
  {
    id: 'databases',
    items: [
      { name: 'Postgres', icon: null },
      { name: 'MySQL', icon: null },
      { name: 'Oracle', icon: null },
    ],
  },
  {
    id: 'devops',
    items: [
      { name: 'Docker', icon: null },
      { name: 'GitHub Actions', icon: null },
      { name: 'Linux', icon: 'images/tech/linux.svg' },
    ],
  },
];

export const events = [
  {
    id: 'ctt-fisei-hackathon',
    nameKey: 'event.ctt-fisei.name',
    kind: 'hackathon',
    date: PLACEHOLDER,
    resultKey: 'event.ctt-fisei.result',
  },
];

export const hobbies = ['swimming', 'reading', 'mathematics', 'exercise'];
