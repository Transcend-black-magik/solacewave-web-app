import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './router';
import { AuthProvider } from './contexts/AuthContext';
import ScrollToTop from './components/common/ScrollToTop';
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;