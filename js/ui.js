export function scrollProgress(scrollTop, scrollHeight, clientHeight) {
  const scrollable = scrollHeight - clientHeight;
  if (scrollable <= 0) return 0;
  const pct = (scrollTop / scrollable) * 100;
  return Math.min(100, Math.max(0, pct));
}

export function activeSection(positions, scrollY) {
  let current = positions[0].id;
  for (const pos of positions) {
    if (pos.top <= scrollY) current = pos.id;
  }
  return current;
}

export function initUi(doc) {
  const progressBar = doc.getElementById('scroll-progress');
  const sections = [...doc.querySelectorAll('main section[id]')];
  const navLinks = [...doc.querySelectorAll('.nav-list a[href^="#"]')];
  const navToggle = doc.getElementById('nav-toggle');

  let ticking = false;

  function update() {
    ticking = false;
    if (progressBar) {
      const pct = scrollProgress(
        doc.documentElement.scrollTop,
        doc.documentElement.scrollHeight,
        doc.documentElement.clientHeight
      );
      progressBar.style.width = `${pct}%`;
    }

    if (sections.length > 0) {
      const positions = sections.map((s) => ({ id: s.id, top: s.offsetTop }));
      const current = activeSection(positions, doc.documentElement.scrollTop);
      for (const link of navLinks) {
        const isActive = link.getAttribute('href') === `#${current}`;
        if (isActive) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      }
    }
  }

  doc.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  });

  if (navToggle) {
    for (const link of navLinks) {
      link.addEventListener('click', () => {
        navToggle.checked = false;
      });
    }
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) entry.target.classList.add('revealed');
      }
    });
    for (const section of sections) observer.observe(section);
  }

  update();
}
