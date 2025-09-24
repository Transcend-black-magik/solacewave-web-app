import React, { useEffect, useState } from 'react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import '../../styles/components/contact-page.css';

const ContactPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  // Newsletter form state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterFirstName, setNewsletterFirstName] = useState('');
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  const [newsletterResult, setNewsletterResult] = useState(null);

  //const FIREBASE_PROJECT_ID = 'solacewave-15844'; 
  //const FUNCTIONS_BASE_URL = `https://us-central1-${FIREBASE_PROJECT_ID}.cloudfunctions.net`;

  useEffect(() => {
    // Add animation delay to simulate content loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Set up intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
    
    return () => {
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.unobserve(el);
      });
    };
  }, [isLoaded]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle contact form submission
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (validateForm()) {
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setSubmitResult({ success: true, message: result.message });
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });

        setTimeout(() => {
          setSubmitResult(null);
        }, 8000);
      } else {
        setSubmitResult({
          success: false,
          message: result.message || 'Failed to send message. Please try again.',
        });
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitResult({
        success: false,
        message: error.message || 'Network error. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }
};

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
    <div className="contact-page">
      <Header />
      
      <main className={`contact-content ${isLoaded ? 'loaded' : ''}`}>
        <section className="contact-hero">
          <div className="container">
            <div className="contact-hero-content animate-on-scroll">
              <h1>Contact Us</h1>
              <p className="subtitle">We're here to help with any questions you may have</p>
            </div>
          </div>
        </section>
        
        <section className="contact-options-section">
          <div className="container">
            <div className="contact-options-grid">
              {/* <div className="contact-form-container animate-on-scroll">
                <h2>Send Us a Message</h2>
                
                {submitResult && (
                  <div className={`submit-result ${submitResult.success ? 'success' : 'error'}`}>
                    {submitResult.message}
                  </div>
                )}
                
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={formErrors.name ? 'error' : ''}
                    />
                    {formErrors.name && <div className="error-message">{formErrors.name}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={formErrors.email ? 'error' : ''}
                    />
                    {formErrors.email && <div className="error-message">{formErrors.email}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Billing Question">Billing Question</option>
                      <option value="Partnership Opportunity">Partnership Opportunity</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      className={formErrors.message ? 'error' : ''}
                    ></textarea>
                    {formErrors.message && <div className="error-message">{formErrors.message}</div>}
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-block"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner"></span>
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              </div> */}
              
              <div className="contact-info-container animate-on-scroll">
                <h2>Contact Information</h2>
                
                <div className="contact-info-items">
                  <div className="contact-info-item">
                    <div className="contact-icon">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="contact-details">
                      <h3>Email Us:</h3>
                      <p>For general inquiries:</p>
                      <a href="mailto:solacewavetherapy@gmail.com">solacewavetherapy@gmail.com</a>
                      <p>For support:</p>
                      <a href="mailto:solacewavetherapy@gmail.com">solacewavetherapy@gmail.com</a>
                    </div>
                  </div>
                  
                  <div className="contact-info-item">
                    <div className="contact-icon">
                      <i className="fas fa-phone-alt"></i>
                    </div>
                    <div className="contact-details">
                      <h3>Call Us</h3>
                      <p>Customer Support:</p>
                      <p>Call: <a href="tel:+2347033343596">(234) 703 334 3596</a></p>
                      <p></p>
                      <p>WhatsApp: <a href="tel:+2347085256034">(234) 708 525 6034</a></p>
                      <p>Available Monday-Friday, 9am-6pm WAT. </p>
                      <p>Saturday & Sunday, 10am-2pm WAT. </p>
                    </div>
                  </div>
                  
                  <div className="contact-info-item">
                    <div className="contact-icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div className="contact-details">
                      <h3>Office Location</h3>
                      <p>11 Koforidua street, off mambolo</p>
                      <p>Wuse Zone 2</p>
                      <p>Abuja, NG</p>
                    </div>
                  </div>
                </div>
                
                <div className="business-hours">
                  <h3>Business Hours</h3>
                  <p><strong>Monday-Friday:</strong> 9:00 AM - 6:00 PM WAT</p>
                  <p><strong>Saturday:</strong> 10:00 AM - 2:00 PM WAT</p>
                  <p><strong>Sunday:</strong> 10:00 AM - 2:00 PM WAT</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="faq-contact-section">
          <div className="container">
            <h2 className="section-title animate-on-scroll">Common Questions</h2>
            
            <div className="faq-grid animate-on-scroll">
              <div className="faq-item">
                <h3>How quickly will I be matched with a therapist?</h3>
                <p>Most clients are matched with a therapist immediately.</p>
              </div>
              
              <div className="faq-item">  
                <h3>Can I change therapists if I'm not satisfied?</h3>
                <p>Yes, you can request a new therapist at any time through WhatsApp or by reaching customer service.</p>
              </div>
          
              <div className="faq-item">
                <h3>How do I cancel my subscription?</h3>
                <p>You can cancel your subscription anytime through WhatsApp or by contacting support.</p>
              </div>
            </div>
            
            <div className="faq-more animate-on-scroll">
              <p>Still have questions? Check out our comprehensive <a href="/faq">FAQ page</a>.</p>
            </div>
          </div>
        </section>
        
        <section className="newsletter-section">
          <div className="container">
            <div className="newsletter-container animate-on-scroll">
              <div className="newsletter-content">
                <h2>Stay Connected</h2>
                <p>Subscribe to our newsletter for mental health tips, resources, and updates.</p>
              </div>
              
              {newsletterResult && (
                <div className={`submit-result ${newsletterResult.success ? 'success' : 'error'} newsletter-result`}>
                  {newsletterResult.message}
                </div>
              )}
              
              <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                <div className="newsletter-input-group">
                  <input 
                    type="text" 
                    placeholder="First name (optional)" 
                    value={newsletterFirstName}
                    onChange={(e) => setNewsletterFirstName(e.target.value)}
                    style={{ marginBottom: '10px' }}
                  />
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    style={{ marginBottom: '10px' }} 
                  />
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isNewsletterSubmitting}
                    style={{marginBottom: '10px'}}
                  >
                    {isNewsletterSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </div>
                <p className="newsletter-privacy">We respect your privacy and will never share your information.</p>
              </form>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;