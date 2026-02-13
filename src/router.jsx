import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./components/pages/LandingPage";
import AboutPage from "./components/pages/AboutPage";
import ServicesPage from "./components/pages/ServicesPage";
import TherapistsPage from "./components/pages/TherapistsPage";
import ContactPage from "./components/pages/ContactPage";
import NotFoundPage from "./components/pages/NotFoundPage";
import AccountDeletionPage from "./components/pages/AccountDeletionPage";
import FAQPage from "./components/pages/FAQPage";
import TermsOfServicePage from "./components/pages/TermsOfServicePage";
import PrivacyPolicyPage from "./components/pages/PrivacyPolicyPage";

const RegionRoutes = () => (
  <>
    <Route index element={<LandingPage />} />
    <Route path="about" element={<AboutPage />} />
    <Route path="services" element={<ServicesPage />} />
    <Route path="therapists" element={<TherapistsPage />} />
    <Route path="contact" element={<ContactPage />} />
    <Route path="faq" element={<FAQPage />} />
    <Route path="terms" element={<TermsOfServicePage />} />
    <Route path="privacy" element={<PrivacyPolicyPage />} />
    <Route path="delete-account" element={<AccountDeletionPage />} />
  </>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Nigeria */}
      <Route path="/ng/*">
        {RegionRoutes()}
      </Route>

      {/* UK */}
      <Route path="/uk/*">
        {RegionRoutes()}
      </Route>

      {/* US */}
      <Route path="/us/*">
        {RegionRoutes()}
      </Route>

      {/* Diaspora */}
      <Route path="/diaspora/*">
        {RegionRoutes()}
      </Route>

      {/* Optional: redirect root to /ng if accessed directly (Cloudflare normally handles this) */}
      <Route path="/" element={<Navigate to="/ng" replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
