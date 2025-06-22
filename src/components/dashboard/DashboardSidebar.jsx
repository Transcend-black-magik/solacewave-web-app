import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const DashboardSidebar = ({ activeTab, onTabChange }) => {
  const { signOut, userProfile } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect happens automatically through auth observer
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <div className="dashboard-sidebar">
      <div className="sidebar-header">
        <div className="user-avatar">
          {userProfile?.profileImageUrl ? (
            <img src={userProfile.profileImageUrl} alt={userProfile.fullName} />
          ) : (
            <div className="avatar-placeholder">
              {userProfile?.fullName?.charAt(0) || '?'}
            </div>
          )}
        </div>
        <div className="user-info">
          <h3>{userProfile?.fullName}</h3>
          <p>Client</p>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <button
              className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => onTabChange('home')}
            >
              <i className="fas fa-home"></i>
              <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button
              className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => onTabChange('messages')}
            >
              <i className="fas fa-comments"></i>
              <span>Messages</span>
              {userProfile?.unreadMessageCount > 0 && (
                <span className="badge">{userProfile.unreadMessageCount}</span>
              )}
            </button>
          </li>
          <li>
            <button
              className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
              onClick={() => onTabChange('appointments')}
            >
              <i className="fas fa-calendar-alt"></i>
              <span>Appointments</span>
              {userProfile?.upcomingAppointments > 0 && (
                <span className="badge">{userProfile.upcomingAppointments}</span>
              )}
            </button>
          </li>
          <li>
            <button
              className={`nav-item ${activeTab === 'resources' ? 'active' : ''}`}
              onClick={() => onTabChange('resources')}
            >
              <i className="fas fa-book"></i>
              <span>Resources</span>
              {userProfile?.newResources > 0 && (
                <span className="badge">{userProfile.newResources}</span>
              )}
            </button>
          </li>
          <li>
            <button
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => onTabChange('settings')}
            >
              <i className="fas fa-cog"></i>
              <span>Settings</span>
            </button>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <button className="sidebar-help">
          <i className="fas fa-question-circle"></i>
          <span>Help Center</span>
        </button>
        
        <button className="sidebar-logout" onClick={handleSignOut}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;