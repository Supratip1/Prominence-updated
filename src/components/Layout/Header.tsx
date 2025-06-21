import React, { useState, useEffect, useRef } from 'react';
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

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    setOpen(false); // Close mobile menu after clicking
  };

  // Helper to navigate to home and scroll to section
  const goToSection = (sectionId: string) => {
    if (window.location.pathname !== '/dashboard' && window.location.pathname !== '/') {
      window.location.href = `/dashboard#${sectionId}`;
    } else {
      smoothScrollTo(sectionId);
    }
    setOpen(false);
  };

  const links = [
    { label: 'Dashboard', icon: <Home className="h-5 w-5 inline-block mr-1" />, href: '#hero', onClick: () => goToSection('hero') },
    { label: 'Testimonials', icon: <User className="h-5 w-5 inline-block mr-1" />, href: '#testimonials', onClick: () => goToSection('testimonials') },
    { label: 'Pricing', icon: <DollarSign className="h-5 w-5 inline-block mr-1" />, href: '#pricing', onClick: () => goToSection('pricing') },
  ];

  // Dynamic text color classes
  const textColorClass = 'text-white';
  const textHoverClass = 'hover:text-white';
  const textOpacityClass = 'text-white/80';

  return (
    <>
      <header 
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? 'bg-black' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Replace logo image with bold "Prominance.ai" */}
            <div className="flex items-center">
              <button
                onClick={() => goToSection('hero')}
                className={`font-bold text-xl md:text-2xl hover:opacity-90 transition-opacity ${textColorClass}`}
              >
                Prominance.ai
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {links.map((link) =>
                link.onClick ? (
                  <button
                    key={link.label}
                    onClick={link.onClick}
                    className={`${textOpacityClass} ${textHoverClass} transition-colors duration-200 cursor-pointer`}
                  >
                    {link.icon}
                    {link.label}
                  </button>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className={`${textOpacityClass} ${textHoverClass} transition-colors duration-200 cursor-pointer`}
                  >
                    {link.icon}
                    {link.label}
                  </a>
                )
              )}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setOpen(!open)}
                className={`${textColorClass} hover:opacity-80 transition-colors duration-200`}
              >
                {open ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      {open && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col md:hidden">
          <div className="flex justify-end p-4">
            <button
              onClick={() => setOpen(false)}
              className="text-white hover:text-white/80 transition-colors duration-200"
              aria-label="Close menu"
            >
              <X className="h-7 w-7" />
            </button>
          </div>
          <div className="flex-1 flex flex-col justify-center px-2 pb-8 space-y-1">
            {links.map((link) =>
              link.onClick ? (
                <button
                  key={link.label}
                  onClick={link.onClick}
                  className="block w-full text-left px-3 py-4 text-xl text-white/80 hover:text-white transition-colors duration-200"
                >
                  {link.icon}
                  {link.label}
                </button>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="block w-full text-left px-3 py-4 text-xl text-white/80 hover:text-white transition-colors duration-200"
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