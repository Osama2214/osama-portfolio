# Osama Ahmed — Developer Portfolio Website

Welcome to the source code repository of my personal developer portfolio website. This is a premium, highly interactive, and responsive portfolio designed to showcase my engineering projects, technical skills, certifications, and academic background — backed by a small set of real serverless features (project reactions, live GitHub stats).

Live Deployment: **[osama-portfolio-six.vercel.app](https://osama-portfolio-six.vercel.app/)**

---

## 🚀 Key Features

* **Sleek Glassmorphism & Dark Theme**: Custom, modern dark UI with a tailored color palette, gradients, and soft glows.
* **Optimized Canvas Particle Network**: Custom particle network background implemented in pure JavaScript using an **O(n) grid-bucket algorithm** (rather than O(n²)) to ensure high-frame-rate rendering on all viewports.
* **Interactive Mouse-Glow Backlight**: A dynamic cursor-tracking light spotlight (`--mx` & `--my` CSS variables) that enhances background readability and depth.
* **Portfolio OS**: A full desktop-style easter egg — a boot screen, taskbar, dock, draggable/resizable windows, and mini apps including **Snake**, **Tic-Tac-Toe**, and **Flappy Bird**.
* **In-Browser Terminal Console**: A retro terminal panel with a real command set for exploring the site and its author from the keyboard.
* **Command Palette (⌘K)**: Fuzzy-searchable quick-navigation palette for jumping to sections, projects, and actions.
* **C# IDE Mock Editor Window**: An interactive, syntax-highlighted code editor mockup representing developer credentials.
* **Typewriter Tagline Loops**: Automated, zero-dependency typewriter animation cycling through core backend developer taglines.
* **Client Testimonials**: A scrolling marquee of real client reviews.
* **Project Reactions**: Persisted like/love/star counters per project, backed by a Redis store.
* **Live GitHub Stats**: Server-side fetch of public GitHub profile/repo stats, cached in Redis to stay well under API rate limits.
* **Matrix Mode & Hacker Effects / Easter Eggs**: Toggleable Matrix rain effect, a DevTools console easter egg, and other hidden interactions.
* **Ambient Audio**: Optional ambient/startup/shutdown sound design tied to the Portfolio OS experience.
* **Smooth "Show More/Less" Project Toggle**: Animated projects grid expand/collapse button with CSS transitions that avoid layout jumping.
* **Secure AJAX Contact Form**: Intercepts contact requests for asynchronous, inline submission via Formspree.
* **100% Responsive Architecture**: Fluid clamp typography, CSS grids, and mobile navigation auto-close.

---

## 🛠️ Tech Stack & Technologies

* **Core Structure**: HTML5 (Semantic elements)
* **Styling & Layout**: CSS3 — modularized per feature (`css/base.css`, `css/hero.css`, `css/os-core.css`, `css/effects-hacker.css`, `css/responsive.css`, etc.), vanilla grids, flexbox, variables, keyframe animations.
* **Interactive Logic**: Vanilla JavaScript (ES6+, IntersectionObserver API, HTML5 Canvas API) — modularized per feature (`js/portfolio-os.js`, `js/os-games.js`, `js/terminal-console.js`, `js/command-palette.js`, `js/github.js`, `js/reactions.js`, etc.)
* **Backend**: Node.js Vercel Serverless Functions (zero-dependency, `api/*.js`) for the reactions and GitHub stats endpoints.
* **Storage**: Upstash Redis (REST API) for reaction counts and GitHub stats caching.
* **Integrations**: Formspree (contact form), GitHub REST API (live stats).
* **Fonts & Icons**: Google Fonts (Outfit, JetBrains Mono), Devicons CDN, Credly Badge API.

---

## 📁 File Structure

```text
├── index.html               # Core HTML layout, navbar, sections, Portfolio OS shell, and form structure.
├── 404.html                 # Custom 404 error page.
├── css/                     # Modular stylesheets (base, hero, sections, OS, effects, responsive, etc.)
├── js/                      # Modular client scripts (Portfolio OS, games, terminal, command palette, effects, etc.)
├── api/                     # Vercel serverless functions (reactions, GitHub stats)
├── icons/                   # Local SVG/PNG assets (platforms, icons, etc.)
├── audio/                   # Ambient/startup/shutdown sound effects for Portfolio OS
├── Osama_Ahmed_CV.pdf       # Downloadable PDF resume.
├── favicon.svg / og-image.png
├── robots.txt / sitemap.xml
└── vercel.json               # Vercel deployment configuration (routing, security headers).
```

---

## 💻 Local Setup & Installation

To run this project locally, clone the repository and open `index.html` in your web browser, or run a simple local development server:

### Option A: VS Code Live Server Extension
Open the directory in VS Code, right-click `index.html`, and select **Open with Live Server**.

### Option B: Python Local Server
Run the following command in your terminal from the project root:
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your browser.

> Note: the static site works fully without any backend configuration. Project reactions and live GitHub stats are backed by Vercel serverless functions and Upstash Redis — without them configured, those features degrade gracefully. Run `vercel dev` to exercise the `api/` functions locally.

---

## 📄 License & Intellectual Property

This project is created by **Osama Ahmed** as a personal developer portfolio. Feel free to explore the code for reference and learning purposes.
