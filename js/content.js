export const PLACEHOLDER = 'PLACEHOLDER_PAPU';

export const profile = {
  name: 'Ariel Paredes Lozada',
  headline: 'Software engineering student — data analysis, DevOps, systems',
  // Proposed two-line draft (accept by deleting the PLACEHOLDER line below):
  // Software engineering student aiming for roles in data analysis, DevOps,
  // or operating systems, with a hands-on interest in Linux-based tooling.
  objective: PLACEHOLDER,
  location: 'Ambato, Ecuador',
  email: 'mateoparedeskt1800@gmail.com',
  universityEmail: 'aparedes3001@uta.edu.ec',
  github: 'https://github.com/ArielParedesLozada',
  linkedin: PLACEHOLDER,
  cvPath: 'assets/cv/cv-ariel-paredes-lozada.pdf',
  cvAvailable: false,
  photo: 'images/my_img.jpg',
};

export const education = [
  {
    institution: 'Universidad Técnica de Ambato',
    degree: 'Ingeniería de Software (Software Engineering)',
    period: '2022 — present',
    detail: PLACEHOLDER, // current semester
    achievements: ['Academic excellence recognition, September 2023 – February 2024'],
  },
];

export const certifications = [
  {
    title: 'Django',
    issuer: 'Universidad Técnica de Ambato',
    url: 'https://drive.google.com/file/d/1boMu6_79RG7XmIyXS4iV47I9eefMN2r6/view?usp=drive_link',
  },
  {
    title: 'Python básico',
    issuer: 'Cisco-FISEI',
    url: 'https://drive.google.com/file/d/1g9zp9OHS-JB7UTB1fk4sPmgb817q-Ygd/view?usp=drive_link',
  },
  {
    title: 'Introducción a IoT',
    issuer: 'Cisco Networking Academy',
    url: 'https://drive.google.com/file/d/1A3UR8xqxwFKHUbnLmWi-nqWhFtsWoNCH/view?usp=drive_link',
  },
];

export const experience = [
  {
    type: 'company',
    org: 'Galacorp',
    role: PLACEHOLDER,
    period: 'June 2025 — August 2025',
    summary: PLACEHOLDER,
    stack: [],
    links: [],
  },
  {
    type: 'company',
    org: 'ASSA',
    role: PLACEHOLDER,
    period: 'June 2026 — August 2026',
    summary: PLACEHOLDER,
    stack: [],
    links: [],
  },
  {
    type: 'professional',
    org: 'Junta de Agua de Santa Rosa',
    role: PLACEHOLDER,
    period: PLACEHOLDER,
    summary: 'Billing/invoicing system (facturación).',
    stack: [],
    links: [
      { label: 'Live site', url: 'https://juntagua--prod-ja-facturacion-front--7hvtmf7r9vh5.code.run/login' },
      { label: 'GitHub', url: PLACEHOLDER },
    ],
  },
  {
    type: 'personal',
    org: PLACEHOLDER, // hackathon name
    role: PLACEHOLDER,
    period: PLACEHOLDER,
    summary: PLACEHOLDER,
    stack: [],
    links: [],
  },
  {
    type: 'academic',
    org: 'Universidad Técnica de Ambato coursework',
    role: PLACEHOLDER, // which academic projects to show
    period: PLACEHOLDER,
    summary: PLACEHOLDER,
    stack: [],
    links: [],
  },
];

export const projects = [
  {
    name: 'Junta de Agua de Santa Rosa — Facturación',
    description: 'Billing/invoicing system for a local water board, in production.',
    role: PLACEHOLDER,
    stack: [],
    image: null,
    imageAlt: 'Screenshot of the JuntaAgua billing system',
    links: [
      { label: 'Live site', url: 'https://juntagua--prod-ja-facturacion-front--7hvtmf7r9vh5.code.run/login' },
      { label: 'GitHub', url: PLACEHOLDER },
    ],
    tags: ['professional'],
  },
];

export const skills = [
  {
    group: 'Languages',
    items: [
      { name: 'Python', icon: 'images/tech/python.svg' },
      { name: 'Java', icon: 'images/tech/java.svg' },
      { name: 'C', icon: 'images/tech/c.svg' },
      { name: 'SQL', icon: null },
      { name: 'JavaScript', icon: 'images/tech/javascript.svg' },
      { name: 'HTML', icon: 'images/tech/html5.svg' },
      { name: 'CSS', icon: 'images/tech/css3.svg' },
    ],
  },
  {
    group: 'Frameworks & Platforms',
    items: [
      { name: 'Django', icon: 'images/tech/django.svg' },
      { name: 'Laravel', icon: 'images/tech/laravel.svg' },
      { name: 'Bootstrap', icon: 'images/tech/bootstrap.svg' },
      { name: 'Oracle', icon: null },
    ],
  },
  {
    group: 'Tools & Systems',
    items: [
      { name: 'Git', icon: 'images/tech/git.svg' },
      { name: 'GitLab', icon: 'images/tech/gitlab.svg' },
      { name: 'GitHub', icon: 'images/tech/github.svg' },
      { name: 'Linux', icon: 'images/tech/linux.svg' },
      { name: 'NixOS', icon: 'images/tech/nixos.svg' },
      { name: 'VS Code', icon: 'images/tech/vscode.svg' },
      { name: 'Claude', icon: null },
      { name: 'Opencode', icon: null },
    ],
  },
];

export const events = [
  {
    name: PLACEHOLDER, // hackathon name
    kind: 'hackathon',
    date: PLACEHOLDER,
    detail: PLACEHOLDER,
  },
];

export const hobbies = ['Swimming', 'Reading', 'Mathematics', 'Exercise'];
