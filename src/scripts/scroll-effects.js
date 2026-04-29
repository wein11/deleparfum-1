import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── Lenis smooth scroll ─────────────────────────────────────────────────────
const lenis = new Lenis({
  duration: 1.4,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

if (!reducedMotion) {
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.on('scroll', ScrollTrigger.update);
}

// ─── Hero entrance timeline ──────────────────────────────────────────────────
if (reducedMotion) {
  ['.hero-logo', '.hero-logo-text', '.hero-eyebrow', '.hero-headline',
   '.hero-divider', '.hero-tagline', '.scroll-indicator'].forEach(sel => {
    const el = document.querySelector(sel);
    if (el) { el.style.opacity = '1'; el.style.transform = 'none'; }
  });
} else {
  gsap.set('.hero-logo, .hero-logo-text', { opacity: 0, y: 28 });
  gsap.set('.hero-eyebrow',               { opacity: 0, y: 18 });
  gsap.set('.hero-headline',              { opacity: 0, y: 44 });
  gsap.set('.hero-divider',               { scaleX: 0 });
  gsap.set('.hero-tagline',               { opacity: 0, y: 18 });
  gsap.set('.scroll-indicator',           { opacity: 0, y: 10 });

  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .to('.hero-logo, .hero-logo-text', { opacity: 1, y: 0, duration: 1.0 }, 0.3)
    .to('.hero-eyebrow',               { opacity: 1, y: 0, duration: 0.8 }, 0.7)
    .to('.hero-headline',              { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out' }, 0.9)
    .to('.hero-divider',               { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, 1.3)
    .to('.hero-tagline',               { opacity: 1, y: 0, duration: 0.8 }, 1.5)
    .to('.scroll-indicator',           { opacity: 1, y: 0, duration: 0.6 }, 1.8);

  // Hero parallax on scroll
  gsap.to('.hero-content', {
    y: -70,
    opacity: 0.3,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2,
    },
  });
}

// ─── Concepto section ────────────────────────────────────────────────────────
gsap.fromTo(
  ['.concepto-label', '.concepto-text'],
  { opacity: 0, y: 36 },
  {
    opacity: 1, y: 0, duration: 1.0, stagger: 0.2, ease: 'power3.out',
    scrollTrigger: { trigger: '.concepto', start: 'top 82%', once: true },
  }
);

// ─── Featured header ─────────────────────────────────────────────────────────
gsap.fromTo(
  '.featured-header .section-eyebrow, .featured-header .section-title, .featured-header .section-divider',
  { opacity: 0, y: 30 },
  {
    opacity: 1, y: 0, duration: 0.9, stagger: 0.14, ease: 'power3.out',
    scrollTrigger: { trigger: '.featured-header', start: 'top 85%', once: true },
  }
);

// ─── Featured items entrance ─────────────────────────────────────────────────
document.querySelectorAll('.featured-item').forEach((item, i) => {
  if (reducedMotion) return;

  const img     = item.querySelector('.featured-image-wrap');
  const content = item.querySelector('.featured-content');
  const xDir    = i % 2 === 0 ? -1 : 1;

  gsap.set(img,     { opacity: 0, x: xDir * 50 });
  gsap.set(content, { opacity: 0, x: xDir * -50 });

  gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 78%', once: true } })
    .to(img,     { opacity: 1, x: 0, duration: 1.1, ease: 'power3.out' })
    .to(content, { opacity: 1, x: 0, duration: 1.0, ease: 'power3.out' }, '-=0.75');
});

// ─── Catalog header ──────────────────────────────────────────────────────────
gsap.fromTo(
  '.catalog .section-header > *',
  { opacity: 0, y: 28 },
  {
    opacity: 1, y: 0, duration: 0.9, stagger: 0.14, ease: 'power3.out',
    scrollTrigger: { trigger: '.catalog .section-header', start: 'top 85%', once: true },
  }
);

// ─── Product cards stagger ───────────────────────────────────────────────────
if (!reducedMotion) {
  gsap.set('.product-card', { opacity: 0, y: 48 });

  ScrollTrigger.batch('.product-card', {
    onEnter: elements => {
      gsap.to(elements, {
        opacity: 1, y: 0, duration: 0.85, stagger: 0.09, ease: 'power3.out',
      });
    },
    once: true,
    start: 'top 92%',
  });
}

// ─── WA section ──────────────────────────────────────────────────────────────
gsap.fromTo(
  '.wa-label, .wa-headline, .wa-subtext, .btn-wa-main',
  { opacity: 0, y: 30 },
  {
    opacity: 1, y: 0, duration: 0.9, stagger: 0.13, ease: 'power3.out',
    scrollTrigger: { trigger: '.wa-section', start: 'top 82%', once: true },
  }
);

// ─── Magnetic CTA button ─────────────────────────────────────────────────────
document.querySelectorAll('.btn-magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    gsap.to(btn, {
      x: (e.clientX - r.left - r.width  / 2) * 0.28,
      y: (e.clientY - r.top  - r.height / 2) * 0.28,
      duration: 0.4,
      ease: 'power2.out',
    });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' });
  });
});
