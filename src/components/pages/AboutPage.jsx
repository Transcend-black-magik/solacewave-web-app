import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import '../../styles/components/about-page.css';

const AboutPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation();
  const region = location.pathname.split("/")[1] || "ng";
  const base = `/${region}`;


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

  // Handle Get Started button click
  const handleGetStarted = () => {
    // window.location.href = 'https://solacewave-app.web.app/';
    window.location.href = 'https://wa.me/2347085256034?text=Hello%20I%20would%20like%20to%20book%20a%20therapy%20session';
  };

  return (
    <div className="about-page">
      <Header />
      
      <main className={`about-content ${isLoaded ? 'loaded' : ''}`}>
        <section className="about-hero">
          <div className="container">
            <div className="about-hero-content animate-on-scroll">
              <h1>About Solace Wave Therapy</h1>
              <p className="subtitle">Our mission is to make mental healthcare accessible to everyone.</p>
            </div>
          </div>
        </section>
        
        <section className="our-story-section">
          <div className="container">
            <div className="section-grid">
              <div className="section-content animate-on-scroll">
                <h2>Our Story</h2>
                <p>Solace Wave Therapy was founded in 2020 by mental health professionals who saw a critical gap in care. As demand grew during the pandemic, access remained limited and long waits between sessions slowed healing.</p>
                <p>To change that, we built an online platform that makes therapy more accessible, affordable, and stigma-free. We introduced Coach in My Pocket to give clients consistent, real time access to their PERSONAL THERAPIST between sessions because healing and transformation is not just a once - a - week thing.</p>
                <p>Our approach is grounded in neuroscience, helping clients understand how mental health affects the brain and body. Through webinars and education, we empower people not just to heal, but to understand their healing.</p>
                <p>Today, Solace Wave Therapy connects thousands with licensed therapists who provide personalized care—anytime, anywhere.</p>
              </div>
              <div className="section-image animate-on-scroll">
                <img src="/assets/images/app-preview.png" alt="Solace Wave Therapy founders" />
              </div>
            </div>
          </div>
        </section>
        
        <section className="our-values-section">
          <div className="container">
            <h2 className="section-title animate-on-scroll">Our Values</h2>
            <div className="values-grid">
              <div className="value-card animate-on-scroll">
                <div className="value-icon">
                  <i className="fas fa-universal-access"></i>
                </div>
                <h3>Accessibility</h3>
                <p>We believe mental healthcare should be available to everyone, regardless of location, schedule, or financial constraints.</p>
              </div>
              <div className="value-card animate-on-scroll">
                <div className="value-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h3>Privacy</h3>
                <p>We protect your information with the highest standards of confidentiality and security.</p>
              </div>
              <div className="value-card animate-on-scroll">
                <div className="value-icon">
                  <i className="fas fa-hand-holding-heart"></i>
                </div>
                <h3>Compassion</h3>
                <p>We approach every person with understanding, empathy, and respect for their unique journey.</p>
              </div>
              <div className="value-card animate-on-scroll">
                <div className="value-icon">
                  <i className="fas fa-check-double"></i>
                </div>
                <h3>Quality</h3>
                <p>We maintain rigorous standards for our therapists and constantly improve our platform based on research and feedback.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="team-section">
          <div className="container">
            <h2 className="section-title animate-on-scroll">Our Leadership Team</h2>
            <div className="team-grid">
              <div className="team-member animate-on-scroll">
                <div className="member-image">
                  <img src="/assets/images/team-1.jpg" alt="Kobi Lord-Michael" />
                </div>
                <h3>Kobi Lord-Michael</h3>
                <p className="member-title">Founder & CEO of Solace Wave Therapy</p>
                <p className="member-bio">With a multidisciplinary background in neuroscience, psychology, philosophy, and medical education, i bring a unique and innovative approach to evidence-based mental wellness supported by extensive experience in psychological research.</p>
              </div>
              <div className="team-member animate-on-scroll">
                <div className="member-image">
                  <img src="/assets/images/team-2.jpg" alt="Diamond Etiebet" />
                </div>
                <h3>Diamond Etiebet</h3>
                <p className="member-title">Chief Operation Officer</p>
                <p className="member-bio">Creating and ensuring seamless user experience across our platform.</p>
              </div>
              <div className="team-member animate-on-scroll">
                <div className="member-image">
                  <img src="/assets/images/team-4.jpg" alt="Faisal Sanusi Ibrahim" />
                </div>
                <h3>Faisal Sanusi Ibrahim</h3>
                <p className="member-title">Clinical Director</p>
                <p className="member-bio">Specializes in providing evidence-based therapies for individuals struggling with Substance Use Disorders, Post-Traumatic Stress Disorders (PTSD), Depression, and Anxiety Disorders and more.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="impact-section">
          <div className="container">
            <div className="section-grid reverse">
              <div className="section-content animate-on-scroll">
                <h2>Our Impact</h2>
                <p>Since our founding, we've helped hundreds of people improve their mental well-being and quality of life. Our clients report significant reductions in symptoms of anxiety, depression, and stress after just a few weeks of therapy.</p>
                <div className="impact-stats">
                  <div className="impact-stat">
                    <span className="stat-number">87%</span>
                    <span className="stat-desc">of clients report improved well-being</span>
                  </div>
                  <div className="impact-stat">
                    <span className="stat-number">92%</span>
                    <span className="stat-desc">found a therapist match on first try</span>
                  </div>
                  <div className="impact-stat">
                    <span className="stat-number">78%</span>
                    <span className="stat-desc">continue therapy beyond 3 months</span>
                  </div>
                </div>
              </div>
              <div className="section-image animate-on-scroll">
                <img src="/assets/images/about-impact.jpg" alt="Solace Wave Therapy impact" />
              </div>
            </div>
          </div>
        </section>
        
        <section className="join-us-section">
          <div className="container">
            <div className="join-us-content animate-on-scroll">
              <h2>Join Our Journey</h2>
              <p>Ready to take the first step toward better mental health? Start your assessment today and get matched with a therapist who understands your unique needs.</p>
              <div className="cta-buttons">
                <button onClick={handleGetStarted} className="btn btn-primary btn-lg">Start Assessment</button>
                <Link to={`${base}/contact`} className="btn btn-secondary btn-lg">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;