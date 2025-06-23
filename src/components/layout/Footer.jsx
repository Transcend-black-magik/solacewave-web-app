import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Newsletter form state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterFirstName, setNewsletterFirstName] = useState('');
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  const [newsletterResult, setNewsletterResult] = useState(null);

  // const FIREBASE_PROJECT_ID = 'solacewave-15844'; 
  //const FUNCTIONS_BASE_URL = `https://us-central1-${FIREBASE_PROJECT_ID}.cloudfunctions.net`;

  // Handle newsletter subscription
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterResult({
        success: false,
        message: 'Please enter a valid email address'
      });
      return;
    }
    
    setIsNewsletterSubmitting(true);
    setNewsletterResult(null);
    
    try {
      // Replace this URL with your deployed server URL
      const API_BASE_URL = 'https://solace-wave-api-production.up.railway.app';
      
      const response = await fetch(`${API_BASE_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newsletterEmail,
          firstName: newsletterFirstName
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setNewsletterResult({
          success: true,
          message: result.message
        });
        
        // Reset form
        setNewsletterEmail('');
        setNewsletterFirstName('');
        
        // Clear message after 8 seconds
        setTimeout(() => {
          setNewsletterResult(null);
        }, 8000);
      } else {
        setNewsletterResult({
          success: false,
          message: result.message || 'Subscription failed. Please try again.'
        });
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setNewsletterResult({
        success: false,
        message: 'Network error. Please try again.'
      });
    } finally {
      setIsNewsletterSubmitting(false);
    }
  };
  
  return (
    <footer className="footer">
      <div className="footer-wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#87431D" fillOpacity="0.2" d="M0,192L60,176C120,160,240,128,360,122.7C480,117,600,139,720,149.3C840,160,960,160,1080,154.7C1200,149,1320,139,1380,133.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>
      
      <div className="footer-content">
        <div className="container">
          <div className="footer-main">
            <div className="footer-logo">
              <Link to="/">
                <img src="/assets/images/logo.svg" alt="Solace Wave Therapy" />
                <span>Solace Wave Therapy</span>
              </Link>
              <p>Your journey to better mental health begins with us.</p>
            </div>
            
            <div className="footer-links">
              <div className="footer-links-column">
                <h3>Company</h3>
                <ul>
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/therapists">Our Therapists</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                </ul>
              </div>
              
              <div className="footer-links-column">
                <h3>Resources</h3>
                <ul>
                  <li><Link to="/services">Our Services</Link></li>
                  <li><Link to="/faq">FAQ</Link></li>
                </ul>
              </div>
              
              <div className="footer-links-column">
                <h3>Legal</h3>
                <ul>
                  <li><Link to="/terms">Terms of Service</Link></li>
                  <li><Link to="/privacy">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="footer-newsletter">
              <h3>Stay Connected</h3>
              <p>Join our newsletter for mental health tips and updates.</p>
              
              {newsletterResult && (
                <div className={`submit-result ${newsletterResult.success ? 'success' : 'error'} newsletter-result`} style={{ 
                  marginBottom: '15px', 
                  padding: '10px', 
                  borderRadius: '5px', 
                  fontSize: '14px',
                  backgroundColor: newsletterResult.success ? '#d4edda' : '#f8d7da',
                  color: newsletterResult.success ? '#155724' : '#721c24',
                  border: `1px solid ${newsletterResult.success ? '#c3e6cb' : '#f5c6cb'}`
                }}>
                  {newsletterResult.message}
                </div>
              )}
              
              <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                {/* <input 
                  type="text" 
                  placeholder="First name (optional)" 
                  value={newsletterFirstName}
                  onChange={(e) => setNewsletterFirstName(e.target.value)}
                  style={{ marginBottom: '10px' }}
                /> */}
                <input 
                  type="email" 
                  placeholder="Your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required 
                />
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isNewsletterSubmitting}
                >
                  {isNewsletterSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
              
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://www.instagram.com/solace_wave_therapy_africa?igsh=MTIyZGdldThnd3R5dw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>
        
          <div className="footer-bottom">
            <p>&copy; {currentYear} Solace Wave Therapy. All rights reserved.</p>
            
            <div className="app-links">
              <a href="https://apps.apple.com/app/solace-therapy/id1234567890" target="_blank" rel="noopener noreferrer">
                <img src="/assets/images/app-store-badge.png" alt="Download on the App Store" />
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.solacetherapy.app" target="_blank" rel="noopener noreferrer">
                <img src="/assets/images/play-store-badge.png" alt="Get it on Google Play" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;