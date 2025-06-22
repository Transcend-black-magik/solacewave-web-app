import React from 'react';

const TherapistDetails = ({ therapist }) => {
  if (!therapist) {
    return (
      <div className="loading-therapist">
        <div className="loading-spinner small"></div>
        <p>Loading therapist information...</p>
      </div>
    );
  }
  
  // Format therapist specializations as comma-separated list
  const formatSpecializations = (specializations) => {
    if (!specializations || !specializations.length) return 'General Therapy';
    
    return specializations.join(', ');
  };
  
  // Format therapist experience
  const formatExperience = (years) => {
    if (!years) return '';
    
    return `${years} year${years !== 1 ? 's' : ''} experience`;
  };

  return (
    <div className="therapist-details-card">
      <div className="therapist-header">
        <div className="therapist-avatar">
          {therapist.profileImageUrl ? (
            <img src={therapist.profileImageUrl} alt={therapist.name} />
          ) : (
            <div className="avatar-placeholder">
              {therapist.name?.charAt(0) || 'T'}
            </div>
          )}
        </div>
        
        <div className="therapist-basic-info">
          <h3>{therapist.name}</h3>
          <p className="therapist-title">{therapist.title}</p>
          <p className="therapist-exp">{formatExperience(therapist.yearsExperience)}</p>
          
          <div className="therapist-badges">
            {therapist.isAcceptingNew && (
              <span className="badge accepting">Accepting New Clients</span>
            )}
            {therapist.languages?.length > 1 && (
              <span className="badge multilingual">
                <i className="fas fa-language"></i>
                Multilingual
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="therapist-body">
        <div className="therapist-info-section">
          <h4>About</h4>
          <p>{therapist.bio || 'No bio provided'}</p>
        </div>
        
        <div className="therapist-info-section">
          <h4>Specializations</h4>
          <p>{formatSpecializations(therapist.specializations)}</p>
          
          <div className="specialization-tags">
            {therapist.specializations?.map((specialty, index) => (
              <span key={index} className="specialty-tag">
                {specialty}
              </span>
            ))}
          </div>
        </div>
        
        <div className="therapist-info-section">
          <h4>Approaches</h4>
          <div className="approach-tags">
            {therapist.approaches?.map((approach, index) => (
              <span key={index} className="approach-tag">
                {approach}
              </span>
            ))}
          </div>
        </div>
        
        <div className="therapist-info-row">
          <div className="therapist-info-col">
            <h4>Education</h4>
            <p>{therapist.education || 'Information not provided'}</p>
          </div>
          
          <div className="therapist-info-col">
            <h4>License</h4>
            <p>{therapist.licenseNumber || 'Information not provided'}</p>
          </div>
        </div>
      </div>
      
      <div className="therapist-actions">
        <button className="btn btn-primary">
          <i className="fas fa-calendar-plus"></i>
          Schedule Session
        </button>
        <button className="btn btn-outline">
          <i className="fas fa-comments"></i>
          Message
        </button>
        <button className="btn btn-outline">
          <i className="fas fa-user"></i>
          View Full Profile
        </button>
      </div>
    </div>
  );
};

export default TherapistDetails;