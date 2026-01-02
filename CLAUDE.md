# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML website for Swiss Expat Realtor, a boutique relocation agency serving Zurich, Zug, Schwyz, and Basel. The site helps expats find housing and relocation services in Switzerland.

## Technology Stack

- **Frontend**: Static HTML pages with vanilla JavaScript
- **Styling**: Custom CSS (base.css + layout.css) with Futura Cyrillic font family
- **Icons**: Font Awesome 6.5.2 (loaded via CDN)
- **Components**: Radix UI React Radio Group (minimal React dependency for specific UI elements)

## Project Structure

```
/var/www/mazdek.ch/new2/
├── *.html              # Page files (index, about, contact, services, etc.)
├── scripts/
│   ├── main.js         # Global navigation, scroll handling, cookie banner
│   ├── schedule.js     # Calendar booking system for consultations
│   └── faq.js          # FAQ accordion functionality
├── styles/
│   ├── base.css        # Font definitions, CSS variables, base styles
│   └── layout.css      # Layout components, responsive styles
├── assets/
│   ├── images/         # Site images
│   └── videos/         # Hero background videos
├── logo/               # Logo variants (white/black for light/dark contexts)
├── font/               # Futura Cyrillic font files (.ttf)
└── logos-company/      # Partner company logos
```

## Key JavaScript Patterns

All JS files use an IIFE pattern with a `ready()` helper for DOM initialization:
```javascript
(function () {
  const ready = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  };
  ready(() => { /* code */ });
})();
```

## Navigation System

- Overlay navigation with scroll-based logo switching (white logo on hero, black on scroll)
- Mobile breakpoint: 1209px
- CSS classes: `.navigation-overlay`, `.scrolled`, `.navigation--hidden`
- Submenu toggle via `.has-submenu` and `.submenu-open` classes

## Page-Specific Features

- **schedule.html**: Calendar booking system with URL params support (`?date=YYYY-MM-DD&time=HH:MM`)
- **faq.html**: Accordion with hash-based deep linking
- **Pages with hero video**: Use `body.has-hero-video` class

## Deployment

Static files served directly from `/var/www/mazdek.ch/new2/`. No build step required - edit HTML/CSS/JS files directly.
