import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [expandedBio, setExpandedBio] = useState(null);
  
  const therapistsData = useMemo(() => ([
    {
      id: 1,
      name: "Faisal Sanusi Ibrahim",
      title: "Clinical Director",
      specialties: ["Anxiety", "Depression", "Trauma", "PTSD", "Psychosis", "Bipolar Disorder"],
      approaches: ["Cognitive Behavioral Therapy", "EMDR", "Mindfulness"],
      image: "/assets/images/team-4.jpg",
      // education: "Ph.D. Clinical Psychology, Stanford University",
      experience: "12 years",
      languages: ["English", "Hausa"],
      acceptingNew: true,
      category: "psychologist",
      bio: "I specialize in providing evidence- based therapies for individuals struggling with Substance Use Disorders, Post-Traumatic Stress Disorders (PTSD), Depression, and Anxiety Disorders and more. My expertise lies in creating personalized treatment plans that address the unique needs and circumstances of each client, promoting long term recovery and wellness. With a strong foundation in cognitive behavioral therapies, trauma informed care, and motivational interviewing, I am dedicated to helping individuals overcome their challenges and achieve a better quality of life. Through my practice, I strive to provide a safe, supportive, and non judgmental environment that fosters growth, healing, and empowerment."
    },
    {
      id: 2,
      name: "Dr. Aisha Hamis",
      title: "Medical Doctor, Psychiatrist",
      specialties: ["Anxiety Disorder", "Mood Disorders", "PTSD", "Somatic Symptom Disorder", "Sleep Disorders", "Schizophrenia and other Psychotic Disorders"],
      approaches: ["Biopsychosocial Model", "Patient-Centered"],
      image: "/assets/images/therapist-10.jpeg",
      // education: "M.S. Marriage and Family Therapy, NYU",
      experience: "4 years",
      languages: ["English", "Hausa"],
      acceptingNew: true,
      category: "psychologist",
      bio: "I am a medical doctor and psychiatry resident dedicated to supporting the mental well-being of my patients. I am deeply passionate about mental health advocacy and strive to raise awareness, reduce stigma, and promote access to compassionate, patient-centered care. My clinical interests include Anxiety Disorders, Mood Disorders, Post-Traumatic Stress Disorder (PTSD), Somatic Symptom Disorder, Sleep Disorders, Schizophrenia, and other Psychotic Disorders. I adopt the biopsychosocial model and a patient-centered approach, integrating biological, psychological, and social perspectives to provide holistic, evidence based care that prioritizes empathy, understanding, and healing.",
    },
    {
      id: 3,
      name: "Dr. Jane",
      title: "Relationship Counseling, Couple Therapy, Trauma",
      specialties: ["Relationships", "Couples Therapy", "Family Conflict", "Parenting", "Trauma", "Anxiety", "Depression"],
      approaches: ["Family Systems Therapy", "Emotionally Focused Therapy", "Gottman Method"],
      image: "/assets/images/therapist-2.jpg",
      // education: "M.S. Marriage and Family Therapy, NYU",
      experience: "8 years",
      languages: ["English"],
      acceptingNew: true,
      category: "marriage-family",
      bio: "I am Here to help with Relationship counseling, Couples Therapy, Trauma. I am genuinely passionate about helping individuals and couples overcome challenges and build strong, fulfilling and lasting relationships. Certified in Relationship Coaching, Cognitive Behavioral Couples Therapy, and Solution- Focused Therapy, I offer a compassionate and personalized approach to each client. I believe in creating meaningful change through evidence-based practices and supportive guidance. With over 8 years of experience and a PhD in Counseling Psychology, I am committed to helping you nurture the relationships that matter most.",
    },
    {
      id: 4,
      name: "Maria Oke",
      title: "Clinical Psychologist",
      specialties: ["Clinical Psychology", "Grief", "Life Transitions", "Identity Issues", "Anxiety", "Depression"],
      approaches: ["Psychodynamic Therapy", "Narrative Therapy", "Solution-Focused Therapy"],
      image: "/assets/images/therapist-4.jpeg",
      // education: "M.S.W. University of Chicago",
      experience: "7 years",
      languages: ["English"],
      acceptingNew: true,
      category: "social-worker",
      bio: "Maria is a passionate, skilled, and person-centered Clinical Psychologist with an impressive background and extensive experience. She is also skilled in Cognitive behaviour therapy. Her commitment to continuous learning, research, and making a positive impact on the well-being of others is admirable. Maria's expertise, combined with her empathetic and compassionate nature, ensures that those under her care receive the highest level of support and guidance for their psychological and emotional needs."
    },
    // {
    //   id: 4,
    //   name: "Uche Lord-Michael",
    //   title: "Marriage Counselor, Relationship coach, Spiritual guidance",
    //   specialties: ["Christian Marriage Counselling", "Pre-Marital Counselling", "Emotional Healing", "Spiritual Guidance"],
    //   approaches: ["Faith-Based Counselling", "Scripture-Centered Dialogue", "Emotional Insight Therapy", "Biblical Principles of Partnership"],
    //   image: "/assets/images/therapist-9.jpg",
    //   // education: "M.S.W. University of Chicago",
    //   experience: "10+ years serving couples within church ministry",
    //   languages: ["English", 'Igbo'],
    //   acceptingNew: true,
    //   category: "social-worker"
    // },
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
      category: "social-worker",
      bio: "I am Here to help with - Substance use, Trauma, Anxiety, Depression. I am a Lead Clinical Psychologist who specializes in therapy that is customised to the unique requirements of each client. In order to guarantee accurate case conceptualisation and treatment planning, I prioritise comprehensive assessments, which encompass personality and substance use evaluations. I have a strong emphasis on promoting resilience and psychological adjustment by addressing issues such as substance use disorders, anxiety, depression, and trauma with diverse populations. Furthermore, I am proficient in the integration of research into practice, the promotion of professional development, and the provision of supervision to enhance client outcomes. My area of expertise is cognitive-behavioral therapy (CBT), motivational interviewing (MI), and trauma-focused modalities"
    },
    {
      id: 6,
      name: "Francis Fame Ikorhishor",
      title: "Clinical Psychologist",
      specialties: ["Anxiety", "Depression", "Trauma", "PTSD", "Addiction", "Grief", "Self Esteem", "Family & Couples Therapy", "Parenting SUpport", "Stress Management"],
      approaches: ["Cognitive Behavioral Therapy (CBT)", "Motivational Interviewing (MI)", "ACT"],
      image: "/assets/images/therapist-11.jpeg",
      // education: "M.S.W. University of Chicago",
      experience: "5 years",
      languages: ["English"],
      acceptingNew: true,
      category: "social-worker",
      bio: "Francis is a dedicated clinical psychologist passionate about helping clients heal from emotional and behavioral challenges. He has worked with organizations such as YouthRISE Nigeria and National Hospital Abuja, supporting individuals through trauma recovery and addiction treatment. He has supported clients through anxiety, depression, and addiction, while leading group therapy and crisis interventions across Nigeria. His calm, practical approach helps clients build confidence, balance, and emotional resilience"
    },
    // {
    //   id: 6,
    //   name: "Judith",
    //   title: "Psychologist / Counselor",
    //   specialties: ["Anxiety", "Depression", "Couples Therapy", "Mood Disorders", "PTSD", "Addiction", "Life Transitions", "Sleep Disorders"],
    //   approaches: ["Integrated Therapy", "Cognitive Behavioral Therapy (CBT)", "Solution-Focused Therapy", "Trauma-Informed Counselling", "Client-Centered Therapy"],
    //   image: "/assets/images/therapist-7.jpg",
    //   // education: "M.S.W. University of Chicago",
    //   experience: "5 years",
    //   languages: ["English"],
    //   acceptingNew: true,
    //   category: "social-worker",
    //   bio: ""
    // },
    // {
    //   id: 7,
    //   name: "Hussein Diaudeen",
    //   title: "Licensed Clinical Psychologist",
    //   specialties: ["Anxiety", "Depression", "Trauma", "Addiction recovery", "Relationship issues", "Marriage counselling", "Psychosis", "Mental illness"],
    //   approaches: ["Psychodynamic Therapy", "Narrative Therapy", "Solution-Focused Therapy"],
    //   image: "/assets/images/therapist-6.jpg",
    //   // education: "M.S.W. University of Chicago",
    //   experience: "5 years",
    //   languages: ["English"],
    //   acceptingNew: true,
    //   category: "social-worker",
    //   bio: "I specialize in providing evidence- based therapies for individuals struggling with Substance Use Disorders, Post-Traumatic Stress Disorders (PTSD), Depression, and Anxiety Disorders and more. My expertise lies in creating personalized treatment plans that address the unique needs and circumstances of each client, promoting long term recovery and wellness. With a strong foundation in cognitive behavioral therapies, trauma informed care, and motivational interviewing, I am dedicated to helping individuals overcome their challenges and achieve a better quality of life. Through my practice, I strive to provide a safe, supportive, and non judgmental environment that fosters growth, healing, and empowerment."
    // },
    
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
    // window.location.href = 'https://solacewave-app.web.app/';
    window.location.href = 'https://wa.me/2347085256034?text=Hello%20I%20would%20like%20to%20book%20a%20therapy%20session';
  };

  const toggleBio = (id) => {
    setExpandedBio(expandedBio === id ? null : id);
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
              filteredTherapists.length === 0 ? (
                <div className="no-results animate-on-scroll">
                  <i className="fas fa-search"></i>
                  <h3>No therapists found</h3>
                  <p>Try adjusting your search criteria or explore different categories</p>
                </div>
              ) : (
                <div className="therapists-grid">
                  {filteredTherapists.map(t => (
                    <div key={t.id} className="therapist-card animate-on-scroll">
                      <div className="therapist-image">
                        <img src={t.image} alt={t.name} />
                        {!t.acceptingNew && <div className="not-accepting">Not Accepting New Clients</div>}
                      </div>

                      <div className="therapist-info">
                        <h3>{t.name}</h3>
                        <p className="therapist-title">{t.title}</p>

                        <div className="therapist-details">
                          <div className="detail-item">
                            <h4>Specialties</h4>
                            <div className="tags">
                              {t.specialties.map((s, i) => <span key={i} className="tag">{s}</span>)}
                            </div>
                          </div>

                          <div className="detail-item">
                            <h4>Approaches</h4>
                            <div className="tags">
                              {t.approaches.map((a, i) => <span key={i} className="tag">{a}</span>)}
                            </div>
                          </div>

                          <div className="detail-row">
                            <div className="detail-item half">
                              <h4>Experience</h4>
                              <p>{t.experience}</p>
                            </div>
                            <div className="detail-item half">
                              <h4>Languages</h4>
                              <p>{t.languages.join(", ")}</p>
                            </div>
                          </div>

                          <div className="therapist-bio-section">
                            <button className="bio-toggle-btn" onClick={() => toggleBio(t.id)}>
                              {expandedBio === t.id ? 'Hide Bio' : 'Read Bio'}
                            </button>

                            <AnimatePresence initial={false}>
                              {expandedBio === t.id && (
                                <motion.div
                                  key="bio"
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.4, ease: "easeInOut" }}
                                  className="therapist-bio"
                                >
                                  <p>{t.bio}</p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
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