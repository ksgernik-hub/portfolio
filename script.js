const revealNodes = [...document.querySelectorAll('.reveal')];

revealNodes.forEach((node, index) => {
  node.style.transitionDelay = `${Math.min(index * 120, 420)}ms`;
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: '0px 0px -6% 0px'
  }
);

revealNodes.forEach((node) => observer.observe(node));

const projectLinks = [...document.querySelectorAll('.project')];
const projectsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-shown');
        projectsObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.08,
    rootMargin: '0px 0px -8% 0px'
  }
);

projectLinks.forEach((link) => projectsObserver.observe(link));

const revealInViewportNow = () => {
  const viewportH = window.innerHeight || document.documentElement.clientHeight;
  const viewportW = window.innerWidth || document.documentElement.clientWidth;

  revealNodes.forEach((node) => {
    const rect = node.getBoundingClientRect();
    const visible = rect.bottom > 0 && rect.right > 0 && rect.top < viewportH * 0.98 && rect.left < viewportW;
    if (visible) {
      node.classList.add('is-visible');
    }
  });

  projectLinks.forEach((link) => {
    const rect = link.getBoundingClientRect();
    const visible = rect.bottom > 0 && rect.right > 0 && rect.top < viewportH * 0.98 && rect.left < viewportW;
    if (visible) {
      link.classList.add('is-shown');
    }
  });
};

// Safari/production fallback: ensure cards are visible on first paint, not only after resize.
requestAnimationFrame(revealInViewportNow);
setTimeout(revealInViewportNow, 120);
window.addEventListener('load', revealInViewportNow, { once: true });
window.addEventListener('pageshow', revealInViewportNow);
window.addEventListener('resize', revealInViewportNow);

const otherProjectsPreview = document.querySelector('.other-projects__preview');
const otherProjectsPreviewImage = otherProjectsPreview
  ? otherProjectsPreview.querySelector('img')
  : null;
const otherProjectLinks = [...document.querySelectorAll('.other-project[data-preview]')];
const desktopPreviewMedia = window.matchMedia('(hover: hover) and (pointer: fine)');

if (otherProjectLinks.length) {
  const previewSources = [...new Set(otherProjectLinks.map((link) => link.getAttribute('data-preview')).filter(Boolean))];

  previewSources.forEach((src) => {
    const image = new Image();
    image.decoding = 'async';
    image.src = src;
  });
}

if (otherProjectsPreview && otherProjectsPreviewImage && otherProjectLinks.length) {
  const movePreview = (x, y) => {
    const offsetX = 30;
    const offsetY = -30;
    const previewWidth = otherProjectsPreview.offsetWidth || 260;
    const previewHeight = otherProjectsPreview.offsetHeight || 195;
    const rawLeft = x + offsetX;
    const rawTop = y + offsetY;
    const safeLeft = Math.max(12, Math.min(rawLeft, window.innerWidth - previewWidth - 12));
    const safeTop = Math.max(12, Math.min(rawTop, window.innerHeight - previewHeight - 12));

    otherProjectsPreview.style.left = `${safeLeft}px`;
    otherProjectsPreview.style.top = `${safeTop}px`;
  };

  const hidePreview = () => {
    otherProjectsPreview.classList.remove('is-visible');
    otherProjectsPreview.style.left = '-9999px';
    otherProjectsPreview.style.top = '-9999px';
  };

  const showPreview = (project, x, y) => {
    const previewImage = project.getAttribute('data-preview');
    if (!previewImage) {
      hidePreview();
      return;
    }

    otherProjectsPreviewImage.src = previewImage;
    movePreview(x, y);
    otherProjectsPreview.classList.add('is-visible');
  };

  if (desktopPreviewMedia.matches) {
    window.addEventListener('mousemove', (event) => {
      const hoveredProject = document.querySelector('.other-project:hover');
      if (!hoveredProject) {
        hidePreview();
        return;
      }

      showPreview(hoveredProject, event.clientX, event.clientY);
    });
  } else {
    otherProjectLinks.forEach((project) => {
      project.setAttribute('role', 'button');
      project.setAttribute('tabindex', '0');

      project.addEventListener('click', (event) => {
        const rect = project.getBoundingClientRect();
        const x = event.clientX || rect.left + rect.width / 2;
        const y = event.clientY || rect.top + rect.height / 2;
        showPreview(project, x, y);
      });

      project.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') {
          return;
        }

        event.preventDefault();
        const rect = project.getBoundingClientRect();
        showPreview(project, rect.left + rect.width / 2, rect.top + rect.height / 2);
      });
    });

    document.addEventListener('click', (event) => {
      if (event.target.closest('.other-project')) {
        return;
      }

      hidePreview();
    });

    window.addEventListener('scroll', hidePreview, { passive: true });
    window.addEventListener('resize', hidePreview);
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        hidePreview();
      }
    });
  }
}

const customCursor = document.querySelector('.custom-cursor');

if (customCursor && desktopPreviewMedia.matches) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  const animateCursor = () => {
    cursorX += (mouseX - cursorX) * 0.52;
    cursorY += (mouseY - cursorY) * 0.52;

    customCursor.style.transform = `translate3d(${cursorX - 4}px, ${cursorY - 4}px, 0)`;

    window.requestAnimationFrame(animateCursor);
  };

  window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  window.requestAnimationFrame(animateCursor);
}

const initHeroNameImageLetters = () => {
  const title = document.querySelector('.hero__title');
  if (!title) return;

  const preloadedLetters = new Set();

  const preloadLetterImages = () => {
    title.querySelectorAll('[data-image]').forEach((letter) => {
      const imagePath = letter.dataset.image;
      if (!imagePath || preloadedLetters.has(imagePath)) return;

      preloadedLetters.add(imagePath);
      const image = new Image();
      image.src = imagePath;
    });
  };

  const scheduleLetterPreload = () => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(preloadLetterImages, { timeout: 1600 });
    } else {
      window.setTimeout(preloadLetterImages, 700);
    }
  };

  const ruLetterImageMap = {
    'г': './images/letters-cyr/г.png',
    'е': './images/letters-cyr/е.png',
    'р': './images/letters-cyr/р.png',
    'н': './images/letters-cyr/н.png',
    'и': './images/letters-cyr/и.png',
    'к': './images/letters-cyr/к.png',
    'с': './images/letters-cyr/с.png',
    'ю': './images/letters-cyr/ю.png',
    'ш': './images/letters-cyr/ш.png',
    'а': './images/letters-cyr/а.png'
  };

  const enNameLetterImageMap = {
    'k': './images/letters-lat/name/k.png',
    's': './images/letters-lat/name/s.png',
    'u': './images/letters-lat/name/u.png',
    'h': './images/letters-lat/name/h.png',
    'a': './images/letters-lat/name/a.png'
  };

  const enSurnameLetterImageMap = {
    'g': './images/letters-lat/surname/g.png',
    'e': './images/letters-lat/surname/e.png',
    'r': './images/letters-lat/surname/r.png',
    'n': './images/letters-lat/surname/n.png',
    'i': './images/letters-lat/surname/i.png',
    'k': './images/letters-lat/surname/k.png'
  };

  const createLetterSpan = (char, variant = 'base', lineIndex = 0, lang = 'ru') => {
    const span = document.createElement('span');
    span.className = 'title-letter';
    span.textContent = char;
    const lower = char.toLowerCase();
    let imagePath = '';

    if (lang === 'ru') {
      imagePath = variant === 'name' && lower === 'к'
        ? './images/letters-cyr/к-name.png'
        : ruLetterImageMap[lower];
    } else {
      if (variant === 'name') {
        if (lower === 's' && lineIndex === 3) {
          imagePath = './images/letters-lat/name/s-2.png';
        } else {
          imagePath = enNameLetterImageMap[lower];
        }
      } else {
        imagePath = enSurnameLetterImageMap[lower];
      }
    }

    if (imagePath) {
      span.dataset.image = imagePath;
      span.addEventListener('mouseenter', () => {
        span.style.setProperty('--letter-image', `url('${imagePath}')`);
        span.classList.add('is-image');
      });
      span.addEventListener('mouseleave', () => {
        span.classList.remove('is-image');
      });
    }

    return span;
  };

  const renderTitle = () => {
    const isRu = document.documentElement.lang === 'ru';
    const isEn = !isRu;

    if (title.dataset.lettersReady === '1') {
      return;
    }

    const firstWord = isRu ? 'КСЮША' : 'KSUSHA';
    const lastWord = isRu ? 'ГЕРНИК' : 'GERNIK';
    const lang = isRu ? 'ru' : 'en';
    const firstLine = document.createElement('span');
    firstLine.className = 'title-line';
    for (const [index, char] of [...firstWord].entries()) {
      if (char === ' ') {
        firstLine.appendChild(document.createTextNode(' '));
        continue;
      }

      firstLine.appendChild(createLetterSpan(char, 'name', index, lang));
    }
    const rebuilt = [firstLine];

    if (lastWord) {
      const secondLine = document.createElement('span');
      secondLine.className = 'title-line';
      for (const [index, char] of [...lastWord].entries()) {
        secondLine.appendChild(createLetterSpan(char, 'surname', index, lang));
      }
      rebuilt.push(secondLine);
    }

    title.textContent = '';
    rebuilt.forEach((node) => title.appendChild(node));
    title.dataset.lettersReady = '1';
    scheduleLetterPreload();
  };

  const resetIfNeeded = () => {
    const isRu = document.documentElement.lang === 'ru';
    title.dataset.lettersReady = '';
    title.innerHTML = isRu
      ? '<span class="title-line">КСЮША</span><span class="title-line">ГЕРНИК</span>'
      : '<span class="title-line">KSUSHA</span><span class="title-line">GERNIK</span>';
    window.requestAnimationFrame(renderTitle);
  };

  const langObserver = new MutationObserver(resetIfNeeded);
  langObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  resetIfNeeded();
};

initHeroNameImageLetters();
