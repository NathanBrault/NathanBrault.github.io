/* ============================================================
   main.js — Portfolio interactions
   ============================================================ */

// ── 1. Navigation : scroll state + burger menu ──────────────

const nav    = document.getElementById('nav');
const burger = document.getElementById('burger');
const links  = document.querySelector('.nav__links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveLink();
}, { passive: true });

burger.addEventListener('click', () => {
  links.classList.toggle('open');
  burger.classList.toggle('open');
  const isOpen = links.classList.contains('open');
  burger.setAttribute('aria-expanded', isOpen);
  // Empêche le scroll de la page quand le menu est ouvert
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Ferme le menu burger sur clic lien
links.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    links.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
    document.body.style.overflow = '';
  });
});

// ── 2. Active link au scroll ─────────────────────────────────

const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  document.querySelectorAll('.nav__link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

// ── 3. Reveal au scroll (Intersection Observer) ──────────────

const revealEls = document.querySelectorAll(
  '.skill-card, .project-card, .about__grid, .contact__grid, .section__header'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Délai en cascade pour les grilles
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ── 4. Animation des barres de compétences ───────────────────

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-card__fill').forEach(fill => {
        fill.classList.add('animated');
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelector('.skills__grid') &&
  barObserver.observe(document.querySelector('.skills__grid'));

// ── 5. Formulaire de contact ─────────────────────────────────

const form   = document.getElementById('contact-form');
const status = document.getElementById('form-status');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Envoi en cours…';
    btn.disabled = true;

    // ⚠️  Remplacez par votre endpoint (Formspree, EmailJS, backend…)
    // Exemple avec Formspree :
    // const res = await fetch('https://formspree.io/f/VOTRE_ID', {
    //   method: 'POST',
    //   body: new FormData(form),
    //   headers: { 'Accept': 'application/json' }
    // });

    // Simulation (à remplacer par le vrai appel)
    await new Promise(r => setTimeout(r, 1200));
    const success = true; // remplacer par res.ok

    if (success) {
      status.textContent = 'Message envoyé ! Je vous réponds sous 48h.';
      status.style.color = 'var(--color-accent)';
      form.reset();
    } else {
      status.textContent = 'Une erreur est survenue. Essayez par email directement.';
      status.style.color = '#c0392b';
    }

    btn.textContent = 'Envoyer le message';
    btn.disabled = false;

    setTimeout(() => { status.textContent = ''; }, 5000);
  });
}

// ── 6. Smooth scroll sur les liens ancre ─────────────────────

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = nav.offsetHeight + 16;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});
