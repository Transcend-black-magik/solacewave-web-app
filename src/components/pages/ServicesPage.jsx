import React, { useEffect, useState } from 'react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import '../../styles/components/services-page.css';

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import PaystackButton from '../common/PaystackButton';

const ServicesPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('individual');
  const [selectedTherapyPlan, setSelectedTherapyPlan] = useState(null);
  const [selectedPocketPlan, setSelectedPocketPlan] = useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false); // 👈 new state
  const [activePayment, setActivePayment] = useState(null); 
  const [clientEmail, setClientEmail] = useState("");
  const isValidEmail = (email) => {
    // Simple regex: checks for "something@something.domain"
    return /\S+@\S+\.\S+/.test(email);
  };
  const [emailError, setEmailError] = useState("");

  const handleCheckout = () => {
  if (!selectedTherapyPlan || !selectedPocketPlan) {
    setEmailError(""); // reset
    alert("Please select a plan before proceeding.");
    return;
  }

  if (!clientEmail.trim()) {
    setEmailError("Email is required.");
    return;
  }

  if (!isValidEmail(clientEmail)) {
    setEmailError("Please enter a valid email address.");
    return;
  }

  setEmailError(""); // ✅ clear error if valid

  const checkoutData = {
    therapy: selectedTherapyPlan,
    pocket: selectedPocketPlan,
    email: clientEmail,
  };

  console.log("Proceeding to checkout with:", checkoutData);
  setShowPaymentOptions(true);
};

  // Example plan mapping to amount (you can refine this logic)
  const planPrices = {
    single: 20000,
    "3sessions": 55000,
    "6sessions": 105000,
    pocket1: 7000,
    pocket3: 20000,
    pocket6: 40000,
  };

  const getTotalAmount = () => {
    let total = 0;
    if (selectedTherapyPlan) total += planPrices[selectedTherapyPlan] || 0;
    if (selectedPocketPlan) total += planPrices[selectedPocketPlan] || 0;
    return total;
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);


  const therapyPlans = [
    {
      id: "single",
      name: "Single Session",
      price: "₦20,000",
      description: "One video or phone call session",
      features: [
        "One-on-one coaching",
        "Choose phone or video",
        "Get clarity on issues",
        "For specific mental health challenges and goals",
      ],
    },
    {
      id: "3sessions",
      name: "3 Sessions",
      price: "₦55,000",
      description: "Save ₦5,000",
      features: [
        "Three video or phone sessions",
        "Ideal for short term goals",
        "Personal growth support",
        "Valid for flexible time frame",
      ],
    },
    {
      id: "6sessions",
      name: "6 Sessions",
      price: "₦105,000",
      description: "Save ₦15,000",
      popular: true,
      features: [
        "Six video or phone sessions",
        "Long term support for deep rooted issues",
        "Ideal for unpacking and dealing with trauma",
        "Best for deep and lasting transformation",
      ],
    },
  ];

  const pocketPlans = [
    {
      id: "pocket1",
      name: "Coach in My Pocket",
      price: "₦7,000",
      period: " / Week",
      note: "Requires an active therapy plan",
      features: [
        "Unlimited Texts/Messaging access to your personal therapist for ongoing support",
        "Therapists are active and respond continually throughout the day",
        "No need to wait for your next appointment. Unpack things that happen on a daily basis",
        "Perfect for staying grounded through your week",
        "Designed for real-life moments"
      ],
    },
    {
      id: "pocket3",
      name: "Coach in My Pocket",
      price: "₦20,000",
      period: " /3 Weeks",
      note: "Available only with an active therapy plan",
      features: [
        "Unlimited Texts/Messaging access to your personal therapist for ongoing support",
        "Therapists are active and respond continually throughout the day",
        "No need to wait for your next appointment. Unpack things that happen on a daily basis",
        "Perfect for staying grounded through your week",
        "Designed for real-life moments"
      ],
    },
    {
      id: "pocket6",
      name: "Coach in My Pocket",
      price: "₦40,000",
      period: " /6 Weeks",
      note: "Requires an active therapy plan",
      features: [
        "Unlimited Texts/Messaging access to your personal therapist for ongoing support",
        "Therapists are active and respond continually throughout the day",
        "No need to wait for your next appointment. Unpack things that happen on a daily basis",
        "Perfect for staying grounded through your week",
        "Designed for real-life moments"
      ],
    },
  ];

  const sendReceiptToWhatsApp = (paymentDetails) => {
    const phoneNumber = "2347085256034"; // ✅ your WhatsApp business number
    const amount = getTotalAmount();
    const receiptText = `Hello, I just made a payment for my therapy plan.
    Email: ${clientEmail}
    Amount: ₦${amount.toLocaleString()}
    Payment Reference: ${paymentDetails?.id || paymentDetails?.reference || "N/A"}
      
    Please confirm my booking.`;

    const encodedText = encodeURIComponent(receiptText);
    window.location.href = `https://wa.me/${phoneNumber}?text=${encodedText}`;
  };


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
    // window.location.href = 'https://solacewave-app.web.app/';
    window.location.href = 'https://wa.me/2347085256034?text=Hello%20I%20would%20like%20to%20book%20a%20therapy%20session';
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

        <section className="plans-section">
          <div className="container">
            <h2 className="section-title">Choose Your Plan</h2>

            {/* Therapy Packages */}
            <h3 className="category-title">Therapy Packages</h3>
            <div className="pricing-grid">
              {therapyPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`pricing-card ${
                    selectedTherapyPlan === plan.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedTherapyPlan(plan.id)}
                >
                  <div className="pricing-header">
                    <h3>{plan.name}</h3>
                    <div className="price">
                      <span className="amount">{plan.price}</span>
                    </div>
                  </div>
                  <div className="pricing-features">
                    <ul>
                      {plan.features.map((f, i) => (
                        <li key={i}>
                          <i className="fas fa-check"></i> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Coach in My Pocket */}
            <h3 className="category-title">Coach in My Pocket</h3>
            <div className="pricing-grid">
              {pocketPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`pricing-card ${
                    selectedPocketPlan === plan.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedPocketPlan(plan.id)}
                >
                  <div className="pricing-header">
                    <h3>{plan.name}</h3>
                    <div className="price">
                      <span className="amount">{plan.price}</span>
                      <span >{plan.period}</span>
                    </div>
                  </div>
                  <div className="pricing-features">
                    <ul>
                      {plan.features.map((f, i) => (
                        <li key={i}>
                          <i className="fas fa-check"></i> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Button */}
            <div className="checkout-wrapper">
              <input
                type="email"
                placeholder="Enter your email"
                value={clientEmail}
                onChange={(e) => {
                  setClientEmail(e.target.value);
                  setEmailError(""); // clear error while typing
                }}
                className={`checkout-email ${emailError ? "error" : ""}`}
                required
              />
              {emailError && <p className="error-message">{emailError}</p>}  {/* ✅ inline error */}

              <button
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={
                  !selectedTherapyPlan || // must have therapy
                  !selectedPocketPlan ||  // must have pocket
                  !clientEmail.trim() ||
                  !isValidEmail(clientEmail)
              }
              >
                Checkout
              </button>
            </div>

            {/* Payment Options Modal */}
            {showPaymentOptions && (
              <div className="payment-modal">
                <div className="payment-content">
                  <h3>Select Payment Method</h3>

                  {/* Tabs */}
                  <div className="payment-tabs">
                    <button
                      className={`payment-tab ${activePayment === "paypal" ? "active" : ""}`}
                      onClick={() => setActivePayment("paypal")}
                    >
                      <img
                        src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg"
                        alt="PayPal"
                        className="tab-logo"
                      />
                      <span>Pay CAD USD EUR with PayPal</span>
                    </button>
                    <button
                      className={`payment-tab ${activePayment === "paystack" ? "active" : ""}`}
                      onClick={() => setActivePayment("paystack")}
                    >
                      <img
                        src="https://assets.paystack.com/assets/img/hero/Paystack-mark-white-twitter.png"
                        alt="Paystack"
                        className="tab-logo"
                      />
                      <span>Pay NGN with Paystack</span>
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="payment-body">
                    {activePayment === "paypal" && (
                      <PayPalScriptProvider options={{ "client-id": "AQ0P0dlrncuplv-QNWsTfofbtQ6yV_ZnEt0hhYKRatOj6ndpGZDMmMSlZ4TPS2X08TKgZfi_YFiRrtzT" /* replace with real */ }}>
                        <PayPalButtons
                          style={{ layout: "vertical", height: 45 }}
                          createOrder={(data, actions) => {
                            return actions.order.create({
                              purchase_units: [
                                {
                                  amount: {
                                    value: (getTotalAmount() / 1600).toFixed(2), // NGN→USD conversion
                                  },
                                },
                              ],
                              payer: {
                                email_address: clientEmail || undefined, // ✅ dynamic email
                              },
                            });
                          }}
                          onApprove={async (data, actions) => {
                            const details = await actions.order.capture();
                            console.log("PayPal Payment Success:", details);
                            alert("Payment successful with PayPal!");
                            setShowPaymentOptions(false);

                            // ✅ Send WhatsApp receipt
                            sendReceiptToWhatsApp(details);
                          }}
                        />
                      </PayPalScriptProvider>
                    )}

                    {activePayment === "paystack" && (
                      <PaystackButton
                        email={clientEmail}
                        amount={getTotalAmount()}
                        publicKey="pk_live_34b73780854135828702b448cae62e1bdb0f98b8"//"pk_test_8d5aa6cbe0649d73d2605b70a00324b39fab427b"
                        onSuccess={(ref) => {
                          console.log("Paystack success:", ref);
                          alert("Payment successful with Paystack!");
                          setShowPaymentOptions(false);

                          // ✅ Send WhatsApp receipt
                          sendReceiptToWhatsApp(ref);
                        }}
                        onClose={() => alert("Payment closed")}
                      />
                    )}
                  </div>

                  {/* Cancel Button */}
                  <button className="btn-cancel" onClick={() => setShowPaymentOptions(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

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
                  <li><i className="fas fa-check"></i> Scheduled 30-60 minute sessions</li>
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