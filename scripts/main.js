(function () {
  if (window.location.pathname.includes('/schedule')) {
    return;
  }

  const ready = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  };

  ready(() => {
    const navigation = document.querySelector('.navigation');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    const navLogoImages = document.querySelectorAll('.nav-logo img');
    const submenuParents = document.querySelectorAll('.nav-menu .has-submenu');
    const heroSection = document.querySelector('.hero-video');
    const navHiddenClass = 'navigation--hidden';
    let lastScrollY = window.scrollY;
    let heroBoundary = 0;
    const isMobile = () => window.matchMedia('(max-width: 1209px)').matches;

    const closeSubmenus = () => {
      submenuParents.forEach((item) => item.classList.remove('submenu-open'));
    };

    const recomputeHeroBoundary = () => {
      heroBoundary = heroSection
        ? heroSection.offsetTop + heroSection.offsetHeight
        : 0;
      lastScrollY = window.scrollY;
    };

    recomputeHeroBoundary();

    const highlightActiveNavLink = () => {
      if (!navMenu) return;
      const navLinks = navMenu.querySelectorAll('a[href]');
      if (!navLinks.length) return;
      const path = window.location.pathname;
      const currentPage = (() => {
        if (!path || path === '/' || path.endsWith('/')) return 'index.html';
        const segments = path.split('/');
        const last = segments.pop();
        return last && last.length ? last : 'index.html';
      })().toLowerCase();

      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('#')) return;
        const normalizedHref = href
          .replace('./', '')
          .split('?')[0]
          .split('#')[0]
          .toLowerCase();
        if (!normalizedHref) return;

        if (normalizedHref === currentPage) {
          link.classList.add('is-active');
        }
      });
    };

    highlightActiveNavLink();

    const toggleNav = () => {
      if (!navToggle || !navMenu) return;
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      body.classList.toggle('nav-open');
      if (!body.classList.contains('nav-open')) {
        closeSubmenus();
      }
    };

    navToggle?.addEventListener('click', toggleNav);

    navMenu?.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (!isMobile()) {
          navToggle?.classList.remove('active');
          navMenu?.classList.remove('active');
          body.classList.remove('nav-open');
        }

        if (!link.closest('.has-submenu') || !isMobile()) {
          closeSubmenus();
        }
      });
    });

    submenuParents.forEach((item) => {
      const trigger = item.querySelector(':scope > a');
      trigger?.addEventListener('click', (event) => {
        if (!isMobile()) return;
        event.preventDefault();
        const isOpen = item.classList.contains('submenu-open');
        closeSubmenus();
        if (!isOpen) {
          item.classList.add('submenu-open');
        }
      });
    });

    const updateNavigationState = () => {
      if (!navigation) return;
      if (window.scrollY > 10) {
        navigation.classList.add('scrolled');
      } else {
        navigation.classList.remove('scrolled');
      }

      const shouldUseDarkLogo =
        !navigation.classList.contains('navigation-overlay') ||
        navigation.classList.contains('scrolled');

      navLogoImages.forEach((img) => {
        const { logoLight, logoDark } = img.dataset;
        if (!logoLight || !logoDark) return;
        const desiredSrc = shouldUseDarkLogo ? logoDark : logoLight;
        if (img.getAttribute('src') !== desiredSrc) {
          img.setAttribute('src', desiredSrc);
        }
      });
    };

    const handleNavVisibility = () => {
      if (!navigation) return;
      if (!heroSection) {
        navigation.classList.remove(navHiddenClass);
        return;
      }

      const currentY = window.scrollY;
      const beyondHero = currentY > heroBoundary;
      const scrollingDown = currentY > lastScrollY;
      const menuOpen = body.classList.contains('nav-open');

      if (!beyondHero || menuOpen) {
        navigation.classList.remove(navHiddenClass);
      } else if (scrollingDown) {
        navigation.classList.add(navHiddenClass);
      } else {
        navigation.classList.remove(navHiddenClass);
      }

      lastScrollY = currentY;
    };

    // Mobile Action Bar Visibility
    const mobileActionBar = document.querySelector('.mobile-action-bar');
    const mobileActionBarHiddenClass = 'mobile-action-bar--hidden';
    let lastActionBarScrollY = window.scrollY;

    const handleMobileActionBarVisibility = () => {
      if (!mobileActionBar) return;

      const currentY = window.scrollY;
      const beyondHero = heroSection ? currentY > heroBoundary : true;

      // Hide mobile action bar while in hero section
      if (!beyondHero) {
        mobileActionBar.classList.add(mobileActionBarHiddenClass);
      } else {
        mobileActionBar.classList.remove(mobileActionBarHiddenClass);
      }

      lastActionBarScrollY = currentY;
    };

    const handleScroll = () => {
      updateNavigationState();
      handleNavVisibility();
      handleMobileActionBarVisibility();
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
      recomputeHeroBoundary();
      handleNavVisibility();
      if (!isMobile()) {
        closeSubmenus();
      }
    });

    const cookieBanner = document.getElementById('cookieBanner');
    const COOKIE_KEY = 'ser_cookie_acceptance';
    let cookieTimeout;
    const COOKIE_DELAY = 2500;

    const scheduleCookieBanner = () => {
      if (!cookieBanner || localStorage.getItem(COOKIE_KEY)) return;
      clearTimeout(cookieTimeout);
      cookieTimeout = window.setTimeout(() => {
        cookieBanner.classList.add('show');
      }, COOKIE_DELAY);
    };

    const handleCookieVisibility = () => {
      if (!cookieBanner || localStorage.getItem(COOKIE_KEY)) return;
      const currentY = window.scrollY;
      if (currentY > heroBoundary) {
        scheduleCookieBanner();
      } else {
        clearTimeout(cookieTimeout);
        cookieBanner.classList.remove('show');
      }
    };

    handleCookieVisibility();

    window.acceptCookies = () => {
      localStorage.setItem(COOKIE_KEY, 'accepted');
      cookieBanner?.classList.remove('show');
    };

    window.addEventListener('scroll', handleCookieVisibility, { passive: true });

    // Horizontal Scroll Drag - Apple Style (reusable)
    const initDragScroll = (container) => {
      if (!container) return;
      let isDown = false;
      let startX;
      let scrollLeft;

      container.addEventListener('mousedown', (e) => {
        isDown = true;
        container.classList.add('dragging');
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
      });

      container.addEventListener('mouseleave', () => {
        isDown = false;
        container.classList.remove('dragging');
      });

      container.addEventListener('mouseup', () => {
        isDown = false;
        container.classList.remove('dragging');
      });

      container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX);
        container.scrollLeft = scrollLeft - walk;
      });
    };

    // Initialize drag scroll for all horizontal scroll containers
    initDragScroll(document.querySelector('.why-scroll-container'));
    initDragScroll(document.querySelector('.testimonial-scroll-container'));
  });
})();