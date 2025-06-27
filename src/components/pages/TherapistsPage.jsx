import React, { useState, useEffect, useMemo } from 'react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import '../../styles/components/therapists-page.css';
//import { id } from 'date-fns/locale';

const TherapistsPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFilter] = useState('all');
  const [searchTerm] = useState('');
  const [therapists, setTherapists] = useState([]);
  const [filteredTherapists, setFilteredTherapists] = useState([]);
  
  const therapistsData = useMemo(() => ([
    {
      id: 1,
      name: "Faisal Sanusi Ibrahim",
      title: "Clinical Director",
      specialties: ["Anxiety", "Depression", "Trauma", "PTSD", "psychosis", "bipolar disorder"],
      approaches: ["Cognitive Behavioral Therapy", "EMDR", "Mindfulness"],
      image: "/assets/images/team-4.jpg",
      // education: "Ph.D. Clinical Psychology, Stanford University",
      experience: "12 years",
      languages: ["English", "Hausa"],
      acceptingNew: true,
      category: "psychologist"
    },
    {
      id: 2,
      name: "Dr. Jane",
      title: "Relationship Counseling, Couple Therapy, Trauma",
      specialties: ["Relationships", "Couples Therapy", "Family Conflict", "Parenting", "trauma", "Anxiety", "Depression"],
      approaches: ["Family Systems Therapy", "Emotionally Focused Therapy", "Gottman Method"],
      image: "/assets/images/therapist-2.jpg",
      // education: "M.S. Marriage and Family Therapy, NYU",
      experience: "8 years",
      languages: ["English"],
      acceptingNew: true,
      category: "marriage-family"
    },
    {
      id: 3,
      name: "Maria Okie",
      title: "Clinical Psychologist",
      specialties: ["Clinical Psychology", "Grief", "Life Transitions", "Identity Issues", "Anxiety", "Depression"],
      approaches: ["Psychodynamic Therapy", "Narrative Therapy", "Solution-Focused Therapy"],
      image: "/assets/images/therapist-4.jpeg",
      // education: "M.S.W. University of Chicago",
      experience: "7 years",
      languages: ["English"],
      acceptingNew: true,
      category: "social-worker"
    },
    {
      id: 4,
      name: "Uche Lord-Michael",
      title: "Marriage Counselor, Relationship coach, Spiritual guidance",
      specialties: ["Christian Marriage Counselling", "Pre-Marital Counselling", "Emotional Healing", "Spiritual Guidance"],
      approaches: ["Faith-Based Counselling", "Scripture-Centered Dialogue", "Emotional Insight Therapy", "Biblical Principles of Partnership"],
      image: "/assets/images/therapist-9.jpg",
      // education: "M.S.W. University of Chicago",
      experience: "10+ years serving couples within church ministry",
      languages: ["English", 'Igbo'],
      acceptingNew: true,
      category: "social-worker"
    },
    {
      id: 5,
      name: "OLA",
      title: "Psychologist",
      specialties: ["Anxiety", "Depression", "Trauma", "Substance Use Disorders", "Psychological Adjustments"],
      approaches: ["Cognitive Behavioral Therapy (CBT)", "Motivational Interviewing (MI)", "Trauma-Focused Therapy", "Evidence-Based Case Formulation"],
      image: "/assets/images/therapist-8.jpg",
      // education: "M.S.W. University of Chicago",
      experience: "10+ years of clinical experience",
      languages: ["English", "Yoruba"],
      acceptingNew: true,
      category: "social-worker"
    },
    {
      id: 6,
      name: "Judith",
      title: "Psychologist / Counselor",
      specialties: ["Anxiety", "Depression", "Couples Therapy", "Mood Disorders", "PTSD", "Addiction", "Life Transitions", "Sleep Disorders"],
      approaches: ["Integrated Therapy", "Cognitive Behavioral Therapy (CBT)", "Solution-Focused Therapy", "Trauma-Informed Counselling", "Client-Centered Therapy"],
      image: "/assets/images/therapist-7.jpg",
      // education: "M.S.W. University of Chicago",
      experience: "5 years",
      languages: ["English"],
      acceptingNew: true,
      category: "social-worker"
    },
    {
      id: 7,
      name: "Hussein Diaudeen",
      title: "Licensed Clinical Psychologist",
      specialties: ["Anxiety", "Depression", "Trauma", "Addiction recovery", "Relationship issues", "Marriage counselling", "psychosis", "mental illness"],
      approaches: ["Psychodynamic Therapy", "Narrative Therapy", "Solution-Focused Therapy"],
      image: "/assets/images/therapist-6.jpg",
      // education: "M.S.W. University of Chicago",
      experience: "5 years",
      languages: ["English"],
      acceptingNew: true,
      category: "social-worker"
    },
    
  ]), []);
  
  // Initialize therapists data
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setTherapists(therapistsData);
      setFilteredTherapists(therapistsData);
      setIsLoaded(true);
    }, 800);
  }, [
    therapistsData // Dependency to ensure it runs when therapistsData changes
  ]);
  // Filter therapists based on category and search term
  useEffect(() => {
    if (therapists.length > 0) {
      let filtered = [...therapists];
      
      // Apply category filter
      if (activeFilter !== 'all') {
        filtered = filtered.filter(therapist => therapist.category === activeFilter);
      }
      
      // Apply search filter
      if (searchTerm.trim() !== '') {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(therapist => 
          therapist.name.toLowerCase().includes(searchLower) ||
          therapist.specialties.some(specialty => specialty.toLowerCase().includes(searchLower)) ||
          therapist.approaches.some(approach => approach.toLowerCase().includes(searchLower))
        );
      }
      
      setFilteredTherapists(filtered);
    }
  }, [activeFilter, searchTerm, therapists]);
  
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
  
  // Handle filter change
  // const handleFilterChange = (filter) => {
  //   setActiveFilter(filter);
  // };
  
  // Handle search input change
  // const handleSearchChange = (e) => {
  //   setSearchTerm(e.target.value);
  // };

  // Handle Get Started button click
  const handleGetStarted = () => {
    window.location.href = 'https://solacewave-app.web.app/';
  };

  return (
    <div className="therapists-page">
      <Header />
      
      <main className={`therapists-content ${isLoaded ? 'loaded' : ''}`}>
        <section className="therapists-hero">
          <div className="container">
            <div className="therapists-hero-content animate-on-scroll">
              <h1>Our Licensed Therapists</h1>
              <p className="subtitle">
                Connect with experienced mental health professionals who specialize in your areas of concern
              </p>
            </div>
          </div>
        </section>
        
        <section className="therapists-list-section">
          <div className="container">
            {isLoaded ? (
              <>
                {filteredTherapists.length === 0 ? (
                  <div className="no-results animate-on-scroll">
                    <i className="fas fa-search"></i>
                    <h3>No therapists found</h3>
                    <p>Try adjusting your search criteria or explore different categories</p>
                  </div>
                ) : (
                  <div className="therapists-grid">
                    {filteredTherapists.map((therapist) => (
                      <div key={therapist.id} className="therapist-card animate-on-scroll">
                        <div className="therapist-image">
                          <img src={therapist.image} alt={therapist.name} />
                          {!therapist.acceptingNew && (
                            <div className="not-accepting">Not Accepting New Clients</div>
                          )}
                        </div>
                        <div className="therapist-info">
                          <h3>{therapist.name}</h3>
                          <p className="therapist-title">{therapist.title}</p>
                          
                          <div className="therapist-details">
                            <div className="detail-item">
                              <h4>Specialties</h4>
                              <div className="tags">
                                {therapist.specialties.map((specialty, index) => (
                                  <span key={index} className="tag">{specialty}</span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="detail-item">
                              <h4>Approaches</h4>
                              <div className="tags">
                                {therapist.approaches.map((approach, index) => (
                                  <span key={index} className="tag">{approach}</span>
                                ))}
                              </div>
                            </div>
                            
                            {/* <div className="detail-item">
                              <h4>Education</h4>
                              <p>{therapist.education}</p>
                            </div> */}
                            
                            <div className="detail-row">
                              <div className="detail-item half">
                                <h4>Experience</h4>
                                <p>{therapist.experience}</p>
                              </div>
                              
                              <div className="detail-item half">
                                <h4>Languages</h4>
                                <p>{therapist.languages.join(", ")}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading therapists...</p>
              </div>
            )}
          </div>
        </section>
        
        <section className="matching-process-section">
          <div className="container">
            <h2 className="section-title animate-on-scroll">How Our Matching Process Works</h2>
            
            <div className="process-steps">
              <div className="process-step animate-on-scroll">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Complete Our Assessment</h3>
                  <p>Answer questions about your needs, preferences, and therapy goals</p>
                </div>
              </div>
              
              <div className="process-step animate-on-scroll">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Review Recommendations</h3>
                  <p>Our algorithm suggests therapists based on your unique profile</p>
                </div>
              </div>
              
              <div className="process-step animate-on-scroll">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Choose Your Therapist</h3>
                  <p>Select from personalized matches or browse profiles yourself</p>
                </div>
              </div>
              
              <div className="process-step animate-on-scroll">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Start Your Journey</h3>
                  <p>Begin therapy with confidence, knowing you've found the right match</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="therapist-cta-section">
          <div className="container">
            <div className="cta-content animate-on-scroll">
              <h2>Ready to Find Your Perfect Therapist Match?</h2>
              <p>Take our comprehensive assessment to get matched with a therapist who's right for your specific needs</p>
              <button onClick={handleGetStarted} className="btn btn-primary btn-lg">
                Start Assessment
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default TherapistsPage;