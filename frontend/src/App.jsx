import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { useDarkMode } from './hooks/useDarkMode';
import { motion } from 'framer-motion';

function App() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className='min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300'>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main>
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
