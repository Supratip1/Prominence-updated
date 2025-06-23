import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

// Desktop NavLink
const NavLink = ({ onClick, children, isActive }: { onClick: () => void, children: React.ReactNode, isActive?: boolean }) => (
  <button
    onClick={onClick}
    className={`flex items-center text-base font-normal transition-colors duration-200 px-3 py-2 rounded-md ${
      isActive ? 'text-white' : 'text-gray-400 hover:text-white'
    }`}
  >
    {isActive && <span className="w-1.5 h-1.5 bg-white rounded-full mr-2.5"></span>}
    {children}
  </button>
);

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const smoothScrollTo = useCallback((elementId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(elementId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
         top: offsetPosition,
         behavior: "smooth"
      });
    } else {
        navigate(`/#${elementId}`);
    }
  }, [navigate]);

  // Scroll detection and active section highlighting
  useEffect(() => {
    const sections = ['hero', 'our-services', 'key-benefits', 'pricing'];
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      
      const scrollPosition = window.scrollY + 120; // Increased offset for better accuracy

      // Find active section
      const currentSection = sections.find(id => {
        const section = document.getElementById(id);
        if (!section) return false;
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        return scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);


  const links = [
    { 
      label: 'Dashboard', 
      sectionId: 'hero'
    },
    { 
      label: 'Features', 
      sectionId: 'our-services'
    },
    { 
      label: 'Benefits', 
      sectionId: 'key-benefits'
    },
    { 
      label: 'Pricing', 
      sectionId: 'pricing'
    },
  ];

  return (
    <>
      {/* Desktop Header */}
      <div className="hidden sm:block fixed top-6 left-8 z-50">
          <button onClick={() => smoothScrollTo('hero')} className="text-white font-normal text-2xl">Prominence</button>
      </div>
      <header className="hidden sm:block fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <div className={`
          flex items-center gap-x-4
          px-4 py-2
          bg-black/50 backdrop-blur-lg
          border border-white/10
          rounded-full
          shadow-lg
          transition-all duration-300
          ${isScrolled ? 'shadow-purple-500/10' : 'shadow-none'}
        `}>
          <nav className="flex items-center gap-x-1">
            {links.map((link) => (
              <NavLink 
                key={link.sectionId}
                onClick={() => smoothScrollTo(link.sectionId)} 
                isActive={activeSection === link.sectionId}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <button
            onClick={() => navigate('/analysis')}
            className="flex items-center text-sm font-normal text-black bg-white hover:bg-gray-200 transition-colors px-4 py-2 rounded-full shadow-md ml-2"
          >
            Get started
          </button>
        </div>
      </header>
      
      {/* Mobile Header */}
      <header className={`sm:hidden fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-sm' : 'bg-transparent'}`}>
         <div className="flex items-center justify-between h-16 px-4">
             <button onClick={() => smoothScrollTo('hero')} className="text-white font-normal">Prominence</button>
             <div className="flex items-center gap-x-2">
                <button
                  onClick={() => navigate('/analysis')}
                  className="flex items-center text-xs font-normal text-black bg-white hover:bg-gray-200 transition-colors px-3 py-1.5 rounded-full shadow-sm"
                >
                  Get started
                </button>
                <button
                  onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-white"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
             </div>
         </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="sm:hidden fixed inset-0 bg-black/95 backdrop-blur-md z-40 flex flex-col items-center justify-center pt-20"
          onClick={() => setMobileMenuOpen(false)}
        >
           <nav className="flex flex-col items-center gap-y-8">
            {links.map((link) => (
              <button
                key={link.sectionId}
                onClick={() => smoothScrollTo(link.sectionId)} 
                className={`text-2xl font-normal ${activeSection === link.sectionId ? 'text-white' : 'text-gray-400'}`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}