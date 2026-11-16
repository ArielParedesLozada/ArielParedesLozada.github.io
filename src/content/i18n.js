// All prose and UI copy, in both languages, under flat dotted keys.
// Imported by the build script (Node) and by the browser, so a string
// exists in exactly one place.
//
// Nothing here is unknown today. If something becomes unknown, the value is
// PLACEHOLDER (imported from data.js) in BOTH languages: it renders as a
// visible "pending" chip, never printed raw and never replaced with a
// plausible-sounding guess.

export const LANGS = ['en', 'es'];

export const DICT = {
  en: {
    'nav.about': 'about',
    'nav.skills': 'skills',
    'nav.education': 'education',
    'nav.experience': 'experience',
    'nav.contact': 'contact',

    'page.boot.title': 'Ariel Paredes Lozada — Portfolio',
    'page.boot.description':
      'Terminal portfolio of Ariel Paredes Lozada, software engineering student focused on data analysis, DevOps and systems.',
    'page.about.title': 'About — Ariel Paredes Lozada',
    'page.about.description': 'Who Ariel Paredes Lozada is, his professional objective, and his CV.',
    'page.skills.title': 'Skills — Ariel Paredes Lozada',
    'page.skills.description': 'Backend, frontend, database and DevOps technologies Ariel Paredes Lozada works with.',
    'page.education.title': 'Education — Ariel Paredes Lozada',
    'page.education.description': 'Higher education and certifications of Ariel Paredes Lozada.',
    'page.experience.title': 'Experience — Ariel Paredes Lozada',
    'page.experience.description': 'Internships, professional and personal projects, and event participation.',
    'page.contact.title': 'Contact — Ariel Paredes Lozada',
    'page.contact.description': 'How to reach Ariel Paredes Lozada by email or LinkedIn.',
    'page.notfound.title': 'Not found — Ariel Paredes Lozada',
    'page.notfound.description': 'That path does not exist on this site.',

    'boot.hint': "type 'start' to begin",
    'boot.nudge': "type 'start' to begin, or 'lang es' for Spanish",
    'boot.technologies': 'technologies',
    'boot.objective': 'objective',
    'boot.location': 'location',

    'cmd.notFound': 'command not found:',
    'cmd.notFound.hint': "type 'help' for the list",
    'cmd.help.header': 'Available commands:',
    'cmd.help.summary': 'list available commands',
    'cmd.clear.summary': 'clear the output',
    'cmd.lang.summary': 'switch language',
    'cmd.lang.usage': 'usage: lang <en|es>',
    'cmd.neofetch.summary': 'show a system-style summary',
    'cmd.cv.summary': 'go to the CV',
    'cmd.start.summary': 'enter the site',
    'cmd.about.summary': 'who Ariel is, and his CV',
    'cmd.about.usage': 'usage: about [cv]',
    'cmd.skills.summary': 'technologies he works with',
    'cmd.skills.usage': 'usage: skills',
    'cmd.education.summary': 'studies and certifications',
    'cmd.education.usage': 'usage: education [uni|certs]',
    'cmd.experience.summary': 'internships, projects and events',
    'cmd.experience.usage': 'usage: experience [events]',
    'cmd.contact.summary': 'how to reach him',
    'cmd.contact.usage': 'usage: contact',
    'cmd.neofetch.os': 'NixOS-inspired portfolio',
    'cmd.neofetch.shell': 'resolve()',
    'cmd.neofetch.focus': 'data analysis / DevOps / systems',

    'section.about.heading': 'about',
    'section.about.summary':
      'Software engineering student at Universidad Técnica de Ambato, building hands-on experience with deployed systems, academic platforms, and hackathon projects.',
    'section.about.objective':
      'Looking for opportunities in data analysis, DevOps, or operating systems.',
    'section.cv.heading': 'curriculum vitae',
    'section.uni.heading': 'higher education',
    'section.certs.heading': 'certifications',
    'section.companies.heading': 'companies',
    'section.projects.heading': 'projects',
    'section.events.heading': 'events',
    'section.skills.heading': 'skills',
    'section.contact.heading': 'contact',

    'education.uta.degree': 'Ingeniería de Software (Software Engineering)',
    'education.uta.achievement': 'Academic excellence recognition, September 2023 – February 2024',

    'cert.network-support': 'Network Support and Security',
    'cert.iot': 'Internet of Things',
    'cert.csei-2024': 'VI Congreso Internacional CSEI 2024',
    'cert.python-basics': 'Fundamentos de Python',
    'cert.django-web': 'Desarrollo Web con Python y Django',
    'cert.esp32': 'IoT Design & Monitoring for Energy Systems with ESP32',

    'company.galacorp.role': 'Technology assistant',
    'company.galacorp.summary': 'Built the Procoineec website.',
    'company.assa.role': 'Technology assistant',
    'company.assa.summary': 'Projects built on PowerApps. No public repository.',

    'project.procoineec.description':
      "Corporate website for Procoineec, built during the Galacorp internship. It features a modern, responsive landing page that showcases the company's services, reinforces its brand identity, and makes it easy for potential clients to get in touch.",
    'project.procoineec.role': 'Frontend developer for the Procoineec site.',
    'project.odoo-das.description':
      'E-learning platform built on Odoo 18 Community for the Academia Virtual de Tecnología, covering course e-commerce, Ecuadorian electronic invoicing with XAdES-BES signing and SRI integration, an LMS, and segmented email marketing.',
    'project.odoo-das.role': 'Developed the certificates module.',
    'project.juntagua.description':
      "Professional project, deployed and in use at the Junta de Agua de Santa Rosa. Electronic invoicing system integrated with Ecuador's SRI for authorization and submission of digital vouchers, including an accounting module and multi-company support.",
    'project.juntagua.role': 'Backend lead, and still maintaining it.',
    'project.ctt-fisei.description':
      'Hackathon project. Multi-agent conversational sales ecosystem for the FISEI technology transfer centre: a Telegram advisor over a real 21-course catalogue, per-message intent classification, and transparent handover to a human operator through a dashboard.',
    'project.ctt-fisei.role': 'Built the backend and the conversational agent.',
    'project.polizas-tungurahua.description':
      'Insurance policy management system for the Gobierno Provincial de Tungurahua. Built as coursework, but with the architecture and the containerised infrastructure a real deployment needs: a layered .NET backend, an Angular front end and a Postgres database, all reproducible from compose files.',
    'project.polizas-tungurahua.role': 'Project lead.',
    'project.gasolineras.description':
      'Distributed systems coursework: a multi-node platform for fuel stations, split into services that talk over gRPC and RabbitMQ instead of a shared database, with geospatial queries on PostGIS and horizontal sharding through Citus.',
    'project.gasolineras.role': 'Project lead.',

    'event.grok-ambato.description': 'Artificial intelligence conference, held in Ambato.',
    'event.hatunsoft.description': 'Hackathon built around a real programming case.',
    'event.csei-2024.description': 'International congress on technology and engineering.',

    'skills.backend': 'backend',
    'skills.frontend': 'frontend',
    'skills.databases': 'databases',
    'skills.devops': 'devops',


    'ui.pending': 'pending',
    'ui.stack': 'Stack',
    'ui.role': 'Role',
    'ui.period': 'Period',
    'ui.semester': 'Semester',
    'ui.date': 'Date',
    'ui.result': 'Result',
    'ui.issuer': 'Issuer',
    'ui.summary': 'Summary',
    'ui.objective': 'Objective',
    'ui.certificate': 'Certificate',
    'ui.preview': 'Preview',
    'ui.previewPending': 'Preview pending',
    'ui.logo': 'Logo',
    'ui.description': 'Description',
    'ui.liveSite': 'Live site',
    'ui.github': 'GitHub',
    'ui.viewCertificate': 'View certificate',
    'ui.downloadCv': 'Download CV',
    'ui.cvUnavailable': 'The CV is not published yet. Reach out by email and Ariel will send it.',
    'ui.menu': 'Menu',
    'ui.skipLink': 'Skip to main content',
    'ui.email': 'Email',
    'ui.universityEmail': 'University email',
    'ui.linkedin': 'LinkedIn',
    'ui.credit': 'Terminal portfolio idea credited to',
    'ui.creditTail': 'Code written from scratch.',
    'ui.noscript':
      'This page works without JavaScript, in English. The command line and the language switch need it.',
    'ui.notfoundMessage': 'No such file or directory. Use the menu above to get back.',
  },

  es: {
    'nav.about': 'acerca',
    'nav.skills': 'skills',
    'nav.education': 'educación',
    'nav.experience': 'experiencia',
    'nav.contact': 'contacto',

    'page.boot.title': 'Ariel Paredes Lozada — Portafolio',
    'page.boot.description':
      'Portafolio en forma de terminal de Ariel Paredes Lozada, estudiante de ingeniería de software enfocado en análisis de datos, DevOps y sistemas.',
    'page.about.title': 'Acerca — Ariel Paredes Lozada',
    'page.about.description': 'Quién es Ariel Paredes Lozada, su objetivo profesional y su hoja de vida.',
    'page.skills.title': 'Skills — Ariel Paredes Lozada',
    'page.skills.description':
      'Tecnologías de backend, frontend, bases de datos y DevOps con las que trabaja Ariel Paredes Lozada.',
    'page.education.title': 'Educación — Ariel Paredes Lozada',
    'page.education.description': 'Educación superior y certificaciones de Ariel Paredes Lozada.',
    'page.experience.title': 'Experiencia — Ariel Paredes Lozada',
    'page.experience.description': 'Prácticas, proyectos profesionales y personales, y participación en eventos.',
    'page.contact.title': 'Contacto — Ariel Paredes Lozada',
    'page.contact.description': 'Cómo contactar a Ariel Paredes Lozada por correo o LinkedIn.',
    'page.notfound.title': 'No encontrado — Ariel Paredes Lozada',
    'page.notfound.description': 'Esa ruta no existe en este sitio.',

    'boot.hint': "escribe 'start' para empezar",
    'boot.nudge': "escribe 'start' para empezar, o 'lang en' para inglés",
    'boot.technologies': 'tecnologías',
    'boot.objective': 'objetivo',
    'boot.location': 'ubicación',

    'cmd.notFound': 'comando no encontrado:',
    'cmd.notFound.hint': "escribe 'help' para ver la lista",
    'cmd.help.header': 'Comandos disponibles:',
    'cmd.help.summary': 'listar los comandos disponibles',
    'cmd.clear.summary': 'limpiar la salida',
    'cmd.lang.summary': 'cambiar de idioma',
    'cmd.lang.usage': 'usage: lang <en|es>',
    'cmd.neofetch.summary': 'mostrar un resumen tipo sistema',
    'cmd.cv.summary': 'ir a la hoja de vida',
    'cmd.start.summary': 'entrar al sitio',
    'cmd.about.summary': 'quién es Ariel, y su hoja de vida',
    'cmd.about.usage': 'usage: about [cv]',
    'cmd.skills.summary': 'tecnologías con las que trabaja',
    'cmd.skills.usage': 'usage: skills',
    'cmd.education.summary': 'estudios y certificaciones',
    'cmd.education.usage': 'usage: education [uni|certs]',
    'cmd.experience.summary': 'prácticas, proyectos y eventos',
    'cmd.experience.usage': 'usage: experience [events]',
    'cmd.contact.summary': 'cómo contactarlo',
    'cmd.contact.usage': 'usage: contact',
    'cmd.neofetch.os': 'portafolio inspirado en NixOS',
    'cmd.neofetch.shell': 'resolve()',
    'cmd.neofetch.focus': 'análisis de datos / DevOps / sistemas',

    'section.about.heading': 'acerca',
    'section.about.summary':
      'Estudiante de ingeniería de software en la Universidad Técnica de Ambato, con experiencia práctica en sistemas desplegados, plataformas académicas y proyectos de hackatón.',
    'section.about.objective':
      'Busca oportunidades en análisis de datos, DevOps o sistemas operativos.',
    'section.cv.heading': 'hoja de vida',
    'section.uni.heading': 'educación superior',
    'section.certs.heading': 'certificaciones',
    'section.companies.heading': 'empresas',
    'section.projects.heading': 'proyectos',
    'section.events.heading': 'eventos',
    'section.skills.heading': 'skills',
    'section.contact.heading': 'contacto',

    'education.uta.degree': 'Ingeniería de Software',
    'education.uta.achievement': 'Reconocimiento a la excelencia académica, septiembre 2023 – febrero 2024',

    'cert.network-support': 'Network Support and Security',
    'cert.iot': 'Internet of Things',
    'cert.csei-2024': 'VI Congreso Internacional CSEI 2024',
    'cert.python-basics': 'Fundamentos de Python',
    'cert.django-web': 'Desarrollo Web con Python y Django',
    'cert.esp32': 'IoT Design & Monitoring for Energy Systems with ESP32',

    'company.galacorp.role': 'Asistente de tecnología',
    'company.galacorp.summary': 'Se desarrolló la página de Procoineec.',
    'company.assa.role': 'Asistente de tecnología',
    'company.assa.summary': 'Proyectos hechos en PowerApps. Sin repositorio público.',

    'project.procoineec.description':
      'Sitio web corporativo de Procoineec, desarrollado durante las prácticas en Galacorp. Es una landing page moderna y responsiva que presenta los servicios de la empresa, refuerza su identidad de marca y facilita que un cliente potencial se ponga en contacto.',
    'project.procoineec.role': 'Desarrollador frontend del sitio de Procoineec.',
    'project.odoo-das.description':
      'Plataforma de e-learning construida sobre Odoo 18 Community para la Academia Virtual de Tecnología: comercio electrónico de cursos, facturación electrónica ecuatoriana con firma XAdES-BES e integración con el SRI, un LMS y marketing por correo segmentado.',
    'project.odoo-das.role': 'Se desarrolló el módulo de certificados.',
    'project.juntagua.description':
      'Proyecto profesional, desplegado y en uso en la Junta de Agua de Santa Rosa. Sistema de facturación electrónica integrado con el SRI del Ecuador para la autorización y el envío de comprobantes digitales, con módulo contable y soporte multiempresa.',
    'project.juntagua.role': 'Jefe de backend, y mantenimiento hasta el momento.',
    'project.ctt-fisei.description':
      'Proyecto de hackatón. Ecosistema conversacional de ventas multiagente para el centro de transferencia tecnológica de la FISEI: un asesor en Telegram sobre un catálogo real de 21 cursos, clasificación de intención por mensaje y traspaso transparente a un operador humano mediante un tablero.',
    'project.ctt-fisei.role': 'Se construyó el backend y el agente conversacional.',
    'project.polizas-tungurahua.description':
      'Sistema de gestión de pólizas para el Gobierno Provincial de Tungurahua. Nació como proyecto académico, pero con la arquitectura y la infraestructura en contenedores que exige un despliegue real: backend .NET por capas, front end en Angular y base de datos Postgres, todo reproducible desde archivos de compose.',
    'project.polizas-tungurahua.role': 'Jefe de proyecto.',
    'project.gasolineras.description':
      'Proyecto académico de aplicaciones distribuidas: una plataforma multinodo para gasolineras, repartida en servicios que se comunican por gRPC y RabbitMQ en lugar de una base compartida, con consultas geoespaciales en PostGIS y particionamiento horizontal mediante Citus.',
    'project.gasolineras.role': 'Jefe de proyecto.',

    'event.grok-ambato.description': 'Conferencia de inteligencia artificial, en Ambato.',
    'event.hatunsoft.description': 'Hackatón con un caso de programación real.',
    'event.csei-2024.description': 'Congreso internacional de tecnología e ingeniería.',

    'skills.backend': 'backend',
    'skills.frontend': 'frontend',
    'skills.databases': 'bases de datos',
    'skills.devops': 'devops',


    'ui.pending': 'pendiente',
    'ui.stack': 'Tecnologías',
    'ui.role': 'Rol',
    'ui.period': 'Periodo',
    'ui.semester': 'Semestre',
    'ui.date': 'Fecha',
    'ui.result': 'Resultado',
    'ui.issuer': 'Emisor',
    'ui.summary': 'Resumen',
    'ui.objective': 'Objetivo',
    'ui.certificate': 'Certificado',
    'ui.preview': 'Vista previa',
    'ui.previewPending': 'Vista previa pendiente',
    'ui.logo': 'Logo',
    'ui.description': 'Descripción',
    'ui.liveSite': 'Sitio en vivo',
    'ui.github': 'GitHub',
    'ui.viewCertificate': 'Ver certificado',
    'ui.downloadCv': 'Descargar hoja de vida',
    'ui.cvUnavailable': 'La hoja de vida aún no está publicada. Escríbele por correo y te la envía.',
    'ui.menu': 'Menú',
    'ui.skipLink': 'Saltar al contenido principal',
    'ui.email': 'Correo',
    'ui.universityEmail': 'Correo universitario',
    'ui.linkedin': 'LinkedIn',
    'ui.credit': 'Idea del portafolio-terminal acreditada a',
    'ui.creditTail': 'Código escrito desde cero.',
    'ui.noscript':
      'Esta página funciona sin JavaScript, en inglés. La línea de comandos y el cambio de idioma sí lo necesitan.',
    'ui.notfoundMessage': 'No existe el fichero o el directorio. Usa el menú de arriba para volver.',
  },
};

export function t(key, lang = 'en') {
  const dict = DICT[lang] ?? DICT.en;
  const value = dict[key];
  if (value === undefined) throw new Error(`missing i18n key: ${key}`);
  return value;
}
