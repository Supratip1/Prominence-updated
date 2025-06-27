import React from "react"

function smoothScrollTo(elementId: string) {
  const element = document.getElementById(elementId);
  if (element) {
    const headerOffset = 100;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  }
}

const Footer = () => {
  return (
    <footer className="w-full bg-white text-black py-12 px-4 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 flex flex-col items-center gap-8 sm:gap-10">
        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-6 sm:gap-8 text-xs sm:text-sm font-medium mb-4 text-black">
          <button
            onClick={() => smoothScrollTo("hero")}
            className="px-2 py-1"
          >
            Dashboard
          </button>
          <button
            onClick={() => smoothScrollTo("our-services")}
            className="px-2 py-1"
          >
            Features
          </button>
          <button
            onClick={() => smoothScrollTo("key-benefits")}
            className="px-2 py-1"
          >
            Benefits
          </button>
          <button
            onClick={() => smoothScrollTo("book-a-call")}
            className="px-2 py-1"
          >
            Book a Call
          </button>
        </nav>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />

        {/* Socials */}
        <div className="flex gap-6 mb-4">
          <a href="#" className="text-black hover:text-green-600 transition p-2" aria-label="Twitter">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.46 6c-.77.35-1.6.58-2.47.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.77c-.37.64-.58 1.39-.58 2.19 0 1.51.77 2.84 1.95 3.62-.72-.02-1.4-.22-1.99-.55v.06c0 2.11 1.5 3.87 3.5 4.27-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.68 2.12 2.9 3.99 2.93A8.6 8.6 0 0 1 2 19.54c-.29 0-.57-.02-.85-.05A12.13 12.13 0 0 0 8.29 21.5c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 24 4.59a8.36 8.36 0 0 1-2.54.7z" />
            </svg>
          </a>
          <a href="#" className="text-black hover:text-green-600 transition p-2" aria-label="LinkedIn">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" />
            </svg>
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-black mt-4">
          &copy; {new Date().getFullYear()} Prominence.ai. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer 