
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { createNewUser } from '../../services/firestoreService';
import AnimatedBackground from '../common/AnimatedBackground';
import Input from '../common/Input';
import Button from '../common/Button';
import '../../styles/components/account-creation.css';

const CreateAccountPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers } = location.state || {};
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    agreeToPrivacy: true
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords must match';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms of Service';
    }
    
    if (!formData.agreeToPrivacy) {
      newErrors.agreeToPrivacy = 'You must agree to the Privacy Policy';
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
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      
      const user = userCredential.user;
      
      // Update user profile with display name
      await updateProfile(user, {
        displayName: formData.fullName
      });
      
      // Save user data to Firestore along with questionnaire answers
      const userData = {
        uid: user.uid,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: '',
        questionnaireResponses: answers || {},
      };
      
      const { success, userId, error } = await createNewUser(userData);
      
      if (success) {
        // Navigate to download app page
        navigate('/download-app');
      } else {
        throw new Error(error || 'Failed to save user data');
      }
    } catch (error) {
      console.error('Account creation error:', error);
      setGeneralError(
        error.message || 'There was an error creating your account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="create-account-page">
      <AnimatedBackground variant="pattern" />
      
      <div className="account-creation-container">
        <div className="account-creation-header">
          <h1>Create Your Account</h1>
          <p>You're almost ready to begin your healing journey</p>
        </div>
        
        {generalError && (
          <div className="error-message general-error">
            {generalError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="account-creation-form">
          <div className="form-group">
            <Input
              type="text"
              id="fullName"
              name="fullName"
              label="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              required
            />
          </div>
          
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
            <p className="password-hint">
              Password must be at least 8 characters
            </p>
          </div>
          
          <div className="form-group">
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />
          </div>
          
          <div className="form-group checkbox">
            <label className={`checkbox-label ${errors.agreeToTerms ? 'error' : ''}`}>
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
              />
              I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>
            </label>
            {errors.agreeToTerms && <p className="error-text">{errors.agreeToTerms}</p>}
          </div>
          
          {/* <div className="form-group checkbox">
            <label className={`checkbox-label ${errors.agreeToPrivacy ? 'error' : ''}`}>
              <input
                type="checkbox"
                name="agreeToPrivacy"
                checked={formData.agreeToPrivacy}
                onChange={handleChange}
              />
              I agree to the <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            </label>
            {errors.agreeToPrivacy && <p className="error-text">{errors.agreeToPrivacy}</p>}
          </div> */}
          
          <Button
            type="submit"
            className="btn-primary btn-full-width"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
        
        <div className="account-creation-footer">
          <p>Already have an account? <a href="/login">Sign In</a></p>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountPage;