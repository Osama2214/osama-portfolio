import { motion } from 'framer-motion';
import { useDarkMode } from '../hooks/useDarkMode';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const NotFound = () => {
  useDarkMode();

  return (
    <div
      className='min-h-screen flex items-center justify-center
                    bg-white dark:bg-gray-900 px-4'
    >
      <motion.div
        className='max-w-2xl w-full text-center'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        {/* 404 Number */}
        <motion.h1
          variants={itemVariants}
          className='text-[120px] md:text-[180px]
                     font-bold leading-none mb-4'
        >
          <span className='text-black dark:text-white'>4</span>
          <span className='gradient-text'>0</span>
          <span className='text-black dark:text-white'>4</span>
        </motion.h1>

        {/* Title */}
        <motion.h2
          variants={itemVariants}
          className='text-2xl md:text-3xl font-bold
                     text-gray-900 dark:text-white mb-3'
        >
          Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className='text-base md:text-lg
                     text-gray-600 dark:text-gray-400
                     mb-8 max-w-md mx-auto'
        >
          The page you’re looking for doesn’t exist or has been moved.
        </motion.p>

        {/* Button */}
        <motion.div variants={itemVariants}>
          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)',
              transition: { duration: 0.5, ease: 'easeOut' },
            }}
            whileTap={{
              scale: 0.98,
              transition: { duration: 0.2, ease: 'easeOut' },
            }}
            onClick={() => (window.location.href = '/')}
            className='px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl hover:shadow-primary/30 transition-shadow duration-300'
          >
            Back to Home
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
