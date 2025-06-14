import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Target,
  User,
  BarChart2,
  Menu,
  X,
  Home,
  Star,
  DollarSign,
  FileText,
  Search,
  Code,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  useEffect(() => {
    if (open) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [open]);

  const smoothScrollTo = (elementId: string) => {
    // If we're not on the dashboard page, navigate there first
    if (location.pathname !== '/dashboard' && location.pathname !== '/') {
      navigate('/dashboard');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 100);
    } else {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
    setOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const links = [
    { 
      label: 'Home', 
      icon: <Home className="h-4 w-4 sm:h-5 sm:w-5" />, 
      onClick: () => smoothScrollTo('hero') 
    },
    { 
      label: 'Features', 
      icon: <BarChart2 className="h-4 w-4 sm:h-5 sm:w-5" />, 
      onClick: () => smoothScrollTo('features') 
    },
    { 
      label: 'Demo', 
      icon: <Search className="h-4 w-4 sm:h-5 sm:w-5" />, 
      onClick: () => smoothScrollTo('demo') 
    },
    { 
      label: 'Testimonials', 
      icon: <User className="h-4 w-4 sm:h-5 sm:w-5" />, 
      onClick: () => smoothScrollTo('testimonials') 
    },
    { 
      label: 'Pricing', 
      icon: <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />, 
      onClick: () => smoothScrollTo('pricing') 
    },
  ];

  return (
    <>
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <motion.div 
              className="flex items-center cursor-pointer"
              onClick={() => handleNavigation('/dashboard')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src="/logos/Navbar.jpg"
                alt="GEO Analytics"
                className="h-10 sm:h-12 w-auto object-contain"
                loading="eager"
              />
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {links.map((link, index) => (
                <motion.button
                  key={link.label}
                  onClick={link.onClick}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-200 text-sm lg:text-base font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  {link.icon}
                  {link.label}
                </motion.button>
              ))}
              
              <motion.button
                onClick={() => handleNavigation('/analysis')}
                className="ml-4 px-4 py-2 bg-gradient-to-r from-[#adff2f] to-[#7cfc00] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all text-sm lg:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                Try Free
              </motion.button>
            </nav>

            {/* Mobile Menu Button */}
            <motion.div 
              className="md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <button
                onClick={() => setOpen(!open)}
                className="text-white hover:text-white/80 transition-colors duration-200 p-2"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {open ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b border-white/10">
                <img
                  src="/logos/Navbar.jpg"
                  alt="GEO Analytics"
                  className="h-10 w-auto object-contain"
                />
                <button
                  onClick={() => setOpen(false)}
                  className="text-white hover:text-white/80 transition-colors duration-200 p-2"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <motion.div 
                className="flex-1 flex flex-col justify-center px-6 space-y-6"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                {links.map((link, index) => (
                  <motion.button
                    key={link.label}
                    onClick={link.onClick}
                    className="flex items-center gap-4 text-white/80 hover:text-white transition-colors duration-200 text-xl font-medium py-3"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                    whileHover={{ x: 10 }}
                  >
                    {link.icon}
                    {link.label}
                  </motion.button>
                ))}
                
                <motion.button
                  onClick={() => handleNavigation('/analysis')}
                  className="mt-8 w-full py-4 bg-gradient-to-r from-[#adff2f] to-[#7cfc00] text-black font-bold rounded-xl text-lg"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Try Free Analysis
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}