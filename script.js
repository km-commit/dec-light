/* ═══════════════════════════════════════════════════
   DÉCARIE PLOMBERIE — Script v3
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Mobile Nav ─────────────────────────────────────
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  const overlay = document.getElementById('nav-overlay');

  function closeMenu() {
    menu.classList.remove('active');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('active');
      toggle.classList.toggle('active');
      toggle.setAttribute('aria-expanded', isOpen);
      if (overlay) overlay.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }
  }

  // ── Nav Scroll Shadow ──────────────────────────────
  const nav = document.getElementById('nav');
  const mobileCta = document.getElementById('mobile-cta');

  if (nav) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      nav.classList.toggle('nav--scrolled', y > 10);
      if (mobileCta) mobileCta.classList.toggle('is-visible', y > 600);
    }, { passive: true });
  }

  // ── Smooth Scroll ──────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = nav ? nav.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── FAQ Accordion (accessible) ─────────────────────
  document.querySelectorAll('.faq__q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq__item');
      const isOpen = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', isOpen);
    });
  });

  // ── Contact Form (Formspree with fallback) ─────────
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      const action = form.getAttribute('action');
      if (!action || action.includes('YOUR_FORM_ID')) {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Demande envoyée ✓';
        btn.disabled = true;
        btn.style.opacity = '0.7';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.opacity = '1';
          form.reset();
        }, 3000);
      }
    });
  }

  // ── Scroll Reveal ──────────────────────────────────
  const revealElements = document.querySelectorAll(
    '.service-card, .testimonial-card, .about__inner, .faq__item, .trust-bar__item, .section-header, .contact__inner, .service-areas__columns'
  );

  const staggerSelectors = ['.service-card', '.testimonial-card', '.faq__item', '.trust-bar__item'];

  if (revealElements.length && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    revealElements.forEach(el => {
      el.classList.add('reveal');
      if (staggerSelectors.some(s => el.matches(s))) {
        el.classList.add('reveal-stagger');
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => observer.observe(el));

    setTimeout(() => {
      revealElements.forEach(el => {
        if (!el.classList.contains('is-visible')) el.classList.add('is-visible');
      });
    }, 5000);
  }

  // ── Loi 25 — Cookie Consent ───────────────────────
  const consentKey = 'decarie_consent';
  if (!localStorage.getItem(consentKey)) {
    document.body.classList.add('consent-pending');
  }

  const acceptBtn = document.getElementById('consent-accept');
  const essentialBtn = document.getElementById('consent-essential');

  function closeConsent(level) {
    localStorage.setItem(consentKey, level);
    document.body.classList.remove('consent-pending');
  }

  if (acceptBtn) acceptBtn.addEventListener('click', () => closeConsent('all'));
  if (essentialBtn) essentialBtn.addEventListener('click', () => closeConsent('essential'));

});
