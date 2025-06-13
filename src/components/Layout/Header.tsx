import React, { useState, useEffect } from 'react';
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
  const [scrolled, setScrolled] = useState(false);

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

  const links = [
    { label: 'Dashboard', icon: <Home className="h-5 w-5 inline-block mr-1" />, href: '#hero', onClick: () => smoothScrollTo('hero') },
    { label: 'Features', icon: <Star className="h-5 w-5 inline-block mr-1" />, href: '#features', onClick: () => smoothScrollTo('features') },
    { label: 'Testimonials', icon: <User className="h-5 w-5 inline-block mr-1" />, href: '#testimonials', onClick: () => smoothScrollTo('testimonials') },
    { label: 'Pricing', icon: <DollarSign className="h-5 w-5 inline-block mr-1" />, href: '#pricing', onClick: () => smoothScrollTo('pricing') },
    { label: 'Content Analyzer', icon: <FileText className="h-5 w-5 inline-block mr-1" />, href: '#content-analyzer', onClick: () => smoothScrollTo('content-analyzer') },
    { label: 'Keyword Research', icon: <Search className="h-5 w-5 inline-block mr-1" />, href: '#keyword-research', onClick: () => smoothScrollTo('keyword-research') },
    { label: 'API Docs', icon: <Code className="h-5 w-5 inline-block mr-1" />, href: '#api-docs', onClick: () => smoothScrollTo('api-docs') },
    { label: 'Blog', icon: <BookOpen className="h-5 w-5 inline-block mr-1" />, href: '#blog', onClick: () => smoothScrollTo('blog') },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/20 backdrop-blur-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img
              src="/logos/Navbar.jpg"
              alt="GEO Analytics"
              className="h-12 w-auto object-contain"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <button
                key={link.label}
                onClick={link.onClick || (() => {})}
                className="text-white/80 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                {link.icon}
                {link.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="text-white hover:text-white/80 transition-colors duration-200"
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

      {/* Mobile Navigation */}
      {open && (
        <div className="md:hidden bg-black/95 backdrop-blur-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {links.map((link) => (
              <button
                key={link.label}
                onClick={link.onClick || (() => {})}
                className="block w-full text-left px-3 py-2 text-white/80 hover:text-white transition-colors duration-200"
              >
                {link.icon}
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}