# COSAS QUE HACER

Las cosas que hay que mejorar en este portafolio web

## ESTADO (2026-11-15)

Reconstruido en la rama `octavo` como **sitio multipagina generado**: seis
paginas reales (`/`, `/about/`, `/skills/`, `/education/`, `/experience/`,
`/contact/`) mas `404.html`, generadas por `node tools/build-pages.mjs`
desde una sola plantilla. La terminal es el mecanismo de navegacion y esta
fija al pie de cada pagina. Idioma conmutable en el cliente con
`lang es` / `lang en`. Sin framework, sin dependencias, sin `package.json`.

Ya no hay formulario de contacto. Los hobbies viven en `/about/#hobbies` y
los eventos en `/experience/#events`.

Ver `HANDOVER.md` para: como funciona el build, las 11 cosas que faltan
llenar con su archivo y campo exactos, los dos pasos manuales (PDF del CV y
los tres links de certificacion) y las decisiones que quizas quieras
revisar. Pendiente: revisar con `live-server` y mergear a `main`.

## CONTEXTO

Este es el portafolio web de Ariel Paredes Lozada. Actualmente, esta en alojado con `Github pages`,  y es hipersimple.

Se debe mejorar esta cosa porque es bastante feo, y no cumple las cosas necesarias.

## OBLIGACIONES

El portafolio debe tener las siguientes secciones obligatorias:
- Nombre: Ariel Paredes Lozada
- Objetivo profesional: lo que se busca hacer con el trabajo, o el puesto que se busca (el puesto seria analisis de datos o DevOps o algo con sistemas operativos)
- Educacion superior: La educacion mia, solo la educacion superior
- Hoja de vida: Solo seria una forma de descargar el PDF. Ya subo ese PDF
- Habilidades que se dominan: las habilidades que se mostraron + Linux + NixOs + Claude + Opencode + ...
- Experiencia: Se incluyen empresas, proyectos personales, profesionales y de clientes. *Empresas*: Se han hecho practicas en Galacorp (de junio a agosto 2025), y en ASSA (de junio a agosto 2026), donde se hicieron un par de proyectos. *Proyectos personales*: La basura que sale en GitHub, y proyectos ed hackatones (solo hay uno). *Proyectos profesionales*: Se hicieron unas cosas en el proyecto de JuntaAgua ed Santa Rosa (que se puede ver en GitHub y que esta desplegado en `https://juntagua--prod-ja-facturacion-front--7hvtmf7r9vh5.code.run/login`), y se han hecho proyectos academicos
- Contacto: un formulario de contacto, redes sociales profesionales (las que se ven actualmente)

### PROYECTOS

Los proyectos deben tener: descripcion, acceso + imagenes (en caso de ser posible), acceso a GitHub (en caso de ser publico), tecnologias usadas, rol en el sistema. Mucho mejor si los proyectos estan documentados (tienen un README bonito)

### HOBBIES Y PARTICIPACIONES EN EVENTOS

Debe tener las participaciones en eventos, hackatones, etc.

## PLANTILLA
 
Como propuesta, se puede utilizar la plantilla de `https://github.com/ashutosh1919/masterPortfolio`, para el portafolio digital

## IMAGENES Y LINKS

> Es muy importante que NO EXISTAN ENLACES ROTOS 

## TOQUE """PERSONAL"""

<!-- Seamos francos, esto no es nada personal y solo lo hizo la IA. Muchas gracias Claude ;) -->

Se puede dar una estetica de NixOs/Linux a esta cosa para que se vea bonita. Solo como recomendacion

## MAS PLANTILLAS

**Plantillas de gente que conozco**:
> https://github.com/Elkinnn/Elkinnn.github.io.git: Solo para ver las secciones
> https://github.com/Diego200509/diego200509.github.io.git: Se ve bonito y es muy creativo
> https://github.com/DavidJosueP2/Personal-Portfolio.git: Solo para inspiracion de secciones
> https://github.com/DaGeus15/DaGeus15.github.io.git: Tambien para ver cuestiones monas
> https://github.com/s4sahiko/tportfolio.git: Linux-like portfolio. Un portafolio que emula una terminal, y que tiene algo bastante bonito. Se puede copiar bastante de esta cosa, dando creditos evidentemente

## CORRECCIONES Y RECOMENDACIONES

### ESTETICA COMUN

Todas las partes deben tener la estetica de una terminal de Linux o algo similar. Los elementos graficos se ven como si fueran una terminal de Linux, pero no es solo texto plano. En la parte inferior, sigue habiendo una linea de comandos para la navegacion, en donde se ponen los comandos de navegacion

- *Funcionamiento de la consola*: Es una especie de consola que permite navegar entre las distintas secciones. Es su funcion principal

- La pagina inicial debe consistir en una terminal, que lo primero que muestre es una cosa tipo fastfetch, que muestre el nombre, objetivo profesional y tecnologias que se pueden usar, y una hint para utilizar el comando start. Si se usa otro comando, sale el error de comando no encontrado, y se da una hint de algun tipo (vago para pensar)

- Al presionar start, se haace visible un menu de navegacion en la parte superior de la pantalla, que sigue la estetica de parecer una terminal interactiva. Este menu tiene las secciones principales de: *about, skills, education, experience, contact*, 

- *About*: Es la seccion de informacion de Ariel Paredes Lozada. Accesible desde la consola mediante el comando `about`. Se muestra el nombre, un resumen de quien se es (ahi un placeholder), el objetivo profesional (otro placeholder), y un miniresumen de la experiencia y la educacion.

- *Skills*: Es la seccion de los skills de Ariel Paredes Lozada. El comando de navegacion es `skills`. Se listan las capacidades, que se dividen en: backend (SpringBoot, .NET, Django, Laravel), frontend (React, Angular, Flutter), databases (Pstgres, MySQL, Oracle), y DevOps (Docker, GitHub actions, Linux).

- *Education*: Es la seccion donde se agrupa la educacion y certificaciones. COmando de navegacion: `education`. Se muestra la educacion superior (comando: education uni), y las certificaciones (comando: education certs). La educacion superior es la misma, en la parte de certificaciones, se tienen las certificaciones de: Network Support and Security, Internet of Things, VI Congreso Internacional CSEI 2024, Fundamentos de Python, Desarollo Web con Python y Django, IoT Design & Monitoring for Energy Systems with ESP32. Cada uno de ellos tiene un acceso al documento de la certificacion (creo que lo puedo subir ahi mismo los PDFs de certificacion, o no se, mira tu)

- *Experience*: Es la seccion donde se describe la experiencia profesional que se tiene. COmando de navegacion: `experience`. Se muestra la experiencia en: Galacorp (de junio a agosto 2025, se hizo la pagina de Procoineec, accesible en `https://procoineec.com/`), ASSA (de junio a agosto 2026, se hicieron proyectos en PowerApps, no hay repo de GitHUb, solo mencionar). Y se muestran los proyectos de GitHub que se han hecho: Odoo-DAS (Descripcion: E-learning platform built on Odoo 18 Community for the Academia Virtual de Tecnología, covering course e-commerce, Ecuadorian electronic invoicing with XAdES-BES signing and SRI integration, an LMS, and segmented email marketing; GitHub link: https://github.com/ArielParedesLozada/Odoo-DAS; Tecnologias: Python, Odoo, Postgres, Docker; Rol: Se desarrollo el modulo de certificados), Proyecto de la junta de agua de Santa Rosa: (Descripcion: Professional project, deployed and in use at the Junta de Agua de Santa Rosa. Electronic invoicing system integrated with Ecuador's SRI for authorization and submission of digital vouchers, including an accounting module and multi-company support; Acceso GitHub link: `https://github.com/junta-agua-uta/ja-facturacion-back`; Tecnologias: NestJS, Prisma, MySQL, Docker, GitHub Actions; Rol: jefe de backend y mantenimiento hasta el momento), Asesor Conversacional CTT-FISEI (Descripcion: Hackathon project. Multi-agent conversational sales ecosystem for the FISEI technology transfer centre: a Telegram advisor over a real 21-course catalogue, per-message intent classification, and transparent handover to a human operator through a dashboard.; Acceso GitHub: `https://github.com/ArielParedesLozada/mini-hackaton`; Tecnologias: Typescript, React, Supabase, Google Gemini; Rol en el sistema: se creo el backend y el agente conversacional). Hay mas proyectos en `https://github.com/ArielParedesLozada?tab=repositories`, mira si hay alguno mas interesante y si se lo puede agregar

- *Contact*: Es la seccion de contacto. Comando: `contact`. Contacto de gmail (johanatreidesi66@gmail.com), email (aparedes3001@uta.edu.ec) y linkedin (www.linkedin.com/in/ariel-paredes-lozada-377685409). YA NO SE USA UN FORMULARIO DE CONTACTO, se deja para despues poner algo mas piola

### ESTRUCTURA MULTIPAGINA

Se busca que esta cosa sea una cosa multipagina

*Ejemplos multipagina*:
> https://elkinnn.github.io/: Buen ejemplo de cosa multipagina
> https://dageus15.github.io/en/: Otro ejemplo de multipagina

### INGLES/ESPAÑOL

Se podria utilizar o un comando o algo para  poder cambiar de ingles a español. Se podria usar el comando `lang <es,en>`, para cambiar el idioma a ingles español. MIra si esa idea es posible.