import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/components/header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  
  // Simple pages where header should be transparent initially
  const transparentPages = ['/', '/about', '/contact'];
  const isTransparentPage = transparentPages.includes(location.pathname);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Immediately check scroll position
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  // Close menu when changing route
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Handle Get Started button click
  const handleGetStarted = () => {
    window.location.href = 'https://solacewave-app.web.app/';
  };
  
  // Full header for all pages
  return (
    <header className={`header ${isScrolled || !isTransparentPage ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <img src="/assets/images/logo.svg" alt="Solace Wave Therapy" />
            <span className="logo-text">Solace Wave Therapy</span>
          </Link>
          
          <button 
            className={`menu-toggle ${menuOpen ? 'open' : ''}`} 
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
            <ul className="nav-links">
              <li>
                <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
                  About
                </Link>
              </li>
              <li>
                <Link to="/services" className={location.pathname === '/services' ? 'active' : ''}>
                  Services
                </Link>
              </li>
              <li>
                <Link to="/therapists" className={location.pathname === '/therapists' ? 'active' : ''}>
                  Therapists
                </Link>
              </li>
              <li>
                <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className={location.pathname === '/faq' ? 'active' : ''}>
                  FAQ
                </Link>
              </li>
            </ul>
            
            <div className="nav-buttons">
              <button 
                onClick={handleGetStarted}
                className="btn btn-primary btn-sm"
              >
                Get Started
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;