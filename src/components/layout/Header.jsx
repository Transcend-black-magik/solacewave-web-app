import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/components/header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  
  const transparentPages = ['/', '/about', '/contact'];
  const isTransparentPage = transparentPages.includes(location.pathname);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) setIsScrolled(true);
      else setIsScrolled(false);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMenu = () => setMenuOpen(!menuOpen);
  useEffect(() => setMenuOpen(false), [location]);

  const handleGetStarted = () => {
    window.location.href = '/services';
  };

  return (
    <header className={`header ${isScrolled || !isTransparentPage ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {/* === NEW LOGO === */}
            <img
              src="/Solacelogosuite-05.png"
              alt="Solace Wave Therapy"
              style={{
                height: '50px',
                objectFit: 'contain',
                marginRight: '-18px',
              }}
            />
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
                <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
              </li>
              <li>
                <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
              </li>
              <li>
                <Link to="/services" className={location.pathname === '/services' ? 'active' : ''}>Services</Link>
              </li>
              <li>
                <Link to="/therapists" className={location.pathname === '/therapists' ? 'active' : ''}>Therapists</Link>
              </li>
              <li>
                <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link>
              </li>
              <li>
                <Link to="/faq" className={location.pathname === '/faq' ? 'active' : ''}>FAQ</Link>
              </li>
            </ul>

            <div className="nav-buttons">
              <button
                onClick={handleGetStarted}
                className="btn btn-primary btn-sm"
              >
                Book A Session
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;