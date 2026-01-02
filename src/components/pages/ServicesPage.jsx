// ServicesPage.jsx
import React, { useEffect, useState, useRef } from "react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import "../../styles/components/services-page.css";
import PaystackButton from "../common/PaystackButton";

const SQUARE_APPLICATION_ID = process.env.REACT_APP_SQUARE_APPLICATION_ID;
const SQUARE_LOCATION_ID = process.env.REACT_APP_SQUARE_LOCATION_ID;


// Replace with your actual Cloud Function URL (set below instructions show how).
// Example: const CREATE_PAYMENT_ENDPOINT = "https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/createSquarePayment";
const CREATE_PAYMENT_ENDPOINT = "https://us-central1-solacewave-15844.cloudfunctions.net/createSquarePayment";

const ServicesPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("individual");
  const [selectedTherapyPlan, setSelectedTherapyPlan] = useState(null);
  const [selectedPocketPlan, setSelectedPocketPlan] = useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [activePayment, setActivePayment] = useState(null); // "square" or "paystack"
  const [clientEmail, setClientEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientCountry, setClientCountry] = useState("");
  const [nameError, setNameError] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [conversionRates, setConversionRates] = useState({
    USD: 1600,
    EUR: 1700,
    CAD: 1200,
  });

  // Square related refs/state
  const [squareLoaded, setSquareLoaded] = useState(false);
  const [cardAttached, setCardAttached] = useState(false);
  const [squarePayments, setSquarePayments] = useState(null);
  const [card, setCard] = useState(null);
  const [squareError, setSquareError] = useState("");
  const [processingSquare, setProcessingSquare] = useState(false);
  const cardContainerRef = useRef(null);

  const allowedPocketPlans = {
    single: ["pocket1"],
    "3sessions": ["pocket1", "pocket3"],
    "6sessions": ["pocket1", "pocket3", "pocket6"],
  };

  // Auto-detect user location -> set currency
  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        const countryCode = data.country_code;

        let defaultCurrency = "USD";
        if (countryCode === "NG") defaultCurrency = "NGN";
        else if (countryCode === "CA") defaultCurrency = "CAD";
        else if (countryCode === "GB" || countryCode === "FR" || countryCode === "DE") defaultCurrency = "EUR";

        setCurrency(defaultCurrency);
      } catch (err) {
        console.error("Currency fetch failed:", err);
        setCurrency("USD");
      }
    };

    fetchCurrency();
  }, []);


  useEffect(() => {
  const fetchRates = async () => {
    try {
      const res = await fetch(
        "https://api.exchangerate.host/latest?base=NGN&symbols=USD,EUR,CAD"
      );
      if (!res.ok) throw new Error("Failed to fetch exchange rates");

      const data = await res.json();
      if (data && data.rates) {
        setConversionRates({
          USD: data.rates.USD,
          EUR: data.rates.EUR,
          CAD: data.rates.CAD,
        });
      } else {
        console.error("Unexpected response:", data);
      }
    } catch (err) {
      console.error("Error fetching FX rates:", err);

      // Optional fallback if API is unreachable
      setConversionRates({
        USD: 0.0011, // ~NGN to USD
        EUR: 0.00095, // ~NGN to EUR
        CAD: 0.0015, // ~NGN to CAD
      });
    }
  };

  fetchRates();
}, []);


  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  useEffect(() => {
    if (
      selectedTherapyPlan &&
      selectedPocketPlan &&
      !allowedPocketPlans[selectedTherapyPlan]?.includes(selectedPocketPlan)
    ) {
      setSelectedPocketPlan(null);
    }
  }, [selectedTherapyPlan, selectedPocketPlan]);

  const handleCheckout = () => {
    if (!selectedTherapyPlan && !selectedPocketPlan) {
      setEmailError("");
      setNameError("");
      alert("Please select a plan before proceeding.");
      return;
    }

    if (!clientName.trim()) {
      setNameError("Name is required.");
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

    setEmailError("");
    setNameError("");

    setShowPaymentOptions(true);
    // default active payment to square for international (or user can pick)
    setActivePayment("square");
  };

  const planPrices = {
    single: 25000,
    "3sessions": 70000,
    "6sessions": 135000,
    pocket1: 20000,
    pocket3: 55000,
    pocket6: 105000,
  };
  // ==== FIXED PRICES PER CURRENCY (NO LIVE FX) ====
// These are the exact fixed amounts you provided (yellow in your PDF).
// We use them whenever the user pays with card (Square) in USD/EUR/CAD.
// NGN prices remain as-is for Paystack.
  const FIXED_PRICES = {
    USD: {
      single: 16.99,
      "3sessions": 40.99,
      "6sessions": 74.99,
      pocket1: 6.70,
      pocket3: 16.99,
      // 6 weeks not in PDF — using 2x 3 weeks, rounded to .99 for consistency
      pocket6: 33.99,
    },
    EUR: {
      single: 14.99,
      "3sessions": 35.99,
      "6sessions": 64.99,
      pocket1: 6.50,
      pocket3: 14.99,
      pocket6: 29.99,
    },
    CAD: {
      single: 19.50,
      "3sessions": 53.99,
      "6sessions": 102.99,
      pocket1: 6.68,
      pocket3: 19.50,
      // Staying consistent (2x 3 weeks)
      pocket6: 39.00,
    },
    GBP: {
      single: 13.99,       
      "3sessions": 30.99,  
      "6sessions": 56.99,  
      pocket1: 5.50,      
      pocket3: 13.99,      
      pocket6: 30.99,    
  },
  };

  const getTotalAmount = () => {
    let total = 0;
    if (selectedTherapyPlan) total += planPrices[selectedTherapyPlan] || 0;
    if (selectedPocketPlan) total += planPrices[selectedPocketPlan] || 0;
    return total;
  };
  

  // Use fixed prices for USD/EUR/CAD instead of FX conversion
  const getConvertedAmount = () => {
    // NGN stays as NGN (Paystack flow)
    if (currency === "NGN") return getTotalAmount().toFixed(2);

    const table = FIXED_PRICES[currency];
    if (!table) return "0.00";

    let total = 0;
    if (selectedTherapyPlan) total += Number(table[selectedTherapyPlan] || 0);
    if (selectedPocketPlan) total += Number(table[selectedPocketPlan] || 0);

    return total.toFixed(2);
  };


  // Load Square payments SDK script only when payment modal opens (lazy)
  useEffect(() => {
    if (!showPaymentOptions) return;

    // don't load twice
    if (squareLoaded) return;

    const script = document.createElement("script");
    // Production / latest web payments SDK
    script.src = "https://web.squarecdn.com/v1/square.js";
    script.type = "text/javascript";
    script.async = true;
    script.onload = () => {
      setSquareLoaded(true);
    };
    script.onerror = () => {
      console.error("Square Web Payments SDK failed to load.");
      setSquareError("Unable to load Square payments. Try again later.");
    };
    document.body.appendChild(script);

    return () => {
      // keep script for caching between opens; do not remove to prevent re-load jank
    };
  }, [showPaymentOptions, squareLoaded]);

  // When SDK is ready, initialize payments and card
  useEffect(() => {
  const initSquare = async () => {
    if (!squareLoaded || typeof window.Square === "undefined") return;

    try {
      const payments = window.Square.payments(SQUARE_APPLICATION_ID, SQUARE_LOCATION_ID);
      setSquarePayments(payments);

      const cardObj = await payments.card();
      setCard(cardObj);

      await cardObj.attach("#card-container");
      setCardAttached(true);
    } catch (err) {
      console.error("Square init error:", err);
      setSquareError("Could not initialize Square payments.");
    }
  };

  if (showPaymentOptions && squareLoaded) {
    // Always re-initialize when modal opens
    setCardAttached(false);
    initSquare();
  }
}, [squareLoaded, showPaymentOptions]);

  

  const handleSquarePayment = async () => {
    setSquareError("");
    if (!card || !squarePayments) {
      setSquareError("Card form not initialized.");
      return;
    }

    setProcessingSquare(true);

    try {
      // Tokenize card (returns an object with status and token)
      const tokenResult = await card.tokenize();
      if (tokenResult.status === "OK") {
        const sourceId = tokenResult.token; // send this to backend
        // amount in cents (Smallest currency unit)
        // getConvertedAmount returns e.g. "12.34"
        const amountStr = getConvertedAmount();
        const amountCents = Math.round(Number(amountStr) * 100);

        // call your firebase function to create a payment
        const res = await fetch(CREATE_PAYMENT_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sourceId,
            amountCents,
            currency: currency, // USD/EUR/CAD per selection
            name: clientName,
            email: clientEmail,
            country: clientCountry,  // 👈 added
            metadata: {
              therapy: selectedTherapyPlan,
              pocket: selectedPocketPlan,
            },
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("Square payment server error", data);
          setSquareError(data?.message || "Payment failed on server.");
          setProcessingSquare(false);
          return;
        }

        // success
        console.log("Square payment success:", data);
        alert("Payment successful with Square! Thank you.");
        setShowPaymentOptions(false);
        setProcessingSquare(false);

        // Optionally send receipt via WhatsApp
        sendReceiptToWhatsApp(data.payment);
      } else {
        // tokenization failed
        console.error("Tokenization error:", tokenResult);
        setSquareError(
          tokenResult.errors?.map((e) => e.message).join(", ") ||
            "Card tokenization failed."
        );
        setProcessingSquare(false);
      }
    } catch (err) {
      console.error("Square payment error:", err);
      setSquareError("Payment failed. Try again.");
      setProcessingSquare(false);
    }
  };

  const sendReceiptToWhatsApp = (paymentDetails) => {
    const phoneNumber = "2347085256034"; // your WhatsApp business number
    const amount = getTotalAmount();
    const receiptText = `Hello, I just made a payment for my therapy plan.
Email: ${clientEmail}
Amount: ₦${amount.toLocaleString()}
Payment Reference: ${paymentDetails?.id || paymentDetails?.reference || "N/A"}

Please confirm my booking.`;

    const encodedText = encodeURIComponent(receiptText);
    window.location.href = `https://wa.me/${phoneNumber}?text=${encodedText}`;
  };

  const handlePocketClick = (planId) => {
    if (!selectedTherapyPlan) return;
    if (!allowedPocketPlans[selectedTherapyPlan]?.includes(planId)) return;
    setSelectedPocketPlan(planId);
  };

  // Animation / content loaded
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    return () => {
      document.querySelectorAll(".animate-on-scroll").forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, [isLoaded]);

  // UI data (plans)
  const therapyPlans = [
    {
      id: "single",
      name: "Single Session",
      price: "₦25,000",
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
      price: "₦70,000",
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
      price: "₦135,000",
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
      price: "₦20,000",
      period: " / Week",
      note: "Requires an active therapy plan",
      features: [
        "Unlimited Texts/Messaging access to your personal therapist for ongoing support",
        "Therapists are active and respond continually throughout the day",
        "No need to wait for your next appointment. Unpack things that happen on a daily basis",
        "Perfect for staying grounded through your week",
        "Designed for real-life moments",
      ],
    },
    {
      id: "pocket3",
      name: "Coach in My Pocket",
      price: "₦55,000",
      period: " /3 Weeks",
      note: "Available only with an active therapy plan",
      features: [
        "Unlimited Texts/Messaging access to your personal therapist for ongoing support",
        "Therapists are active and respond continually throughout the day",
        "No need to wait for your next appointment. Unpack things that happen on a daily basis",
        "Perfect for staying grounded through your week",
        "Designed for real-life moments",
      ],
    },
    {
      id: "pocket6",
      name: "Coach in My Pocket",
      price: "₦105,000",
      period: " /6 Weeks",
      note: "Requires an active therapy plan",
      features: [
        "Unlimited Texts/Messaging access to your personal therapist for ongoing support",
        "Therapists are active and respond continually throughout the day",
        "No need to wait for your next appointment. Unpack things that happen on a daily basis",
        "Perfect for staying grounded through your week",
        "Designed for real-life moments",
      ],
    },
  ];

  const handleTabChange = (tab) => setActiveTab(tab);

  const handleGetStarted = () => {
    window.location.href =
      "https://wa.me/2347085256034?text=Hello%20I%20would%20like%20to%20book%20a%20therapy%20session";
  };

  return (
    <div className="services-page">
      <Header />

      <main className={`services-content ${isLoaded ? "loaded" : ""}`}>
        <section className="services-hero">
          <div className="container">
            <div className="services-hero-content animate-on-scroll">
              <h1>Our Therapy Services</h1>
              <p className="subtitle">
                Personalized mental health care tailored to your unique needs
              </p>
            </div>
          </div>
        </section>

        <section className="plans-section">
          <div className="container">
            <button
              onClick={handleGetStarted}
              className="whatsapp-consultation">
              Book your free consultaion on whatsapp
            </button>

            <div style={{ marginBottom: "1rem", textAlign: "center" }}>
              <span style={{ fontSize: "18px", fontWeight: "600" }}>Or</span>
              <br />
            </div>
            <h2
              style={{
                color: "#833c13",
                fontSize: "25px",
                marginBottom: "1rem",
              }}
            >
              Select a therapy package to get started. You can add "Coach in My
              Pocket" for daily support.
            </h2>

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
                      <span className="amount">{plan.price}</span> <br />
                      <span className="description">{plan.description}</span>
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

            <h3 className="category-title">Coach in My Pocket</h3>
            <span>
              Daily text messaging with your therapist(only activated with
              ongoing therapy sessions)
            </span>
            <div className="pricing-grid">
              {pocketPlans.map((plan) => {
                const isAllowed =
                  selectedTherapyPlan &&
                  allowedPocketPlans[selectedTherapyPlan]?.includes(plan.id);
                return (
                  <div
                    key={plan.id}
                    className={`pricing-card ${
                      selectedPocketPlan === plan.id ? "selected" : ""
                    } ${!isAllowed ? "disabled" : ""}`}
                    onClick={() => handlePocketClick(plan.id)}
                  >
                    <div className="pricing-header">
                      <h3>{plan.name}</h3>
                      <div className="price">
                        <span className="amount">{plan.price}</span>
                        <span>{plan.period}</span>
                        <br />
                        <span className="note">{plan.note}</span>
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
                );
              })}
            </div>

            <div className="checkout-wrapper">
              <input
                type="text"
                placeholder="Enter your full name"
                value={clientName}
                onChange={(e) => {
                  setClientName(e.target.value);
                  setNameError("");
                }}
                className={`checkout-name ${nameError ? "error" : ""}`}
                required
              />
              {nameError && <p className="error-message">{nameError}</p>}
              
              <input
                type="email"
                placeholder="Enter your email"
                value={clientEmail}
                onChange={(e) => {
                  setClientEmail(e.target.value);
                  setEmailError("");
                }}
                className={`checkout-email ${emailError ? "error" : ""}`}
                required
              />
              {emailError && <p className="error-message">{emailError}</p>}


              <input
                type="text"
                placeholder="Enter your country"
                value={clientCountry}
                onChange={(e) => setClientCountry(e.target.value)}
                className="checkout-name"
                required
              />

              <button
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={
                  !selectedTherapyPlan ||
                  !clientName.trim() ||
                  !clientEmail.trim() ||
                  !isValidEmail(clientEmail) ||
                  !clientCountry.trim()
                }
                style={{
                  opacity:
                    !selectedTherapyPlan ||
                    !clientName.trim() ||
                    !clientEmail.trim() ||
                    !isValidEmail(clientEmail) ||
                    !clientCountry.trim()
                      ? 0.6
                      : 1,
                  cursor:
                    !selectedTherapyPlan ||
                    !clientName.trim() ||
                    !clientEmail.trim() ||
                    !isValidEmail(clientEmail) ||
                    !clientCountry.trim()
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                Checkout
              </button>

            </div>

            {/* Payment Options Modal */}
            {showPaymentOptions && (
              <div className="payment-modal">
                <div className="payment-content">
                  <h3>Select Payment Method</h3>

                  {/* <div className="currency-selector">
                    <label htmlFor="currency">Choose Currency: </label>
                    <select
                      id="currency"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      <option value="USD">USD – US Dollar</option>
                      <option value="EUR">EUR – Euro</option>
                      <option value="CAD">CAD – Canadian Dollar</option>
                      <option value="GBP">GBP – British Pound</option>
                    </select>
                  </div> */}

                  <div className="payment-tabs">
                    {/* <button
                      className={`payment-tab ${
                        activePayment === "square" ? "active" : ""
                      }`}
                      onClick={() => setActivePayment("square")}
                    >
                      <div>
                        <span className="payment-tap-button">Pay with Card (Square)</span>
                      </div>
                    </button> */}

                    <button
                      className={`payment-tab ${
                        activePayment === "paystack" ? "active" : ""
                      }`}
                      onClick={() => setActivePayment("paystack")}
                    >
                      <img
                        src="https://assets.paystack.com/assets/img/hero/Paystack-mark-white-twitter.png"
                        alt="Paystack"
                        className="tab-logo"
                      />
                      <div>
                        <span className="payment-tap-button">Pay with Paystack</span>
                      </div>
                    </button>
                  </div>

                  <div className="payment-body">
                    {/* {activePayment === "square" && (
                      <div
                        style={{ display: activePayment === "square" ? "block" : "none" }}
                      >
                        <p>
                          Amount: {currency} {getConvertedAmount()}
                        </p>
                        <div
                          id="card-container"
                          ref={cardContainerRef}
                          style={{ marginBottom: "1rem" }}
                        ></div>

                        {squareError && <p className="error-message">{squareError}</p>}

                        <button
                          className="checkout-btn"
                          onClick={handleSquarePayment}
                          disabled={processingSquare}
                        >
                          {processingSquare ? "Processing..." : "Pay with Card"}
                        </button>
                      </div>

                    )} */}

                    {activePayment === "paystack" && (
                      <PaystackButton
                        email={clientEmail}
                        amount={getTotalAmount()}
                        metadata={{
                          custom_fields: [
                            {
                              display_name: "Name",
                              variable_name: "client_name",
                              value: clientName,
                            },
                             {
                              display_name: "Country",
                              variable_name: "client_country",
                              value: clientCountry,
                            },
                          ],
                        }}
                        publicKey="pk_live_34b73780854135828702b448cae62e1bdb0f98b8"
                        onSuccess={(ref) => {
                          console.log("Paystack success:", ref);
                          alert("Payment successful with Paystack!");
                          setShowPaymentOptions(false);
                          sendReceiptToWhatsApp(ref);
                        }}
                        onClose={() => alert("Payment closed")}
                      />
                    )}
                  </div>

                  <button
                    className="btn-cancel"
                    onClick={() => setShowPaymentOptions(false)}
                  >
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











// // ServicesPage.jsx
// import React, { useEffect, useState} from "react";
// import Header from "../layout/Header";
// import Footer from "../layout/Footer";
// import "../../styles/components/services-page.css";
// import PaystackButton from "../common/PaystackButton";
// import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';


// const ServicesPage = () => {
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [activeTab, setActiveTab] = useState("individual");
//   const [selectedTherapyPlan, setSelectedTherapyPlan] = useState(null);
//   const [selectedPocketPlan, setSelectedPocketPlan] = useState(null);
//   const [showPaymentOptions, setShowPaymentOptions] = useState(false);
//   const [activePayment, setActivePayment] = useState(null); // "square" or "paystack"
//   const [clientEmail, setClientEmail] = useState("");
//   const [emailError, setEmailError] = useState("");
//   const [clientName, setClientName] = useState("");
//   const [clientCountry, setClientCountry] = useState("");
//   const [nameError, setNameError] = useState("");
//   const [currency, setCurrency] = useState("USD");
//   const [conversionRates, setConversionRates] = useState({
//     USD: 1600,
//     EUR: 1700,
//     CAD: 1200,
//   });


//   const allowedPocketPlans = {
//     single: ["pocket1"],
//     "3sessions": ["pocket1", "pocket3"],
//     "6sessions": ["pocket1", "pocket3", "pocket6"],
//   };

//   // Auto-detect user location -> set currency
//   useEffect(() => {
//     const fetchCurrency = async () => {
//       try {
//         const res = await fetch("https://ipapi.co/json/");
//         const data = await res.json();
//         const countryCode = data.country_code;

//         let defaultCurrency = "USD";
//         if (countryCode === "NG") defaultCurrency = "NGN";
//         else if (countryCode === "CA") defaultCurrency = "CAD";
//         else if (countryCode === "GB" || countryCode === "FR" || countryCode === "DE") defaultCurrency = "EUR";

//         setCurrency(defaultCurrency);
//       } catch (err) {
//         console.error("Currency fetch failed:", err);
//         setCurrency("USD");
//       }
//     };

//     fetchCurrency();
//   }, []);


//   useEffect(() => {
//   const fetchRates = async () => {
//     try {
//       const res = await fetch(
//         "https://api.exchangerate.host/latest?base=NGN&symbols=USD,EUR,CAD"
//       );
//       if (!res.ok) throw new Error("Failed to fetch exchange rates");

//       const data = await res.json();
//       if (data && data.rates) {
//         setConversionRates({
//           USD: data.rates.USD,
//           EUR: data.rates.EUR,
//           CAD: data.rates.CAD,
//         });
//       } else {
//         console.error("Unexpected response:", data);
//       }
//     } catch (err) {
//       console.error("Error fetching FX rates:", err);

//       // Optional fallback if API is unreachable
//       setConversionRates({
//         USD: 0.0011, // ~NGN to USD
//         EUR: 0.00095, // ~NGN to EUR
//         CAD: 0.0015, // ~NGN to CAD
//       });
//     }
//   };

//   fetchRates();
// }, []);


//   const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

//   useEffect(() => {
//     if (
//       selectedTherapyPlan &&
//       selectedPocketPlan &&
//       !allowedPocketPlans[selectedTherapyPlan]?.includes(selectedPocketPlan)
//     ) {
//       setSelectedPocketPlan(null);
//     }
//   }, [selectedTherapyPlan, selectedPocketPlan]);

//   const handleCheckout = () => {
//     if (!selectedTherapyPlan && !selectedPocketPlan) {
//       setEmailError("");
//       setNameError("");
//       alert("Please select a plan before proceeding.");
//       return;
//     }

//     if (!clientName.trim()) {
//       setNameError("Name is required.");
//       return;
//     }

//     if (!clientEmail.trim()) {
//       setEmailError("Email is required.");
//       return;
//     }

//     if (!isValidEmail(clientEmail)) {
//       setEmailError("Please enter a valid email address.");
//       return;
//     }

//     setEmailError("");
//     setNameError("");

//     setShowPaymentOptions(true);
//     // default active payment to square for international (or user can pick)
//     setActivePayment("flutterwave");
//   };

//   const planPrices = {
//     single: 20000,
//     "3sessions": 55000,
//     "6sessions": 105000,
//     pocket1: 7000,
//     pocket3: 20000,
//     pocket6: 40000,
//   };
//   // ==== FIXED PRICES PER CURRENCY (NO LIVE FX) ====
// // These are the exact fixed amounts you provided (yellow in your PDF).
// // We use them whenever the user pays with card (Square) in USD/EUR/CAD.
// // NGN prices remain as-is for Paystack.
//   const FIXED_PRICES = {
//     USD: {
//       single: 16.99,
//       "3sessions": 40.99,
//       "6sessions": 74.99,
//       pocket1: 6.70,
//       pocket3: 16.99,
//       // 6 weeks not in PDF — using 2x 3 weeks, rounded to .99 for consistency
//       pocket6: 33.99,
//     },
//     EUR: {
//       single: 14.99,
//       "3sessions": 35.99,
//       "6sessions": 64.99,
//       pocket1: 6.50,
//       pocket3: 14.99,
//       pocket6: 29.99,
//     },
//     CAD: {
//       single: 19.50,
//       "3sessions": 53.99,
//       "6sessions": 102.99,
//       pocket1: 6.68,
//       pocket3: 19.50,
//       // Staying consistent (2x 3 weeks)
//       pocket6: 39.00,
//     },
//     GBP: {
//       single: 13.99,       
//       "3sessions": 30.99,  
//       "6sessions": 56.99,  
//       pocket1: 5.50,      
//       pocket3: 13.99,      
//       pocket6: 30.99,    
//   },
//   };

//   const getTotalAmount = () => {
//     let total = 0;
//     if (selectedTherapyPlan) total += planPrices[selectedTherapyPlan] || 0;
//     if (selectedPocketPlan) total += planPrices[selectedPocketPlan] || 0;
//     return total;
//   };
  

//   // Use fixed prices for USD/EUR/CAD instead of FX conversion
//   const getConvertedAmount = () => {
//     // NGN stays as NGN (Paystack flow)
//     if (currency === "NGN") return getTotalAmount().toFixed(2);

//     const table = FIXED_PRICES[currency];
//     if (!table) return "0.00";

//     let total = 0;
//     if (selectedTherapyPlan) total += Number(table[selectedTherapyPlan] || 0);
//     if (selectedPocketPlan) total += Number(table[selectedPocketPlan] || 0);

//     return total.toFixed(2);
//   };

//   const flutterwaveConfig = {
//     public_key: "FLWPUBK_TEST-975b9a14c195a620de1733d1e6a3e89a-X", // Replace with your real Flutterwave key
//     tx_ref: Date.now(),
//     amount: getConvertedAmount(),
//     currency: currency,
//     payment_options: "card, mobilemoney, ussd",
//     customer: { email: clientEmail, name: clientName },
//     customizations: {
//       title: "Solace Therapy Payment",
//       description: "Payment for therapy plan",
//       logo: "https://yourapp.com/logo.png",
//     },
//   };


//   const sendReceiptToWhatsApp = (paymentDetails) => {
//     const phoneNumber = "2347085256034"; // your WhatsApp business number
//     const amount = getTotalAmount();
//     const receiptText = `Hello, I just made a payment for my therapy plan.
// Email: ${clientEmail}
// Amount: ₦${amount.toLocaleString()}
// Payment Reference: ${paymentDetails?.id || paymentDetails?.reference || "N/A"}

// Please confirm my booking.`;

//     const encodedText = encodeURIComponent(receiptText);
//     window.location.href = `https://wa.me/${phoneNumber}?text=${encodedText}`;
//   };

//   const handlePocketClick = (planId) => {
//     if (!selectedTherapyPlan) return;
//     if (!allowedPocketPlans[selectedTherapyPlan]?.includes(planId)) return;
//     setSelectedPocketPlan(planId);
//   };

//   // Animation / content loaded
//   useEffect(() => {
//     const timer = setTimeout(() => setIsLoaded(true), 500);
//     return () => clearTimeout(timer);
//   }, []);

//   // Intersection observer for scroll animations
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add("in-view");
//           }
//         });
//       },
//       { threshold: 0.1 }
//     );

//     document.querySelectorAll(".animate-on-scroll").forEach((el) => {
//       observer.observe(el);
//     });

//     return () => {
//       document.querySelectorAll(".animate-on-scroll").forEach((el) => {
//         observer.unobserve(el);
//       });
//     };
//   }, [isLoaded]);

//   // UI data (plans)
//   const therapyPlans = [
//     {
//       id: "single",
//       name: "Single Session",
//       price: "₦20,000",
//       description: "One video or phone call session",
//       features: [
//         "One-on-one coaching",
//         "Choose phone or video",
//         "Get clarity on issues",
//         "For specific mental health challenges and goals",
//       ],
//     },
//     {
//       id: "3sessions",
//       name: "3 Sessions",
//       price: "₦55,000",
//       description: "Save ₦5,000",
//       features: [
//         "Three video or phone sessions",
//         "Ideal for short term goals",
//         "Personal growth support",
//         "Valid for flexible time frame",
//       ],
//     },
//     {
//       id: "6sessions",
//       name: "6 Sessions",
//       price: "₦105,000",
//       description: "Save ₦15,000",
//       popular: true,
//       features: [
//         "Six video or phone sessions",
//         "Long term support for deep rooted issues",
//         "Ideal for unpacking and dealing with trauma",
//         "Best for deep and lasting transformation",
//       ],
//     },
//   ];

//   const pocketPlans = [
//     {
//       id: "pocket1",
//       name: "Coach in My Pocket",
//       price: "₦7,000",
//       period: " / Week",
//       note: "Requires an active therapy plan",
//       features: [
//         "Unlimited Texts/Messaging access to your personal therapist for ongoing support",
//         "Therapists are active and respond continually throughout the day",
//         "No need to wait for your next appointment. Unpack things that happen on a daily basis",
//         "Perfect for staying grounded through your week",
//         "Designed for real-life moments",
//       ],
//     },
//     {
//       id: "pocket3",
//       name: "Coach in My Pocket",
//       price: "₦20,000",
//       period: " /3 Weeks",
//       note: "Available only with an active therapy plan",
//       features: [
//         "Unlimited Texts/Messaging access to your personal therapist for ongoing support",
//         "Therapists are active and respond continually throughout the day",
//         "No need to wait for your next appointment. Unpack things that happen on a daily basis",
//         "Perfect for staying grounded through your week",
//         "Designed for real-life moments",
//       ],
//     },
//     {
//       id: "pocket6",
//       name: "Coach in My Pocket",
//       price: "₦40,000",
//       period: " /6 Weeks",
//       note: "Requires an active therapy plan",
//       features: [
//         "Unlimited Texts/Messaging access to your personal therapist for ongoing support",
//         "Therapists are active and respond continually throughout the day",
//         "No need to wait for your next appointment. Unpack things that happen on a daily basis",
//         "Perfect for staying grounded through your week",
//         "Designed for real-life moments",
//       ],
//     },
//   ];

//   const handleTabChange = (tab) => setActiveTab(tab);

//   const handleGetStarted = () => {
//     window.location.href =
//       "https://wa.me/2347085256034?text=Hello%20I%20would%20like%20to%20book%20a%20therapy%20session";
//   };

//   return (
//     <div className="services-page">
//       <Header />

//       <main className={`services-content ${isLoaded ? "loaded" : ""}`}>
//         <section className="services-hero">
//           <div className="container">
//             <div className="services-hero-content animate-on-scroll">
//               <h1>Our Therapy Services</h1>
//               <p className="subtitle">
//                 Personalized mental health care tailored to your unique needs
//               </p>
//             </div>
//           </div>
//         </section>

//         <section className="plans-section">
//           <div className="container">
//             <button
//               onClick={handleGetStarted}
//               className="whatsapp-consultation">
//               Book your free consultaion on whatsapp
//             </button>

//             <div style={{ marginBottom: "1rem", textAlign: "center" }}>
//               <span style={{ fontSize: "18px", fontWeight: "600" }}>Or</span>
//               <br />
//             </div>
//             <h2
//               style={{
//                 color: "#833c13",
//                 fontSize: "25px",
//                 marginBottom: "1rem",
//               }}
//             >
//               Select a therapy package to get started. You can add "Coach in My
//               Pocket" for daily support.
//             </h2>

//             <div className="pricing-grid">
//               {therapyPlans.map((plan) => (
//                 <div
//                   key={plan.id}
//                   className={`pricing-card ${
//                     selectedTherapyPlan === plan.id ? "selected" : ""
//                   }`}
//                   onClick={() => setSelectedTherapyPlan(plan.id)}
//                 >
//                   <div className="pricing-header">
//                     <h3>{plan.name}</h3>
//                     <div className="price">
//                       <span className="amount">{plan.price}</span> <br />
//                       <span className="description">{plan.description}</span>
//                     </div>
//                   </div>
//                   <div className="pricing-features">
//                     <ul>
//                       {plan.features.map((f, i) => (
//                         <li key={i}>
//                           <i className="fas fa-check"></i> {f}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <h3 className="category-title">Coach in My Pocket</h3>
//             <span>
//               Daily text messaging with your therapist(only activated with
//               ongoing therapy sessions)
//             </span>
//             <div className="pricing-grid">
//               {pocketPlans.map((plan) => {
//                 const isAllowed =
//                   selectedTherapyPlan &&
//                   allowedPocketPlans[selectedTherapyPlan]?.includes(plan.id);
//                 return (
//                   <div
//                     key={plan.id}
//                     className={`pricing-card ${
//                       selectedPocketPlan === plan.id ? "selected" : ""
//                     } ${!isAllowed ? "disabled" : ""}`}
//                     onClick={() => handlePocketClick(plan.id)}
//                   >
//                     <div className="pricing-header">
//                       <h3>{plan.name}</h3>
//                       <div className="price">
//                         <span className="amount">{plan.price}</span>
//                         <span>{plan.period}</span>
//                         <br />
//                         <span className="note">{plan.note}</span>
//                       </div>
//                     </div>
//                     <div className="pricing-features">
//                       <ul>
//                         {plan.features.map((f, i) => (
//                           <li key={i}>
//                             <i className="fas fa-check"></i> {f}
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             <div className="checkout-wrapper">
//               <input
//                 type="text"
//                 placeholder="Enter your full name"
//                 value={clientName}
//                 onChange={(e) => {
//                   setClientName(e.target.value);
//                   setNameError("");
//                 }}
//                 className={`checkout-name ${nameError ? "error" : ""}`}
//                 required
//               />
//               {nameError && <p className="error-message">{nameError}</p>}
              
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 value={clientEmail}
//                 onChange={(e) => {
//                   setClientEmail(e.target.value);
//                   setEmailError("");
//                 }}
//                 className={`checkout-email ${emailError ? "error" : ""}`}
//                 required
//               />
//               {emailError && <p className="error-message">{emailError}</p>}


//               <input
//                 type="text"
//                 placeholder="Enter your country"
//                 value={clientCountry}
//                 onChange={(e) => setClientCountry(e.target.value)}
//                 className="checkout-name"
//                 required
//               />

//               <button
//                 className="checkout-btn"
//                 onClick={handleCheckout}
//                 disabled={
//                   !selectedTherapyPlan ||
//                   !clientName.trim() ||
//                   !clientEmail.trim() ||
//                   !isValidEmail(clientEmail) ||
//                   !clientCountry.trim()
//                 }
//                 style={{
//                   opacity:
//                     !selectedTherapyPlan ||
//                     !clientName.trim() ||
//                     !clientEmail.trim() ||
//                     !isValidEmail(clientEmail) ||
//                     !clientCountry.trim()
//                       ? 0.6
//                       : 1,
//                   cursor:
//                     !selectedTherapyPlan ||
//                     !clientName.trim() ||
//                     !clientEmail.trim() ||
//                     !isValidEmail(clientEmail) ||
//                     !clientCountry.trim()
//                       ? "not-allowed"
//                       : "pointer",
//                 }}
//               >
//                 Checkout
//               </button>

//             </div>

//             {/* Payment Options Modal */}
//             {showPaymentOptions && (
//               <div className="payment-modal">
//                 <div className="payment-content">
//                   <h3>Select Payment Method</h3>

//                   <div className="currency-selector">
//                     <label htmlFor="currency">Choose Currency: </label>
//                     <select
//                       id="currency"
//                       value={currency}
//                       onChange={(e) => setCurrency(e.target.value)}
//                     >
//                       <option value="USD">USD – US Dollar</option>
//                       <option value="EUR">EUR – Euro</option>
//                       <option value="CAD">CAD – Canadian Dollar</option>
//                       <option value="GBP">GBP – British Pound</option>
//                     </select>
//                   </div>

//                   <div className="payment-tabs">
//                     <button
//                       className={`payment-tab ${
//                         activePayment === "flutterwave" ? "active" : ""
//                       }`}
//                       onClick={() => setActivePayment("flutterwave")}
//                     >
//                       <div>
//                         <span className="payment-tap-button">Pay with Flutterwave</span>
//                       </div>
//                     </button>

//                     <button
//                       className={`payment-tab ${
//                         activePayment === "paystack" ? "active" : ""
//                       }`}
//                       onClick={() => setActivePayment("paystack")}
//                     >
//                       <img
//                         src="https://assets.paystack.com/assets/img/hero/Paystack-mark-white-twitter.png"
//                         alt="Paystack"
//                         className="tab-logo"
//                       />
//                       <div>
//                         <span className="payment-tap-button">Pay with Paystack</span>
//                       </div>
//                     </button>
//                   </div>

//                   <div className="payment-body">
//                     {activePayment === "flutterwave" && (
//                       <>
//                         <p>
//                           Amount: {currency} {getConvertedAmount()}
//                         </p>
//                         <FlutterWaveButton
//                           {...flutterwaveConfig}
//                           text="Pay Now"
//                           onClose={() => closePaymentModal()}
//                           callback={(response) => {
//                             console.log(response);
//                             alert("Payment successful with Flutterwave!");
//                             setShowPaymentOptions(false);
//                             sendReceiptToWhatsApp(response);
//                           }}
//                           className="checkout-btn"
//                         />
//                       </>
//                     )}

//                     {activePayment === "paystack" && (
//                       <PaystackButton
//                         email={clientEmail}
//                         amount={getTotalAmount()}
//                         metadata={{
//                           custom_fields: [
//                             {
//                               display_name: "Name",
//                               variable_name: "client_name",
//                               value: clientName,
//                             },
//                              {
//                               display_name: "Country",
//                               variable_name: "client_country",
//                               value: clientCountry,
//                             },
//                           ],
//                         }}
//                         publicKey="pk_live_34b73780854135828702b448cae62e1bdb0f98b8"
//                         onSuccess={(ref) => {
//                           console.log("Paystack success:", ref);
//                           alert("Payment successful with Paystack!");
//                           setShowPaymentOptions(false);
//                           sendReceiptToWhatsApp(ref);
//                         }}
//                         onClose={() => alert("Payment closed")}
//                       />
//                     )}
//                   </div>

//                   <button
//                     className="btn-cancel"
//                     onClick={() => setShowPaymentOptions(false)}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </section>
                      
//         <section className="therapy-types-section">
//           <div className="container">
//             <h2 className="section-title animate-on-scroll">We Offer Multiple Types of Therapy</h2>
            
//             <div className="therapy-tabs animate-on-scroll">
//               <button 
//                 className={`tab-button ${activeTab === 'individual' ? 'active' : ''}`}
//                 onClick={() => handleTabChange('individual')}
//               >
//                 <i className="fas fa-user"></i>
//                 <span>Individual Therapy</span>
//               </button>
//               <button 
//                 className={`tab-button ${activeTab === 'couples' ? 'active' : ''}`}
//                 onClick={() => handleTabChange('couples')}
//               >
//                 <i className="fas fa-heart"></i>
//                 <span>Couples Therapy</span>
//               </button>
//               <button 
//                 className={`tab-button ${activeTab === 'family' ? 'active' : ''}`}
//                 onClick={() => handleTabChange('family')}
//               >
//                 <i className="fas fa-users"></i>
//                 <span>Family Therapy</span>
//               </button>
//               <button 
//                 className={`tab-button ${activeTab === 'teens' ? 'active' : ''}`}
//                 onClick={() => handleTabChange('teens')}
//               >
//                 <i className="fas fa-child"></i>
//                 <span>Teen Therapy</span>
//               </button>
//             </div>
            
//             <div className="therapy-content animate-on-scroll">
//               {/* individual */}
//               {activeTab === 'individual' && (
//                 <div className="therapy-type-content">
//                   <div className="therapy-image">
//                     <img src="/assets/images/individual-therapy.jpg" alt="Individual Therapy" />
//                   </div>
//                   <div className="therapy-details">
//                     <h3>Individual Therapy</h3>
//                     <p>Heal, grow, and gain clarity through personalized individual therapy. Our therapists provide a safe, supportive space to explore your thoughts, emotions, and experiences. We work collaboratively with you to build resilience, deepen self-awareness, and overcome personal challenges.</p>
//                     <h4>Common areas we address:</h4>
//                     <ul className="therapy-areas">
//                       <li><i className="fas fa-check-circle"></i> Anxiety and stress</li>
//                       <li><i className="fas fa-check-circle"></i> Depression and mood disorders</li>
//                       <li><i className="fas fa-check-circle"></i> Self-esteem and identity concerns</li>
//                       <li><i className="fas fa-check-circle"></i> Trauma and past experiences</li>
//                       <li><i className="fas fa-check-circle"></i> Life transitions and decision-making</li>
//                       <li><i className="fas fa-check-circle"></i> Grief and loss</li>
//                       <li><i className="fas fa-check-circle"></i> Personal growth and emotional regulation</li>
//                     </ul>
//                     <div className="therapy-cta">
//                       <button onClick={handleGetStarted} className="btn btn-primary">Get Matched</button>
//                       <a href="/therapists" className="btn btn-outline">Browse Therapists</a>
//                     </div>
//                   </div>
//                 </div>
//               )}
//               {/* couples */}
//               {activeTab === 'couples' && (
//                 <div className="therapy-type-content">
//                   <div className="therapy-image">
//                     <img src="/assets/images/couples_therapy.jpg" alt="Couples Therapy" />
//                   </div>
//                   <div className="therapy-details">
//                     <h3>Couples Therapy</h3>
//                     <p>Strengthen your relationship with professional guidance and support. Our experienced therapists help you deepen emotional connection, improve communication, resolve conflicts, and rebuild trust. Whether you’re dating, engaged, or married, we equip you with tools to navigate challenges and grow together as a team.</p>
//                     <h4>Common areas we address:</h4>
//                     <ul className="therapy-areas">
//                       <li><i className="fas fa-check-circle"></i> Communication breakdowns</li>
//                       <li><i className="fas fa-check-circle"></i> Intimacy and emotional disconnect</li>
//                       <li><i className="fas fa-check-circle"></i> Rebuilding trust after infidelity</li>
//                       <li><i className="fas fa-check-circle"></i> Financial disagreements</li>
//                       <li><i className="fas fa-check-circle"></i> Parenting and co-parenting conflicts</li>
//                       <li><i className="fas fa-check-circle"></i> Navigating major life transitions (e.g moving, career shifts, grief)</li>
//                     </ul>
//                     <div className="therapy-cta">
//                       <button onClick={handleGetStarted} className="btn btn-primary">Get Matched</button>
//                       <a href="/therapists" className="btn btn-outline">Browse Therapists</a>
//                     </div>
//                   </div>
//                 </div>
//               )}
//               {/* family */}
//               {activeTab === 'family' && (
//                 <div className="therapy-type-content">
//                   <div className="therapy-image">
//                     <img src="/assets/images/family_therapy.jpg" alt="Family Therapy" />
//                   </div>
//                   <div className="therapy-details">
//                     <h3>Family Therapy</h3>
//                     <p>Improve family dynamics and resolve conflicts with specialized family therapy. Our therapists work with all family members to enhance communication, understanding, and functioning within the family system.</p>
//                     <h4>Common areas we address:</h4>
//                     <ul className="therapy-areas">
//                       <li><i className="fas fa-check-circle"></i> Parent-child conflicts</li>
//                       <li><i className="fas fa-check-circle"></i> Sibling relationships</li>
//                       <li><i className="fas fa-check-circle"></i> Blended family challenges</li>
//                       <li><i className="fas fa-check-circle"></i> Family communication</li>
//                       <li><i className="fas fa-check-circle"></i> Life cycle transitions</li>
//                       <li><i className="fas fa-check-circle"></i> Coping with family illness</li>
//                     </ul>
//                     <div className="therapy-cta">
//                       <button onClick={handleGetStarted} className="btn btn-primary">Get Matched</button>
//                       <a href="/therapists" className="btn btn-outline">Browse Therapists</a>
//                     </div>
//                   </div>
//                 </div>
//               )}
//               {/* teens */}
//               {activeTab === 'teens' && (
//                 <div className="therapy-type-content">
//                   <div className="therapy-image">
//                     <img src="/assets/images/teen-therapy.jpg" alt="Teen Therapy" />
//                   </div>
//                   <div className="therapy-details">
//                     <h3>Teen Therapy</h3>
//                     <p>Specialized therapy for adolescents (13-19) focused on their unique developmental needs and challenges. Our teen therapists create a comfortable, non-judgmental space where young people can express themselves freely.</p>
//                     <h4>Common areas we address:</h4>
//                     <ul className="therapy-areas">
//                       <li><i className="fas fa-check-circle"></i> Academic pressure</li>
//                       <li><i className="fas fa-check-circle"></i> Social anxiety and peer relationships</li>
//                       <li><i className="fas fa-check-circle"></i> Identity exploration</li>
//                       <li><i className="fas fa-check-circle"></i> Depression and anxiety</li>
//                       <li><i className="fas fa-check-circle"></i> Family conflicts</li>
//                       <li><i className="fas fa-check-circle"></i> Self-esteem and body image</li>
//                     </ul>
//                     <div className="therapy-cta">
//                       <button onClick={handleGetStarted} className="btn btn-primary">Get Matched</button>
//                       <a href="/therapists" className="btn btn-outline">Browse Therapists</a>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </section>
        
        
//         <section className="approaches-section">
//           <div className="container">
//             <h2 className="section-title animate-on-scroll">Our Therapeutic Approaches</h2>
//             <p className="section-subtitle animate-on-scroll">Our therapists are trained in various evidence-based approaches to provide personalized care.</p>
            
//             <div className="approaches-grid">
//               <div className="approach-card animate-on-scroll">
//                 <div className="approach-icon">
//                   <i className="fas fa-brain"></i>
//                 </div>
//                 <h3>Cognitive Behavioral Therapy (CBT)</h3>
//                 <p>Focuses on identifying and changing negative thought patterns that influence behaviors and emotions.</p>
//               </div>
              
//               <div className="approach-card animate-on-scroll">
//                 <div className="approach-icon">
//                   <i className="fas fa-heart"></i>
//                 </div>
//                 <h3>Mindfulness-Based Therapy</h3>
//                 <p>Cultivates present-moment awareness and non-judgmental acceptance of thoughts, feelings, and sensations.</p>
//               </div>
              
//               <div className="approach-card animate-on-scroll">
//                 <div className="approach-icon">
//                   <i className="fas fa-comments"></i>
//                 </div>
//                 <h3>Psychodynamic Therapy</h3>
//                 <p>Explores unconscious processes and how they influence current behavior, especially in the context of early life experiences.</p>
//               </div>
              
//               <div className="approach-card animate-on-scroll">
//                 <div className="approach-icon">
//                   <i className="fas fa-users"></i>
//                 </div>
//                 <h3>Family Systems Therapy</h3>
//                 <p>Views problems within the context of family relationships and patterns rather than as individual issues.</p>
//               </div>
              
//               <div className="approach-card animate-on-scroll">
//                 <div className="approach-icon">
//                   <i className="fas fa-hand-holding-heart"></i>
//                 </div>
//                 <h3>Person-Centered Therapy</h3>
//                 <p>Emphasizes empathy, unconditional positive regard, and genuine therapist presence to facilitate client growth.</p>
//               </div>
              
//               <div className="approach-card animate-on-scroll">
//                 <div className="approach-icon">
//                   <i className="fas fa-balance-scale"></i>
//                 </div>
//                 <h3>Dialectical Behavior Therapy (DBT)</h3>
//                 <p>Combines cognitive-behavioral techniques with mindfulness practices to develop emotional regulation and interpersonal skills.</p>
//               </div>
//             </div>
//           </div>
//         </section>
        
//         <section className="communication-options-section">
//           <div className="container">
//             <h2 className="section-title animate-on-scroll">Flexible Communication Options</h2>
//             <p className="section-subtitle animate-on-scroll">Choose the therapy format that works best for you.</p>
            
//             <div className="options-grid">
//               <div className="option-card animate-on-scroll">
//                 <div className="option-icon">
//                   <i className="fas fa-video"></i>
//                 </div>
//                 <h3>Video Sessions</h3>
//                 <p>Face-to-face virtual therapy sessions from the comfort of your home or any private space.</p>
//                 <ul className="option-features">
//                   <li><i className="fas fa-check"></i> Scheduled 30-60 minute sessions</li>
//                   <li><i className="fas fa-check"></i> Most similar to traditional in-person therapy</li>
//                   <li><i className="fas fa-check"></i> Secure, HIPAA-compliant platform</li>
//                 </ul>
//               </div>
              
//               <div className="option-card animate-on-scroll">
//                 <div className="option-icon">
//                   <i className="fas fa-phone-alt"></i>
//                 </div>
//                 <h3>Audio Sessions</h3>
//                 <p>Voice-only therapy sessions for those who prefer not to be on camera.</p>
//                 <ul className="option-features">
//                   <li><i className="fas fa-check"></i> Scheduled 30-60 minute sessions</li>
//                   <li><i className="fas fa-check"></i> Great for on-the-go or limited bandwidth</li>
//                   <li><i className="fas fa-check"></i> Focus entirely on the conversation</li>
//                 </ul>
//               </div>
              
//               <div className="option-card animate-on-scroll">
//                 <div className="option-icon">
//                   <i className="fas fa-comment-dots"></i>
//                 </div>
//                 <h3>Coach in my Pocket</h3>
//                 <p>Unlike other platforms, therapists reply continually all through the day to provide you with continuous intensive care.</p>
//                 <ul className="option-features">
//                   <li><i className="fas fa-check"></i> Send messages anytime, 24/7</li>
//                   <li><i className="fas fa-check"></i> Therapist responds immediately through the days.</li>
//                   <li><i className="fas fa-check"></i> Great for processing thoughts at your own pace</li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </section>
        
//         <section className="cta-section">
//           <div className="container">
//             <div className="cta-content animate-on-scroll">
//               <h2>Ready to Start Your Therapy Journey?</h2>
//               <p>Take our brief assessment to get matched with the right therapist for your needs.</p>
//               <button onClick={handleGetStarted} className="btn btn-primary btn-lg">Begin Assessment</button>
//             </div>
//           </div>
//         </section>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default ServicesPage;