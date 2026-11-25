// ===== Mobile Navigation Toggle =====
document.addEventListener('DOMContentLoaded', function () {

  // --- Hamburger Menu ---
  const navEl = document.querySelector('nav');
  if (navEl) {
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.setAttribute('aria-label', 'Toggle navigation');
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    navEl.parentNode.insertBefore(hamburger, navEl);

    hamburger.addEventListener('click', function () {
      const isOpen = navEl.classList.toggle('nav-open');
      hamburger.classList.toggle('active');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a link is clicked (mobile)
    navEl.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navEl.classList.remove('nav-open');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Smooth Scrolling for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Scroll-triggered Fade-in Animations ---
  var fadeEls = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    fadeEls.forEach(function (el) { observer.observe(el); });
  } else {
    fadeEls.forEach(function (el) { el.classList.add('visible'); });
  }

  // --- Contact Form Validation ---
  var contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      var fields = contactForm.querySelectorAll('[required]');

      fields.forEach(function (field) {
        if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        } else {
          field.classList.remove('error');
        }
      });

      // Email validation
      var emailField = contactForm.querySelector('#email');
      if (emailField && emailField.value) {
        var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(emailField.value)) {
          emailField.classList.add('error');
          valid = false;
        }
      }

      if (valid) {
        var btn = contactForm.querySelector('.submit-btn');
        var originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;

        setTimeout(function () {
          btn.textContent = '✓ Message Sent!';
          btn.style.background = '#28a745';
          contactForm.reset();

          setTimeout(function () {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
          }, 3000);
        }, 1500);
      }
    });

    // Remove error class on input
    contactForm.querySelectorAll('input, textarea, select').forEach(function (field) {
      field.addEventListener('input', function () {
        if (this.value.trim()) {
          this.classList.remove('error');
        }
      });
    });
  }

  // --- Back to Top Button ---
  var backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.innerHTML = '&#9650;';
  backToTop.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(backToTop);

  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- Image Lightbox ---
  var lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = '<span class="lightbox-close">&times;</span><img class="lightbox-img" src="" alt="Enlarged view">';
  document.body.appendChild(lightbox);

  var lightboxImg = lightbox.querySelector('.lightbox-img');
  var lightboxClose = lightbox.querySelector('.lightbox-close');

  document.querySelectorAll('.gallery-img').forEach(function (img) {
    img.addEventListener('click', function () {
      lightboxImg.src = this.src;
      lightboxImg.alt = this.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  // --- Counter Animation for Stats ---
  var statNumbers = document.querySelectorAll('.stat .number');
  if ('IntersectionObserver' in window && statNumbers.length) {
    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });

    var statsSection = document.querySelector('.stats');
    if (statsSection) statsObserver.observe(statsSection);
  }

  function animateCounters() {
    statNumbers.forEach(function (el) {
      var text = el.textContent;
      var match = text.match(/(\d[\d,]*)/);
      if (!match) return;
      var target = parseInt(match[1].replace(/,/g, ''));
      var suffix = text.replace(match[0], '');
      var prefix = text.substring(0, text.indexOf(match[0]));
      var duration = 2000;
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var current = Math.floor(progress * target);
        el.textContent = prefix + current.toLocaleString() + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = text;
        }
      }

      requestAnimationFrame(step);
    });
  }

});
