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
const desktopPreviewMedia = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 981px)');

if (otherProjectsPreview && otherProjectsPreviewImage && otherProjectLinks.length && desktopPreviewMedia.matches) {
  const movePreview = (x, y) => {
    const offsetX = 18;
    const offsetY = 18;
    otherProjectsPreview.style.transform = `translate3d(${x + offsetX}px, ${y + offsetY}px, 0)`;
  };

  otherProjectLinks.forEach((projectLink) => {
    projectLink.addEventListener('mouseenter', () => {
      const previewImage = projectLink.getAttribute('data-preview');
      if (previewImage) {
        otherProjectsPreviewImage.src = previewImage;
      }
      otherProjectsPreview.classList.add('is-visible');
    });

    projectLink.addEventListener('mousemove', (event) => {
      movePreview(event.clientX, event.clientY);
    });

    projectLink.addEventListener('mouseleave', () => {
      otherProjectsPreview.classList.remove('is-visible');
      otherProjectsPreview.style.transform = 'translate3d(-9999px, -9999px, 0)';
    });
  });
}
