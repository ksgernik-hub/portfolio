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
