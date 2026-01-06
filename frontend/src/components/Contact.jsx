import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  Mail,
  MapPin,
  MessageCircle,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import emailjs from '@emailjs/browser';

/**
 * Contact Component
 * A contact form with validation, rate limiting, spam protection, and animated feedback.
 */
const Contact = () => {
  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isErrorMessage, setIsErrorMessage] = useState(false);

  // UI states
  const [focusedField, setFocusedField] = useState(null);

  // Rate limiting states
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [submitCount, setSubmitCount] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  // Load initial data from localStorage and handle message auto-hide
  useEffect(() => {
    // Load submit history from localStorage
    const storedSubmitCount = localStorage.getItem('contactSubmitCount');
    const storedLastSubmit = localStorage.getItem('lastSubmitTime');

    if (storedSubmitCount) {
      setSubmitCount(parseInt(storedSubmitCount));
    }
    if (storedLastSubmit) {
      setLastSubmitTime(parseInt(storedLastSubmit));
    }

    // Auto-hide submit message after 5 seconds (only if no cooldown active)
    if (submitMessage && cooldownRemaining === 0) {
      const timer = setTimeout(() => {
        setSubmitMessage('');
        setIsErrorMessage(false);
      }, 5000); // 5 seconds
      return () => clearTimeout(timer);
    }
  }, [submitMessage, cooldownRemaining]);

  // Handle cooldown timer countdown
  useEffect(() => {
    if (cooldownRemaining > 0) {
      const interval = setInterval(() => {
        setCooldownRemaining(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [cooldownRemaining]);

  // Update submit message text during cooldown
  useEffect(() => {
    if (
      cooldownRemaining > 0 &&
      isErrorMessage &&
      submitMessage.includes('wait')
    ) {
      setSubmitMessage(
        `Please wait ${cooldownRemaining} seconds before sending another message.`
      );
    } else if (cooldownRemaining === 0 && submitMessage.includes('wait')) {
      setSubmitMessage('');
      setIsErrorMessage(false);
    }
  }, [cooldownRemaining, isErrorMessage, submitMessage]);

  /**
   * Check rate limiting and cooldown
   * @returns {boolean} true if allowed to submit, false otherwise
   */
  const checkRateLimit = () => {
    const now = Date.now();
    const timeWindow = 24 * 60 * 60 * 1000; // 24 hours
    const maxSubmits = 5; // Max 5 submissions per day
    const cooldown = 60 * 1000; // 1 minute cooldown between submissions

    // Check cooldown
    if (now - lastSubmitTime < cooldown) {
      return false; // Too soon since last submission
    }

    // Reset counter if time window passed
    if (now - lastSubmitTime > timeWindow) {
      setSubmitCount(0);
      localStorage.setItem('contactSubmitCount', '0');
      return true;
    }

    // Check if under limit
    if (submitCount >= maxSubmits) {
      return false;
    }

    return true;
  };

  /**
   * Check for spam patterns in message
   * @param {string} message - The message to check
   * @returns {boolean} true if spam detected
   */
  const checkForSpam = message => {
    const spamPatterns = [
      /http[s]?:\/\//gi, // URLs
      /www\./gi, // Web addresses
      /bit\.ly|tinyurl|goo\.gl|t\.co/gi, // URL shorteners
      /viagra|casino|lottery|winner/gi, // Spam keywords
      /(.)\1{10,}/gi, // Repeated characters
    ];

    return spamPatterns.some(pattern => pattern.test(message));
  };

  /**
   * Handle form input changes
   * @param {Event} e - The change event
   */
  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Handle form submission with validation, rate limiting, and email sending
   * @param {Event} e - The submit event
   */
  const handleSubmit = async e => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim()) {
      setSubmitMessage('Please enter your name.');
      setIsErrorMessage(true);
      return;
    }

    if (!formData.email.trim()) {
      setSubmitMessage('Please enter your email.');
      setIsErrorMessage(true);
      return;
    }

    if (!formData.subject.trim()) {
      setSubmitMessage('Please enter a subject.');
      setIsErrorMessage(true);
      return;
    }

    if (!formData.message.trim()) {
      setSubmitMessage('Please enter a message.');
      setIsErrorMessage(true);
      return;
    }

    // Check minimum message length
    if (formData.message.trim().length < 10) {
      setSubmitMessage(
        'Message is too short. Please provide more details (at least 10 characters).'
      );
      setIsErrorMessage(true);
      return;
    }

    // Check rate limiting and cooldown
    if (!checkRateLimit()) {
      const now = Date.now();
      if (now - lastSubmitTime < 60 * 1000) {
        const remaining = Math.ceil(
          (60 * 1000 - (now - lastSubmitTime)) / 1000
        );
        setCooldownRemaining(remaining);
        setSubmitMessage(
          `Please wait ${remaining} seconds before sending another message.`
        );
      } else {
        setSubmitMessage(
          'Too many messages sent today. Please try again tomorrow.'
        );
      }
      setIsErrorMessage(true);
      return;
    }

    // Check for spam patterns
    if (checkForSpam(formData.message) || checkForSpam(formData.subject)) {
      setSubmitMessage(
        'Message contains suspicious content. Please revise and try again.'
      );
      setIsErrorMessage(true);
      return;
    }

    // Start submission process
    setIsSubmitting(true);

    try {
      await emailjs.send(
        'service_91p9ang',
        'template_2mleis6',
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        'fm1U_67Drx8TBAWoU'
      );

      // Update rate limiting
      const now = Date.now();
      const newCount = submitCount + 1;
      setSubmitCount(newCount);
      setLastSubmitTime(now);
      localStorage.setItem('contactSubmitCount', newCount.toString());
      localStorage.setItem('lastSubmitTime', now.toString());

      setSubmitMessage(
        'Message sent successfully! I will get back to you soon.'
      );
      setIsErrorMessage(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitMessage(
        'Sorry, there was an error sending your message. Please try again.'
      );
      setIsErrorMessage(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Contact information data
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'osamahamad261981@gmail.com',
      href: 'https://mail.google.com/mail/?view=cm&fs=1&to=osamahamad261981@gmail.com&su=Contact from Portfolio&body=Hi Osama, I saw your portfolio and would like to get in touch.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Giza, Egypt',
      href: 'https://maps.google.com/?q=Giza,Egypt',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  // Animation variants for staggered animations
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

  // Render the contact section
  return (
    <section
      id='contact'
      className='py-16 sm:py-20 md:py-24 relative overflow-hidden'
    >
      {/* Background Elements */}
      <div className='absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800' />
      <div className='absolute top-0 left-1/4 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-primary/10 rounded-full blur-3xl' />
      <div className='absolute bottom-0 right-1/4 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-accent/10 rounded-full blur-3xl' />

      <div className='container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-10 sm:mb-12 md:mb-16'
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            viewport={{ once: true }}
            className='inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4 sm:mb-6'
          >
            <MessageCircle size={18} className='text-primary' />
            <span className='text-primary font-medium text-sm sm:text-base'>
              Get in Touch
            </span>
          </motion.div>

          <h2 className='text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6'>
            Let's <span className='gradient-text'>Connect</span>
          </h2>
          <p className='text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-base sm:text-lg px-2'>
            Have a project idea, a question, or an opportunity? Feel free to
            reach out and I’ll get back to you as soon as possible.
          </p>
        </motion.div>

        <div className='grid lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12 items-start'>
          {/* Contact Info - Left Side */}
          <motion.div
            variants={containerVariants}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            className='lg:col-span-2 space-y-4 sm:space-y-6'
          >
            <motion.div variants={itemVariants} className='mb-6 sm:mb-8'>
              <h3 className='text-xl sm:text-2xl font-bold mb-3 sm:mb-4'>
                Let's work together
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                I'm always open to discussing new projects, internship
                opportunities, or backend development roles where I can grow and
                contribute.
              </p>
            </motion.div>

            {contactInfo.map(info => (
              <motion.a
                key={info.title}
                href={info.href}
                target='_blank'
                rel='noopener noreferrer'
                variants={itemVariants}
                whileHover={{ x: 8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className='group flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700'
              >
                <div
                  className={`p-3 sm:p-4 rounded-xl bg-gradient-to-br ${info.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <info.icon size={20} className='text-white sm:w-6 sm:h-6' />
                </div>
                <div>
                  <h4 className='font-semibold text-gray-900 dark:text-white'>
                    {info.title}
                  </h4>
                  <p className='text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors'>
                    {info.value}
                  </p>
                </div>
              </motion.a>
            ))}

            {/* Social Links */}
            <motion.div variants={itemVariants} className='pt-6'>
              <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
                Or connect with me on social media
              </p>
              <div className='flex gap-3'>
                {[
                  { name: 'github', href: 'https://github.com/Osama2214' },
                  {
                    name: 'linkedin',
                    href: 'https://www.linkedin.com/in/osama-ahmed-67127222a/',
                  },
                  { name: 'twitter', href: 'https://x.com/OSAMA3974' },
                ].map(social => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    className='group w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-primary hover:to-accent text-gray-600 dark:text-gray-300 hover:text-white transition-colors duration-300 hover:shadow-lg hover:shadow-primary/25'
                  >
                    <span className='sr-only'>{social.name}</span>
                    <svg
                      className='w-5 h-5 group-hover:scale-110 transition-transform duration-300'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      {social.name === 'github' && (
                        <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
                      )}
                      {social.name === 'linkedin' && (
                        <path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' />
                      )}
                      {social.name === 'twitter' && (
                        <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
                      )}
                    </svg>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='lg:col-span-3'
          >
            <form
              onSubmit={handleSubmit}
              className='relative bg-white dark:bg-gray-800 p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700'
            >
              {/* Decorative Element */}
              <div className='absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full blur-2xl opacity-20' />

              <div className='relative'>
                <div className='flex items-center justify-between mb-8'>
                  <div className='flex items-center gap-3'>
                    <div className='p-3 bg-gradient-to-br from-primary to-accent rounded-xl'>
                      <Send size={24} className='text-white' />
                    </div>
                    <div>
                      <h3 className='text-xl font-bold'>Send a Message</h3>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        Fill in the form below
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Messages sent today
                    </p>
                    <p className='text-lg font-semibold text-primary'>
                      {submitCount}/5
                    </p>
                  </div>
                </div>

                <div className='grid md:grid-cols-2 gap-6 mb-6'>
                  <div className='relative'>
                    <label
                      htmlFor='name'
                      className={`absolute left-4 transition-all duration-300 pointer-events-none z-10 ${
                        focusedField === 'name' || formData.name
                          ? '-top-3 text-xs bg-white dark:bg-gray-800 px-2 text-primary rounded'
                          : 'top-4 text-gray-400'
                      }`}
                    >
                      Your Name *
                    </label>
                    <input
                      type='text'
                      id='name'
                      name='name'
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      required
                      dir='auto'
                      className='w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary focus:ring-0 bg-transparent text-gray-900 dark:text-white transition-colors'
                    />
                  </div>
                  <div className='relative'>
                    <label
                      htmlFor='email'
                      className={`absolute left-4 transition-all duration-300 pointer-events-none z-10 ${
                        focusedField === 'email' || formData.email
                          ? '-top-3 text-xs bg-white dark:bg-gray-800 px-2 text-primary rounded'
                          : 'top-4 text-gray-400'
                      }`}
                    >
                      Your Email *
                    </label>
                    <input
                      type='email'
                      id='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className='w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary focus:ring-0 bg-transparent text-gray-900 dark:text-white transition-colors'
                    />
                  </div>
                </div>

                <div className='mb-6 relative'>
                  <label
                    htmlFor='subject'
                    className={`absolute left-4 transition-all duration-300 pointer-events-none z-10 ${
                      focusedField === 'subject' || formData.subject
                        ? '-top-3 text-xs bg-white dark:bg-gray-800 px-2 text-primary rounded'
                        : 'top-4 text-gray-400'
                    }`}
                  >
                    Subject *
                  </label>
                  <input
                    type='text'
                    id='subject'
                    name='subject'
                    value={formData.subject}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={() => setFocusedField(null)}
                    required
                    dir='auto'
                    className='w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary focus:ring-0 bg-transparent text-gray-900 dark:text-white transition-colors'
                  />
                </div>

                <div className='mb-8 relative'>
                  <label
                    htmlFor='message'
                    className={`absolute left-4 transition-all duration-300 pointer-events-none z-10 ${
                      focusedField === 'message' || formData.message
                        ? '-top-3 text-xs bg-white dark:bg-gray-800 px-2 rounded'
                        : 'top-4'
                    } ${
                      isErrorMessage &&
                      submitMessage.toLowerCase().includes('message')
                        ? 'text-red-500'
                        : focusedField === 'message' || formData.message
                        ? 'text-primary'
                        : 'text-gray-400'
                    }`}
                  >
                    Your Message *
                  </label>
                  <textarea
                    id='message'
                    name='message'
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    required
                    dir='auto'
                    rows={5}
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-0 bg-transparent text-gray-900 dark:text-white resize-none transition-colors ${
                      isErrorMessage &&
                      submitMessage.toLowerCase().includes('message')
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-200 dark:border-gray-700 focus:border-primary'
                    }`}
                  />
                </div>

                <motion.button
                  type='submit'
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className='w-full bg-gradient-to-r from-primary to-accent text-white py-4 px-6 rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer'
                >
                  {isSubmitting ? (
                    <>
                      <div className='animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent'></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>

                {submitMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-6 flex items-center justify-center gap-2 p-4 rounded-xl animated-progress ${
                      isErrorMessage
                        ? 'error-progress text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                        : 'success-progress text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                    }`}
                  >
                    {isErrorMessage ? (
                      <svg
                        className='w-5 h-5'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
                        />
                      </svg>
                    ) : (
                      <CheckCircle size={20} />
                    )}
                    <p>{submitMessage}</p>
                  </motion.div>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
