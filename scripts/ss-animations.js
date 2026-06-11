/**
 * Registers a single IntersectionObserver for all .ss-reveal elements
 * inside a block, toggling .ss-visible when they enter the viewport.
 * Children of .ss-stagger get incremental transition-delay.
 * @param {Element} block
 * @param {number} [staggerMs=80]
 */
export function observeReveal(block, staggerMs = 80) {
  block.querySelectorAll('.ss-stagger').forEach((parent) => {
    [...parent.children].forEach((child, i) => {
      child.style.transitionDelay = `${i * staggerMs}ms`;
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('ss-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  );

  block.querySelectorAll('.ss-reveal, .ss-reveal-left, .ss-reveal-right').forEach((el) => {
    observer.observe(el);
  });
}

/**
 * Animates an element's text content from 0 to data-count-to when it
 * enters the viewport. Supports optional data-count-suffix attribute.
 * @param {Element} el
 */
export function observeCounter(el) {
  const target = parseInt(el.dataset.countTo, 10);
  if (!target) return;
  const suffix = el.dataset.countSuffix || '';
  const duration = 1200;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - (1 - progress) ** 3;
          const current = Math.round(eased * target);
          el.textContent = target >= 1000
            ? `${(current / 1000).toFixed(current % 1000 === 0 ? 0 : 1)}K${suffix}`
            : `${current}${suffix}`;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.5 },
  );
  observer.observe(el);
}
