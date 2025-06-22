import React, { useState } from 'react';
import { updateUserProfile, updateUserPassword } from '../../services/firestoreService';
import { updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

const ProfileSettings = ({ user, currentUser }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  
  // Personal Info Form
  const [personalInfo, setPersonalInfo] = useState({
    fullName: user?.fullName || '',
    email: user?.email || currentUser?.email || '',
    phoneNumber: user?.phoneNumber || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || '',
    preferredLanguage: user?.preferredLanguage || 'en'
  });
  
  // Preferences Form
  const [preferences, setPreferences] = useState({
    notifications: user?.preferences?.notifications || true,
    emailReminders: user?.preferences?.emailReminders || true,
    smsReminders: user?.preferences?.smsReminders || false,
    darkMode: user?.preferences?.darkMode || false,
    language: user?.preferences?.language || 'en'
  });
  
  // Password Change Form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Current Password for Email Change
  const [currentPassword, setCurrentPassword] = useState('');
  const [showCurrentPasswordField, setShowCurrentPasswordField] = useState(false);
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Reset success/error messages when changing tabs
    setSuccess(null);
    setError(null);
  };
  
  // Handle personal info change
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle preferences change
  const handlePreferencesChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle password form change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle personal info form submit
  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // Check if email has changed
      const emailChanged = personalInfo.email !== currentUser.email;
      
      if (emailChanged) {
        // If email changed, we need to re-authenticate and then update email
        if (!currentPassword) {
          setShowCurrentPasswordField(true);
          setLoading(false);
          return;
        }
        
        try {
          // Create credential with current password
          const credential = EmailAuthProvider.credential(
            currentUser.email,
            currentPassword
          );
          
          // Re-authenticate user
          await reauthenticateWithCredential(currentUser, credential);
          
          // Update email in Firebase Auth
          await updateEmail(currentUser, personalInfo.email);
        } catch (authError) {
          console.error('Authentication error:', authError);
          setError(authError.message || 'Failed to update email. Please check your password and try again.');
          setLoading(false);
          return;
        }
      }
      
      // Update profile in Firestore
      const profileData = {
        fullName: personalInfo.fullName,
        email: personalInfo.email,
        phoneNumber: personalInfo.phoneNumber,
        dateOfBirth: personalInfo.dateOfBirth,
        gender: personalInfo.gender,
        preferredLanguage: personalInfo.preferredLanguage,
      };
      
      // In a real implementation, you'd update Firestore
      // const { success, error } = await updateUserProfile(currentUser.uid, profileData);
      
      // Simulate successful update
      setTimeout(() => {
        setSuccess('Profile updated successfully');
        setLoading(false);
        setShowCurrentPasswordField(false);
        setCurrentPassword('');
      }, 1000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
      setLoading(false);
    }
  };
  
  // Handle preferences form submit
  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // In a real implementation, you'd update Firestore
      // const { success, error } = await updateUserProfile(currentUser.uid, { preferences });
      
      // Simulate successful update
      setTimeout(() => {
        setSuccess('Preferences updated successfully');
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error updating preferences:', err);
      setError('Failed to update preferences. Please try again.');
      setLoading(false);
    }
  };
  
  // Handle password form submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // Create credential with current password
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        passwordForm.currentPassword
      );
      
      try {
        // Re-authenticate user
        await reauthenticateWithCredential(currentUser, credential);
        
        // Update password in Firebase Auth
        await updatePassword(currentUser, passwordForm.newPassword);
        
        // Reset form
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        setSuccess('Password updated successfully');
      } catch (authError) {
        console.error('Authentication error:', authError);
        setError('Current password is incorrect');
      }
    } catch (err) {
      console.error('Error updating password:', err);
      setError('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-settings-container">
      <div className="settings-tabs">
        <button
          className={`settings-tab ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => handleTabChange('personal')}
        >
          <i className="fas fa-user"></i>
          <span>Personal Info</span>
        </button>
        <button
          className={`settings-tab ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => handleTabChange('preferences')}
        >
          <i className="fas fa-cog"></i>
          <span>Preferences</span>
        </button>
        <button
          className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => handleTabChange('security')}
        >
          <i className="fas fa-lock"></i>
          <span>Security</span>
        </button>
      </div>
      
      <div className="settings-content">
        {success && (
          <div className="success-message">
            <i className="fas fa-check-circle"></i>
            <p>{success}</p>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
          </div>
        )}
        
        {activeTab === 'personal' && (
          <form className="personal-info-form" onSubmit={handlePersonalInfoSubmit}>
            <h3>Personal Information</h3>
            
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={personalInfo.fullName}
                onChange={handlePersonalInfoChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={personalInfo.email}
                onChange={handlePersonalInfoChange}
                required
              />
            </div>
            
            {showCurrentPasswordField && (
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <p className="field-hint">Required to update your email address</p>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                required
                minLength={8}
              />
            </div>
            
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
            
            <div className="security-options">
              <h4>Account Security</h4>
              
              <div className="security-option">
                <div className="security-option-info">
                  <h5>Two-Factor Authentication</h5>
                  <p>Add an extra layer of security to your account</p>
                </div>
                <button type="button" className="btn btn-outline btn-sm">
                  Enable
                </button>
              </div>
              
              <div className="security-option">
                <div className="security-option-info">
                  <h5>Login Sessions</h5>
                  <p>Manage your active sessions and sign out from other devices</p>
                </div>
                <button type="button" className="btn btn-outline btn-sm">
                  Manage
                </button>
              </div>
              
              <div className="security-option">
                <div className="security-option-info">
                  <h5>Download Your Data</h5>
                  <p>Get a copy of all your personal data stored in our system</p>
                </div>
                <button type="button" className="btn btn-outline btn-sm">
                  Download
                </button>
              </div>
              
              <div className="security-option">
                <div className="security-option-info">
                  <h5>Account Deletion</h5>
                  <p>Permanently delete your account and all associated data</p>
                </div>
                <button type="button" className="btn btn-danger btn-sm">
                  Delete Account
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;