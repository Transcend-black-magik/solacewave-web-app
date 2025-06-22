import React, { useState, useEffect } from 'react';
import { getUpcomingSession } from '../../services/firestoreService';
import { useAuth } from '../../contexts/AuthContext';

const UpcomingSession = ({ therapist }) => {
  const { currentUser } = useAuth();
  const [upcomingSession, setUpcomingSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUpcomingSession = async () => {
      if (!currentUser?.uid) return;
      
      try {
        setLoading(true);
        // Use a placeholder implementation since the real service function isn't defined yet
        // In a real implementation, you'd replace this with the actual API call
        
        // Mock implementation for demo purposes
        setTimeout(() => {
          const mockSession = {
            id: 'session123',
            date: new Date(Date.now() + 86400000), // Tomorrow
            startTime: '14:00',
            endTime: '14:50',
            type: 'video',
            notes: 'Follow-up on last week\'s discussion about anxiety management techniques.',
            isConfirmed: true,
            therapistId: therapist?.id || 'unknown'
          };
          
          setUpcomingSession(mockSession);
          setLoading(false);
        }, 800);
        
        // Real implementation would be like:
        // const { success, data, error } = await getUpcomingSession(currentUser.uid);
        // if (success && data) {
        //   setUpcomingSession(data);
        // } else {
        //   setError(error || 'No upcoming sessions found');
        // }
      } catch (err) {
        console.error('Error fetching upcoming session:', err);
        setError('Failed to load your upcoming session');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUpcomingSession();
  }, [currentUser, therapist]);
  
  // Format date
  const formatSessionDate = (date) => {
    if (!date) return '';
    
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Format time
  const formatSessionTime = (startTime, endTime) => {
    if (!startTime || !endTime) return '';
    
    return `${startTime} - ${endTime}`;
  };
  
  // Get session icon
  const getSessionTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return 'fas fa-video';
      case 'audio':
        return 'fas fa-phone-alt';
      case 'chat':
        return 'fas fa-comments';
      default:
        return 'fas fa-calendar-check';
    }
  };
  
  // Calculate time remaining
  const getTimeRemaining = (sessionDate) => {
    if (!sessionDate) return '';
    
    const now = new Date();
    const diffMs = sessionDate.getTime() - now.getTime();
    
    if (diffMs < 0) return 'Past due';
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) {
      return `in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    } else {
      return `in ${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
    }
  };

  if (loading) {
    return (
      <div className="session-loading">
        <div className="loading-spinner small"></div>
        <p>Loading your next session...</p>
      </div>
    );
  }
  
  if (error || !upcomingSession) {
    return (
      <div className="no-session-message">
        <div className="message-icon">
          <i className="fas fa-calendar"></i>
        </div>
        <div className="message-content">
          <h3>No upcoming sessions</h3>
          <p>You don't have any scheduled sessions. Book your next appointment now.</p>
          <button className="btn btn-primary">Schedule Session</button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="upcoming-session">
      <div className="session-header">
        <div className="session-type">
          <i className={getSessionTypeIcon(upcomingSession.type)}></i>
          <span>{upcomingSession.type.charAt(0).toUpperCase() + upcomingSession.type.slice(1)} Session</span>
        </div>
        <div className="session-time-remaining">
          {getTimeRemaining(upcomingSession.date)}
        </div>
      </div>
      
      <div className="session-details">
        <div className="session-calendar">
          <div className="calendar-date">
            <div className="calendar-month">
              {upcomingSession.date.toLocaleDateString('en-US', { month: 'short' })}
            </div>
            <div className="calendar-day">
              {upcomingSession.date.getDate()}
            </div>
            <div className="calendar-weekday">
              {upcomingSession.date.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
          </div>
        </div>
        
        <div className="session-info">
          <div className="session-date-time">
            <h3>{formatSessionDate(upcomingSession.date)}</h3>
            <p>{formatSessionTime(upcomingSession.startTime, upcomingSession.endTime)}</p>
          </div>
          
          <div className="session-therapist">
            <div className="therapist-avatar">
              {therapist?.profileImageUrl ? (
                <img src={therapist.profileImageUrl} alt={therapist.name} />
              ) : (
                <div className="avatar-placeholder">
                  {therapist?.name?.charAt(0) || 'T'}
                </div>
              )}
            </div>
            <div className="therapist-info">
              <h4>With {therapist?.name || 'Your Therapist'}</h4>
              <p>{therapist?.title || 'Licensed Therapist'}</p>
            </div>
          </div>
          
          {upcomingSession.notes && (
            <div className="session-notes">
              <h4>Session Notes</h4>
              <p>{upcomingSession.notes}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="session-actions">
        <button className="btn btn-primary">
          <i className="fas fa-video"></i>
          Join Session
        </button>
        <button className="btn btn-outline">
          <i className="fas fa-calendar-alt"></i>
          Reschedule
        </button>
        <button className="btn btn-outline">
          <i className="fas fa-times"></i>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UpcomingSession;