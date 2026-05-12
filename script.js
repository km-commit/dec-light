document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  const overlay = document.getElementById('nav-overlay');
  const nav = document.getElementById('nav');
  const mobileCta = document.getElementById('mobile-cta');

  function closeMenu() {
    menu.classList.remove('active');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('active');
      toggle.classList.toggle('active');
      toggle.setAttribute('aria-expanded', String(isOpen));
      overlay?.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    overlay?.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('active')) closeMenu();
    });
  }

  if (nav) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      nav.classList.toggle('nav--scrolled', y > 10);
      mobileCta?.classList.toggle('is-visible', y > 600);
    }, { passive: true });
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = nav ? nav.offsetHeight : 0;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
      }
    });
  });

  document.querySelectorAll('.faq__q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq__item');
      const isOpen = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  });

  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      const action = form.getAttribute('action');
      if (!action || action.includes('YOUR_FORM_ID')) {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const original = btn.textContent;
        btn.textContent = document.documentElement.lang.startsWith('en') ? 'Request sent' : 'Demande envoyée';
        btn.disabled = true;
        btn.style.opacity = '0.7';
        setTimeout(() => {
          btn.textContent = original;
          btn.disabled = false;
          btn.style.opacity = '1';
          form.reset();
        }, 3000);
      }
    });
  }

  const scroller = document.querySelector('.testimonials__scroller');
  if (scroller) {
    const track = scroller.querySelector('.testimonials__track');
    let isDragging = false, startX, currentTranslate = 0, dragOffset = 0, resumeTimer;
    const halfWidth = () => track.scrollWidth / 2;

    function getAnimTranslate() {
      return new DOMMatrix(getComputedStyle(track).transform).m41;
    }

    function stopAnim() {
      clearTimeout(resumeTimer);
      currentTranslate = getAnimTranslate();
      track.style.animation = 'none';
      track.style.transform = `translateX(${currentTranslate}px)`;
    }

    function resumeAnim() {
      resumeTimer = setTimeout(() => {
        const half = halfWidth();
        let pos = currentTranslate % half;
        if (pos > 0) pos -= half;
        track.style.transform = '';
        track.style.animation = `reviews-scroll ${50 * (1 - Math.abs(pos) / half)}s linear infinite`;
      }, 2000);
    }

    function onStart(x) {
      isDragging = true;
      startX = x;
      stopAnim();
      dragOffset = 0;
      scroller.classList.add('is-dragging');
    }

    function onMove(x) {
      if (!isDragging) return;
      dragOffset = x - startX;
      track.style.transform = `translateX(${currentTranslate + dragOffset}px)`;
    }

    function onEnd() {
      if (!isDragging) return;
      isDragging = false;
      scroller.classList.remove('is-dragging');
      currentTranslate += dragOffset;
      const half = halfWidth();
      if (currentTranslate > 0) currentTranslate -= half;
      if (currentTranslate < -half) currentTranslate += half;
      track.style.transform = `translateX(${currentTranslate}px)`;
      resumeAnim();
    }

    scroller.addEventListener('mousedown', (e) => { e.preventDefault(); onStart(e.pageX); });
    window.addEventListener('mousemove', (e) => onMove(e.pageX));
    window.addEventListener('mouseup', onEnd);
    scroller.addEventListener('touchstart', (e) => onStart(e.touches[0].pageX), { passive: true });
    scroller.addEventListener('touchmove', (e) => onMove(e.touches[0].pageX), { passive: true });
    scroller.addEventListener('touchend', onEnd);

    const prevBtn = document.querySelector('.testimonials__btn--prev');
    const nextBtn = document.querySelector('.testimonials__btn--next');
    const cardWidth = () => {
      const card = track.querySelector('.testimonial-card');
      return card ? card.offsetWidth + 16 : 320;
    };

    function scrollByCards(dir) {
      stopAnim();
      const shift = cardWidth() * dir;
      currentTranslate += shift;
      const half = halfWidth();
      if (currentTranslate > 0) currentTranslate -= half;
      if (currentTranslate < -half) currentTranslate += half;
      track.style.transition = 'transform 0.4s ease';
      track.style.transform = `translateX(${currentTranslate}px)`;
      track.addEventListener('transitionend', () => {
        track.style.transition = '';
        resumeAnim();
      }, { once: true });
    }

    prevBtn?.addEventListener('click', () => scrollByCards(1));
    nextBtn?.addEventListener('click', () => scrollByCards(-1));
  }

  const revealEls = document.querySelectorAll(
    '.service-card, .testimonial-card, .about__inner, .faq__item, .trust-bar__item, .section-header, .contact__inner, .service-areas__columns'
  );
  const staggerSelectors = ['.service-card', '.testimonial-card', '.faq__item', '.trust-bar__item'];

  if (revealEls.length && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    revealEls.forEach(el => {
      el.classList.add('reveal');
      if (staggerSelectors.some(s => el.matches(s))) el.classList.add('reveal-stagger');
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
    setTimeout(() => revealEls.forEach(el => el.classList.add('is-visible')), 5000);
  }

  const consentKey = 'decarie_consent';
  if (!localStorage.getItem(consentKey)) {
    document.body.classList.add('consent-pending');
  }

  document.getElementById('consent-accept')?.addEventListener('click', () => {
    localStorage.setItem(consentKey, 'all');
    document.body.classList.remove('consent-pending');
  });

  document.getElementById('consent-essential')?.addEventListener('click', () => {
    localStorage.setItem(consentKey, 'essential');
    document.body.classList.remove('consent-pending');
  });
});
