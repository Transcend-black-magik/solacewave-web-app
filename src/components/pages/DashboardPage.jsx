import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getTherapistById } from '../../services/firestoreService';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import DashboardSidebar from '../dashboard/DashboardSidebar';
import UpcomingSession from '../dashboard/UpcomingSession';
import TherapistDetails from '../dashboard/TherapistDetails';
import MessageThread from '../dashboard/MessageThread';
import AppointmentCalendar from '../dashboard/AppointmentCalendar';
import ResourceList from '../dashboard/ResourceList';
import ProfileSettings from '../dashboard/ProfileSettings';
import '../../styles/components/dashboard-page.css';

const DashboardPage = () => {
  const { userProfile, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch therapist data if user is matched
  useEffect(() => {
    const fetchTherapistData = async () => {
      if (userProfile?.currentTherapistId) {
        try {
          setLoading(true);
          const { success, data, error } = await getTherapistById(userProfile.currentTherapistId);
          
          if (success && data) {
            setTherapist(data);
          } else {
            setError(error || 'Failed to fetch therapist details');
          }
        } catch (err) {
          console.error('Error fetching therapist:', err);
          setError('An unexpected error occurred');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    fetchTherapistData();
  }, [userProfile]);
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="dashboard-page">
      <Header />
      
      <main className="dashboard-content">
        <div className="container">
          <div className="dashboard-welcome">
            <h1>Welcome, {userProfile?.fullName || currentUser?.displayName || 'Client'}</h1>
            <p className="dashboard-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          
          <div className="dashboard-container">
            <DashboardSidebar activeTab={activeTab} onTabChange={handleTabChange} />
            
            <div className="dashboard-main">
              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading your dashboard...</p>
                </div>
              ) : error ? (
                <div className="error-message general-error">
                  <p>{error}</p>
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  {activeTab === 'home' && (
                    <div className="dashboard-home">
                      <div className="dashboard-section">
                        <h2 className="section-title">Your Next Session</h2>
                        {userProfile?.isMatched ? (
                          <UpcomingSession therapist={therapist} />
                        ) : (
                          <div className="no-sessions-message">
                            <div className="message-icon">
                              <i className="fas fa-user-clock"></i>
                            </div>
                            <div className="message-content">
                              <h3>You're not matched with a therapist yet</h3>
                              <p>
                                Once you're matched with a therapist, you'll be able to schedule
                                sessions and start your therapy journey.
                              </p>
                              <button className="btn btn-primary">Find a Therapist</button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {userProfile?.isMatched && (
                        <div className="dashboard-section">
                          <h2 className="section-title">Your Therapist</h2>
                          <TherapistDetails therapist={therapist} />
                        </div>
                      )}
                      
                      <div className="dashboard-section dashboard-stats">
                        <div className="stat-card">
                          <div className="stat-icon">
                            <i className="fas fa-calendar-check"></i>
                          </div>
                          <div className="stat-content">
                            <h3>Total Sessions</h3>
                            <p className="stat-value">{userProfile?.sessionCount || 0}</p>
                          </div>
                        </div>
                        
                        <div className="stat-card">
                          <div className="stat-icon">
                            <i className="fas fa-comments"></i>
                          </div>
                          <div className="stat-content">
                            <h3>Messages</h3>
                            <p className="stat-value">{userProfile?.messageCount || 0}</p>
                          </div>
                        </div>
                        
                        <div className="stat-card">
                          <div className="stat-icon">
                            <i className="fas fa-file-alt"></i>
                          </div>
                          <div className="stat-content">
                            <h3>Resources</h3>
                            <p className="stat-value">{userProfile?.resourceCount || 0}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'messages' && (
                    <div className="dashboard-messages">
                      <h2 className="section-title">Messages</h2>
                      {userProfile?.isMatched ? (
                        <MessageThread therapist={therapist} userId={currentUser.uid} />
                      ) : (
                        <div className="no-messages-message">
                          <div className="message-icon">
                            <i className="fas fa-comments"></i>
                          </div>
                          <div className="message-content">
                            <h3>No message thread yet</h3>
                            <p>
                              Once you're matched with a therapist, you'll be able to send
                              messages and communicate securely.
                            </p>
                            <button className="btn btn-primary">Find a Therapist</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {activeTab === 'appointments' && (
                    <div className="dashboard-appointments">
                      <h2 className="section-title">Manage Appointments</h2>
                      {userProfile?.isMatched ? (
                        <AppointmentCalendar therapist={therapist} userId={currentUser.uid} />
                      ) : (
                        <div className="no-appointments-message">
                          <div className="message-icon">
                            <i className="fas fa-calendar-alt"></i>
                          </div>
                          <div className="message-content">
                            <h3>No appointments yet</h3>
                            <p>
                              Once you're matched with a therapist, you'll be able to schedule
                              and manage your therapy sessions.
                            </p>
                            <button className="btn btn-primary">Find a Therapist</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {activeTab === 'resources' && (
                    <div className="dashboard-resources">
                      <h2 className="section-title">Your Resources</h2>
                      <ResourceList userId={currentUser.uid} />
                    </div>
                  )}
                  
                  {activeTab === 'settings' && (
                    <div className="dashboard-settings">
                      <h2 className="section-title">Profile Settings</h2>
                      <ProfileSettings user={userProfile} currentUser={currentUser} />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DashboardPage;