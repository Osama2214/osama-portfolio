import { motion } from 'framer-motion';
import {
  Code,
  Database,
  Palette,
  Zap,
  Globe,
  Award,
  Coffee,
} from 'lucide-react';

const About = () => {
  const skills = [
    {
      icon: Code,
      title: 'Frontend Development',
      description: 'React, Vue.js, TypeScript, Next.js',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Database,
      title: 'Backend Development',
      description: 'Node.js, PHP, Python, Laravel',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Palette,
      title: 'UI/UX Design',
      description: 'Figma, Adobe XD, Tailwind CSS',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const techStack = [
    'React',
    'Node.js',
    'TypeScript',
    'Python',
    'Java',
    'Laravel',
    'MongoDB',
    'MySQL',
    'PostgreSQL',
    'Docker',
    'AWS',
    'Tailwind CSS',
    'Redis',
    'Git',
  ];

  const stats = [
    { icon: Award, value: '1+', label: 'Years Learning & Building' },
    { icon: Zap, value: '10+', label: 'Projects Built' },
    { icon: Globe, value: '∞', label: 'Continuous Learning' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      id='about'
      className='py-24 bg-gray-50 dark:bg-gray-800/50 relative overflow-hidden'
    >
      {/* Background Decoration */}
      <div className='absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none'>
        <div className='absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl' />
        <div className='absolute bottom-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl' />
      </div>

      <div className='container mx-auto px-6 relative z-10'>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-12 sm:mb-16 md:mb-20 px-2'
        >
          <span className='text-primary font-semibold text-sm uppercase tracking-wider'>
            About Me
          </span>
          <h2 className='text-3xl sm:text-4xl md:text-5xl font-bold mt-2 mb-4 sm:mb-6'>
            Turning Ideas Into <span className='gradient-text'>Reality</span>
          </h2>
          <p className='text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-base sm:text-lg'>
            I'm a Backend / Full Stack Developer focused on building real-world
            projects and continuously improving my skills.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 md:mb-20 max-w-3xl mx-auto px-2'
        >
          {stats.map(stat => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className='bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group card-hover'
            >
              <div className='w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform'>
                <stat.icon size={28} className='text-white' />
              </div>
              <div className='text-3xl md:text-4xl font-bold gradient-text mb-1'>
                {stat.value}
              </div>
              <div className='text-sm text-gray-500 dark:text-gray-400'>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className='grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center mb-12 sm:mb-16 md:mb-20'>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className='text-2xl sm:text-3xl font-bold mb-4 sm:mb-6'>
              My Journey
            </h3>
            <p className='text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed'>
              I started my journey as a curious learner with a strong interest
              in backend development. Over time, I’ve worked on multiple
              real-world projects that helped me understand how modern web
              applications are built from the ground up.
            </p>
            <p className='text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed'>
              I enjoy learning new technologies, improving my problem-solving
              skills, and writing clean, maintainable code. I’m always looking
              for opportunities to grow as a developer and gain real industry
              experience.
            </p>

            {/* Tech Stack */}
            <div>
              <h4 className='text-base sm:text-lg font-semibold mb-3 sm:mb-4'>
                Tech Stack
              </h4>
              <div className='flex flex-wrap gap-1.5 sm:gap-2'>
                {techStack.map((tech, index) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className='px-3 sm:px-4 py-1.5 sm:py-2 bg-white dark:bg-gray-900 rounded-lg text-xs sm:text-sm font-medium shadow-sm hover:shadow-md hover:scale-105 transition-all cursor-default border border-gray-100 dark:border-gray-700'
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='relative'
          >
            <div className='relative z-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-8'>
              <img
                src='https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=600&h=600&fit=crop'
                alt='Developer workspace'
                className='w-full rounded-2xl shadow-2xl'
              />
            </div>
            {/* Decorative elements */}
            <div className='absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl' />
            <div className='absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-2xl' />
          </motion.div>
        </div>

        {/* Skills Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className='text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12'>
            What I Do
          </h3>
          <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto'>
            {skills.map((skill, index) => (
              <motion.div
                key={skill.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className='group bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100 dark:border-gray-800'
              >
                <div
                  className={`w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br ${skill.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <skill.icon size={24} className='text-white sm:w-8 sm:h-8' />
                </div>
                <h4 className='text-lg sm:text-xl font-bold mb-2 sm:mb-3'>
                  {skill.title}
                </h4>
                <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>
                  {skill.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
