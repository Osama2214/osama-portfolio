# Osama Ahmed - Developer Portfolio Website

Welcome to the source code repository of my personal developer portfolio website. This is a premium, highly interactive, and responsive portfolio designed to showcase my engineering projects, technical skills, certifications, and academic background.

Live Deployment: **[osama-portfolio-six.vercel.app](https://osama-portfolio-six.vercel.app/)**

---

## 🚀 Key Features

* **Sleek Glassmorphism & Dark Theme**: Built with a custom, modern dark UI using a tailored color palette, gradients, and soft glows.
* **Optimized Canvas Particle Network**: Features a custom particle network background implemented in pure JavaScript using an **O(n) grid-bucket algorithm** (rather than O(n²)) to ensure high-frame-rate rendering on all viewports.
* **Interactive Mouse-Glow Backlight**: A dynamic cursor-tracking light spotlight (`--mx` & `--my` CSS variables) that enhances background readability and depth.
* **C# IDE Mock Editor Window**: An interactive, syntax-highlighted code editor mockup representing developer credentials.
* **Typewriter Tagline loops**: Automated, zero-dependency typewriter animation cycling through core backend developer taglines.
* **Smooth "Show More/Less" Project Toggle**: An animated projects grid expand/collapse button equipped with CSS transitions that avoids layout jumping.
* **Secure AJAX Contact Form**: Intercepts contact requests for asynchronous, inline submission via Formspree.
* **100% Responsive Architecture**: Built with fluid clamp typography, CSS grids, and mobile navigation auto-close.

---

## 🛠️ Tech Stack & Technologies

* **Core Structure**: HTML5 (Semantic elements)
* **Styling & Layout**: CSS3 (Vanilla grids, flexbox, variables, keyframe animations)
* **Interactive Logic**: Vanilla JavaScript (ES6+, IntersectionObserver API, HTML5 Canvas API)
* **Integrations**: Formspree (Contact Form endpoint)
* **Fonts & Icons**: Google Fonts (Outfit, JetBrains Mono), Devicons CDN, Credly Badge API

---

## 📁 File Structure

```text
├── index.html            # Core HTML layout, navbar, sections, and form structure.
├── style.css             # Main stylesheet containing theme tokens, utility classes, and media queries.
├── script.js             # Typewriter loops, particle animation loop, active section tracker, and form submit.
├── 404.html              # Custom 404 error page.
├── Osama_Ahmed_CV.pdf    # Downloadable PDF resume.
├── vercel.json           # Vercel deployment configuration.
└── icons/                # Local SVG assets (platforms, icons, etc.)
```

---

## 💻 Local Setup & Installation

To run this project locally, simply clone the repository and open `index.html` in your web browser. You can also run a simple local development server:

### Option A: VS Code Live Server Extension
Open the directory in VS Code, right-click `index.html`, and select **Open with Live Server**.

### Option B: Python Local Server
Run the following command in your terminal from the project root:
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your browser.

---

## 📄 License & Intellectual Property

This project is created by **Osama Ahmed** as a personal developer portfolio. Feel free to explore the code for reference and learning purposes.
