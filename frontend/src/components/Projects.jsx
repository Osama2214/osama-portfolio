import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Star, ArrowUpRight } from 'lucide-react';
import { projects } from '../data/projects';

const Projects = () => {
  const [filter, setFilter] = useState('all');
  const [hoveredId, setHoveredId] = useState(null);

  const filteredProjects = useMemo(() => {
    if (filter === 'all') {
      return projects;
    } else if (filter === 'featured') {
      return projects.filter(project => project.featured);
    }
    return projects;
  }, [filter, projects]);

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'featured', label: 'Featured' },
  ];

  return (
    <section id='projects' className='py-24 relative overflow-hidden'>
      {/* Background */}
      <div className='absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent' />

      <div className='container mx-auto px-6 relative z-10'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <span className='text-primary font-semibold text-sm uppercase tracking-wider'>
            Portfolio
          </span>
          <h2 className='text-4xl md:text-5xl font-bold mt-2 mb-6'>
            Featured <span className='gradient-text'>Projects</span>
          </h2>
          <p className='text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg mb-10'>
            Here are some of the projects I’ve built while learning and applying
            backend and full stack concepts in real-world scenarios.
          </p>

          {/* Filter Buttons */}
          <div className='flex flex-wrap justify-center gap-3'>
            {filters.map(f => (
              <motion.button
                key={f.id}
                onClick={() => setFilter(f.id)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-medium transition-colors duration-300 cursor-pointer ${
                  filter === f.id
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md hover:shadow-lg'
                }`}
              >
                {f.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode='wait'>
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8'
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
                className='group relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800'
              >
                {/* Featured Badge */}
                {project.featured && (
                  <div className='absolute top-4 left-4 z-20'>
                    <span className='inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold rounded-full'>
                      <Star size={12} fill='currentColor' />
                      Featured
                    </span>
                  </div>
                )}

                {/* Image Container */}
                <div className='relative h-44 sm:h-52 lg:h-56 overflow-hidden'>
                  <img
                    src={project.image}
                    alt={project.title}
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                  />
                  {/* Overlay */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300' />

                  {/* Quick Links on Hover */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: hoveredId === project.id ? 1 : 0,
                      y: hoveredId === project.id ? 0 : 20,
                    }}
                    className='absolute bottom-4 left-4 right-4 flex gap-3'
                  >
                    <a
                      href={project.github}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex-1 flex items-center justify-center gap-2 py-2 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg font-medium hover:bg-white transition-colors'
                    >
                      <Github size={18} />
                      Code
                    </a>
                    <a
                      href={project.demo}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex-1 flex items-center justify-center gap-2 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors'
                    >
                      <ExternalLink size={18} />
                      Demo
                    </a>
                  </motion.div>
                </div>

                {/* Content */}
                <div className='p-4 sm:p-5 lg:p-6'>
                  <div className='flex items-start justify-between mb-3'>
                    <h3 className='text-xl font-bold group-hover:text-primary transition-colors'>
                      {project.title}
                    </h3>
                    <ArrowUpRight
                      size={20}
                      className='text-gray-400 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all'
                    />
                  </div>

                  <p className='text-gray-600 dark:text-gray-400 mb-4 line-clamp-2'>
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className='flex flex-wrap gap-2'>
                    {project.technologies.slice(0, 4).map(tech => (
                      <span
                        key={tech}
                        className='px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium'
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View More Button */}
        {projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className='text-center mt-8 sm:mt-10 md:mt-12'
          >
            <motion.a
              href='https://github.com/Osama2214'
              target='_blank'
              rel='noopener noreferrer'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-gray-800 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 text-sm sm:text-base'
            >
              <Github size={18} className='sm:w-5 sm:h-5' />
              View All Projects on GitHub
              <ArrowUpRight size={18} />
            </motion.a>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Projects;
