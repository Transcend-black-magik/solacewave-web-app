import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './router';
import { AuthProvider } from './contexts/AuthContext';
import ScrollToTop from './components/common/ScrollToTop';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import './styles/global.css';

// Load Stripe with your publishable key from .env
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Elements stripe={stripePromise}>
          <AppRoutes />
        </Elements>
      </Router>
    </AuthProvider>
  );
}

export default App;
