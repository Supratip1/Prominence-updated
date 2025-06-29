import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, NavLink as RouterNavLink } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, UserIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';
import { useUser, UserButton } from '@clerk/clerk-react';
import { useSidebar } from '../../contexts/SidebarContext';

// Desktop NavLink
const NavLink = ({ onClick, children, isActive }: { onClick: () => void, children: React.ReactNode, isActive?: boolean }) => (
  <button
    onClick={onClick}
    className={`flex items-center text-base font-semibold transition-all duration-200 px-3 py-2 rounded-md ${
      isActive 
        ? 'text-black bg-gray-100 shadow-sm' 
        : 'text-gray-600 hover:text-black hover:bg-gray-50'
    }`}
  >
    {isActive && <span className="w-1.5 h-1.5 bg-black rounded-full mr-2.5"></span>}
    {children}
  </button>
);

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn, user } = useUser();
  const { openSidebar } = useSidebar();

  // Only show sidebar toggle on these routes
  const sidebarRoutes = [
    '/aeo-analysis',
    '/analysis',
    '/optimization',
    '/track-competitors',
    '/integrate-boards',
    '/model-scores',
  ];
  const showSidebarToggle = sidebarRoutes.some(route => location.pathname.startsWith(route));

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
    const sections = ['hero', 'our-services', 'key-benefits', 'book-a-call'];
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
    { label: 'Dashboard', to: 'hero' },
    { label: 'Features', to: 'our-services' },
    { label: 'FAQ', to: 'key-benefits' },
    { label: 'Book a Call', to: 'book-a-call' },
  ];

  return (
    <header className={`fixed top-0 left-0 w-full py-6 px-8 z-[100] transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-white'
    }`}>
      <div className="relative flex items-center w-full">
        {/* Left: Logo (text only) */}
        <button
          className="cursor-pointer hover:opacity-80 transition-opacity bg-transparent border-none p-0 m-0"
          style={{ background: 'none' }}
          onClick={() => smoothScrollTo('hero')}
          aria-label="Go to top / hero section"
        >
          <div className="flex items-end">
            <img 
              src="/logos/mainlogo.png" 
              alt="Prominence Logo" 
              className="h-8 w-auto"
            />
          </div>
        </button>
        {/* Sidebar toggle for mobile (PanelLeft icon) */}
        {showSidebarToggle && (
          <button
            className="md:hidden p-2 rounded focus:outline-none ml-2"
            onClick={openSidebar}
            aria-label="Open sidebar menu"
          >
            <Bars3Icon className="w-6 h-6 text-black" />
          </button>
        )}
        
        {/* Centered Nav Pill */}
        <nav className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex gap-2 px-6 py-2 rounded-full shadow-lg border border-gray-200 bg-white/80 backdrop-blur-md">
            {links.map((link) => (
              <NavLink
                key={link.to}
                onClick={() => smoothScrollTo(link.to)}
                isActive={activeSection === link.to}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Right: Auth Actions */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          {isSignedIn ? (
            <>
              <UserButton afterSignOutUrl="/dashboard" />
              {/* Optionally show user info */}
              {/* <span className="ml-2">{user?.firstName}</span> */}
            </>
          ) : (
            <>
              <button
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-black transition-colors duration-200"
                onClick={() => navigate('/sign-in')}
              >
                <ArrowRightEndOnRectangleIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Log In</span>
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors duration-200"
                onClick={() => navigate('/sign-up')}
              >
                <UserIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Sign Up</span>
              </button>
            </>
          )}
        </div>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden p-2 rounded focus:outline-none ml-auto"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="Open navigation menu"
        >
          {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6 text-black" /> : <Bars3Icon className="w-6 h-6 text-black" />}
        </button>
      </div>
      
      {/* Mobile Nav Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg z-40 flex flex-col items-center py-4 md:hidden animate-fade-in">
          {links.map((link) => (
            <button
              key={link.to}
              onClick={() => { setMobileMenuOpen(false); smoothScrollTo(link.to); }}
              className={`w-full text-lg py-3 px-4 text-center transition-colors duration-200 ${
                activeSection === link.to 
                  ? 'text-black bg-gray-50 font-semibold' 
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              {link.label}
            </button>
          ))}
          
          {/* Mobile Auth Actions */}
          <div className="w-full border-t border-gray-200 mt-4 pt-4 flex flex-col gap-2 px-4">
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/dashboard" />
            ) : (
              <>
                <button
                  className="w-full py-3 text-center text-gray-600 hover:text-black transition-colors duration-200"
                  onClick={() => { setMobileMenuOpen(false); navigate('/sign-in'); }}
                >
                  Log In
                </button>
                <button
                  className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors duration-200"
                  onClick={() => { setMobileMenuOpen(false); navigate('/sign-up'); }}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
