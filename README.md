# Dr. Sebastian Müller-Bellé — Personal Website

A minimal, typography-forward personal website for Dr. Sebastian Müller-Bellé, built as a static single-page site with plain HTML, CSS, and vanilla JavaScript.

## Current Status

- Static site — no framework, package manager, or build step required
- Main branch: `main`
- Entry point: `index.html`
- Local development: serve the repository root with any static web server
- Deployment target: GitHub Pages or any static hosting provider

## Design Philosophy

- **Minimalist editorial aesthetic** inspired by modern studio portfolios
- **Typography-forward** using Basier Square Mono as the active site font, with Borna font files retained in the repository for possible future use
- **Generous whitespace** with grid-based layout
- **Restrained palette** with light/dark mode support
- **Subtle microinteractions** respecting reduced motion preferences
- **Progressive enhancement** — core content remains available without JavaScript

## Features

- Single-page design with smooth-scrolling anchor navigation
- Sticky header with active section indicator
- Light/dark theme controls with automatic system preference mode and manual override
- Responsive hero image
- Accessible biography and content sections
- Memberships and supported organizations section
- Curriculum vitae section with dedicated styling and locking script
- Scroll reveal animations
- Fully responsive layout for desktop, tablet, and mobile
- Keyboard-accessible navigation and controls

## File Structure

```text
/
├── index.html                  # Main page content and markup
├── README.md                   # Project documentation
└── assets/
    ├── backup/
    │   └── styles.css          # Backup/reference stylesheet
    ├── css/
    │   ├── styles.css          # Core site styles, layout, themes, responsive rules
    │   └── cv-section.css      # CV-specific styling
    ├── fonts/
    │   ├── BasierSquareMono-*.otf # Active site typeface family
    │   ├── Borna-*.otf            # Additional retained font family
    │   └── .gitkeep
    ├── images/
    │   └── header-smb.jpg      # Header/hero image
    └── js/
        ├── main.js             # Navigation, theme handling, scrolling, interactions
        └── cv-lock.js          # CV section lock/unlock behavior
```

## Typography

The active site typography uses the Basier Square Mono font family:

- Body text: Basier Square Mono Regular, weight 400
- Links and emphasized interface text: Basier Square Mono Medium, weight 500
- Menu items and headings: Basier Square Mono SemiBold, weight 600
- Main name/headline: Basier Square Mono Bold, weight 700

Borna font files are also retained in the repository for possible future use.

## Local Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/semube/web2026.git
   cd web2026
   ```

2. Start a local static server from the repository root. For example:

   ```bash
   python3 -m http.server 4173
   ```

3. Open the site in a browser:

   ```text
   http://127.0.0.1:4173/
   ```

You can also open `index.html` directly in a browser, but using a local server better reflects how the site will behave when hosted.

## Content Editing Guide

Most content lives in `index.html`.

Common updates:

- Profile copy and biography: edit the relevant sections in `index.html`
- Contact links: update the links in the Connect section
- LinkedIn URL: currently intentionally left as configured in `index.html`
- Deloitte profile links: English and German profile URLs are listed separately in the Connect section
- Memberships and supported organizations: edit the corresponding section in `index.html`
- CV content and access behavior: edit `index.html`, `assets/css/cv-section.css`, and `assets/js/cv-lock.js` as needed
- CV PDF download: regenerate `assets/files/sebastian-mueller-belle-cv.pdf` after CV content changes with `npm install` and `npm run generate:cv-pdf`

## Styling Guide

- Core design tokens, layout rules, theme colors, and responsive behavior are in `assets/css/styles.css`
- CV-specific presentation is in `assets/css/cv-section.css`
- Light and dark theme values are controlled with CSS custom properties
- Mobile header spacing is controlled by the mobile `--header-height` value in `assets/css/styles.css`; verify it whenever the mobile navigation changes so the fixed header does not overlap the intro title
- Mobile CV password form sizing is controlled in the mobile rules of `assets/css/cv-section.css`; keep the password input as a compact single-line field
- Motion should continue to respect `prefers-reduced-motion`

## JavaScript Guide

- `assets/js/main.js` handles general site behavior such as navigation state, theme controls, automatic system theme syncing, smooth scrolling, and UI interactions
- `assets/js/cv-lock.js` handles CV section locking/unlocking behavior
- The site should remain readable and navigable if JavaScript is unavailable

## Quality Checks

Before committing changes, run a quick static check:

```bash
# Check JavaScript syntax
node --check assets/js/main.js
node --check assets/js/cv-lock.js

# Regenerate the downloadable CV PDF after CV content changes
npm run generate:cv-pdf

# Serve locally and smoke-test the page
python3 -m http.server 4173
```

Then verify in a browser:

- Homepage loads successfully
- CSS and JavaScript assets load without 404s
- Header image displays correctly
- Navigation anchors work
- Light/dark mode works
- Auto theme mode follows the user’s OS color-scheme setting unless a manual override is selected
- CV section behaves as expected
- CV PDF download appears only after unlocking the protected section and opens/downloads successfully
- Mobile layout remains usable
- Mobile header/navigation does not overlap the name/title
- Mobile CV password input remains compact and aligned with the unlock button

## Documentation Maintenance

Keep this README up to date with every meaningful future change. In particular, update it whenever:

- Files, folders, or asset locations change
- New sections or features are added
- Setup, deployment, or testing steps change
- JavaScript behavior changes in a way future maintainers should understand
- Content ownership, placeholders, or editing instructions change

This README should stay accurate enough that a future contributor can understand the site structure and make safe edits without reverse-engineering the project.

## Browser Support

Target current versions of:

- Chrome
- Firefox
- Safari
- Edge
- Mobile Safari
- Chrome for Android

## Accessibility

The site is designed with accessibility and progressive enhancement in mind:

- Semantic HTML landmarks
- Skip link to main content
- Visible focus styles with `:focus-visible`
- Keyboard-accessible navigation and interactions
- Sufficient structure for assistive technologies
- Respects `prefers-reduced-motion`
- Respects `prefers-color-scheme`

## License

All rights reserved. Font files are subject to their respective license terms.
