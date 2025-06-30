import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, NavLink as RouterNavLink } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, UserIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';
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
  const [isMarketingMenuOpen, setMarketingMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
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

      // Delay scrolling slightly to ensure body overflow is reset on mobile
      setTimeout(() => {
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }, 50);
    } else {
      // Navigate to the dashboard page with the hash if section isn't found
      navigate(`/dashboard#${elementId}`);
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

  const dashboardRoutes = [
    '/dashboard',
    '/aeo-analysis',
    '/analysis',
    '/optimization',
    '/track-competitors',
    '/integrate-boards',
    '/model-scores',
  ];
  const isDashboardPage = dashboardRoutes.some(route => location.pathname.startsWith(route) && location.pathname !== '/dashboard');
  const isHomePage = location.pathname === '/dashboard' || location.pathname === '/';

  const links = [
    { label: 'Dashboard', to: 'hero' },
    { label: 'Features', to: 'our-services' },
    { label: 'FAQ', to: 'key-benefits' },
    { label: 'Book a Call', to: 'book-a-call' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full py-2 px-4 z-[100] transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-white'
      }`}
      style={{}}
    >
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
        {/* Hamburger for marketing pages (mobile only) */}
        {!isDashboardPage && (
          <button
            className="md:hidden p-2 ml-auto"
            onClick={() => setMarketingMenuOpen(v => !v)}
            aria-label="Open navigation menu"
            style={{ position: 'absolute', right: 0 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-black">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5m-16.5 5.25h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        )}
        {/* Hamburger for mobile (only on dashboard/analysis pages) */}
        {isDashboardPage && (
          <button
            className="md:hidden p-2 ml-auto"
            onClick={openSidebar}
            aria-label="Open sidebar menu"
            style={{ position: 'absolute', right: 0 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-black">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5m-16.5 5.25h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        )}
        
        {/* Centered Nav Pill (only on marketing/public pages, desktop) */}
        {!isDashboardPage && (
          <nav className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex gap-2 px-4 py-1.5 rounded-full shadow-lg border border-gray-200 bg-white/80 backdrop-blur-md">
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
        )}
        {/* Mobile marketing menu dropdown */}
        {!isDashboardPage && isMarketingMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex flex-col items-end">
            <div className="w-48 bg-white border border-gray-200 shadow-lg rounded-b-xl animate-fade-in relative">
              {/* Close button */}
              <button
                className="absolute top-2 right-2 p-2 text-gray-500 hover:text-black"
                onClick={() => setMarketingMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="pt-10 pb-2 flex flex-col">
                {links.map((link) => (
                  <button
                    key={link.to}
                    onClick={() => {
                      setMarketingMenuOpen(false);
                      setTimeout(() => smoothScrollTo(link.to), 100); // ensure menu closes before scroll
                    }}
                    className={`w-full text-left px-6 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 ${activeSection === link.to ? 'bg-gray-100 font-semibold' : ''}`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Overlay to close menu when clicking outside */}
            <div className="fixed inset-0 z-40" onClick={() => setMarketingMenuOpen(false)} />
          </div>
        )}

        {/* Right: Auth Actions - Removed Clerk authentication */}
        <div className="hidden md:flex items-center gap-3 ml-auto">
          {isHomePage && (
            <button
              className="flex items-center gap-2 px-4 py-2 border border-black rounded-lg text-sm font-medium text-black hover:bg-gray-50 transition-colors"
              onClick={() => {
                smoothScrollTo('analyze-input');
                const input = document.getElementById('analyze-input') as HTMLInputElement | null;
                input?.focus();
              }}
            >
              Get Started
            </button>
          )}
          {/* Authentication removed - no login/logout buttons */}
        </div>
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
          
          {/* Mobile Auth Actions - Removed Clerk authentication */}
          <div className="w-full border-t border-gray-200 mt-4 pt-4 flex flex-col gap-2 px-4">
            {/* Authentication removed - no login/logout buttons */}
          </div>
        </div>
      )}
    </header>
  );
}
