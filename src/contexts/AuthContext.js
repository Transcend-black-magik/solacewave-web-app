import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  onAuthStateChanged, 
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { getUserById } from '../services/firestoreService';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Get additional user data from Firestore
          const { success, data, error } = await getUserById(user.uid);
          
          if (success && data) {
            setUserProfile(data);
          } else if (error) {
            console.error('Error fetching user profile:', error);
            setAuthError('Failed to load user profile. Please try again later.');
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          setAuthError('An unexpected error occurred. Please try again later.');
        }
      } else {
        // Reset user profile when signed out
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Sign out function
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      // User state will be updated by the auth state observer
    } catch (error) {
      console.error('Sign out error:', error);
      setAuthError('Failed to sign out. Please try again.');
      throw error;
    }
  };

  // Clear error function
  const clearAuthError = () => {
    setAuthError(null);
  };

  // Update user profile in context
  const updateProfile = (profileData) => {
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        ...profileData
      });
    }
  };

  // Context value
  const value = {
    currentUser,
    userProfile,
    loading,
    authError,
    signOut,
    clearAuthError,
    updateProfile,
    isAuthenticated: !!currentUser,
    isProfileLoaded: !!userProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;