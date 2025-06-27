import React, { useEffect, useState } from 'react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import '../../styles/components/services-page.css';

const ServicesPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('individual');

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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle Get Started button click
  const handleGetStarted = () => {
    window.location.href = 'https://solacewave-app.web.app/';
  };

  return (
    <div className="services-page">
      <Header />
      
      <main className={`services-content ${isLoaded ? 'loaded' : ''}`}>
        <section className="services-hero">
          <div className="container">
            <div className="services-hero-content animate-on-scroll">
              <h1>Our Therapy Services</h1>
              <p className="subtitle">Personalized mental health care tailored to your unique needs</p>
            </div>
          </div>
        </section>
        
        <section className="therapy-types-section">
          <div className="container">
            <h2 className="section-title animate-on-scroll">We Offer Multiple Types of Therapy</h2>
            
            <div className="therapy-tabs animate-on-scroll">
              <button 
                className={`tab-button ${activeTab === 'individual' ? 'active' : ''}`}
                onClick={() => handleTabChange('individual')}
              >
                <i className="fas fa-user"></i>
                <span>Individual Therapy</span>
              </button>
              <button 
                className={`tab-button ${activeTab === 'couples' ? 'active' : ''}`}
                onClick={() => handleTabChange('couples')}
              >
                <i className="fas fa-heart"></i>
                <span>Couples Therapy</span>
              </button>
              <button 
                className={`tab-button ${activeTab === 'family' ? 'active' : ''}`}
                onClick={() => handleTabChange('family')}
              >
                <i className="fas fa-users"></i>
                <span>Family Therapy</span>
              </button>
              <button 
                className={`tab-button ${activeTab === 'teens' ? 'active' : ''}`}
                onClick={() => handleTabChange('teens')}
              >
                <i className="fas fa-child"></i>
                <span>Teen Therapy</span>
              </button>
            </div>
            
            <div className="therapy-content animate-on-scroll">
              {/* individual */}
              {activeTab === 'individual' && (
                <div className="therapy-type-content">
                  <div className="therapy-image">
                    <img src="/assets/images/individual-therapy.jpg" alt="Individual Therapy" />
                  </div>
                  <div className="therapy-details">
                    <h3>Individual Therapy</h3>
                    <p>Heal, grow, and gain clarity through personalized individual therapy. Our therapists provide a safe, supportive space to explore your thoughts, emotions, and experiences. We work collaboratively with you to build resilience, deepen self-awareness, and overcome personal challenges.</p>
                    <h4>Common areas we address:</h4>
                    <ul className="therapy-areas">
                      <li><i className="fas fa-check-circle"></i> Anxiety and stress</li>
                      <li><i className="fas fa-check-circle"></i> Depression and mood disorders</li>
                      <li><i className="fas fa-check-circle"></i> Self-esteem and identity concerns</li>
                      <li><i className="fas fa-check-circle"></i> Trauma and past experiences</li>
                      <li><i className="fas fa-check-circle"></i> Life transitions and decision-making</li>
                      <li><i className="fas fa-check-circle"></i> Grief and loss</li>
                      <li><i className="fas fa-check-circle"></i> Personal growth and emotional regulation</li>
                    </ul>
                    <div className="therapy-cta">
                      <button onClick={handleGetStarted} className="btn btn-primary">Get Matched</button>
                      <a href="/therapists" className="btn btn-outline">Browse Therapists</a>
                    </div>
                  </div>
                </div>
              )}
              {/* couples */}
              {activeTab === 'couples' && (
                <div className="therapy-type-content">
                  <div className="therapy-image">
                    <img src="/assets/images/couples_therapy.jpg" alt="Couples Therapy" />
                  </div>
                  <div className="therapy-details">
                    <h3>Couples Therapy</h3>
                    <p>Strengthen your relationship with professional guidance and support. Our experienced therapists help you deepen emotional connection, improve communication, resolve conflicts, and rebuild trust. Whether you’re dating, engaged, or married, we equip you with tools to navigate challenges and grow together as a team.</p>
                    <h4>Common areas we address:</h4>
                    <ul className="therapy-areas">
                      <li><i className="fas fa-check-circle"></i> Communication breakdowns</li>
                      <li><i className="fas fa-check-circle"></i> Intimacy and emotional disconnect</li>
                      <li><i className="fas fa-check-circle"></i> Rebuilding trust after infidelity</li>
                      <li><i className="fas fa-check-circle"></i> Financial disagreements</li>
                      <li><i className="fas fa-check-circle"></i> Parenting and co-parenting conflicts</li>
                      <li><i className="fas fa-check-circle"></i> Navigating major life transitions (e.g moving, career shifts, grief)</li>
                    </ul>
                    <div className="therapy-cta">
                      <button onClick={handleGetStarted} className="btn btn-primary">Get Matched</button>
                      <a href="/therapists" className="btn btn-outline">Browse Therapists</a>
                    </div>
                  </div>
                </div>
              )}
              {/* family */}
              {activeTab === 'family' && (
                <div className="therapy-type-content">
                  <div className="therapy-image">
                    <img src="/assets/images/family_therapy.jpg" alt="Family Therapy" />
                  </div>
                  <div className="therapy-details">
                    <h3>Family Therapy</h3>
                    <p>Improve family dynamics and resolve conflicts with specialized family therapy. Our therapists work with all family members to enhance communication, understanding, and functioning within the family system.</p>
                    <h4>Common areas we address:</h4>
                    <ul className="therapy-areas">
                      <li><i className="fas fa-check-circle"></i> Parent-child conflicts</li>
                      <li><i className="fas fa-check-circle"></i> Sibling relationships</li>
                      <li><i className="fas fa-check-circle"></i> Blended family challenges</li>
                      <li><i className="fas fa-check-circle"></i> Family communication</li>
                      <li><i className="fas fa-check-circle"></i> Life cycle transitions</li>
                      <li><i className="fas fa-check-circle"></i> Coping with family illness</li>
                    </ul>
                    <div className="therapy-cta">
                      <button onClick={handleGetStarted} className="btn btn-primary">Get Matched</button>
                      <a href="/therapists" className="btn btn-outline">Browse Therapists</a>
                    </div>
                  </div>
                </div>
              )}
              {/* teens */}
              {activeTab === 'teens' && (
                <div className="therapy-type-content">
                  <div className="therapy-image">
                    <img src="/assets/images/teen-therapy.jpg" alt="Teen Therapy" />
                  </div>
                  <div className="therapy-details">
                    <h3>Teen Therapy</h3>
                    <p>Specialized therapy for adolescents (13-19) focused on their unique developmental needs and challenges. Our teen therapists create a comfortable, non-judgmental space where young people can express themselves freely.</p>
                    <h4>Common areas we address:</h4>
                    <ul className="therapy-areas">
                      <li><i className="fas fa-check-circle"></i> Academic pressure</li>
                      <li><i className="fas fa-check-circle"></i> Social anxiety and peer relationships</li>
                      <li><i className="fas fa-check-circle"></i> Identity exploration</li>
                      <li><i className="fas fa-check-circle"></i> Depression and anxiety</li>
                      <li><i className="fas fa-check-circle"></i> Family conflicts</li>
                      <li><i className="fas fa-check-circle"></i> Self-esteem and body image</li>
                    </ul>
                    <div className="therapy-cta">
                      <button onClick={handleGetStarted} className="btn btn-primary">Get Matched</button>
                      <a href="/therapists" className="btn btn-outline">Browse Therapists</a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        
        <section className="pricing-section">
          <div className="container">
            <h2 className="section-title animate-on-scroll">Affordable Therapy Packages</h2>
            <p className="section-subtitle animate-on-scroll">Flexible pricing with real value. No hidden fees.</p>

            <div className="pricing-grid animate-on-scroll">
              {/* Single Session Plan */}
              <div className="pricing-card">
                <div className="pricing-header">
                  <h3>Single Session</h3>
                  <div className="price">
                    <span className="amount">₦20,000</span>
                  </div>
                  <p>One video or phone call session</p>
                </div>
                <div className="pricing-features">
                  <ul>
                    <li><i className="fas fa-check"></i> One-on-one coaching</li>
                    <li><i className="fas fa-check"></i> Choose phone or video</li>
                    <li><i className="fas fa-check"></i> Get clarity on issues</li>
                    <li><i className="fas fa-check"></i> For specific mental health challenges and goals</li>
                  </ul>
                </div>
                <div className="pricing-action">
                  <button onClick={handleGetStarted} className="btn btn-outline btn-block">Get Started</button>
                </div>
              </div>

              {/* 3 Sessions Plan */}
              <div className="pricing-card">
                <div className="pricing-header">
                  <h3>3 Sessions</h3>
                  <div className="price">
                    <span className="amount">₦55,000</span>
                    <span className="period">/ month</span>
                  </div>
                  <p>Save ₦5,000</p>
                </div>
                <div className="pricing-features">
                  <ul>
                    <li><i className="fas fa-check"></i> Three video or phone sessions</li>
                    <li><i className="fas fa-check"></i> Ideal for short term goals</li>
                    <li><i className="fas fa-check"></i> Personal growth support</li>
                    <li><i className="fas fa-check"></i> Valid for flexible time frame</li>
                  </ul>
                </div>
                <div className="pricing-action">
                  <button onClick={handleGetStarted} className="btn btn-outline btn-block">Get Started</button>
                </div>
              </div>

              {/* 6 Sessions Plan - Popular */}
              <div className="pricing-card popular">
                <div className="popular-tag">Best Value</div>
                <div className="pricing-header">
                  <h3>6 Sessions</h3>
                  <div className="price">
                    <span className="amount">₦105,000</span>
                    <span className="period">/ month</span>
                  </div>
                  <p>Save ₦15,000</p>
                </div>
                <div className="pricing-features">
                  <ul>
                    <li><i className="fas fa-check"></i> Six video or phone sessions</li>
                    <li><i className="fas fa-check"></i> Long term support for deep rooted issues</li>
                    <li><i className="fas fa-check"></i> Ideal for unpacking and dealing with trauma</li>
                    <li><i className="fas fa-check"></i> Best for deep and lasting transformation</li>
                  </ul>
                </div>
                <div className="pricing-action">
                  <button onClick={handleGetStarted} className="btn btn-primary btn-block">Get Started</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="coach-pocket-section">
          <div className="container">
            <h2 className="section-title animate-on-scroll">Coach in My Pocket</h2>
            <p className="section-subtitle animate-on-scroll">Skip the wait! Get daily access to your personal therapist</p>
            <p className="pocket-description animate-on-scroll">Had a fight with your partner today? Had a hard day at school or work? Got triggered today? 
              Unlike other platforms, we offer consistent access to your therapist throughout the day. Because therapy should not just be a 
              once-a-week thing!</p>

            <div className="pricing-grid animate-on-scroll">
              {/* Weekly Plan */}
              <div className="pricing-card">
                <div className="pricing-header">
                  <h3>Coach in My Pocket</h3>
                  <div className="price">
                    <span className="amount">₦5,000</span>
                    <span className="period">/ week</span>
                  </div>
                </div>
                <div className="pricing-features">
                  <ul>
                    <li><i className="fas fa-check"></i> Extra support for active therapy clients</li>
                    <li><i className="fas fa-check"></i> Unlimited messaging access to your personal therapist for ongoing support</li>
                    <li><i className="fas fa-check"></i> Therapists are active and respond continually throughout the day</li>
                    <li><i className="fas fa-check"></i> No need to wait for your next appointment. Unpack things that happen on a daily basis</li>
                    <li><i className="fas fa-check"></i> Texts and check-ins anytime, anywhere</li>
                    <li><i className="fas fa-check"></i> Get support in real time between your main weekly sessions</li>
                    <li><i className="fas fa-check"></i> Perfect for staying grounded through your week</li>
                    <li><i className="fas fa-check"></i> Designed for real-life moments</li>
                    <li><i className="fas fa-check"></i> Transformation is not just a once-a-week thing! Skip the wait</li>
                  </ul>
                </div>
                <div className="pricing-note">
                  <p>Requires an active therapy plan</p>
                </div>
                <div className="pricing-action">
                  <button onClick={handleGetStarted} className="btn btn-outline btn-block">Get Started</button>
                </div>
              </div>

              {/* Monthly Plan */}
              <div className="pricing-card">
                <div className="pricing-header">
                  <h3>Coach in My Pocket</h3>
                  <div className="price">
                    <span className="amount">₦18,000</span>
                    <span className="period">/ month</span>
                  </div>
                </div>
                <div className="pricing-features">
                  <ul>
                    <li><i className="fas fa-check"></i> Extra support for active therapy clients</li>
                    <li><i className="fas fa-check"></i> Message your therapist as life happens</li>
                    <li><i className="fas fa-check"></i> Therapists are active and respond continually throughout the day</li>
                    <li><i className="fas fa-check"></i> No need to wait for your next appointment. Unpack things that happen on a daily basis</li>
                    <li><i className="fas fa-check"></i> Texts and check-ins to maintain your mental clarity</li>
                    <li><i className="fas fa-check"></i> Consistent support that strengthens your transformation</li>
                    <li><i className="fas fa-check"></i> Ideal for clients doing deep emotional or personal growth work</li>
                    <li><i className="fas fa-check"></i> A powerful extension of your 1-on-1 therapy</li>
                    <li><i className="fas fa-check"></i> Transformation is not just a once-a-week thing! Skip the wait</li>
                  </ul>
                </div>
                <div className="pricing-note">
                  <p>Available only with an active therapy plan</p>
                </div>
                <div className="pricing-action">
                  <button onClick={handleGetStarted} className="btn btn-outline btn-block">Get Started</button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="approaches-section">
          <div className="container">
            <h2 className="section-title animate-on-scroll">Our Therapeutic Approaches</h2>
            <p className="section-subtitle animate-on-scroll">Our therapists are trained in various evidence-based approaches to provide personalized care.</p>
            
            <div className="approaches-grid">
              <div className="approach-card animate-on-scroll">
                <div className="approach-icon">
                  <i className="fas fa-brain"></i>
                </div>
                <h3>Cognitive Behavioral Therapy (CBT)</h3>
                <p>Focuses on identifying and changing negative thought patterns that influence behaviors and emotions.</p>
              </div>
              
              <div className="approach-card animate-on-scroll">
                <div className="approach-icon">
                  <i className="fas fa-heart"></i>
                </div>
                <h3>Mindfulness-Based Therapy</h3>
                <p>Cultivates present-moment awareness and non-judgmental acceptance of thoughts, feelings, and sensations.</p>
              </div>
              
              <div className="approach-card animate-on-scroll">
                <div className="approach-icon">
                  <i className="fas fa-comments"></i>
                </div>
                <h3>Psychodynamic Therapy</h3>
                <p>Explores unconscious processes and how they influence current behavior, especially in the context of early life experiences.</p>
              </div>
              
              <div className="approach-card animate-on-scroll">
                <div className="approach-icon">
                  <i className="fas fa-users"></i>
                </div>
                <h3>Family Systems Therapy</h3>
                <p>Views problems within the context of family relationships and patterns rather than as individual issues.</p>
              </div>
              
              <div className="approach-card animate-on-scroll">
                <div className="approach-icon">
                  <i className="fas fa-hand-holding-heart"></i>
                </div>
                <h3>Person-Centered Therapy</h3>
                <p>Emphasizes empathy, unconditional positive regard, and genuine therapist presence to facilitate client growth.</p>
              </div>
              
              <div className="approach-card animate-on-scroll">
                <div className="approach-icon">
                  <i className="fas fa-balance-scale"></i>
                </div>
                <h3>Dialectical Behavior Therapy (DBT)</h3>
                <p>Combines cognitive-behavioral techniques with mindfulness practices to develop emotional regulation and interpersonal skills.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="communication-options-section">
          <div className="container">
            <h2 className="section-title animate-on-scroll">Flexible Communication Options</h2>
            <p className="section-subtitle animate-on-scroll">Choose the therapy format that works best for you.</p>
            
            <div className="options-grid">
              <div className="option-card animate-on-scroll">
                <div className="option-icon">
                  <i className="fas fa-video"></i>
                </div>
                <h3>Video Sessions</h3>
                <p>Face-to-face virtual therapy sessions from the comfort of your home or any private space.</p>
                <ul className="option-features">
                  <li><i className="fas fa-check"></i> Scheduled 30-50 minute sessions</li>
                  <li><i className="fas fa-check"></i> Most similar to traditional in-person therapy</li>
                  <li><i className="fas fa-check"></i> Secure, HIPAA-compliant platform</li>
                </ul>
              </div>
              
              <div className="option-card animate-on-scroll">
                <div className="option-icon">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <h3>Audio Sessions</h3>
                <p>Voice-only therapy sessions for those who prefer not to be on camera.</p>
                <ul className="option-features">
                  <li><i className="fas fa-check"></i> Scheduled 30-60 minute sessions</li>
                  <li><i className="fas fa-check"></i> Great for on-the-go or limited bandwidth</li>
                  <li><i className="fas fa-check"></i> Focus entirely on the conversation</li>
                </ul>
              </div>
              
              <div className="option-card animate-on-scroll">
                <div className="option-icon">
                  <i className="fas fa-comment-dots"></i>
                </div>
                <h3>Coach in my Pocket</h3>
                <p>Unlike other platforms, therapists reply continually all through the day to provide you with continuous intensive care.</p>
                <ul className="option-features">
                  <li><i className="fas fa-check"></i> Send messages anytime, 24/7</li>
                  <li><i className="fas fa-check"></i> Therapist responds immediately through the days.</li>
                  <li><i className="fas fa-check"></i> Great for processing thoughts at your own pace</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        <section className="cta-section">
          <div className="container">
            <div className="cta-content animate-on-scroll">
              <h2>Ready to Start Your Therapy Journey?</h2>
              <p>Take our brief assessment to get matched with the right therapist for your needs.</p>
              <button onClick={handleGetStarted} className="btn btn-primary btn-lg">Begin Assessment</button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ServicesPage;