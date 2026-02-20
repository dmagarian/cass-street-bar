/**
 * Cass Street Bar & Grill - Interactive Website
 * Synthwave-themed interactions with full accessibility support
 */

(function () {
  'use strict';

  // ============================================
  // MOBILE NAVIGATION
  // ============================================
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = navMenu?.querySelectorAll('a');
  const header = document.querySelector('.site-header');

  function toggleNav() {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isOpen);
    navMenu.classList.toggle('open', !isOpen);
    document.body.style.overflow = !isOpen ? 'hidden' : '';
  }

  function closeNav() {
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  navToggle?.addEventListener('click', toggleNav);

  navLinks?.forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Close nav on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu?.classList.contains('open')) {
      closeNav();
      navToggle?.focus();
    }
  });

  // ============================================
  // HEADER SCROLL BEHAVIOR
  // ============================================
  let lastScrollY = 0;

  function handleHeaderScroll() {
    const scrollY = window.scrollY;
    header?.classList.toggle('scrolled', scrollY > 50);
    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  // ============================================
  // MENU TAB SYSTEM
  // ============================================
  const tabButtons = document.querySelectorAll('.menu-tab');
  const tabPanels = document.querySelectorAll('.menu-panel');

  function switchTab(targetButton) {
    const targetId = targetButton.getAttribute('aria-controls');

    // Update buttons
    tabButtons.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
      btn.setAttribute('tabindex', '-1');
    });
    targetButton.classList.add('active');
    targetButton.setAttribute('aria-selected', 'true');
    targetButton.setAttribute('tabindex', '0');

    // Update panels
    tabPanels.forEach(panel => {
      panel.classList.remove('active');
      panel.hidden = true;
    });

    const targetPanel = document.getElementById(targetId);
    if (targetPanel) {
      targetPanel.classList.add('active');
      targetPanel.hidden = false;
    }
  }

  tabButtons.forEach((button, index) => {
    // Set initial tabindex
    button.setAttribute('tabindex', index === 0 ? '0' : '-1');

    button.addEventListener('click', () => switchTab(button));

    // Keyboard navigation for tabs
    button.addEventListener('keydown', (e) => {
      let targetIndex = -1;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        targetIndex = (index + 1) % tabButtons.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        targetIndex = (index - 1 + tabButtons.length) % tabButtons.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        targetIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        targetIndex = tabButtons.length - 1;
      }

      if (targetIndex >= 0) {
        tabButtons[targetIndex].focus();
        switchTab(tabButtons[targetIndex]);
      }
    });
  });

  // ============================================
  // SCROLL REVEAL (Intersection Observer)
  // ============================================
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show everything
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // ============================================
  // ANIMATED COUNTERS
  // ============================================
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const start = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      el.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));
  } else {
    statNumbers.forEach(el => {
      el.textContent = el.dataset.target;
    });
  }

  // ============================================
  // BACK TO TOP BUTTON
  // ============================================
  const backToTop = document.getElementById('back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      const isVisible = window.scrollY > 500;
      backToTop.hidden = !isVisible;
      backToTop.classList.toggle('visible', isVisible);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 80;
        const top = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top, behavior: 'smooth' });

        // Set focus to target for accessibility
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus({ preventScroll: true });
      }
    });
  });

  // ============================================
  // ACTIVE NAV LINK HIGHLIGHTING
  // ============================================
  const sections = document.querySelectorAll('.section[id]');

  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks?.forEach(link => {
            link.classList.toggle('active',
              link.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(section => navObserver.observe(section));
  }

  // ============================================
  // PARALLAX EFFECT (SUBTLE)
  // ============================================
  const heroContent = document.querySelector('.hero-content');
  const synthwaveSun = document.querySelector('.synthwave-sun');

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        const parallaxAmount = scrollY * 0.3;
        if (heroContent) {
          heroContent.style.transform = `translateY(${parallaxAmount}px)`;
          heroContent.style.opacity = 1 - (scrollY / window.innerHeight);
        }
        if (synthwaveSun) {
          synthwaveSun.style.transform = `translateX(-50%) translateY(${scrollY * 0.15}px)`;
        }
      }
    }, { passive: true });
  }

  // ============================================
  // DYNAMIC YEAR IN FOOTER
  // ============================================
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ============================================
  // FAQ ACCORDION BEHAVIOR
  // ============================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      // Optional: close others when one opens
      if (item.open) {
        faqItems.forEach(other => {
          if (other !== item && other.open) {
            other.open = false;
          }
        });
      }
    });
  });

  // ============================================
  // KEYBOARD TRAP PREVENTION FOR MOBILE NAV
  // ============================================
  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    });
  }

  if (navMenu) {
    trapFocus(navMenu);
  }

  // ============================================
  // PERFORMANCE: LAZY LOAD MAP IFRAME
  // ============================================
  const mapIframe = document.querySelector('.map-container iframe');
  if (mapIframe && 'IntersectionObserver' in window) {
    const src = mapIframe.getAttribute('src');
    mapIframe.removeAttribute('src');
    mapIframe.setAttribute('data-src', src);

    const mapObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const iframe = entry.target;
          iframe.setAttribute('src', iframe.getAttribute('data-src'));
          mapObserver.unobserve(iframe);
        }
      });
    }, { rootMargin: '200px' });

    mapObserver.observe(mapIframe);
  }

  // ============================================
  // OPEN/CLOSED STATUS INDICATOR
  // ============================================
  function updateOpenStatus() {
    const now = new Date();
    const day = now.getDay(); // 0=Sun, 1=Mon, ...
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const time = hours + minutes / 60;

    let isOpen = false;

    if (day >= 1 && day <= 4) {
      // Mon-Thu: 11am-10pm
      isOpen = time >= 11 && time < 22;
    } else if (day === 5 || day === 6) {
      // Fri-Sat: 11am-2am (next day)
      isOpen = time >= 11 || time < 2;
    } else if (day === 0) {
      // Sunday: 11am-10pm (also open until 2am from Sat)
      isOpen = time < 2 || (time >= 11 && time < 22);
    }

    // Add status to the hero
    const tagline = document.querySelector('.hero-tagline');
    if (tagline && !document.querySelector('.open-status')) {
      const statusEl = document.createElement('span');
      statusEl.className = `open-status ${isOpen ? 'status-open' : 'status-closed'}`;
      statusEl.setAttribute('aria-label', isOpen ? 'Currently open' : 'Currently closed');
      statusEl.style.cssText = `
        display: inline-block;
        padding: 0.3rem 0.8rem;
        border-radius: 9999px;
        font-family: var(--font-heading);
        font-size: 0.8rem;
        font-weight: 600;
        letter-spacing: 0.1em;
        margin-left: 0.75rem;
        vertical-align: middle;
        ${isOpen
          ? 'background: rgba(0, 255, 100, 0.15); color: #00ff64; border: 1px solid rgba(0, 255, 100, 0.3);'
          : 'background: rgba(255, 60, 60, 0.15); color: #ff3c3c; border: 1px solid rgba(255, 60, 60, 0.3);'
        }
      `;
      statusEl.textContent = isOpen ? 'OPEN NOW' : 'CLOSED';
      tagline.appendChild(statusEl);
    }
  }

  updateOpenStatus();

  // ============================================
  // NEON CURSOR GLOW (optional, desktop only)
  // ============================================
  if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    const cursorGlow = document.createElement('div');
    cursorGlow.setAttribute('aria-hidden', 'true');
    cursorGlow.style.cssText = `
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 45, 149, 0.06) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
      transform: translate(-50%, -50%);
      transition: opacity 0.3s;
      opacity: 0;
    `;
    document.body.appendChild(cursorGlow);

    let glowVisible = false;

    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
      if (!glowVisible) {
        cursorGlow.style.opacity = '1';
        glowVisible = true;
      }
    });

    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
      glowVisible = false;
    });
  }

})();
