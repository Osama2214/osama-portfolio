import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github,
  Linkedin,
  Mail,
  Heart,
  Twitter,
  ArrowUp,
  Code2,
  Sparkles,
  X,
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const socialLinks = [
    {
      icon: Github,
      href: 'https://github.com/Osama2214',
      label: 'GitHub',
    },
    {
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/osama-ahmed-67127222a/',
      label: 'LinkedIn',
    },
    {
      icon: X,
      href: 'https://x.com/OSAMA3974',
      label: 'Twitter (X)',
    },
    {
      icon: Mail,
      href: 'https://mail.google.com/mail/?view=cm&fs=1&to=osamahamad261981@gmail.com&su=Contact from Portfolio&body=Hi Osama, I saw your portfolio and would like to get in touch.',
      label: 'Email',
    },
  ];

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const policyContent = {
    privacy: {
      title: 'Privacy Policy',
      content: [
        'This portfolio website collects basic information such as name and email only when you voluntarily submit the contact form.',
        'The collected information is used solely for communication purposes and will not be shared with third parties.',
        'No cookies or tracking tools are used on this website.',
        'If you have any questions regarding this privacy policy, feel free to contact me via email.',
      ],
    },
    terms: {
      title: 'Terms of Service',
      content: [
        'This website is a personal portfolio created to showcase projects, skills, and experience.',
        'All content provided is for informational purposes only. I do not guarantee the accuracy or completeness of the information.',
        'You may not copy or reuse any content from this website without permission.',
        'By using this website, you agree to these terms.',
      ],
    },
  };

  return (
    <>
      {/* Modal */}
      <AnimatePresence>
        {modalContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4'
            onClick={() => setModalContent(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden'
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className='flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700'>
                <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                  {policyContent[modalContent]?.title}
                </h3>
                <button
                  onClick={() => setModalContent(null)}
                  className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer'
                >
                  <X size={20} className='text-gray-500' />
                </button>
              </div>
              {/* Modal Body */}
              <div className='p-5 overflow-y-auto max-h-[60vh]'>
                <ul className='space-y-4'>
                  {policyContent[modalContent]?.content.map((item, index) => (
                    <li
                      key={index}
                      className='flex items-start gap-3 text-gray-600 dark:text-gray-300'
                    >
                      <span className='w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0' />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Modal Footer */}
              <div className='p-5 border-t border-gray-200 dark:border-gray-700'>
                <button
                  onClick={() => setModalContent(null)}
                  className='w-full py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all cursor-pointer'
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Scroll to Top Button - Fixed Position */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className='fixed bottom-20 sm:bottom-24 right-4 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gradient-to-r from-primary to-accent text-white rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 z-50 cursor-pointer'
            aria-label='Scroll to top'
          >
            <ArrowUp size={18} className='sm:w-[22px] sm:h-[22px]' />
          </motion.button>
        )}
      </AnimatePresence>

      <footer className='relative bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white'>
        {/* Background Gradient */}
        <div className='absolute inset-0 bg-gradient-to-t from-gray-200 via-gray-100 to-gray-100 dark:from-black dark:via-gray-900 dark:to-gray-900' />
        <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent' />

        <div className='container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10'>
          {/* Main Footer Content */}
          <div className='py-10 sm:py-12 md:py-16'>
            <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12'>
              {/* Brand Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className='sm:col-span-2 lg:col-span-2'
              >
                <div className='flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6'>
                  <div className='p-2.5 sm:p-3 bg-gradient-to-br from-primary to-accent rounded-xl'>
                    <Code2 size={24} className='text-white sm:w-7 sm:h-7' />
                  </div>
                  <span className='text-xl sm:text-2xl font-bold'>
                    Port<span className='text-primary'>folio</span>
                  </span>
                </div>
                <p className='text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-md text-base sm:text-lg leading-relaxed'>
                  Building modern web applications with clean and scalable code.
                </p>

                {/* Social Links */}
                <div className='flex gap-3'>
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.1,
                        type: 'spring',
                        stiffness: 400,
                        damping: 17,
                      }}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      className='p-3 bg-gray-200 dark:bg-gray-800 rounded-xl hover:bg-gradient-to-br hover:from-primary hover:to-accent transition-colors duration-300 group text-gray-700 dark:text-white hover:text-white hover:shadow-lg hover:shadow-primary/25'
                      aria-label={social.label}
                    >
                      <social.icon
                        size={20}
                        className='group-hover:scale-110 transition-transform duration-300'
                      />
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className='text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2'>
                  <Sparkles size={18} className='text-primary' />
                  Quick Links
                </h4>
                <ul className='space-y-3 sm:space-y-4'>
                  {quickLinks.map((link, index) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <a
                        href={link.href}
                        className='text-gray-600 dark:text-gray-400 hover:text-primary transition-colors duration-300 flex items-center gap-2 group'
                      >
                        <span className='w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full group-hover:bg-primary transition-colors' />
                        {link.name}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h4 className='text-base sm:text-lg font-bold mb-4 sm:mb-6'>
                  Get In Touch
                </h4>
                <div className='space-y-3 sm:space-y-4'>
                  <a
                    href='https://mail.google.com/mail/?view=cm&fs=1&to=osamahamad261981@gmail.com&su=Contact from Portfolio&body=Hi Osama, I saw your portfolio and would like to get in touch.'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors group'
                  >
                    <div className='p-2 bg-gray-200 dark:bg-gray-800 rounded-lg group-hover:bg-primary/20 transition-colors'>
                      <Mail size={16} />
                    </div>
                    <span className='text-sm'>osamahamad261981@gmail.com</span>
                  </a>
                  <a
                    href='https://maps.google.com/?q=Giza,Egypt'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors group'
                  >
                    <div className='p-2 bg-gray-200 dark:bg-gray-800 rounded-lg group-hover:bg-primary/20 transition-colors'>
                      <span className='text-xs'>📍</span>
                    </div>
                    <span className='text-sm'>Giza, Egypt</span>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className='border-t border-gray-300 dark:border-gray-800 py-6 sm:py-8'
          >
            <div className='flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4'>
              <p className='text-gray-600 dark:text-gray-400 flex items-center gap-2 text-sm'>
                <span>© {currentYear} Portfolio.</span>
                <span className='hidden md:inline'>•</span>
                <span className='flex items-center gap-1'>
                  Made with{' '}
                  <Heart
                    size={14}
                    className='text-red-500 animate-pulse'
                    fill='currentColor'
                  />{' '}
                  by Osama
                </span>
              </p>
              <div className='flex items-center gap-6 text-sm text-gray-500 dark:text-gray-500'>
                <button
                  onClick={() => setModalContent('privacy')}
                  className='hover:text-primary transition-colors cursor-pointer'
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => setModalContent('terms')}
                  className='hover:text-primary transition-colors cursor-pointer'
                >
                  Terms of Service
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
