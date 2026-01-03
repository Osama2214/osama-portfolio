export const skills = [
  {
    id: 1,
    category: 'Frontend',
    technologies: [
      { name: 'React', level: 90 },
      { name: 'Vue.js', level: 85 },
      { name: 'TypeScript', level: 80 },
      { name: 'Tailwind CSS', level: 95 },
      { name: 'JavaScript', level: 90 }
    ]
  },
  {
    id: 2,
    category: 'Backend',
    technologies: [
      { name: 'Node.js', level: 85 },
      { name: 'PHP/Laravel', level: 88 },
      { name: 'Python', level: 75 },
      { name: 'MySQL', level: 85 },
      { name: 'MongoDB', level: 70 }
    ]
  },
  {
    id: 3,
    category: 'Tools & Others',
    technologies: [
      { name: 'Git', level: 90 },
      { name: 'Docker', level: 75 },
      { name: 'AWS', level: 70 },
      { name: 'Figma', level: 80 },
      { name: 'Linux', level: 75 }
    ]
  }
]

export const projects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with React and Laravel',
    image: 'https://via.placeholder.com/400x250/3B82F6/FFFFFF?text=E-Commerce',
    technologies: ['React', 'Laravel', 'MySQL', 'Tailwind CSS'],
    github: 'https://github.com/username/ecommerce',
    demo: 'https://ecommerce-demo.com',
    featured: true
  },
  {
    id: 2,
    title: 'Task Management App',
    description: 'Collaborative task management with real-time updates',
    image: 'https://via.placeholder.com/400x250/10B981/FFFFFF?text=Task+App',
    technologies: ['Vue.js', 'Node.js', 'Socket.io', 'MongoDB'],
    github: 'https://github.com/username/taskapp',
    demo: 'https://taskapp-demo.com',
    featured: true
  },
  {
    id: 3,
    title: 'Weather Dashboard',
    description: 'Beautiful weather app with location-based forecasts',
    image: 'https://via.placeholder.com/400x250/F59E0B/FFFFFF?text=Weather',
    technologies: ['React', 'OpenWeather API', 'Chart.js'],
    github: 'https://github.com/username/weather',
    demo: 'https://weather-demo.com',
    featured: false
  },
  {
    id: 4,
    title: 'Portfolio Website',
    description: 'Modern portfolio with dark mode and animations',
    image: 'https://via.placeholder.com/400x250/8B5CF6/FFFFFF?text=Portfolio',
    technologies: ['React', 'Framer Motion', 'Tailwind CSS'],
    github: 'https://github.com/username/portfolio',
    demo: 'https://portfolio-demo.com',
    featured: true
  }
]

export const testimonials = [
  {
    id: 1,
    name: 'John Doe',
    position: 'CEO at TechCorp',
    company: 'TechCorp',
    message: 'Amazing work! Delivered the project on time with exceptional quality.',
    avatar: 'https://via.placeholder.com/60x60/3B82F6/FFFFFF?text=JD'
  },
  {
    id: 2,
    name: 'Jane Smith',
    position: 'Product Manager',
    company: 'StartupXYZ',
    message: 'Professional, reliable, and highly skilled. Would work with again.',
    avatar: 'https://via.placeholder.com/60x60/10B981/FFFFFF?text=JS'
  }
]