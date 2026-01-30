# Dr. Sebastian Müller-Bellé — Personal Website

A minimal, typography-forward personal website built with plain HTML, CSS, and vanilla JavaScript.

## Design Philosophy

- **Minimalist editorial aesthetic** inspired by modern studio portfolios
- **Typography-forward** using the Borna font family
- **Generous whitespace** with grid-based layout
- **Restrained palette** with light/dark mode support
- **Subtle microinteractions** respecting reduced motion preferences

## Features

- Single-page design with smooth-scrolling anchor navigation
- Sticky header with active section indicator
- Light/Dark theme toggle with system preference detection
- Accessible `<details>/<summary>` biography expansion
- Scroll reveal animations
- Fully responsive (desktop, tablet, mobile)
- Progressive enhancement — works without JavaScript

## Typography

| Element | Font Style | Weight |
|---------|------------|--------|
| Body text | Borna Regular | 400 |
| Links | Borna Medium | 500 |
| Menu items, headings | Borna SemiBold | 600 |
| Name (H1) | Borna Bold | 700 |

## File Structure

```
/
├── index.html
├── README.md
└── assets/
    ├── css/
    │   └── styles.css
    ├── fonts/
    │   ├── Borna-Regular.otf
    │   ├── Borna-RegularItalic.otf
    │   ├── Borna-Medium.otf
    │   ├── Borna-MediumItalic.otf
    │   ├── Borna-SemiBold.otf
    │   ├── Borna-SemiBoldItalic.otf
    │   ├── Borna-Bold.otf
    │   └── Borna-BoldItalic.otf
    └── js/
        └── main.js
```

## Setup

1. Clone this repository
2. Add your Borna font files (`.otf`) to the `assets/fonts/` directory
3. Open `index.html` in a browser

## Customization

### Links
Update the placeholder URLs in `index.html`:
- LinkedIn: Replace `https://www.linkedin.com/`
- Email: Replace `mailto:you@example.com`

### Colors
Edit CSS custom properties in `assets/css/styles.css` under `[data-theme="light"]` and `[data-theme="dark"]`.

### Content
All content is in `index.html` — edit the biography, memberships, and links as needed.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari / Chrome

## Accessibility

- Semantic HTML landmarks
- Skip link to main content
- Visible focus styles with `:focus-visible`
- Keyboard-accessible navigation and interactions
- Respects `prefers-reduced-motion`
- Respects `prefers-color-scheme`

## License

All rights reserved. The Borna font is subject to its own license terms.
