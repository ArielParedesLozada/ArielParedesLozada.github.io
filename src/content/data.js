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
  cvPath: 'assets/cv/CV.pdf',
  // What the visitor's download lands as: "CV.pdf" in a Downloads folder
  // tells them nothing a week later.
  cvFileName: 'cv-ariel-paredes-lozada.pdf',
  cvAvailable: true,
};

export const education = [
  {
    id: 'uta',
    institution: 'Universidad Técnica de Ambato',
    degreeKey: 'education.uta.degree',
    period: '2022 — present',
    semester: '8',
    achievementKeys: ['education.uta.achievement'],
  },
];

// `preview` is the scan of the certificate itself, shown on the card. null
// means Ariel has not uploaded it yet and the shared placeholder stands in;
// drop a file under images/certs/ and point at it to replace the frame.
export const certifications = [
  {
    id: 'network-support',
    titleKey: 'cert.network-support',
    issuer: 'Cisco Networking Academy',
    url: 'https://drive.google.com/file/d/1JfrHNirzeoLlVGUAr2k6GCqBo9tD7Hjn/view?usp=sharing',
    preview: 'images/certifications/netwroks.cisco.png',
  },
  {
    id: 'iot',
    titleKey: 'cert.iot',
    issuer: 'Cisco Networking Academy',
    url: 'https://drive.google.com/file/d/1mHb6GhXfCslmSznXSZT_vo_LbXS4XyMX/view?usp=sharing',
    preview: 'images/certifications/iot.cisco.png',
  },
  {
    id: 'csei-2024',
    titleKey: 'cert.csei-2024',
    issuer: 'Universidad Técnica de Ambato',
    url: 'https://drive.google.com/file/d/1om1Ct3Sw34PqB0sQecj59kmFPfEQjRQd/view?usp=drive_link',
    preview: 'images/certifications/csei.uta.png',
  },
  {
    id: 'python-basics',
    titleKey: 'cert.python-basics',
    issuer: 'Cisco-FISEI',
    url: 'https://drive.google.com/file/d/1Mar8LBZYlgAvHZ2wDe__rmMQxNMFMJ5T/view?usp=sharing',
    preview: 'images/certifications/python.uta.png',
  },
  {
    id: 'django-web',
    titleKey: 'cert.django-web',
    issuer: 'Universidad Técnica de Ambato',
    url: 'https://drive.google.com/file/d/1UP1PiMQif8atrE6UWepIZAZlAgZ3yiOF/view?usp=sharing',
    preview: 'images/certifications/django.uta.png',
  },
  {
    id: 'esp32',
    titleKey: 'cert.esp32',
    issuer: 'Universidad Técnica de Ambato',
    url: 'https://drive.google.com/file/d/1c_TS_clx8Iz4KsXlfUifzMge0rp11ppN/view?usp=sharing',
    preview: 'images/certifications/esp32.uta.png',
  },
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

// Projects carry no screenshot: the cards are read for their prose, and an
// empty frame on every one of them said less than nothing.
export const projects = [
  {
    id: 'procoineec',
    name: 'Procoineec',
    descriptionKey: 'project.procoineec.description',
    roleKey: 'project.procoineec.role',
    stack: ['React', 'Vite'],
    links: [{ labelKey: 'ui.liveSite', url: 'https://procoineec.com/' }],
  },
  {
    id: 'odoo-das',
    name: 'Odoo-DAS',
    descriptionKey: 'project.odoo-das.description',
    roleKey: 'project.odoo-das.role',
    stack: ['Python', 'Odoo', 'Postgres', 'Docker'],
    links: [{ labelKey: 'ui.github', url: 'https://github.com/ArielParedesLozada/Odoo-DAS' }],
  },
  {
    id: 'juntagua',
    name: 'Junta de Agua de Santa Rosa',
    descriptionKey: 'project.juntagua.description',
    roleKey: 'project.juntagua.role',
    stack: ['NestJS', 'Prisma', 'MySQL', 'Docker', 'GitHub Actions'],
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
    links: [{ labelKey: 'ui.github', url: 'https://github.com/ArielParedesLozada/mini-hackaton' }],
  },
  {
    id: 'polizas-tungurahua',
    name: 'Gestión de Pólizas — Tungurahua',
    descriptionKey: 'project.polizas-tungurahua.description',
    roleKey: 'project.polizas-tungurahua.role',
    stack: ['.NET', 'Angular', 'Postgres', 'Docker'],
    links: [
      { labelKey: 'ui.github', url: 'https://github.com/ArielParedesLozada/Proyecto-Gestion-7ASW' },
    ],
  },
  {
    id: 'gasolineras',
    name: 'Sistema Distribuido para Gasolineras',
    descriptionKey: 'project.gasolineras.description',
    roleKey: 'project.gasolineras.role',
    stack: ['.NET', 'Express', 'RabbitMQ', 'gRPC', 'React', 'PostGIS', 'Citus'],
    links: [
      {
        labelKey: 'ui.github',
        url: 'https://github.com/ArielParedesLozada/Proyecto-Final-Distribuidas',
      },
    ],
  },
];

export const skills = [
  {
    id: 'backend',
    items: [
      { name: 'Spring Boot', icon: 'images/tech/springboot.svg' },
      { name: '.NET', icon: 'images/tech/dotnet.svg' },
      { name: 'Django', icon: 'images/tech/django.svg' },
      { name: 'Laravel', icon: 'images/tech/laravel.svg' },
    ],
  },
  {
    id: 'frontend',
    items: [
      { name: 'React', icon: 'images/tech/react.svg' },
      { name: 'Angular', icon: 'images/tech/angular.svg' },
      { name: 'Flutter', icon: 'images/tech/flutter.svg' },
    ],
  },
  {
    id: 'databases',
    items: [
      { name: 'Postgres', icon: 'images/tech/postgres.svg' },
      { name: 'MySQL', icon: 'images/tech/mysql.svg' },
      { name: 'Oracle', icon: 'images/tech/oracle.svg' },
    ],
  },
  {
    id: 'devops',
    items: [
      { name: 'Docker', icon: 'images/tech/docker.svg' },
      { name: 'GitHub Actions', icon: 'images/tech/githubactions.svg' },
      { name: 'Linux', icon: 'images/tech/linux.svg' },
    ],
  },
];

// `logo` works like a certificate preview: null falls back to the shared
// placeholder until the real mark lands under images/events/.
export const events = [
  {
    id: 'grok-ambato',
    name: 'Grok Bot Ambato Meetup',
    date: '2026',
    descriptionKey: 'event.grok-ambato.description',
    logo: 'images/events/grok.webp',
  },
  {
    id: 'hatunsoft',
    name: 'Hatunsoft',
    date: '2025',
    descriptionKey: 'event.hatunsoft.description',
    logo: 'images/events/hatunsoft.webp',
  },
  {
    id: 'csei-2024',
    name: 'CSEI 2024',
    date: '2024',
    descriptionKey: 'event.csei-2024.description',
    logo: 'images/events/csei.webp',
  },
];
