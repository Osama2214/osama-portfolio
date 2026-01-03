# 🚀 Modern Portfolio Website

A stunning, fully responsive portfolio website showcasing modern web development skills. Built with React, Tailwind CSS, and Node.js API with beautiful animations and dark/light mode support.

![Portfolio Preview](./frontend/public/portfolio-preview.png)

## 📋 Project Overview

This portfolio website demonstrates modern web development practices including:
- **Frontend:** React with TypeScript-like patterns, responsive design, and smooth animations
- **Backend:** RESTful API built with Node.js and Express
- **UI/UX:** Clean, modern design with dark/light mode toggle
- **Performance:** Optimized with Vite build tool and lazy loading

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI framework with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for React
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework for Node.js
- **CORS** - Cross-origin resource sharing
- **JSON** - Data storage (easily replaceable with database)

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## ✨ Features

### 🎨 Design & UI
- 🌙 **Dark/Light Mode** - Toggle between themes with smooth transitions
- 📱 **Fully Responsive** - Works perfectly on all devices (mobile, tablet, desktop)
- 🎭 **Modern UI/UX** - Clean, professional design with attention to detail
- ✨ **Smooth Animations** - Framer Motion powered transitions and micro-interactions

### 🚀 Functionality
- 📧 **Contact Form** - Working contact form with validation and API integration
- 🏗️ **Dynamic Projects** - Projects loaded from API with filtering (All/Featured)
- 🔄 **Real-time API** - Live data fetching with loading states and error handling
- 🎯 **Smooth Scrolling** - Navigation with smooth scroll to sections

### 💻 Developer Experience
- 🧹 **Clean Code** - Well-structured, maintainable codebase
- 🔧 **API Abstraction** - Centralized API service layer
- ⚡ **Fast Development** - Hot reload and optimized build process
- 🐛 **Error Handling** - Comprehensive error states and user feedback

## 📸 Screenshots

### Desktop View (Light Mode)
![Desktop Light](./frontend/public/screenshots/desktop-light.png)

### Desktop View (Dark Mode)
![Desktop Dark](./frontend/public/screenshots/desktop-dark.png)

### Mobile View
![Mobile](./frontend/public/screenshots/mobile.png)

### Projects Section
![Projects](./frontend/public/screenshots/projects.png)

### Contact Form
![Contact](./frontend/public/screenshots/contact.png)

## 🚀 How to Run

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**

### Frontend Setup

1. **Clone and navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
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

### Backend Setup

1. **Navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start API server:**
   ```bash
   node server.js
   ```

4. **API will be available at:**
   ```
   http://localhost:8000
   ```

### Full Development Setup

1. **Start Backend (Terminal 1):**
   ```bash
   cd backend
   node server.js
   ```

2. **Start Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open Portfolio:**
   ```
   http://localhost:5173
   ```

## 📡 API Endpoints

### Projects API
```
GET /api/projects
```
**Response:**
```json
[
  {
    "id": 1,
    "title": "E-Commerce Platform",
    "description": "Full-stack e-commerce solution with React and Laravel",
    "image": "https://via.placeholder.com/400x250",
    "technologies": ["React", "Laravel", "MySQL", "Tailwind CSS"],
    "github": "https://github.com/username/ecommerce",
    "demo": "https://ecommerce-demo.com",
    "featured": true
  }
]
```

### Contact API
```
POST /api/contact
```
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "Hello, I'm interested in your services..."
}
```

**Response:**
```json
{
  "message": "Thank you! Your message has been sent successfully.",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Project Inquiry",
    "message": "Hello, I'm interested in your services..."
  }
}
```

## 📁 Project Structure

```
Portfolio/
├── frontend/
│   ├── public/
│   │   ├── screenshots/          # Screenshots for README
│   │   └── portfolio-preview.png # Main preview image
│   └── src/
│       ├── components/           # React components
│       │   ├── Header.jsx       # Navigation + theme toggle
│       │   ├── Hero.jsx         # Hero section
│       │   ├── About.jsx        # About section
│       │   ├── Projects.jsx     # Projects grid with API
│       │   ├── Contact.jsx      # Contact form
│       │   └── Footer.jsx       # Footer
│       ├── services/            # API services
│       │   └── api.js           # Axios configuration
│       ├── data/                # Static data
│       │   └── portfolioData.js # Fallback data
│       ├── hooks/               # Custom hooks
│       │   └── useDarkMode.js   # Theme management
│       ├── App.jsx              # Main app component
│       └── main.jsx             # Entry point
├── backend/
│   ├── server.js                # Express server
│   ├── package.json             # Dependencies
│   └── node_modules/            # Installed packages
└── README.md                    # This file
```

## 🔧 Available Scripts

### Frontend Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend Scripts
```bash
node server.js   # Start API server
```

## 🎨 Customization

### Colors & Theme
Edit `frontend/tailwind.config.js` to customize colors:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#3B82F6',    // Change primary color
      secondary: '#1F2937',  // Change secondary color
    },
  },
}
```

### Content
Update personal information in:
- `frontend/src/data/portfolioData.js` - Projects and skills
- `frontend/src/components/Hero.jsx` - Personal info
- `frontend/src/components/About.jsx` - About content

### API Data
Modify `backend/server.js` to change API responses or connect to a real database.

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Upload `dist` folder to your hosting platform
3. Configure environment variables if needed

### Backend (Heroku/Railway)
1. Deploy `backend` folder to your server
2. Set environment variables
3. Update frontend API base URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- Portfolio: [https://your-portfolio.com](https://your-portfolio.com)
- LinkedIn: [https://linkedin.com/in/your-profile](https://linkedin.com/in/your-profile)
- GitHub: [https://github.com/your-username](https://github.com/your-username)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Vite](https://vitejs.dev/) - Build tool
- [Express.js](https://expressjs.com/) - Web framework

---

⭐ **Star this repo if you found it helpful!**

Made with ❤️ and modern web technologies