(function () {
  const ready = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  };

  ready(() => {
    // FAQ Accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach((item) => {
      const question = item.querySelector('.faq-question');

      question?.addEventListener('click', () => {
        // Toggle current item
        const isActive = item.classList.contains('active');

        // Close all items
        faqItems.forEach((otherItem) => {
          otherItem.classList.remove('active');
          const otherQuestion = otherItem.querySelector('.faq-question');
          otherQuestion?.setAttribute('aria-expanded', 'false');
        });

        // Open clicked item if it wasn't active
        if (!isActive) {
          item.classList.add('active');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // Smooth scroll to FAQ categories
    const categoryLinks = document.querySelectorAll('.faq-category-card');

    categoryLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            const offset = 120; // Account for fixed nav
            const targetPosition = targetElement.offsetTop - offset;

            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });

    // Open FAQ item from URL hash
    const hash = window.location.hash;
    if (hash) {
      // If hash points to a specific section, scroll to it
      const targetSection = document.querySelector(hash);
      if (targetSection) {
        setTimeout(() => {
          const offset = 120;
          const targetPosition = targetSection.offsetTop - offset;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }, 300);
      }
    }
  });
})();
