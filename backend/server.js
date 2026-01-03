import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
const projects = [
  {
    id: 1,
    title: 'E-Commerce Web App',
    description: 'Full-stack e-commerce solution with React and Laravel',
    image: 'https://picsum.photos/seed/ecommerce/400/250',
    technologies: ['React', 'Laravel', 'MySQL', 'Tailwind CSS'],
    github: 'https://github.com/Osama2214/ecommerce',
    demo: 'https://ecommerce-demo.com',
    featured: true,
  },
  {
    id: 2,
    title: 'Task Management App',
    description: 'Collaborative task management with real-time updates',
    image: 'https://picsum.photos/seed/taskapp/400/250',
    technologies: ['Vue.js', 'Node.js', 'Socket.io', 'MongoDB'],
    github: 'https://github.com/Osama2214/taskapp',
    demo: 'https://taskapp-demo.com',
    featured: true,
  },
  {
    id: 3,
    title: 'Weather Dashboard',
    description: 'Beautiful weather app with location-based forecasts',
    image: 'https://picsum.photos/seed/weather/400/250',
    technologies: ['React', 'OpenWeather API', 'Chart.js'],
    github: 'https://github.com/Osama2214/weather',
    demo: 'https://weather-demo.com',
    featured: false,
  },
  {
    id: 4,
    title: 'Portfolio Website',
    description: 'Modern portfolio with dark mode and animations',
    image: 'https://picsum.photos/seed/portfolio/400/250',
    technologies: ['React', 'Framer Motion', 'Tailwind CSS'],
    github: 'https://github.com/Osama2214/portfolio',
    demo: 'https://portfolio-demo.com',
    featured: true,
  },
];

// Routes
app.get('/api/projects', (req, res) => {
  res.json(projects);
});

app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  // Basic validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      message: 'All fields are required',
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: 'Invalid email format',
    });
  }

  // Here you would typically send an email or save to database
  console.log('Contact form submission:', { name, email, subject, message });

  res.json({
    message: 'Thank you! Your message has been sent successfully.',
    data: { name, email, subject, message },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
