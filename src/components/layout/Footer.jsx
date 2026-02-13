import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/components/footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  // ===== Detect current region from URL =====
  const region = location.pathname.split("/")[1] || "ng";
  const base = `/${region}`;

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterFirstName, setNewsletterFirstName] = useState("");
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  const [newsletterResult, setNewsletterResult] = useState(null);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      setNewsletterResult({
        success: false,
        message: "Please enter a valid email address",
      });
      return;
    }

    setIsNewsletterSubmitting(true);
    setNewsletterResult(null);

    try {
      const API_BASE_URL = "https://solace-wave-api-production.up.railway.app";

      const response = await fetch(`${API_BASE_URL}/api/newsletter/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: newsletterEmail,
          firstName: newsletterFirstName,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setNewsletterResult({
          success: true,
          message: result.message,
        });

        setNewsletterEmail("");
        setNewsletterFirstName("");

        setTimeout(() => setNewsletterResult(null), 8000);
      } else {
        setNewsletterResult({
          success: false,
          message: result.message || "Subscription failed. Please try again.",
        });
      }
    } catch (error) {
      setNewsletterResult({
        success: false,
        message: "Network error. Please try again.",
      });
    } finally {
      setIsNewsletterSubmitting(false);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#87431D"
            fillOpacity="0.2"
            d="M0,192L60,176C120,160,240,128,360,122.7C480,117,600,139,720,149.3C840,160,960,160,1080,154.7C1200,149,1320,139,1380,133.3L1440,128L1440,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="footer-content">
        <div className="container">
          <div className="footer-main">
            {/* LOGO */}
            <div className="footer-logo">
              <Link to={base} style={{ display: "flex", alignItems: "center" }}>
                <img
                  src="/Solacelogosuite-05.png"
                  alt="Solace Wave Therapy"
                  style={{
                    height: "42px",
                    objectFit: "contain",
                    marginRight: "-12px",
                    marginTop: "-2px",
                  }}
                />
                <span style={{ fontWeight: "500", fontSize: "1rem" }}>
                  Solace Wave Therapy
                </span>
              </Link>

              <p>Your journey to better mental health begins with us.</p>
            </div>

            {/* LINKS */}
            <div className="footer-links">
              <div className="footer-links-column">
                <h3>Company</h3>
                <ul>
                  <li><Link to={`${base}/about`}>About Us</Link></li>
                  <li><Link to={`${base}/therapists`}>Our Therapists</Link></li>
                  <li><Link to={`${base}/contact`}>Contact</Link></li>
                </ul>
              </div>

              <div className="footer-links-column">
                <h3>Resources</h3>
                <ul>
                  <li><Link to={`${base}/services`}>Our Services</Link></li>
                  <li><Link to={`${base}/faq`}>FAQ</Link></li>
                </ul>
              </div>

              <div className="footer-links-column">
                <h3>Legal</h3>
                <ul>
                  <li><Link to={`${base}/terms`}>Terms of Service</Link></li>
                  <li><Link to={`${base}/privacy`}>Privacy Policy</Link></li>
                </ul>
              </div>
            </div>

            {/* NEWSLETTER */}
            <div className="footer-newsletter">
              <h3>Stay Connected</h3>
              <p>Join our newsletter for mental health tips and updates.</p>

              {newsletterResult && (
                <div className={`submit-result ${newsletterResult.success ? "success" : "error"}`}>
                  {newsletterResult.message}
                </div>
              )}

              <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
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
                  {isNewsletterSubmitting ? "Subscribing..." : "Subscribe"}
                </button>
              </form>

              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                <a href="https://www.instagram.com/solace_wave_therapy_africa" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="footer-bottom">
            <p>&copy; {currentYear} Solace Wave Therapy. All rights reserved.</p>

            <div className="app-links">
              <a href="https://apps.apple.com/app/solace-therapy/id1234567890" target="_blank" rel="noopener noreferrer">
                <img src="/assets/images/app-store-badge.png" alt="App Store" />
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.solacetherapy.app" target="_blank" rel="noopener noreferrer">
                <img src="/assets/images/play-store-badge.png" alt="Play Store" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
