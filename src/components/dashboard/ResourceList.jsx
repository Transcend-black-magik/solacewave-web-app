import React, { useState, useEffect } from 'react';
import { getUserResources } from '../../services/firestoreService';

const ResourceList = ({ userId }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch resources from Firestore
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        // In a real implementation, you'd fetch actual resources from Firestore
        
        // Mock implementation for demo purposes
        setTimeout(() => {
          const mockResources = [
            {
              id: 'r1',
              title: 'Understanding Anxiety: A Guide to Symptoms and Coping Strategies',
              description: 'This comprehensive guide explains different types of anxiety disorders and offers practical strategies for managing symptoms.',
              type: 'article',
              url: '#',
              date: new Date(2025, 3, 15), // April 15, 2025
              read: false,
              tags: ['anxiety', 'mental health', 'coping strategies']
            },
            {
              id: 'r2',
              title: 'Deep Breathing Exercises for Stress Relief',
              description: 'A collection of breathing techniques that can help reduce stress and anxiety in just a few minutes.',
              type: 'video',
              url: '#',
              date: new Date(2025, 3, 20), // April 20, 2025
              read: true,
              tags: ['stress', 'breathing', 'relaxation']
            },
            {
              id: 'r3',
              title: 'Cognitive Distortions: Recognizing and Challenging Negative Thought Patterns',
              description: 'Learn to identify common cognitive distortions and how to challenge them using cognitive-behavioral techniques.',
              type: 'worksheet',
              url: '#',
              date: new Date(2025, 4, 1), // May 1, 2025
              read: false,
              tags: ['CBT', 'cognitive distortions', 'thought patterns']
            },
            {
              id: 'r4',
              title: 'Mindfulness Meditation for Beginners',
              description: 'A guided 10-minute meditation practice to help you develop mindfulness skills for everyday life.',
              type: 'audio',
              url: '#',
              date: new Date(2025, 4, 5), // May 5, 2025
              read: false,
              tags: ['mindfulness', 'meditation', 'stress reduction']
            }
          ];
          
          setResources(mockResources);
          setLoading(false);
        }, 1000);
        
        // Real implementation would be like:
        // const { success, data, error } = await getUserResources(userId);
        // if (success && data) {
        //   setResources(data);
        // } else {
        //   setError(error || 'Failed to load resources');
        // }
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('Failed to load your resources');
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchResources();
    }
  }, [userId]);
  
  // Filter resources based on active filter and search query
  const filteredResources = resources.filter(resource => {
    // Apply type filter
    if (activeFilter !== 'all' && resource.type !== activeFilter) {
      return false;
    }
    
    // Apply search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      return (
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  // Format resource date
  const formatResourceDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Get icon for resource type
  const getResourceIcon = (type) => {
    switch (type) {
      case 'article':
        return 'fas fa-file-alt';
      case 'video':
        return 'fas fa-video';
      case 'audio':
        return 'fas fa-headphones';
      case 'worksheet':
        return 'fas fa-tasks';
      default:
        return 'fas fa-file';
    }
  };
  
  // Mark resource as read
  const handleMarkAsRead = (resourceId) => {
    setResources(prevResources =>
      prevResources.map(resource =>
        resource.id === resourceId ? { ...resource, read: true } : resource
      )
    );
    
    // In a real implementation, update Firestore
    // const updateResult = await updateResourceStatus(resourceId, userId, { read: true });
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading resources...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="resource-error">
        <div className="error-message">
          <p>{error}</p>
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="resource-list-container">
      <div className="resource-controls">
        <div className="resource-search">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>
        
        <div className="resource-filters">
          <button
            className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-button ${activeFilter === 'article' ? 'active' : ''}`}
            onClick={() => setActiveFilter('article')}
          >
            <i className="fas fa-file-alt"></i>
            Articles
          </button>
          <button
            className={`filter-button ${activeFilter === 'video' ? 'active' : ''}`}
            onClick={() => setActiveFilter('video')}
          >
            <i className="fas fa-video"></i>
            Videos
          </button>
          <button
            className={`filter-button ${activeFilter === 'audio' ? 'active' : ''}`}
            onClick={() => setActiveFilter('audio')}
          >
            <i className="fas fa-headphones"></i>
            Audio
          </button>
          <button
            className={`filter-button ${activeFilter === 'worksheet' ? 'active' : ''}`}
            onClick={() => setActiveFilter('worksheet')}
          >
            <i className="fas fa-tasks"></i>
            Worksheets
          </button>
        </div>
      </div>
      
      {filteredResources.length === 0 ? (
        <div className="no-resources">
          <div className="message-icon">
            <i className="fas fa-book"></i>
          </div>
          <div className="message-content">
            <h3>No resources found</h3>
            <p>
              {searchQuery
                ? `No resources match your search for "${searchQuery}"`
                : `You don't have any ${activeFilter !== 'all' ? activeFilter : ''} resources yet`}
            </p>
          </div>
        </div>
      ) : (
        <div className="resource-grid">
          {filteredResources.map(resource => (
            <div 
              key={resource.id} 
              className={`resource-card ${!resource.read ? 'unread' : ''}`}
            >
              <div className="resource-type">
                <i className={getResourceIcon(resource.type)}></i>
                <span>{resource.type}</span>
              </div>
              
              <div className="resource-content">
                <h3 className="resource-title">{resource.title}</h3>
                <p className="resource-description">{resource.description}</p>
                
                <div className="resource-tags">
                  {resource.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
                
                <div className="resource-meta">
                  <span className="resource-date">
                    Added {formatResourceDate(resource.date)}
                  </span>
                  {!resource.read && (
                    <span className="new-badge">New</span>
                  )}
                </div>
              </div>
              
              <div className="resource-actions">
                <a href={resource.url} className="btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer">
                  {resource.type === 'article' ? 'Read' : 
                   resource.type === 'video' ? 'Watch' :
                   resource.type === 'audio' ? 'Listen' : 'View'}
                </a>
                
                {!resource.read && (
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => handleMarkAsRead(resource.id)}
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourceList;