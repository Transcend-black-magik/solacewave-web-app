import React, { useEffect, useState } from 'react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import '../../styles/components/faq-page.css';

const FAQPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeCategory, setActiveCategory] = useState('general');

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

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const switchCategory = (category) => {
    setActiveCategory(category);
    setActiveFaq(null);
  };

  // FAQ Data organized by categories
  const faqData = {
    general: [
      {
        question: "How much does therapy cost?",
        answer: "Our therapy plans start at N20,000 per session. You can check your coverage during the sign-up process."
      },
      {
        question: "How do I know if therapy is right for me?",
        answer: "Therapy can benefit anyone looking to improve their mental well-being, cope with stress, or work through specific challenges. Our initial assessment will help determine if our services match your needs, and we'll provide personalized recommendations."
      },
      {
        question: "How often will I meet with my therapist?",
        answer: "Most clients meet with their therapists weekly, especially at the beginning. As you progress, you and your therapist may decide to adjust the frequency. Our platform allows for flexible scheduling based on your needs and preferences. And you can also have 24/7 access to your therapist when you are under Coach in my Pocket Plan."
      }
    ],
    therapists: [
      {
        question: "Can I change therapists if I'm not satisfied?",
        answer: "Absolutely! Finding the right therapist match is important. If you feel your current therapist isn't the right fit, you can request a change anytime through WhatsApp, and we'll match you with someone new. Or you can contact our customer service team to change easily at (234) 703 334 3596."
      },
      {
        question: "How quickly will I be matched with a therapist?",
        answer: "Most clients are matched with a therapist immediately after completing the assessment."
      },
      {
        question: "Are all your therapists licensed?",
        answer: "Yes, all our therapists are licensed professionals with extensive experience in their specific areas of specialization. Each therapist undergoes a rigorous vetting process before joining our platform."
      }
    ],
    therapy: [
      {
        question: "Is online therapy as effective as in-person therapy?",
        answer: "Research shows that online therapy can be just as effective as in-person therapy for many conditions. Our platform is designed to provide the same quality of care with added convenience and flexibility."
      },
      {
        question: "What types of therapy approaches do you offer?",
        answer: "We offer various evidence-based therapy approaches including Cognitive Behavioral Therapy (CBT), Mindfulness-Based Therapy, Family Systems Therapy, and Psychodynamic Therapy, among others. Your therapist will work with you to determine the best approach for your specific needs."
      },
      {
        question: "How long does therapy typically last?",
        answer: "The duration of therapy varies based on individual needs and goals. Some clients benefit from short-term therapy lasting a few months, while others may engage in longer-term therapy. You and your therapist will regularly assess your progress and adjust the treatment plan accordingly."
      }
    ],
    technical: [
      {
        question: "How is my privacy protected?",
        answer: "We take your privacy seriously. Our platform uses end-to-end encryption for all communications, and we are fully HIPAA compliant. Your personal information and therapy sessions are kept strictly confidential."
      },
      {
        question: "What devices can I use to access the platform?",
        answer: "Our platform is accessible on smartphones (iOS and Android), tablets, and computers. You can download our app from the App Store or Google Play Store, or access the web version from any modern browser."
      },
      {
        question: "How do I cancel my subscription?",
        answer: "You can cancel your subscription anytime through WhatsApp or by contacting support at (234) 703 334 3596.."
      }
    ]
  };

  return (
    <div className="faq-page">
      <Header />
      
      <main className={`faq-content ${isLoaded ? 'loaded' : ''}`}>
        <section className="faq-hero">
          <div className="container">
            <div className="faq-hero-content animate-on-scroll">
              <h1>Frequently Asked Questions</h1>
              <p className="subtitle">Find answers to common questions about our services</p>
            </div>
          </div>
        </section>
        
        <section className="faq-main-section">
          <div className="container">
            <div className="faq-search animate-on-scroll">
              <div className="search-container">
                <input 
                  type="text" 
                  placeholder="Search for questions..." 
                  className="faq-search-input"
                />
                <button className="faq-search-btn">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>
            
            <div className="faq-categories animate-on-scroll">
              <button 
                className={`category-btn ${activeCategory === 'general' ? 'active' : ''}`}
                onClick={() => switchCategory('general')}
              >
                General Questions
              </button>
              <button 
                className={`category-btn ${activeCategory === 'therapists' ? 'active' : ''}`}
                onClick={() => switchCategory('therapists')}
              >
                About Our Therapists
              </button>
              <button 
                className={`category-btn ${activeCategory === 'therapy' ? 'active' : ''}`}
                onClick={() => switchCategory('therapy')}
              >
                Therapy Process
              </button>
              <button 
                className={`category-btn ${activeCategory === 'technical' ? 'active' : ''}`}
                onClick={() => switchCategory('technical')}
              >
                Technical & Privacy
              </button>
            </div>
            
            <div className="faq-list animate-on-scroll">
              {faqData[activeCategory].map((faq, index) => (
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
          </div>
        </section>
        
        {/* <section className="faq-contact-section">
          <div className="container">
            <div className="faq-contact-content animate-on-scroll">
              <h2>Still Have Questions?</h2>
              <p>Our support team is ready to help with any questions you may have.</p>
              <div className="faq-contact-buttons">
                <a href="/contact" className="btn btn-primary">Contact Us</a>
                <a href="mailto:solacewavetherapy@gmail.com" className="btn btn-secondary">
                  <i className="fas fa-envelope"></i> Email Support
                </a>
              </div>
            </div>
          </div>
        </section> */}
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQPage;