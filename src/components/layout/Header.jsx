import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/components/header.css";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // ===== Detect current region from URL =====
  const region = location.pathname.split("/")[1] || "ng";
  const base = `/${region}`;

  // ===== Transparent pages inside region =====
  const transparentPages = [base, `${base}/about`, `${base}/contact`];
  const isTransparentPage = transparentPages.includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  useEffect(() => setMenuOpen(false), [location]);

  const handleGetStarted = () => {
    window.location.href = `${base}/services`;
  };

  const isActive = (path) => location.pathname === `${base}${path}`;

  return (
    <header className={`header ${isScrolled || !isTransparentPage ? "scrolled" : ""}`}>
      <div className="container">
        <div className="header-content">

          {/* Logo */}
          <Link
            to={base}
            className="logo"
            style={{ display: "flex", alignItems: "center", gap: "4px" }}
          >
            <img
              src="/Solacelogosuite-05.png"
              alt="Solace Wave Therapy"
              style={{
                height: "50px",
                objectFit: "contain",
                marginRight: "-18px",
              }}
            />
            <span className="logo-text">Solace Wave Therapy</span>
          </Link>

          {/* Mobile Toggle */}
          <button
            className={`menu-toggle ${menuOpen ? "open" : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Nav */}
          <nav className={`main-nav ${menuOpen ? "open" : ""}`}>
            <ul className="nav-links">
              <li><Link to={base} className={isActive("") ? "active" : ""}>Home</Link></li>
              <li><Link to={`${base}/about`} className={isActive("/about") ? "active" : ""}>About</Link></li>
              <li><Link to={`${base}/services`} className={isActive("/services") ? "active" : ""}>Services</Link></li>
              <li><Link to={`${base}/therapists`} className={isActive("/therapists") ? "active" : ""}>Therapists</Link></li>
              <li><Link to={`${base}/contact`} className={isActive("/contact") ? "active" : ""}>Contact</Link></li>
              <li><Link to={`${base}/faq`} className={isActive("/faq") ? "active" : ""}>FAQ</Link></li>
            </ul>

            <div className="nav-buttons">
              <button onClick={handleGetStarted} className="btn btn-primary btn-sm">
                Book A Session
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
