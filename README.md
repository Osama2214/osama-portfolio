# 🚀 Modern Portfolio Website

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.19-38B2AC.svg)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.23.26-0055FF.svg)](https://www.framer.com/motion/)

A stunning, fully responsive portfolio website showcasing modern web development skills. Built with React, Tailwind CSS, and Framer Motion with beautiful animations and dark/light mode support.

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Tech Stack](#️-tech-stack)
- [Features](#-features)
- [PWA Features](#-pwa-features)
- [Recent Updates](#-recent-updates)
- [How to Run](#-how-to-run)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [Customization](#-customization)
- [Deployment](#-deployment)
- [Author](#-author)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

## 📋 Project Overview

This portfolio website demonstrates modern web development practices including:

- **Frontend-Only:** Pure React application with no backend required
- **UI/UX:** Clean, modern design with dark/light mode toggle
- **Performance:** Optimized with Vite build tool
- **Contact Form:** EmailJS integration for direct email sending
- **Animations:** Smooth Framer Motion animations with auto-hide notifications
- **Responsive:** Fully responsive design across all devices

## 🛠️ Tech Stack

- **React 19** - Modern UI framework with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for React
- **EmailJS** - Email sending without backend
- **Lucide React** - Beautiful icons
- **React Router** - Client-side routing

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing

## ✨ Features

### 🎨 Design & UI

- 🌙 **Dark/Light Mode** - Toggle between themes with smooth transitions
- 📱 **Fully Responsive** - Works perfectly on all devices (mobile, tablet, desktop)
- 🎭 **Modern UI/UX** - Clean, professional design with attention to detail
- ✨ **Smooth Animations** - Framer Motion powered transitions and micro-interactions
- 🎯 **Auto-Hide Notifications** - Success messages disappear automatically with progress animation
- 🎨 **Custom Animations** - Gradient text effects, floating elements, and progress bars
- 📱 **PWA Ready** - Installable web app with offline capabilities, app shortcuts, and native app-like experience

### 🚀 Functionality

- 📧 **Contact Form** - Working contact form with EmailJS (no backend needed)
- 🏗️ **Projects Showcase** - Projects with filtering (All/Featured)
- 🎯 **Smooth Scrolling** - Navigation with smooth scroll to sections
- 🔝 **Scroll to Top** - Button appears after scrolling down
- 📧 **Direct Email Links** - Gmail integration for easy contact
- 🔗 **Social Media Links** - Direct links to GitHub, LinkedIn, Twitter
- 🔔 **Smart Notifications** - Animated progress bar for temporary messages

## � PWA Features

### 🏠 Installable Web App

- **App Shortcuts** - Quick access to Projects and Contact sections from home screen
- **Offline Support** - Service worker enables basic offline functionality
- **Native App Experience** - Install on desktop and mobile devices
- **Responsive Design** - Optimized for all screen sizes and orientations

### 📋 App Manifest

- **Enhanced Metadata** - Complete app information for app stores
- **Theme Integration** - Matches system dark/light mode preferences
- **Screenshots** - App preview images for installation prompts
- **Categories** - Properly categorized for app store discovery

## �🚀 Demo

Check out the live demo: [osama2214.github.io](https://osama2214.github.io/)

### 💻 Developer Experience

- 🧹 **Clean Code** - Well-structured, maintainable codebase
- ⚡ **Fast Development** - Hot reload and optimized build process
- **Mobile-First** - Responsive design approach
- 🎨 **Component-Based** - Modular React architecture

## 🚀 Recent Updates

### v1.1.0 - Enhanced User Experience

- ✨ **Auto-Hide Success Messages** - Contact form success messages now disappear automatically after 5 seconds
- 🎯 **Animated Progress Bar** - Added moving progress bar under success notifications
- 🎨 **Improved Animations** - Enhanced hover effects and button animations
- 🔗 **Updated Social Links** - Fixed GitHub project links and email integration
- 🎭 **Unified Design** - Consistent styling across all components
- 📧 **Gmail Integration** - Direct Gmail links for easy contact

### v1.0.0 - Initial Release

- 🌟 Complete portfolio website with modern design
- 📱 Fully responsive across all devices
- 🌙 Dark/Light mode toggle
- 📧 Working contact form with EmailJS
- 🎨 Beautiful animations with Framer Motion
- 📱 **Mobile-First** - Responsive design approach
- 🎨 **Custom Animations** - Gradient text, floating elements, and progress bars

## 🚀 How to Run

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Quick Start

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Osama2214/osama-portfolio.git
   cd osama-portfolio
   ```

2. **Install dependencies:**

   ```bash
   cd frontend
   npm install
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
Portfolio/
├── frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── favicon.svg
│   │   ├── manifest.json          # Enhanced PWA manifest with shortcuts
│   │   ├── Osama_Ahmed_CV.pdf
│   │   ├── robots.txt
│   │   ├── sitemap.xml
│   │   └── sw.js                  # Service worker for offline functionality
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx      # Navigation + theme toggle
│   │   │   ├── Hero.jsx        # Hero section with CTA
│   │   │   ├── About.jsx       # About section with skills
│   │   │   ├── Projects.jsx    # Projects grid with filtering
│   │   │   ├── Contact.jsx     # Contact form with auto-hide messages
│   │   │   ├── Footer.jsx      # Footer with social links
│   │   │   ├── NotFound.jsx    # 404 error page
│   │   │   └── Root.jsx        # App wrapper component
│   │   ├── data/
│   │   │   └── projects.js     # Projects data configuration
│   │   ├── hooks/
│   │   │   └── useDarkMode.js  # Dark mode toggle hook
│   │   ├── App.jsx             # Main app component
│   │   ├── App.css             # Global styles
│   │   ├── index.css           # Tailwind imports + custom animations
│   │   └── main.jsx            # Entry point
│   ├── eslint.config.js        # ESLint configuration
│   ├── index.html              # HTML template
│   ├── package.json            # Dependencies and scripts
│   ├── postcss.config.js       # PostCSS configuration
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   └── vite.config.js          # Vite build configuration
├── CHANGELOG.md                # Version history
├── CODE_OF_CONDUCT.md          # Community guidelines
├── CONTRIBUTING.md             # Contribution guidelines
├── LICENSE                     # MIT License
├── README.md                   # This file
└── SECURITY.md                 # Security policy
```

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🎨 Customization

### Colors & Theme

Edit `frontend/tailwind.config.js` to customize colors:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#3B82F6',    // Blue
      accent: '#8B5CF6',     // Purple
    },
  },
}
```

### Projects

Update your projects in `frontend/src/data/projects.js`:

```javascript
export const projects = [
  {
    id: 1,
    title: 'Project Name',
    description: 'Project description',
    image: 'image-url',
    technologies: ['React', 'Node.js'],
    github: 'github-link',
    demo: 'demo-link',
    featured: true,
  },
];
```

### Contact Form (EmailJS)

Update EmailJS credentials in `frontend/src/components/Contact.jsx`:

```javascript
await emailjs.send(
  'your_service_id',
  'your_template_id',
  { ... },
  'your_public_key'
);
```

## 🚀 Deployment

### GitHub Pages (Recommended for Portfolio)

1. **Build the project:**

   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to GitHub Pages:**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select "Deploy from a branch"
   - Choose "gh-pages" branch
   - Upload the `dist` folder contents to the `gh-pages` branch

### Netlify

1. Build the project: `cd frontend && npm run build`
2. Upload `dist` folder to Netlify
3. Done!

## 👨‍💻 Author

**Osama Ahmed**

- **Portfolio:** [osama2214.github.io](https://osama2214.github.io/)
- **GitHub:** [Osama2214](https://github.com/Osama2214)
- **LinkedIn:** [Osama Ahmed](https://www.linkedin.com/in/osama-ahmed-67127222a/)
- **Twitter:** [@OSAMA3974](https://x.com/OSAMA3974)
- **Email:** [osamahamad261981@gmail.com](mailto:osamahamad261981@gmail.com)
- **Location:** Giza, Egypt

_Backend Developer | Full Stack Enthusiast | Open Source Contributor_

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Vite](https://vitejs.dev/) - Build tool
- [EmailJS](https://www.emailjs.com/) - Email service
- [Lucide](https://lucide.dev/) - Icons

---

⭐ **Star this repo if you found it helpful!**

Made with ❤️ by Osama Ahmed
