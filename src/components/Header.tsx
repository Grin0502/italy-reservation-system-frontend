import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header id="global-header" className="code-section bg-black/90 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold" data-logo="">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Tavly
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/about-us" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300">
              Chi Siamo
            </Link>
            <Link to="/services" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300">
              Servizi
            </Link>
            <Link to="/restaurants" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300">
              Ristoranti
            </Link>
            <Link to="/faqs" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300">
              FAQ
            </Link>

            {/* CTA Button */}
            <Link 
              to="/get-started" 
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 transform hover:scale-105"
            >
              Contattaci Ora
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-white focus:outline-none" 
            data-landingsite-mobile-menu-toggle="" 
            aria-expanded={isMobileMenuOpen}
            aria-label="Apri menu di navigazione"
            onClick={toggleMobileMenu}
          >
            <i className="fas fa-bars text-xl" aria-hidden="true"></i>
          </button>
        </nav>

        {/* Mobile Navigation */}
        <div className={`lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`} data-landingsite-mobile-menu="">
          <div className="bg-gray-900/95 backdrop-blur-sm rounded-lg mt-2 p-4 border border-gray-700">
            <div className="flex flex-col space-y-4">
              <Link to="/about-us" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 py-2">
                Chi Siamo
              </Link>
              <Link to="/services" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 py-2">
                Servizi
              </Link>
              <Link to="/restaurants" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 py-2">
                Ristoranti
              </Link>
              <Link to="/faqs" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 py-2">
                FAQ
              </Link>
              <Link 
                to="/get-started" 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold text-center mt-4"
              >
                Contattaci Ora
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
