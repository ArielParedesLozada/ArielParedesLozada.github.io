# Reconstrucción del portafolio — Diseño

Fecha: 2026-11-15
Repositorio: `ArielParedesLozada.github.io` (rama `octavo`)

## Intención y motivo

El portafolio actual es una plantilla ajena (de Om Chaudhari) con el contenido
parcialmente reemplazado. Se ve pobre, arrastra restos del autor original
—incluido un `<script>` de Google AdSense con el ID de publisher de él— y no
cubre las secciones que el portafolio necesita como pieza profesional.

Se reconstruye desde cero: sitio estático propio, sin frameworks ni paso de
build, con todo el contenido en un único archivo de datos para que Ariel lo
mantenga sin tocar HTML.

El objetivo de fondo es conseguir entrevistas para puestos de **análisis de
datos, DevOps o sistemas operativos**. Cada decisión de contenido se ordena por
lo que le sirve a alguien que mira la página treinta segundos.

Hay además un contexto social: los portafolios de sus conocidos
(`Diego200509`, `Elkinnn`, `DaGeus15`) son mundos 3D con Three.js y sitios en
Next.js con case studies. No se compite en espectáculo gráfico. Se compite en
carácter propio, lectura rápida y cero enlaces roto.

## Metas

- Cubrir las secciones obligatorias del TODO: nombre, objetivo profesional,
  educación superior, descarga de CV, habilidades, experiencia (empresas /
  profesionales / personales / académicos), proyectos con detalle, hobbies y
  participaciones en eventos, contacto.
- Estética de entorno Linux/NixOS, con una terminal funcional en el hero.
- Sitio **íntegramente en inglés**, `lang="en"`: navegación, prosa, comandos de
  la terminal y etiquetas del formulario. Es el idioma que esperan los
  reclutadores de los puestos a los que apunta.
- Que se vea bien en móvil y sea usable con teclado.
- Contenido centralizado y editable en un solo archivo.
- Cero dependencias instalables; funciona con cualquier servidor estático.
- Ningún enlace ni imagen roto, verificado con una herramienta, no a ojo.
- Placeholders explícitos y visibles donde falta información, nunca datos
  inventados.

## No-metas

- No se adopta `masterPortfolio` ni ningún framework (React, Next, Astro,
  Tailwind), ni Three.js/WebGL.
- No se migra el hosting a Vercel en este trabajo (ver Decisiones).
- No hay blog, ni conmutador claro/oscuro, ni versión en español, ni conmutador
  de idioma. Si el español se quiere después, se agrega sin reestructurar.
- No se consume la API de GitHub. Nada de listados de repos generados en
  tiempo de ejecución.
- No se toca el `README.md` del perfil de GitHub.

## Anti-metas (fracaso incluso si funciona)

- Que el sitio siga reconociéndose como la plantilla de otra persona.
- Que quede código muerto o datos de terceros (AdSense, créditos, metadatos).
- Que el contenido quede escondido detrás de comandos: la terminal es un adorno
  funcional, no la única puerta. Todo se ve haciendo scroll.
- Que agregar un trabajo o un proyecto obligue a editar HTML o JS de render.
- Que el formulario de contacto aparente funcionar y se pierdan los mensajes.
- Que se copie código de `tportfolio` sin permiso: no tiene licencia.

## Restricciones

- Hosting estático: no hay backend propio ni secretos en el cliente.
- El PDF del CV lo sube Ariel; el sitio solo lo enlaza.
- La aprobación final es visual: Ariel abre el sitio con `live-server` y juzga.
  El implementador no levanta servidores.

## Approaches

**A. Vanilla reconstruido, data-driven (elegida).** HTML/CSS/JS plano; el
contenido vive en `js/content.js` y funciones de render lo pintan. Sin build ni
dependencias. Cuesta más diseño propio, pero cumple la restricción de no usar
frameworks, es verificable con un servidor local y el resultado es suyo.

**B. Fork de `masterPortfolio` migrado a Vite.** Conserva sus componentes y su
estética a cambio de sacar Create React App, reemplazar `apollo-boost`,
`react-reveal` y `react-bootstrap` beta, y adaptar componentes React para las
secciones nuevas. Look pulido rápido, pero cada cambio futuro es tocar React.
Descartada por costo de mantenimiento.

**C. `masterPortfolio` tal cual.** Descartada: `react-scripts` 3.2.0 sin
mantenimiento, scripts que ya dependen del parche `--openssl-legacy-provider`, y
su README pide un token de GitHub con todos los permisos. Tampoco trae
formulario de contacto, así que ese requisito quedaría pendiente igual.

Ariel eligió A el 2026-11-15.

## Dirección visual: híbrida

Elegida por Ariel el 2026-11-15, sobre "terminal pura" y "solo estética".

Página con scroll convencional —secciones, tarjetas, timeline— vestida como un
entorno Linux:

- Las secciones se presentan como ventanas con barra de título
  (`─ □ ×`) y rutas tipo `## experiencia/`.
- Encabezados y metadatos en monoespaciada, prosa en sans. Paleta derivada de
  los azules del logo de Nix sobre fondo oscuro, con acentos para estados.
- En el hero, una **terminal funcional** con un puñado de comandos reales:
  `help`, `whoami`, `ls proyectos`, `cat cv`, `contacto`, `skills`, `clear`.
  Los comandos imprimen una respuesta corta y, cuando corresponde, desplazan la
  página a la sección. Historial con flechas arriba/abajo y autocompletado con
  Tab si sale barato.
- La terminal nunca es requisito: si su JS falla, el hero degrada a un bloque
  estático con el nombre, el objetivo profesional y los botones de CV y GitHub.

**Crédito e implementación de la terminal.** La idea viene de
[`s4sahiko/tportfolio`](https://github.com/s4sahiko/tportfolio), que no declara
licencia y por tanto es "todos los derechos reservados". El intérprete se
escribe desde cero (es un `switch` sobre comandos, unas 80 líneas) y en el
footer va una línea de crédito a Sahiko por la inspiración. No se copian bloques
de su `script.js` ni de su `style.css`. *(Mi decisión: evita pedir permiso y
evita el riesgo.)*

## Arquitectura

```
index.html            una sola página, secciones ancladas
css/tokens.css        variables: color, tipografía, espaciado, radios, sombras
css/base.css          reset, tipografía base, utilidades
css/layout.css        contenedor, grid, nav, footer, responsive
css/components.css    ventanas, tarjetas, timeline, chips, botones, formulario
css/terminal.css      la terminal del hero
js/content.js         TODO el contenido como objetos exportados
js/render.js          plantillas por sección, inyecta desde content.js
js/terminal.js        intérprete de comandos del hero
js/ui.js              nav móvil, scroll-spy, barra de progreso, reveal
images/projects/      capturas de proyectos (placeholders si faltan)
assets/cv/            PDF del CV (lo sube Ariel)
tools/check-links.mjs verificador de enlaces e imágenes
```

Módulos ES nativos (`<script type="module">`), que funcionan servidos por
`http://`, que es como se sirve en local y en producción. Sin bundler.

**Qué es estático y qué se renderiza.** El hero —nombre, objetivo profesional,
botón de CV y enlaces de contacto— va escrito en el HTML, no renderizado, para
que exista aunque el JavaScript falle. Las secciones repetitivas (educación,
experiencia, proyectos, habilidades, eventos) se pintan desde `content.js`, y el
`<noscript>` avisa y deja visibles los enlaces esenciales. *(Mi decisión: el
beneficio de editar un solo archivo supera el caso raro de JS deshabilitado, y
la identidad y el CV se conservan igual.)*

**Archivos que se eliminan.** `script/typed.js`, `script/download.js`,
`script/repos.js`, `css/style.css` y `css/timeline.css` son de la plantilla
ajena y se borran al reconstruir. `images/` se conserva (favicons, foto,
`location-sign-svgrepo-com.svg`). `images/wave-hello.gif` está referenciado pero
no existe: se elimina esa referencia. *(Mi decisión.)*

## Decisiones tomadas

**Hosting: se queda en GitHub Pages.** El nombre del repo ya es el correcto para
Pages y el sitio es 100% estático. Vercel solo aportaría funciones serverless
(para el formulario) y deploys de preview; si luego se quiere el formulario
propio, migrar es importar el repo en Vercel sin cambiar código. *(Mi decisión,
revisable.)*

**Formulario de contacto: HTML real apuntando a Formspree, con endpoint
placeholder.** Mientras el endpoint sea el placeholder, el submit se intercepta
y muestra un aviso con los correos directos en vez de fingir un envío. Debajo
siempre hay enlaces `mailto`, que es la vía que funciona hoy. *(Mi decisión: la
anti-meta de "mensajes perdidos" manda sobre aparentar completitud.)*

**Enlaces roto: verificador propio.** `tools/check-links.mjs` extrae cada
`href` y `src` del HTML y del `content.js`, resuelve los locales contra el
sistema de archivos y hace `HEAD`/`GET` a los externos, e imprime un reporte con
código de salida distinto de cero si algo falla. Se corre en cada fase. Node ya
está disponible en la máquina y el script no instala nada. Los enlaces locales
que faltan son **error**; los externos que responden 403/405 a un `HEAD` se
reintentan con `GET` y, si siguen fallando, se reportan como **aviso** y no
rompen el chequeo, porque Google Drive y LinkedIn bloquean clientes automáticos
y un aviso falso constante haría que se ignore el reporte. *(Mi decisión: el
TODO pide esto en mayúsculas y a ojo no se cumple.)*

**Idioma: inglés, `lang="en"`.** Decisión de Ariel el 2026-11-15, sobre
bilingüe con conmutador y sobre español. El sitio actual mezclaba los dos
idiomas en la navegación y los títulos; ahora es uno solo.

**Nombres propios en su idioma original.** "Universidad Técnica de Ambato",
"Junta de Agua de Santa Rosa", "Unidad Educativa Luis A. Martínez" y los
títulos de los certificados se escriben tal cual, con una glosa breve en inglés
cuando aporte (`Universidad Técnica de Ambato (public university, Ecuador)`).
Traducirlos produciría instituciones que no existen y que no se pueden
verificar. *(Mi decisión.)*

**Tema: oscuro único.** Se conserva el carácter oscuro, con paleta y escala
tipográfica nuevas y coherentes. Sin conmutador, para no duplicar el trabajo de
diseño. *(Mi decisión.)*

**Dependencias externas: se eliminan las de comportamiento.** Fuera AOS,
`typed.js`, Iconify, `github-calendar`, `bootstrap-icons` y `colored-icons`. El
efecto de tecleo y las animaciones de entrada se reimplementan con
`IntersectionObserver`, respetando `prefers-reduced-motion`. Los logos de
tecnologías se descargan una vez a `images/tech/` y se sirven locales, para que
ningún icono dependa de un CDN que pueda caerse —requisito de "no enlaces
roto"—. Fuentes: se usan las monoespaciadas y sans del sistema, sin Google
Fonts, salvo que haga falta una mono concreta, que se autohospeda. *(Mi
decisión.)*

**Educación: solo superior.** Se elimina la entrada del colegio (UELAM), como
pide el TODO. Quedan UTA y las tres certificaciones con sus enlaces de
verificación ya existentes.

**Proyectos: todos curados a mano, sin API.** Cada tarjeta se escribe en
`content.js` con descripción, rol, tecnologías, enlace al despliegue y al repo,
e imagen. No hay listado automático de repos: el `repos.js` actual interpola una
`Promise` dentro de un template string y pinta `[object Promise]`, y de todas
formas un volcado de repos sin curar resta más de lo que suma. En su lugar, un
enlace sobrio al perfil de GitHub al final de la sección. Decisión de Ariel el
2026-11-15.

**Limpieza obligatoria.** Se eliminan el `<script>` de AdSense, el `meta author`
y los `og:image`/`twitter:image` del autor original, el crédito del footer, la
referencia a `Om_Chaudhari_CV.pdf` y los `link rel="shortcut icon"` que apuntan
a un `assets/` inexistente. Los favicons de `images/` sí existen y se conservan.

## Contenido e inventario de placeholders

Confirmado (del TODO y del sitio actual):

- Nombre; UTA, Ingeniería de Software, 2022–actualidad; logro a la excelencia
  académica del período Septiembre 2023 – Febrero 2024.
- Certificaciones: Django (UTA), Python básico (Cisco-FISEI), Introducción a IoT
  (Cisco Networking Academy), con sus URLs de Drive.
- Prácticas: Galacorp (junio–agosto 2025) y ASSA (junio–agosto 2026).
- JuntaAgua Santa Rosa: facturación, desplegado en
  `https://juntagua--prod-ja-facturacion-front--7hvtmf7r9vh5.code.run/login`.
- Habilidades: Python, C, Java, SQL, Oracle, Django, Laravel, Bootstrap, HTML,
  CSS, JavaScript, Git, GitLab, GitHub, Linux, VS Code, NixOS, Claude, Opencode.
- Hobbies: natación, lectura, matemáticas, ejercicio.
- Contacto: GitHub `ArielParedesLozada`, `mateoparedeskt1800@gmail.com`,
  `aparedes3001@uta.edu.ec`.

Placeholders a dejar marcados con la cadena literal **`PLACEHOLDER_PAPU`** en
`content.js`, visibles en la página con estilo propio y nunca como texto que
parezca real. La cadena es única y rara a propósito: `grep -rn PLACEHOLDER_PAPU`
devuelve exactamente lo que falta por llenar. Decisión de Ariel el 2026-11-15.

1. Objetivo profesional: redacción definitiva. Va una propuesta de dos líneas
   basada en "análisis de datos / DevOps / sistemas operativos".
2. Semestre actual (el sitio decía "cuarto semestre", desactualizado).
3. Galacorp: qué se hizo, tecnologías, rol.
4. ASSA: los "un par de proyectos", tecnologías, rol.
5. JuntaAgua: rol exacto, stack y URL del repositorio.
6. Hackatón: nombre, fecha, equipo, resultado.
7. Proyectos académicos: cuáles vale la pena mostrar.
8. LinkedIn (el TODO pide redes profesionales y no hay perfil en el sitio).
9. Capturas de los proyectos en `images/projects/`.
10. `assets/cv/cv-ariel-paredes-lozada.pdf`.
11. Endpoint de Formspree.

## Verificación

El implementador no levanta servidores. Lo que corre por fase:

1. `node tools/check-links.mjs` sin errores.
2. `grep -rn PLACEHOLDER_PAPU` y reportar la lista, para que se vea qué falta.
3. Revisión estática de que cada sección del TODO existe en `index.html` o en
   `content.js`, y que no quedan restos de la plantilla ajena
   (`grep -rni "chaudhari\|adsbygoogle\|typed.js\|aos@\|iconify"`).

Ariel revisa visualmente con `live-server` al final de cada fase: que renderice
bien, que la terminal responda, que se vea en móvil y que la consola esté
limpia. Esa es la aprobación que cuenta.

## Lo que queda al implementador

- La paleta y la escala tipográfica concretas, dentro del tema oscuro Nix.
- La forma exacta de las ventanas, tarjetas, timeline y chips.
- Si la experiencia se agrupa con pestañas o en un solo timeline etiquetado por
  tipo.
- El conjunto final de comandos de la terminal, más allá de los enumerados.
- El texto propuesto para el objetivo profesional, que Ariel corregirá.
