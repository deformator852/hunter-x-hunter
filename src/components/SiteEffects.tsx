import { useEffect } from 'react';

/** Mobile nav toggle + scroll-reveal for `.reveal` elements. */
export default function SiteEffects() {
  useEffect(() => {
    const toggle = document.querySelector<HTMLButtonElement>('.nav-toggle');
    const linksEl = document.querySelector('.nav-links');

    const onToggle = () => {
      const open = linksEl?.classList.toggle('open');
      toggle?.setAttribute('aria-expanded', String(!!open));
    };
    toggle?.addEventListener('click', onToggle);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

    return () => {
      toggle?.removeEventListener('click', onToggle);
      io.disconnect();
    };
  }, []);

  return null;
}
