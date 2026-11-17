(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = document.querySelector('.scroll-progress');
  const menuTrigger = document.querySelector('.menu-demo-trigger');
  const menuPopup = document.querySelector('#homebar-popup');
  const menuPrompt = document.querySelector('.popup-prompt');

  menuTrigger.addEventListener('click', () => {
    const isOpen = menuTrigger.getAttribute('aria-expanded') === 'true';
    menuTrigger.setAttribute('aria-expanded', String(!isOpen));
    menuPopup.classList.toggle('is-closed', isOpen);
    menuPopup.setAttribute('aria-hidden', String(isOpen));
    menuPrompt.setAttribute('aria-hidden', String(!isOpen));
  });

  if (!reduceMotion && 'IntersectionObserver' in window) {
    root.classList.add('has-motion');
    const observer = new IntersectionObserver((entries, activeObserver) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          activeObserver.unobserve(entry.target);
        }
      }
    }, { threshold: 0.08, rootMargin: '0px 0px 40px 0px' });
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
  }

  let scheduled = false;
  const updateProgress = () => {
    const available = root.scrollHeight - window.innerHeight;
    const fraction = available > 0 ? window.scrollY / available : 0;
    progress.style.transform = `scaleX(${Math.max(0, Math.min(1, fraction))})`;
    scheduled = false;
  };
  window.addEventListener('scroll', () => {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(updateProgress);
    }
  }, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();

  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    const hero = document.querySelector('.hero-shell');
    hero.addEventListener('pointermove', (event) => {
      const bounds = hero.getBoundingClientRect();
      hero.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
      hero.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
    }, { passive: true });
  }
})();
