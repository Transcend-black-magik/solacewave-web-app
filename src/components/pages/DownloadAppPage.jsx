import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import AnimatedBackground from '../common/AnimatedBackground';
import '../../styles/components/download-app.css';

const DownloadAppPage = () => {
  const navigate = useNavigate();
  const currentUser = auth.currentUser;
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Detect platform
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isAndroid = /Android/.test(navigator.userAgent);
  
  // Generate deep link
  const generateDeepLink = () => {
    // This would be your actual deep link schema with user ID
    if (currentUser) {
      return `solacetherapy://user/${currentUser.uid}`;
    }
    return 'solacetherapy://';
  };
  
  // Handle app download or open
  const handleAppAction = () => {
    const deepLink = generateDeepLink();
    
    // Try to open the app first
    window.location.href = deepLink;
    
    // Set a timeout to redirect to store if app isn't installed
    setTimeout(() => {
      if (isIOS) {
        window.location.href = 'https://apps.apple.com/app/solace-therapy/id1234567890';
      } else if (isAndroid) {
        window.location.href = 'https://play.google.com/store/apps/details?id=com.solacetherapy.app';
      }
    }, 1000);
  };

  return (
    <div className="download-app-page">
      <AnimatedBackground variant="celebration" />
      
      <div className="download-app-container">
        <div className="download-app-content">
          <div className="success-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          
          <h1>Account Created Successfully!</h1>
          
          <p className="congrats-message">
            Congratulations! Your journey to better mental health has begun.
          </p>
          
          <div className="next-steps">
            <h2>Next Steps:</h2>
            <p>Download our mobile app to continue your therapy journey with Solace Wave Therapy.</p>
          </div>
          
          <div className="app-preview">
            <img src="/assets/images/app-preview.png" alt="Solace Wave Therapy App" />
          </div>
          
          <div className="download-options">
            {isIOS && (
              <div className="download-option ios">
                <a 
                  href="https://apps.apple.com/app/solace-therapy/id1234567890" 
                  className="store-button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAppAction();
                  }}
                >
                  <img src="/assets/images/app-store-badge.png" alt="Download on the App Store" />
                </a>
              </div>
            )}
            
            {isAndroid && (
              <div className="download-option android">
                <a 
                  href="https://play.google.com/store/apps/details?id=com.solacetherapy.app" 
                  className="store-button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAppAction();
                  }}
                >
                  <img src="/assets/images/play-store-badge.png" alt="Get it on Google Play" />
                </a>
              </div>
            )}
            
            {!isIOS && !isAndroid && (
              <div className="download-options-generic">
                <a 
                  href="https://apps.apple.com/app/solace-therapy/id1234567890" 
                  className="store-button"
                >
                  <img src="/assets/images/app-store-badge.png" alt="Download on the App Store" />
                </a>
                
                <a 
                  href="https://play.google.com/store/apps/details?id=com.solacetherapy.app" 
                  className="store-button"
                >
                  <img src="/assets/images/play-store-badge.png" alt="Get it on Google Play" />
                </a>
              </div>
            )}
          </div>
          
          <div className="email-confirmation">
            <p>
              We've sent a confirmation email to <strong>{currentUser?.email}</strong> with instructions
              to verify your account and get started.
            </p>
            
            <div className="email-notice">
              <i className="fas fa-envelope"></i>
              <p>
                Don't see the email? Check your spam folder or
                <button 
                  className="text-button"
                  onClick={() => {
                    // Resend verification email function would go here
                    alert('Verification email has been resent.');
                  }}
                >
                  click here to resend
                </button>
              </p>
            </div>
          </div>
          
          <div className="browser-option">
            <p>
              Go back to the? <a href="/">Home Page</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadAppPage;