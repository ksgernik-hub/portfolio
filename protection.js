(() => {
  const mediaSelector = 'img, video, iframe, .project__thumb, .hero-cover';

  const isProtectedTarget = (target) => {
    if (!(target instanceof Element)) return false;
    return Boolean(target.closest(mediaSelector));
  };

  document.addEventListener('contextmenu', (event) => {
    if (isProtectedTarget(event.target)) {
      event.preventDefault();
    }
  }, { capture: true });

  document.addEventListener('dragstart', (event) => {
    if (isProtectedTarget(event.target)) {
      event.preventDefault();
    }
  }, { capture: true });

  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if ((event.metaKey || event.ctrlKey) && (key === 's' || key === 'u')) {
      event.preventDefault();
    }
  });
})();
