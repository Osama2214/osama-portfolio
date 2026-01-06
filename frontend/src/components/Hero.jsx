import { motion } from 'framer-motion';
import {
  ChevronDown,
  Github,
  Linkedin,
  Mail,
  Download,
  Sparkles,
} from 'lucide-react';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const socialLinks = [
    {
      icon: Github,
      href: 'https://github.com/Osama2214',
      label: 'GitHub',
      color: 'hover:bg-gray-800 hover:text-white',
    },
    {
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/osama-ahmed-67127222a/',
      label: 'LinkedIn',
      color: 'hover:bg-blue-600 hover:text-white',
    },
    {
      icon: Mail,
      href: 'https://mail.google.com/mail/?view=cm&fs=1&to=osamahamad261981@gmail.com&su=Contact from Portfolio&body=Hi Osama, I saw your portfolio and would like to get in touch.',
      label: 'Email',
      color: 'hover:bg-red-500 hover:text-white',
    },
  ];

  return (
    <section
      id='home'
      className='min-h-screen flex items-center justify-center relative overflow-hidden pt-24 sm:pt-28 pb-16 md:pb-20'
    >
      {/* Animated Background Blobs - z-0 to stay behind content */}
      <div className='absolute inset-0 overflow-hidden z-0'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob' />
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000' />
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000' />
      </div>

      {/* Grid Pattern Overlay - z-0 to stay behind content */}
      <div className='absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] z-0' />

      <div className='container mx-auto px-6 text-center relative z-10'>
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='max-w-4xl mx-auto'
        >
          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className='text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight'
          >
            Hi, I'm <span className='gradient-text'>Osama</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className='text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-4 max-w-2xl mx-auto px-4'
          >
            Backend / Full Stack Developer
          </motion.p>

          <motion.p
            variants={itemVariants}
            className='text-lg text-gray-500 dark:text-gray-500 mb-10 max-w-xl mx-auto'
          >
            I build scalable backend systems and modern web applications using
            React, Node.js, and Laravel.
          </motion.p>

          {/* Social Links */}
          <motion.div
            variants={itemVariants}
            className='flex flex-wrap justify-center gap-3 sm:gap-4 mb-10'
          >
            {socialLinks.map(social => (
              <motion.a
                key={social.label}
                href={social.href}
                target='_blank'
                rel='noopener noreferrer'
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className={`p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg ${social.color} transition-colors duration-300 group hover:shadow-xl`}
                aria-label={social.label}
              >
                <social.icon
                  size={22}
                  className='transition-transform duration-300 group-hover:scale-110'
                />
              </motion.a>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className='flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6'
          >
            <motion.button
              onClick={() =>
                document
                  .getElementById('projects')
                  .scrollIntoView({ behavior: 'smooth' })
              }
              whileHover={{
                scale: 1.05,
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)',
              }}
              whileTap={{ scale: 0.95 }}
              className='w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl hover:shadow-primary/30 transition-shadow duration-300 text-center'
            >
              View My Work
            </motion.button>
            <motion.a
              href='/Osama_Ahmed_CV.pdf'
              download='Osama_Ahmed_CV.pdf'
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                y: { duration: 0.15 },
                scale: { duration: 0.15 },
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)',
              }}
              whileTap={{ scale: 0.95 }}
              className='group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl hover:shadow-primary/30 transition-shadow duration-300 flex items-center justify-center gap-3'
            >
              <span className='inline-flex items-center gap-3'>
                <span className='inline-block w-5 h-5'>
                  <Download size={20} className='animate-bounce' />
                </span>
                <span>Download CV</span>
              </span>
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className='mt-12 sm:mt-16 md:mt-20 grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-lg mx-auto px-2'
          >
            {[
              { number: '1+', label: 'Years Learning & Building' },
              { number: '10+', label: 'Projects Built' },
              { number: '∞', label: 'Continuous Learning' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                className='text-center'
              >
                <div className='text-2xl sm:text-3xl md:text-4xl font-bold gradient-text'>
                  {stat.number}
                </div>
                <div className='text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1'>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator - Hidden on small screens, visible on md and up */}
      <motion.a
        href='#about'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className='hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1 text-gray-400 hover:text-primary transition-colors duration-300 cursor-pointer z-10'
      >
        <span className='text-xs font-medium'>Scroll Down</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.a>
    </section>
  );
};

export default Hero;
