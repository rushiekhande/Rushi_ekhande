document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinkMap = {};
  document.querySelectorAll('.nav-link').forEach(link => {
    navLinkMap[link.dataset.section] = link;
  });

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        Object.values(navLinkMap).forEach(l => l.classList.remove('active'));
        const activeLink = navLinkMap[entry.target.id];
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(sec => navObserver.observe(sec));

  /* ---------- Scroll reveal ---------- */
  const revealItems = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach((item, i) => {
    item.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`;
    revealObserver.observe(item);
  });

  /* ---------- Typing effect for hero role ---------- */
  const roles = [
    'SAP ABAP Developer',
    'Technical Consultant',
    'Backend Problem-Solver',
    'Report & Interface Builder'
  ];
  const roleEl = document.getElementById('roleTyped');

  if (roleEl) {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeLoop() {
      const current = roles[roleIndex];

      if (!deleting) {
        charIndex++;
        roleEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(typeLoop, 1400);
          return;
        }
      } else {
        charIndex--;
        roleEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      setTimeout(typeLoop, deleting ? 35 : 65);
    }
    typeLoop();
  }

  /* ---------- Back to top button ---------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  function setError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const wrapper = field.closest('.field');
    const errorEl = form.querySelector(`.field-error[data-for="${fieldName}"]`);
    if (message) {
      wrapper.classList.add('invalid');
      errorEl.textContent = message;
    } else {
      wrapper.classList.remove('invalid');
      errorEl.textContent = '';
    }
  }

  function validate() {
    let valid = true;

    const name = form.name.value.trim();
    if (!name) {
      setError('name', 'Please enter your name.');
      valid = false;
    } else {
      setError('name', '');
    }

    const email = form.email.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError('email', 'Please enter your email.');
      valid = false;
    } else if (!emailPattern.test(email)) {
      setError('email', 'Please enter a valid email address.');
      valid = false;
    } else {
      setError('email', '');
    }

    const message = form.message.value.trim();
    if (!message) {
      setError('message', 'Please enter a message.');
      valid = false;
    } else if (message.length < 10) {
      setError('message', 'Message should be at least 10 characters.');
      valid = false;
    } else {
      setError('message', '');
    }

    return valid;
  }

  ['name', 'email', 'message'].forEach(fieldName => {
    form[fieldName].addEventListener('blur', validate);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formStatus.textContent = '';

    if (!validate()) {
      formStatus.style.color = '#ff8a8a';
      formStatus.textContent = 'Please fix the highlighted fields.';
      return;
    }

    // No backend is connected yet — this simulates a successful send.
    // Wire this up to a form service (e.g. Formspree) or your own endpoint to go live.
    formStatus.style.color = '#6ee7a0';
    formStatus.textContent = 'Message sent — thanks, I\'ll get back to you soon!';
    form.reset();
  });

});
