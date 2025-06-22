import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase';
import AnimatedBackground from '../common/AnimatedBackground';
import Input from '../common/Input';
import Button from '../common/Button';
import '../../styles/components/login-page.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetError, setResetError] = useState('');

  
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
      
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setGeneralError('');
    
    try {
      await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      // Navigate to dashboard on successful login
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Failed to log in. Please check your credentials and try again.';
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect email or password. Please try again.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many unsuccessful login attempts. Please try again later or reset your password.';
      }
      
      setGeneralError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    
    if (!resetEmail.trim()) {
      setResetError('Please enter your email address');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      setResetError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    setResetError('');
    
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSent(true);
    } catch (error) {
      console.error('Password reset error:', error);
      
      let errorMessage = 'Failed to send password reset email. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      }
      
      setResetError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const toggleResetForm = () => {
    setShowResetForm(!showResetForm);
    setResetEmail(formData.email || '');
    setResetError('');
    setResetSent(false);
  };
  
  return (
    <div className="login-page">
      <AnimatedBackground variant="subtle" />
      
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue your therapy journey</p>
        </div>
        
        {generalError && (
          <div className="error-message general-error">
            {generalError}
          </div>
        )}
        
        {!showResetForm ? (
          // Login Form
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <Input
                type="email"
                id="email"
                name="email"
                label="Email Address"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />
            </div>
            
            <div className="form-group">
              <Input
                type="password"
                id="password"
                name="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
              />
            </div>
            
            <Button
              type="submit"
              className="btn-primary btn-full-width"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
            
            <div className="login-options">
              <button 
                type="button" 
                className="text-button" 
                onClick={toggleResetForm}
              >
                Forgot Password?
              </button>
            </div>
          </form>
        ) : (
          // Password Reset Form
          <div className="reset-password-container">
            {resetSent ? (
              <div className="reset-success">
                <i className="fas fa-check-circle"></i>
                <h3>Password Reset Email Sent</h3>
                <p>
                  We've sent password reset instructions to {resetEmail}.
                  Please check your inbox and follow the provided link.
                </p>
                <Button
                  type="button"
                  className="btn-outline btn-full-width"
                  onClick={toggleResetForm}
                >
                  Back to Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="reset-form">
                <h3>Reset Your Password</h3>
                <p>Enter your email address and we'll send you instructions to reset your password.</p>
                
                {resetError && (
                  <div className="error-message">
                    {resetError}
                  </div>
                )}
                
                <div className="form-group">
                  <Input
                    type="email"
                    id="resetEmail"
                    name="resetEmail"
                    label="Email Address"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="btn-primary btn-full-width"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
                
                <button 
                  type="button" 
                  className="text-button" 
                  onClick={toggleResetForm}
                >
                  Back to Login
                </button>
              </form>
            )}
          </div>
        )}
        
        <div className="login-footer">
          <p>Don't have an account? <Link to="/questionnaire">Get Started</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;