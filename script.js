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

if (otherProjectsPreview && otherProjectsPreviewImage && otherProjectLinks.length && desktopPreviewMedia.matches) {
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

  window.addEventListener('mousemove', (event) => {
    const hoveredProject = document.querySelector('.other-project:hover');
    if (!hoveredProject) {
      otherProjectsPreview.classList.remove('is-visible');
      otherProjectsPreview.style.left = '-9999px';
      otherProjectsPreview.style.top = '-9999px';
      return;
    }

    const previewImage = hoveredProject.getAttribute('data-preview');
    if (!previewImage) {
      otherProjectsPreview.classList.remove('is-visible');
      return;
    }

    otherProjectsPreviewImage.src = previewImage;

    movePreview(event.clientX, event.clientY);
    otherProjectsPreview.classList.add('is-visible');
  });
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
