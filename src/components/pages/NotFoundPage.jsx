import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import AnimatedBackground from '../common/AnimatedBackground';
import '../../styles/components/not-found-page.css';

const NotFoundPage = () => {
  // Set page title
  useEffect(() => {
    document.title = 'Page Not Found | Solace Wave Therapy';
    
    // Restore original title when component unmounts
    return () => {
      document.title = 'Solace Wave Therapy';
    };
  }, []);

  // Handle Get Started button click
  const handleGetStarted = () => {
    window.location.href = 'https://solacewave-app.web.app/';
  };

  return (
    <div className="not-found-page">
      <AnimatedBackground variant="subtle" />
      <Header />
      
      <main className="not-found-content">
        <div className="container">
          <div className="not-found-container">
            <div className="not-found-illustration">
              <img src="/assets/images/404-illustration.svg" alt="Page not found" />
            </div>
            
            <div className="not-found-message">
              <h1>404</h1>
              <h2>Page Not Found</h2>
              <p>
                The page you are looking for might have been removed, had its name changed,
                or is temporarily unavailable.
              </p>
              
              <div className="not-found-actions">
                <Link to="/" className="btn btn-primary">
                  Return Home
                </Link>
                <Link to="/contact" className="btn btn-outline">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
          
          <div className="helpful-links">
            <h3>You might be looking for:</h3>
            <div className="links-grid">
              <Link to="/" className="helpful-link">
                <i className="fas fa-home"></i>
                <span>Home</span>
              </Link>
              <Link to="/services" className="helpful-link">
                <i className="fas fa-clipboard-list"></i>
                <span>Our Services</span>
              </Link>
              <Link to="/therapists" className="helpful-link">
                <i className="fas fa-user-md"></i>
                <span>Our Therapists</span>
              </Link>
              <button onClick={handleGetStarted} className="helpful-link helpful-link-button">
                <i className="fas fa-clipboard-check"></i>
                <span>Get Started</span>
              </button>
              <Link to="/contact" className="helpful-link">
                <i className="fas fa-envelope"></i>
                <span>Contact Us</span>
              </Link>
              <Link to="/about" className="helpful-link">
                <i className="fas fa-info-circle"></i>
                <span>About Us</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFoundPage;