# 🚀 Modern Portfolio Website

A stunning, fully responsive portfolio website showcasing modern web development skills. Built with React, Tailwind CSS, and Framer Motion with beautiful animations and dark/light mode support.

## 📋 Project Overview

This portfolio website demonstrates modern web development practices including:

- **Frontend-Only:** Pure React application with no backend required
- **UI/UX:** Clean, modern design with dark/light mode toggle
- **Performance:** Optimized with Vite build tool
- **Contact Form:** EmailJS integration for direct email sending

## 🛠️ Tech Stack

- **React 19** - Modern UI framework with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for React
- **EmailJS** - Email sending without backend
- **Lucide React** - Beautiful icons

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Docker** - Containerization (optional)

## ✨ Features

### 🎨 Design & UI

- 🌙 **Dark/Light Mode** - Toggle between themes with smooth transitions
- 📱 **Fully Responsive** - Works perfectly on all devices (mobile, tablet, desktop)
- 🎭 **Modern UI/UX** - Clean, professional design with attention to detail
- ✨ **Smooth Animations** - Framer Motion powered transitions and micro-interactions

### 🚀 Functionality

- 📧 **Contact Form** - Working contact form with EmailJS (no backend needed)
- 🏗️ **Projects Showcase** - Projects with filtering (All/Featured)
- 🎯 **Smooth Scrolling** - Navigation with smooth scroll to sections
- 🔝 **Scroll to Top** - Button appears after scrolling down

### 💻 Developer Experience

- 🧹 **Clean Code** - Well-structured, maintainable codebase
- ⚡ **Fast Development** - Hot reload and optimized build process
- 🐳 **Docker Ready** - Easy deployment with Docker

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

### Using Docker

```bash
docker-compose up -d
```

Then open `http://localhost:5173`

## 📁 Project Structure

```
Portfolio/
├── frontend/
│   ├── public/              # Static assets
│   │   └── favicon.svg      # Site favicon
│   └── src/
│       ├── components/      # React components
│       │   ├── Header.jsx   # Navigation + theme toggle
│       │   ├── Hero.jsx     # Hero section
│       │   ├── About.jsx    # About section
│       │   ├── Projects.jsx # Projects grid
│       │   ├── Contact.jsx  # Contact form (EmailJS)
│       │   └── Footer.jsx   # Footer with modals
│       ├── data/            # Static data
│       │   └── projects.js  # Projects data
│       ├── hooks/           # Custom hooks
│       │   └── useDarkMode.js
│       ├── App.jsx          # Main app component
│       ├── App.css          # Global styles
│       ├── index.css        # Tailwind imports
│       └── main.jsx         # Entry point
├── docker-compose.yml       # Docker configuration
└── README.md               # This file
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

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Set root directory to `frontend`
4. Deploy!

### Netlify

1. Build the project: `cd frontend && npm run build`
2. Upload `dist` folder to Netlify
3. Done!

### GitHub Pages

1. Build: `npm run build`
2. Deploy `dist` folder to `gh-pages` branch

## 👨‍💻 Author

**Osama Ahmed**

- **GitHub:** [Osama2214](https://github.com/Osama2214)
- **LinkedIn:** [Osama Ahmed](https://www.linkedin.com/in/osama-ahmed-67127222a/)
- **Twitter:** [@OSAMA3974](https://x.com/OSAMA3974)
- **Email:** [osamahamad261981@gmail.com](mailto:osamahamad261981@gmail.com)
- **Location:** Giza, Egypt

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
