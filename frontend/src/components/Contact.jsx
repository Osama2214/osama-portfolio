import { useState } from 'react';
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

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
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
      setSubmitMessage(
        'Message sent successfully! I will get back to you soon.'
      );
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitMessage(
        'Sorry, there was an error sending your message. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
      id='contact'
      className='py-16 sm:py-20 md:py-24 relative overflow-hidden'
    >
      {/* Background Elements */}
      <div className='absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800' />
      <div className='absolute top-0 left-1/4 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-primary/10 rounded-full blur-3xl' />
      <div className='absolute bottom-0 right-1/4 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-accent/10 rounded-full blur-3xl' />

      <div className='container mx-auto px-4 sm:px-6 relative z-10'>
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

            {contactInfo.map((info, index) => (
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
                        <path d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' />
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
                <div className='flex items-center gap-3 mb-8'>
                  <div className='p-3 bg-gradient-to-br from-primary to-accent rounded-xl'>
                    <Sparkles size={24} className='text-white' />
                  </div>
                  <div>
                    <h3 className='text-xl font-bold'>Send a Message</h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      Fill in the form below
                    </p>
                  </div>
                </div>

                <div className='grid md:grid-cols-2 gap-6 mb-6'>
                  <div className='relative'>
                    <label
                      htmlFor='name'
                      className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                        focusedField === 'name' || formData.name
                          ? '-top-2 text-xs bg-white dark:bg-gray-800 px-2 text-primary'
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
                      className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                        focusedField === 'email' || formData.email
                          ? '-top-2 text-xs bg-white dark:bg-gray-800 px-2 text-primary'
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
                    className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                      focusedField === 'subject' || formData.subject
                        ? '-top-2 text-xs bg-white dark:bg-gray-800 px-2 text-primary'
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
                    className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                      focusedField === 'message' || formData.message
                        ? '-top-2 text-xs bg-white dark:bg-gray-800 px-2 text-primary'
                        : 'top-4 text-gray-400'
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
                    className='w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary focus:ring-0 bg-transparent text-gray-900 dark:text-white resize-none transition-colors'
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
                    className='mt-6 flex items-center justify-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-4 rounded-xl'
                  >
                    <CheckCircle size={20} />
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
