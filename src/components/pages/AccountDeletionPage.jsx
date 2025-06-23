import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/components/account-deletion.css';

const AccountDeletionPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    reason: '',
    feedback: '',
    confirmEmail: '',
    confirmDeletion: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Firebase Functions URL - Replace with your project ID
  // const FIREBASE_PROJECT_ID = 'solacewave-15844';
  //const FUNCTIONS_BASE_URL = `https://us-central1-${FIREBASE_PROJECT_ID}.cloudfunctions.net`;

  useEffect(() => {
    // Pre-fill email if user is authenticated
    if (isAuthenticated && user?.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [isAuthenticated, user]);

  const deletionReasons = [
    'I no longer need the service',
    'Privacy concerns',
    'Poor user experience',
    'Found a better alternative',
    'Too expensive',
    'Technical issues',
    'Account security concerns',
    'Personal reasons',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.confirmEmail.trim()) {
      newErrors.confirmEmail = 'Please confirm your email address';
    } else if (formData.email !== formData.confirmEmail) {
      newErrors.confirmEmail = 'Email addresses do not match';
    }

    if (!formData.reason) {
      newErrors.reason = 'Please select a reason for deletion';
    }

    if (!formData.confirmDeletion) {
      newErrors.confirmDeletion = 'You must confirm that you understand the consequences of account deletion';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmDeletion = async () => {
    setIsSubmitting(true);
    setSubmitResult(null);
  
    try {
      // Replace this URL with your deployed server URL
      const API_BASE_URL = 'https://solace-wave-api-production.up.railway.app';
      
      const response = await fetch(`${API_BASE_URL}/api/account/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          reason: formData.reason,
          feedback: formData.feedback,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          userId: user?.uid || null
        }),
      });
  
      const result = await response.json();
  
      if (result.success) {
        setSubmitResult({
          success: true,
          message: result.message
        });
        
        // Reset form
        setFormData({
          email: '',
          reason: '',
          feedback: '',
          confirmEmail: '',
          confirmDeletion: false
        });
        
        setShowConfirmation(false);
        
        // Redirect after 5 seconds
        setTimeout(() => {
          navigate('/');
        }, 5000);
      } else {
        setSubmitResult({
          success: false,
          message: result.message || 'Failed to submit deletion request. Please try again.'
        });
      }
    } catch (error) {
      console.error('Account deletion request error:', error);
      setSubmitResult({
        success: false,
        message: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="account-deletion-page">
      <Header />
      
      <main className="account-deletion-content">
        <div className="container">
          <div className="deletion-header">
            <h1>Delete Your Account</h1>
            <p className="subtitle">We're sorry to see you go. Please read the information below carefully before proceeding.</p>
          </div>

          {/* Information Section */}
          <div className="deletion-info-section">
            <div className="info-card">
              <h2>⚠️ Important Information</h2>
              <p>Before you delete your account, please understand that:</p>
              <ul>
                <li><strong>This action is permanent and cannot be undone</strong></li>
                <li>All your personal data, chat history, and therapy sessions will be permanently deleted</li>
                <li>You will lose access to all premium features and subscriptions</li>
                <li>Your therapist will be notified of your account deletion</li>
                <li>Any ongoing therapy sessions will be terminated</li>
                <li>You will not be able to recover your data after deletion</li>
              </ul>
            </div>

            <div className="info-card">
              <h2>🔒 Data Retention Policy</h2>
              <p>Upon account deletion:</p>
              <ul>
                <li>Personal information will be deleted within 30 days</li>
                <li>Some anonymized data may be retained for legal and compliance purposes</li>
                <li>Billing records may be retained as required by law</li>
                <li>Anonymous usage statistics may be retained for service improvement</li>
              </ul>
            </div>

            <div className="info-card">
              <h2>💡 Alternative Options</h2>
              <p>Instead of deleting your account, you might consider:</p>
              <ul>
                <li><strong>Deactivating your account temporarily</strong> - Contact support</li>
                <li><strong>Pausing your subscription</strong> - Keep your data but stop billing</li>
                <li><strong>Switching therapists</strong> - Find a better match</li>
                <li><strong>Adjusting notification settings</strong> - Reduce app communications</li>
              </ul>
              <p>
                <a href="/contact" className="support-link">Contact our support team</a> to explore these options.
              </p>
            </div>
          </div>

          {/* Deletion Form */}
          <div className="deletion-form-section">
            <h2>Account Deletion Request</h2>
            
            {submitResult && (
              <div className={`submit-result ${submitResult.success ? 'success' : 'error'}`}>
                {submitResult.message}
                {submitResult.success && (
                  <p style={{ marginTop: '10px', fontSize: '14px' }}>
                    You will be redirected to the homepage shortly.
                  </p>
                )}
              </div>
            )}

            <form className="deletion-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="Enter your account email address"
                  disabled={isAuthenticated && user?.email}
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmEmail">Confirm Email Address *</label>
                <input
                  type="email"
                  id="confirmEmail"
                  name="confirmEmail"
                  value={formData.confirmEmail}
                  onChange={handleChange}
                  className={errors.confirmEmail ? 'error' : ''}
                  placeholder="Re-enter your email address"
                />
                {errors.confirmEmail && <div className="error-message">{errors.confirmEmail}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="reason">Reason for Deletion *</label>
                <select
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className={errors.reason ? 'error' : ''}
                >
                  <option value="">Please select a reason</option>
                  {deletionReasons.map((reason) => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
                {errors.reason && <div className="error-message">{errors.reason}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="feedback">Additional Feedback (Optional)</label>
                <textarea
                  id="feedback"
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Help us improve by sharing your experience or specific issues you encountered..."
                />
                <div className="form-help">Your feedback helps us improve our service for other users.</div>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="confirmDeletion"
                    checked={formData.confirmDeletion}
                    onChange={handleChange}
                    className={errors.confirmDeletion ? 'error' : ''}
                  />
                  <span className="checkmark"></span>
                  I understand that deleting my account is permanent and cannot be undone. All my data will be permanently deleted and cannot be recovered.
                </label>
                {errors.confirmDeletion && <div className="error-message">{errors.confirmDeletion}</div>}
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger" disabled={isSubmitting}>
                  Request Account Deletion
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <div className="modal-header">
              <h3>⚠️ Final Confirmation</h3>
            </div>
            <div className="modal-body">
              <p><strong>Are you absolutely sure you want to delete your account?</strong></p>
              <p>This action will:</p>
              <ul>
                <li>Permanently delete all your data</li>
                <li>Cancel any active subscriptions</li>
                <li>End all therapy sessions</li>
                <li>Remove access to the app</li>
              </ul>
              <p><strong>This cannot be undone.</strong></p>
            </div>
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleCancelConfirmation}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={handleConfirmDeletion}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Yes, Delete My Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AccountDeletionPage;