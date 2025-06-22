import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import Button from '../UI/Button';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Handle scroll effect with throttling
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10;
      setIsScrolled(scrolled);
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, []);

  // Handle body scroll lock
  useEffect(() => {
    if (open) {
      document.body.classList.add('overflow-hidden');
      // Focus trap for mobile menu
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      if (firstElement) firstElement.focus();
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement?.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement?.focus();
            }
          }
        } else if (e.key === 'Escape') {
          setOpen(false);
        }
      };
      
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.classList.remove('overflow-hidden');
      };
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [open]);

  const smoothScrollTo = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    setOpen(false);
  }, []);

  // Helper to navigate to home and scroll to section
  const goToSection = useCallback((sectionId: string) => {
    if (window.location.pathname !== '/dashboard' && window.location.pathname !== '/') {
      window.location.href = `/dashboard#${sectionId}`;
    } else {
      smoothScrollTo(sectionId);
    }
    setOpen(false);
  }, [smoothScrollTo]);

  const links = [
    { 
      label: 'Dashboard', 
      icon: <Home className="h-5 w-5 inline-block mr-1" />, 
      href: '#hero', 
      onClick: () => goToSection('hero'),
      'aria-label': 'Go to dashboard section'
    },
    { 
      label: 'Features', 
      icon: <Target className="h-5 w-5 inline-block mr-1" />, 
      href: '#our-services', 
      onClick: () => goToSection('our-services'),
      'aria-label': 'Go to features section'
    },
    { 
      label: 'Pricing', 
      icon: <DollarSign className="h-5 w-5 inline-block mr-1" />, 
      href: '#pricing', 
      onClick: () => goToSection('pricing'),
      'aria-label': 'Go to pricing section'
    },
  ];

  // Dynamic text color classes
  const textColorClass = 'text-white';
  const textHoverClass = 'hover:text-white';
  const textOpacityClass = 'text-white/80';

  return (
    <>
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-black' : 'bg-transparent'}`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <button
              onClick={() => goToSection('hero')}
              className="font-bold text-xl text-white hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded"
              aria-label="Go to homepage"
            >
              Prominance.ai
            </button>

            {/* Desktop Navigation - Right aligned */}
            <nav className="hidden md:flex items-center space-x-6" role="navigation" aria-label="Main navigation">
              {links.map((link) => (
                <button
                  key={link.label}
                  onClick={link.onClick}
                  className="text-base font-medium text-gray-400 hover:text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded px-2 py-1"
                  aria-label={link['aria-label']}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                ref={menuButtonRef}
                onClick={() => setOpen(!open)}
                className={`${textColorClass} hover:opacity-80 transition-colors duration-200 p-2 rounded focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black`}
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                aria-controls="mobile-menu"
              >
                {open ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      {open && (
        <div 
          className="fixed inset-0 z-50 bg-black flex flex-col md:hidden"
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
        >
          <div className="flex justify-end p-4">
            <button
              onClick={() => setOpen(false)}
              className="text-white hover:text-white/80 transition-colors duration-200 p-2 rounded focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              aria-label="Close menu"
            >
              <X className="h-7 w-7" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 flex flex-col justify-center px-2 pb-8 space-y-1">
            <h2 id="mobile-menu-title" className="sr-only">Mobile menu</h2>
            {links.map((link) =>
              link.onClick ? (
                <button
                  key={link.label}
                  onClick={link.onClick}
                  className="block w-full text-left px-3 py-4 text-xl text-white/80 hover:text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded"
                  aria-label={link['aria-label']}
                >
                  {link.icon}
                  {link.label}
                </button>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="block w-full text-left px-3 py-4 text-xl text-white/80 hover:text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded"
                  aria-label={link['aria-label']}
                >
                  {link.icon}
                  {link.label}
                </a>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
}