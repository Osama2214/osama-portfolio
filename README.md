# Osama Ahmed — Developer Portfolio

Welcome to the repository of my personal developer portfolio! This website serves as a digital resume, highlighting my projects, skills, education, and credentials as an IT student and aspiring backend developer.

🌐 **Live URL:** [https://osama-portfolio-six.vercel.app/](https://osama-portfolio-six.vercel.app/)

---

## 🚀 Key Highlights & Developer Info
*   **Developer:** Osama Ahmed Abdelaziz
*   **Role:** Aspiring Backend Developer (.NET) & IT Student
*   **Education:** B.Sc. in Information Technology at the **Egyptian E-Learning University (EELU)** (Expected Graduation: 2028)
*   **Location:** 6th of October, Giza, Egypt
*   **Certifications:** Cisco CCNA: Introduction to Networks

---

## 🎨 Tech Stack & Website Architecture
This portfolio is built from scratch as a highly optimized, single-page application utilizing vanilla web technologies to achieve premium design aesthetics, fast load times, and smooth micro-interactions.

*   **HTML5:** Structured semantic markup optimized for accessibility and SEO.
*   **Vanilla CSS3:** A fully custom design system using CSS variables, featuring a sleek modern dark mode (`#050812`), glassmorphism, responsive grids, flex layouts, and custom media queries.
*   **JavaScript (ES6+):** Pure vanilla JavaScript handling all page animations, states, and interactive graphics without external library bloat.
*   **Hosting & Deployment:** Deployed on **Vercel** with clean URLs enabled via `vercel.json`.

---

## ✨ Features & Micro-Interactions
The website incorporates advanced client-side scripts to deliver a premium user experience:

1.  **Optimized Particle Canvas Background:**
    *   An interactive particle network drawn on an HTML5 `<canvas>`.
    *   To prevent performance drops, particles are bucketed into a **2D Spatial Grid Map** (`O(N)` average complexity) rather than checking all pairs (`O(N²)`). Connections are drawn dynamically based on distance.
2.  **Magnetic Card Tilt & Cursor Glow:**
    *   Cards (projects, credentials, and contact) compute mouse coordinates relative to the card's bounding rectangle on `mousemove` to apply interactive 3D rotation (`rotateX`/`rotateY`) and reposition a radial glow spotlight.
3.  **Dynamic Scroll Indicators & Active Navigation Pill:**
    *   Uses the browser's `IntersectionObserver` API to track the currently visible section, dynamically moving the navigation indicator pill (`#navPill`) to underline the active menu item.
4.  **Role Typewriter Effect:**
    *   A fluid text animation loops through core developer profiles (Backend Developer, .NET Learner, App Builder, IT Student, Problem Solver).
5.  **AJAX Contact Form:**
    *   Integrated with **Formspree** via asynchronous `fetch` requests, handling loading states, success prompts, and error boundaries without page reloads.

---

## 🛠️ Main Showcase Projects
The portfolio highlights:

*   **Munjez:** A full-featured, offline-first productivity desktop application designed, built, and shipped solo. 
    *   *Features:* Task Management, Calendar (including Hijri support), Pomodoro Focus Timer, Habit Tracker with Streaks, Stopwatch, and a White Noise Mixer.
    *   *Tech Stack:* React, TypeScript, Tauri, Rust, Vite, Firebase.
    *   *Links:* [Live Site](https://munjez-website.vercel.app) | [GitHub Releases](https://github.com/Osama2214/munjez-releases)
*   **Munjez Landing Page:** A multilingual (Arabic/English) marketing landing page, changelog, and privacy policy for the Munjez app.
    *   *Tech Stack:* HTML, CSS, JavaScript, Vercel.
    *   *Links:* [Live Site](https://munjez-website.vercel.app) | [GitHub](https://github.com/Osama2214/munjez-website)

---

## 📦 How to Run Locally

Since the website uses standard vanilla web technologies, running it locally is straightforward.

### Method 1: Simple Open
Simply double-click the `index.html` file to open it in your browser. (Note: Some SVG resources or local file access might require an HTTP server depending on browser CORS policies).

### Method 2: Local HTTP Server (Recommended)
You can serve the directory using a simple server. For example:

Using Python:
```bash
python -m http.server 8000
```
Or using Node.js:
```bash
npx serve
```
Open `http://localhost:8000` (or the port specified by serve) in your browser.

---

## 📁 Project Structure
```text
├── 404.html               # Custom 404 error page matching website theme
├── Osama_Ahmed_CV.pdf     # Resume PDF download
├── favicon.svg            # Site favicon
├── index.html             # Core landing page markup
├── og-image.png           # Open Graph social sharing image
├── script.js              # Site interaction, particles, and typewriter scripts
├── style.css              # Custom design system and layout styling
└── vercel.json            # Vercel configuration
```

---

*Made with ❤️ by [Osama Ahmed](https://github.com/Osama2214)*
