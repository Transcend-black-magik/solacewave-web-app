import React, { useEffect, useState, useRef } from 'react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import '../../styles/components/landing-page.css';

const LandingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [activeFaq, setActiveFaq] = useState(null);
  const [useVideo, setUseVideo] = useState(true);
  const videoRef = useRef(null);
  const howItWorksRef = useRef(null);
  
  useEffect(() => {
    // Check if on mobile and potentially on mobile data saving mode
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile && navigator.connection && navigator.connection.saveData) {
      setUseVideo(false);
    }
    
    if (useVideo && videoRef.current) {
      const timer = setTimeout(() => {
        const videoElement = videoRef.current;
        
        // Create a source element
        const source = document.createElement('source');
        source.src = '/assets/videos/therapy-background.mp4';
        source.type = 'video/mp4';
        
        videoElement.appendChild(source);
        
        videoElement.load();
        
        try {
          videoElement.play().catch(() => {
          });
        } catch (e) {
          // Fallback already in place with autoplay attribute
        }
      }, 100); // Delay loading the video by 1 second
      
      return () => clearTimeout(timer);
    }
  }, [useVideo]);
  
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
  }, []);

  useEffect(() => {
    // Add animation delay to simulate content loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Handle Get Started button click
  const handleGetStarted = () => {
    window.location.href = 'https://solacewave-app.web.app/';
  };

  // Handle Learn More smooth scroll
  const handleLearnMore = (e) => {
    e.preventDefault();
    document.getElementById('how-it-works').scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  // Updated FAQ Data
  const faqData = [
    {
      question: "How much does therapy cost?",
      answer: "Our therapy plans start at N20,000 per session, billed monthly. You can check your coverage during the sign-up process in our secure platform."
    },
    {
      question: "How do I get started?",
      answer: "Simply click 'Get Started' on our website to access our secure platform. You'll complete a brief assessment and be matched with a licensed therapist within 24 hours."
    },
    {
      question: "How often will I meet with my therapist?",
      answer: "Most clients meet with their therapists weekly, especially at the beginning. As you progress, you and your therapist may decide to adjust the frequency. Our platform allows for flexible scheduling based on your needs and preferences. And you can also have 24/7 access to your therapist when you are under Coach in my Pocket Plan."
    },
    {
      question: "Can I change therapists if I'm not satisfied?",
      answer: "Absolutely! Finding the right therapist match is important. If you feel your current therapist isn't the right fit, you can request a change anytime through your account dashboard, and we'll match you with someone new."
    },
    {
      question: "Is online therapy as effective as in-person therapy?",
      answer: "Research shows that online therapy can be just as effective as in-person therapy for many conditions. Our platform is designed to provide the same quality of care with added convenience and flexibility."
    },
    {
      question: "How is my privacy protected?",
      answer: "We take your privacy seriously. Our platform uses end-to-end encryption for all communications, and we are fully HIPAA compliant. Your personal information and therapy sessions are kept strictly confidential."
    }
  ];

  return (
    <div className="landing-page">
      <Header />
      
      <main className={`landing-content ${isLoaded ? 'loaded' : ''}`}>
        <section className="hero-section">
          {/* Simple Video Background - Direct Source */}
          <div className="video-background">
            <video autoPlay loop muted playsInline poster="/assets/images/calm-background.jpg">
              <source src="/assets/videos/therapy-background.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="video-overlay"></div>
          </div>
          
          <div className="container">
            <div className="hero-content animate-on-scroll full-width">
              <h1 className="hero-title">Your Mental Health Journey Begins Here</h1>
              <p className="hero-description">
                Experience personalized therapy from licensed professionals in a safe, confidential online environment
              </p>
              <div className="hero-cta">
                <button 
                  onClick={handleGetStarted}
                  className="btn btn-primary btn-animated"
                >
                  Get Started
                </button>
                <button 
                  onClick={handleLearnMore}
                  className="btn btn-secondary btn-animated"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" ref={howItWorksRef} className="how-it-works-section interactive">
          <div className="container">
            <h2 className="section-title animate-on-scroll">How It Works</h2>
            
            <div className="interactive-workflow animate-on-scroll">
              <div className="workflow-navigation">
                <button 
                  className={`workflow-nav-item ${activeStep === 1 ? 'active' : ''}`} 
                  onClick={() => handleStepChange(1)}
                >
                  <div className="step-number">1</div>
                  <span>Complete Assessment</span>
                </button>
                <div className="workflow-connector"></div>
                
                <button 
                  className={`workflow-nav-item ${activeStep === 2 ? 'active' : ''}`} 
                  onClick={() => handleStepChange(2)}
                >
                  <div className="step-number">2</div>
                  <span>Match with Therapist</span>
                </button>
                <div className="workflow-connector"></div>
                
                <button 
                  className={`workflow-nav-item ${activeStep === 3 ? 'active' : ''}`} 
                  onClick={() => handleStepChange(3)}
                >
                  <div className="step-number">3</div>
                  <span>Begin Therapy</span>
                </button>
              </div>
              
              <div className="workflow-content">
                {activeStep === 1 && (
                  <div className="workflow-step-content">
                    <div className="step-illustration">
                      <img src="/assets/images/assessment-illustration.jpg" alt="Complete Assessment" />
                    </div>
                    <div className="step-details">
                      <h3>Complete Your Assessment</h3>
                      <p>Answer a few questions about your mental health needs, preferences, and goals. Our comprehensive assessment takes about 5-10 minutes and helps us understand your unique situation.</p>
                      <ul className="step-features">
                        <li>
                          <i className="fas fa-check-circle"></i>
                          <span>Personalized treatment and therapist based on your responses</span>
                        </li>
                        <li>
                          <i className="fas fa-check-circle"></i>
                          <span>Identify specific areas where you need support</span>
                        </li>
                        <li>
                          <i className="fas fa-check-circle"></i>
                          <span>Share preferences for therapist characteristics</span>
                        </li>
                      </ul>
                      <button 
                        onClick={handleGetStarted}
                        className="btn btn-primary"
                      >
                        Start Assessment
                      </button>
                    </div>
                  </div>
                )}
                
                {activeStep === 2 && (
                  <div className="workflow-step-content">
                    <div className="step-illustration">
                      <img src="/assets/images/match-illustration.svg" alt="Match with Therapist" />
                    </div>
                    <div className="step-details">
                      <h3>Get Matched with the Perfect Therapist</h3>
                      <p>Our advanced matching system connects you with a licensed therapist who specializes in your specific needs and aligns with your preferences.</p>
                      <ul className="step-features">
                        <li>
                          <i className="fas fa-check-circle"></i>
                          <span>Matched based on expertise and specialization</span>
                        </li>
                        <li>
                          <i className="fas fa-check-circle"></i>
                          <span>Consider communication style and approach</span>
                        </li>
                        <li>
                          <i className="fas fa-check-circle"></i>
                          <span>Option to request a different match if needed</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
                
                {activeStep === 3 && (
                  <div className="workflow-step-content">
                    <div className="step-illustration">
                      <img src="/assets/images/therapy-illustration.svg" alt="Begin Therapy" />
                    </div>
                    <div className="step-details">
                      <h3>Start Your Therapy Journey</h3>
                      <p>Begin communicating with your therapist in a way that feels comfortable for you. Enjoy the flexibility of therapy that fits your schedule.</p>
                      <ul className="step-features">
                        <li>
                          <i className="fas fa-check-circle"></i>
                          <span>Text, audio, video, or live sessions</span>
                        </li>
                        <li>
                          <i className="fas fa-check-circle"></i>
                          <span>Secure messaging anytime, responses within 24 hours</span>
                        </li>
                        <li>
                          <i className="fas fa-check-circle"></i>
                          <span>Schedule live sessions at your convenience</span>
                        </li>
                      </ul>
                      <button 
                        onClick={handleGetStarted}
                        className="btn btn-primary"
                      >
                        Get Started
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="benefits-section">
          <div className="container">
            <h2 className="section-title animate-on-scroll">Why Choose Solace Wave Therapy</h2>
            <div className="benefits-grid">
              <div className="benefit-card animate-on-scroll">
                <div className="benefit-icon">
                  <i className="fas fa-lock"></i>
                </div>
                <h3>Confidential & Secure</h3>
                <p>All conversations and data are protected with end-to-end encryption.</p>
              </div>
              <div className="benefit-card animate-on-scroll">
                <div className="benefit-icon">
                  <i className="fas fa-certificate"></i>
                </div>
                <h3>Licensed Professionals</h3>
                <p>Our therapists are certified and experienced in various mental health areas.</p>
              </div>
              <div className="benefit-card animate-on-scroll">
                <div className="benefit-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <h3>Flexible Scheduling</h3>
                <p>Book sessions at your convenience, any day, any time.</p>
              </div>
              <div className="benefit-card animate-on-scroll">
                <div className="benefit-icon">
                  <i className="fas fa-hand-holding-heart"></i>
                </div>
                <h3>Personalized Approach</h3>
                <p>Therapy tailored to your unique needs, including religious preferences.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="therapies-section">
          <div className="container">
            <h2 className="section-title animate-on-scroll">Our Therapy Approaches</h2>
            <div className="therapies-carousel animate-on-scroll">
              <div className="therapy-card">
                <div className="therapy-icon">
                  <i className="fas fa-brain"></i>
                </div>
                <h3>Cognitive Behavioral Therapy</h3>
                <p>Identify and change negative thought patterns that influence behaviors and emotions.</p>
              </div>
              <div className="therapy-card">
                <div className="therapy-icon">
                  <i className="fas fa-heart"></i>
                </div>
                <h3>Mindfulness-Based Therapy</h3>
                <p>Learn to be present in the moment and develop a non-judgmental awareness.</p>
              </div>
              <div className="therapy-card">
                <div className="therapy-icon">
                  <i className="fas fa-users"></i>
                </div>
                <h3>Family Systems Therapy</h3>
                <p>Address issues within the context of family relationships and dynamics.</p>
              </div>
              <div className="therapy-card">
                <div className="therapy-icon">
                  <i className="fas fa-comment-dots"></i>
                </div>
                <h3>Psychodynamic Therapy</h3>
                <p>Explore unconscious patterns influencing current behavior and relationships.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="testimonials-section">
          <div className="container">
            <h2 className="section-title animate-on-scroll">What Our Users Say</h2>
            <div className="testimonials-slider animate-on-scroll">
              <div className="testimonial">
                <div className="testimonial-content">
                  <p>"Solace Wave Therapy has been life-changing. My therapist truly understands my needs and has helped me make significant progress."</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <img src="/assets/images/testimonial-1.jpg" alt="Sarah K." />
                  </div>
                  <div className="author-info">
                    <h4>Sarah K.</h4>
                    <p>Client for 8 months</p>
                  </div>
                </div>
              </div>
              <div className="testimonial">
                <div className="testimonial-content">
                  <p>"The convenience of therapy from home made it possible for me to finally prioritize my mental health. Forever grateful!"</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <img src="/assets/images/testimonial-2.jpg" alt="Michael T." />
                  </div>
                  <div className="author-info">
                    <h4>Michael T.</h4>
                    <p>Client for 6 months</p>
                  </div>
                </div>
              </div>
              <div className="testimonial">
                <div className="testimonial-content">
                  <p>"I was skeptical about online therapy at first, but my experience has been nothing short of amazing. The flexibility fits perfectly with my busy schedule."</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <img src="/assets/images/testimonial-3.jpg" alt="Jennifer R." />
                  </div>
                  <div className="author-info">
                    <h4>Jennifer R.</h4>
                    <p>Client for 4 months</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="faq-section">
          <div className="container">
            <h2 className="section-title animate-on-scroll">Frequently Asked Questions</h2>
            <div className="faq-container animate-on-scroll">
              {faqData.map((faq, index) => (
                <div 
                  key={index} 
                  className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                >
                  <button 
                    className="faq-question" 
                    onClick={() => toggleFaq(index)}
                  >
                    {faq.question}
                    <span className="faq-icon">
                      <i className={`fas fa-chevron-${activeFaq === index ? 'up' : 'down'}`}></i>
                    </span>
                  </button>
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="faq-more-help animate-on-scroll">
              <p>Still have questions? We're here to help.</p>
              <a href="/contact" className="btn btn-secondary">Contact Us</a>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <div className="cta-content animate-on-scroll">
              <h2>Ready to Begin Your Healing Journey?</h2>
              <p>Take the first step toward better mental health today.</p>
              <button 
                onClick={handleGetStarted}
                className="btn btn-primary btn-lg btn-animated"
              >
                Get Started
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;