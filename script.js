/* ================================================
   AMANDIP SINGH — PORTFOLIO JAVASCRIPT
   Handles: Particles, Cursor, Navbar, Typing,
            Scroll Reveal, Counters, Skill Bars,
            Contact Form, Back-to-Top
   ================================================ */

'use strict';

/* ================================================
   1. PARTICLE CANVAS
   ================================================ */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 1.5 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.a  = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${this.a})`;
      ctx.fill();
    }
  }

  // Create particles
  for (let i = 0; i < 120; i++) particles.push(new Particle());

  // Draw lines between nearby particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(loop);
  }
  loop();
})();


/* ================================================
   2. CUSTOM CURSOR
   ================================================ */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let ringX = 0, ringY = 0, dotX = 0, dotY = 0;

  document.addEventListener('mousemove', e => {
    dotX  = e.clientX;
    dotY  = e.clientY;
  });

  function animateCursor() {
    // Smooth ring following
    ringX += (dotX - ringX) * 0.12;
    ringY += (dotY - ringY) * 0.12;

    dot.style.left  = dotX + 'px';
    dot.style.top   = dotY + 'px';
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Scale on hover
  document.querySelectorAll('a, button, .skill-card, .project-card, .ach-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform  = 'translate(-50%, -50%) scale(0)';
      ring.style.width     = '56px';
      ring.style.height    = '56px';
      ring.style.borderColor = 'rgba(0,212,255,0.8)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform  = 'translate(-50%, -50%) scale(1)';
      ring.style.width     = '36px';
      ring.style.height    = '36px';
      ring.style.borderColor = 'rgba(0,212,255,0.5)';
    });
  });
})();


/* ================================================
   3. STICKY NAVBAR + ACTIVE LINK HIGHLIGHTING
   ================================================ */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const ham      = document.getElementById('hamburger');
  const navMenu  = document.getElementById('nav-links');

  // Sticky class on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightNav();
    toggleBackToTop();
  });

  // Highlight active nav link
  function highlightNav() {
    let current = '';
    sections.forEach(section => {
      const top    = section.offsetTop - 120;
      const height = section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  // Hamburger menu toggle
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      ham.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });
})();


/* ================================================
   4. TYPING TEXT ANIMATION (HERO)
   ================================================ */
(function initTyping() {
  const el       = document.getElementById('typed-text');
  const phrases  = [
    'B.Sc. (Hons) CS & AI Student',
    'AI Enthusiast',
    'Full Stack Learner',
    'Problem Solver',
    'Open Source Contributor'
  ];
  let phraseIdx  = 0;
  let charIdx    = 0;
  let deleting   = false;
  let speed      = 80;

  function type() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        speed    = 2000; // Pause at full phrase
      } else {
        speed = 80;
      }
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting  = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        speed     = 300;
      } else {
        speed = 45;
      }
    }
    setTimeout(type, speed);
  }

  setTimeout(type, 1400);
})();


/* ================================================
   5. SCROLL REVEAL
   ================================================ */
(function initReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger effect for grid children
        const delay = entry.target.closest('.skills-grid, .projects-grid, .achievements-grid, .stats-row')
          ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 80
          : 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => observer.observe(el));
})();


/* ================================================
   6. ANIMATED SKILL BARS
   ================================================ */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar   = entry.target;
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => observer.observe(bar));
})();


/* ================================================
   7. ANIMATED COUNTERS (ABOUT STATS)
   ================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const dur    = 1500;
        const step   = dur / target;
        let current  = 0;

        const timer = setInterval(() => {
          current++;
          el.textContent = current;
          if (current >= target) clearInterval(timer);
        }, step);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


/* ================================================
   8. BACK-TO-TOP BUTTON
   ================================================ */
function toggleBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (window.scrollY > 400) {
    btn.classList.add('visible');
  } else {
    btn.classList.remove('visible');
  }
}
document.getElementById('back-to-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ================================================
   9. CONTACT FORM HANDLING
   ================================================ */
(function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Basic validation
    if (!name || !email || !message) return;
    if (!email.includes('@')) return;

    // Simulate sending (replace with actual backend / EmailJS etc.)
    const btn = form.querySelector('.btn-primary');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled  = true;

    setTimeout(() => {
      btn.innerHTML  = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
      btn.disabled   = false;
      form.reset();
      success.style.display = 'block';
      setTimeout(() => { success.style.display = 'none'; }, 5000);
    }, 1800);
  });
})();


/* ================================================
   10. SMOOTH HOVER TILT ON CARDS
   ================================================ */
(function initCardTilt() {
  document.querySelectorAll('.project-card, .ach-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left - rect.width  / 2;
      const y      = e.clientY - rect.top  - rect.height / 2;
      const tiltX  = (y / rect.height) * 8;
      const tiltY  = -(x / rect.width)  * 8;
      card.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ================================================
   11. SECTION ENTRY ANIMATIONS (already visible ones)
   ================================================ */
(function initHeroAnimations() {
  // Stagger grid lines fade
  document.querySelectorAll('.vline, .hline').forEach((el, i) => {
    el.style.animationDelay = `${i * 0.2}s`;
  });
})();


/* ================================================
   12. NAV SMOOTH SCROLL (ensure offset for sticky nav)
   ================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // Navbar height
      const top    = target.offsetTop - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ================================================
   13. PAGE LOAD REVEAL FOR HERO
   ================================================ */
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  // Trigger any initial reveal checks
  window.dispatchEvent(new Event('scroll'));
});
