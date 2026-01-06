import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, Code2 } from 'lucide-react';

const Header = ({ darkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = navItems.map(item => item.href.substring(1));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(prev => (prev !== section ? section : prev));
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg shadow-gray-200/20 dark:shadow-black/20 border-b border-gray-200/50 dark:border-gray-700/50'
          : 'bg-transparent'
      }`}
    >
      <nav className='container mx-auto px-4 sm:px-6 py-3 sm:py-4'>
        <div className='flex items-center justify-between'>
          {/* Logo */}
          <motion.a
            href='#home'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className='flex items-center gap-2 sm:gap-3 group'
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className='p-1.5 sm:p-2 bg-gradient-to-br from-primary to-accent rounded-lg sm:rounded-xl shadow-lg shadow-primary/20'
            >
              <Code2 size={20} className='text-white sm:w-6 sm:h-6' />
            </motion.div>
            <span className='text-lg sm:text-xl xl:text-2xl font-bold'>
              Port<span className='text-primary'>folio</span>
            </span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center gap-2'>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='flex items-center gap-1 p-1.5 bg-gray-100/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm'
            >
              {navItems.map(item => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`relative px-3 sm:px-4 xl:px-6 py-2 rounded-lg text-sm xl:text-base font-medium transition-all duration-300 ${
                    activeSection === item.href.substring(1)
                      ? 'text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {activeSection === item.href.substring(1) && (
                    <motion.div
                      layoutId='activeNav'
                      className='absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-lg'
                      transition={{
                        type: 'spring',
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span className='relative z-10'>{item.name}</span>
                </a>
              ))}
            </motion.div>

            {/* Dark Mode Toggle */}
            <motion.button
              onClick={toggleDarkMode}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className='ml-4 p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 relative overflow-hidden group cursor-pointer'
            >
              <motion.div
                initial={false}
                animate={{ rotate: darkMode ? 180 : 0 }}
                transition={{ duration: 0.5 }}
              >
                {darkMode ? (
                  <Sun size={20} className='text-yellow-500' />
                ) : (
                  <Moon size={20} className='text-gray-600' />
                )}
              </motion.div>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className='md:hidden flex items-center gap-2 sm:gap-3'>
            <motion.button
              onClick={toggleDarkMode}
              whileTap={{ scale: 0.95 }}
              className='p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-gray-100 dark:bg-gray-800 transition-colors cursor-pointer'
            >
              {darkMode ? (
                <Sun size={18} className='text-yellow-500 sm:w-5 sm:h-5' />
              ) : (
                <Moon size={18} className='text-gray-600 sm:w-5 sm:h-5' />
              )}
            </motion.button>
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileTap={{ scale: 0.95 }}
              className='p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-gray-100 dark:bg-gray-800 transition-colors cursor-pointer'
            >
              <AnimatePresence mode='wait'>
                <motion.div
                  key={isOpen ? 'close' : 'open'}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className='md:hidden overflow-hidden'
            >
              <div className='pt-6 pb-4 space-y-2'>
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{
                      delay: index * 0.1,
                      type: 'spring',
                      stiffness: 400,
                      damping: 20,
                    }}
                    className={`block px-4 py-3 rounded-xl font-medium transition-colors duration-300 ${
                      activeSection === item.href.substring(1)
                        ? 'bg-gradient-to-r from-primary to-accent text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {item.name}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
