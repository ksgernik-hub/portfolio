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

const projectLinks = [...document.querySelectorAll('.project[href]')];

projectLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http')) return;

    event.preventDefault();
    link.classList.add('is-opening');

    setTimeout(() => {
      window.location.href = href;
    }, 520);
  });
});

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
    if (previewImage) {
      otherProjectsPreviewImage.src = previewImage;
    }

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
