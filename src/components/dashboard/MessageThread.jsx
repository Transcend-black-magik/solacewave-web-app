import React, { useState, useEffect, useRef } from 'react';
import { getMessages, sendMessage } from '../../services/firestoreService';
import { format } from 'date-fns';

const MessageThread = ({ therapist, userId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);
  
  // For demo purposes, creating mock messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        // In a real implementation, you'd fetch actual messages from Firestore
        
        // Mock implementation for demo purposes
        setTimeout(() => {
          const now = new Date();
          const mockMessages = [
            {
              id: 'm1',
              senderId: therapist?.id || 'therapist123',
              recipientId: userId,
              content: 'Hello! How have you been feeling since our last session?',
              timestamp: new Date(now.getTime() - 86400000 * 2), // 2 days ago
              read: true,
              senderType: 'therapist'
            },
            {
              id: 'm2',
              senderId: userId,
              recipientId: therapist?.id || 'therapist123',
              content: 'I\'ve been practicing those breathing exercises you suggested, and they\'ve been helping with my anxiety.',
              timestamp: new Date(now.getTime() - 86400000 * 2 + 3600000), // 2 days ago + 1 hour
              read: true,
              senderType: 'client'
            },
            {
              id: 'm3',
              senderId: therapist?.id || 'therapist123',
              recipientId: userId,
              content: 'That\'s great to hear! Consistent practice can make a big difference. Have you noticed any specific situations where they\'ve been most effective?',
              timestamp: new Date(now.getTime() - 86400000), // 1 day ago
              read: true,
              senderType: 'therapist'
            },
            {
              id: 'm4',
              senderId: userId,
              recipientId: therapist?.id || 'therapist123',
              content: 'Definitely during work meetings. I used to get really anxious before speaking, but taking a moment to breathe has helped me stay more centered.',
              timestamp: new Date(now.getTime() - 86400000 + 1800000), // 1 day ago + 30 minutes
              read: true,
              senderType: 'client'
            },
            {
              id: 'm5',
              senderId: therapist?.id || 'therapist123',
              recipientId: userId,
              content: 'That\'s excellent progress! We should discuss this more in our next session. Is there anything specific you\'d like to focus on when we meet tomorrow?',
              timestamp: new Date(now.getTime() - 3600000), // 1 hour ago
              read: false,
              senderType: 'therapist'
            }
          ];
          
          setMessages(mockMessages);
          setLoading(false);
        }, 1000);
        
        // Real implementation would be like:
        // const { success, data, error } = await getMessages(userId, therapist.id);
        // if (success && data) {
        //   setMessages(data);
        // } else {
        //   setError(error || 'Failed to load messages');
        // }
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load your message thread');
      } finally {
        setLoading(false);
      }
    };
    
    if (userId && therapist) {
      fetchMessages();
    }
  }, [userId, therapist]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Format message timestamp
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const messageDate = new Date(timestamp);
    
    // If same day, show time
    if (
      messageDate.getDate() === now.getDate() &&
      messageDate.getMonth() === now.getMonth() &&
      messageDate.getFullYear() === now.getFullYear()
    ) {
      return format(messageDate, 'h:mm a');
    }
    
    // If yesterday, show "Yesterday"
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (
      messageDate.getDate() === yesterday.getDate() &&
      messageDate.getMonth() === yesterday.getMonth() &&
      messageDate.getFullYear() === yesterday.getFullYear()
    ) {
      return 'Yesterday at ' + format(messageDate, 'h:mm a');
    }
    
    // If within last 7 days, show day of week
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 6);
    if (messageDate >= weekAgo) {
      return format(messageDate, 'EEEE') + ' at ' + format(messageDate, 'h:mm a');
    }
    
    // Otherwise show full date
    return format(messageDate, 'MMM d, yyyy') + ' at ' + format(messageDate, 'h:mm a');
  };
  
  // Handle message input change
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };
  
  // Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    try {
      setSending(true);
      
      // Create message object
      const messageData = {
        senderId: userId,
        recipientId: therapist.id,
        content: newMessage.trim(),
        timestamp: new Date(),
        read: false,
        senderType: 'client'
      };
      
      // In a real implementation, you'd send to Firestore
      // For demo, just add to local state
      setMessages(prev => [...prev, { ...messageData, id: `temp-${Date.now()}` }]);
      
      // Real implementation would be:
      // const { success, data, error } = await sendMessage(messageData);
      // if (!success) {
      //   setError('Failed to send message');
      // }
      
      // Clear input after sending
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading messages...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="message-error">
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

  if (!messages.length) {
    return (
      <div className="no-messages">
        <div className="message-icon">
          <i className="fas fa-comments"></i>
        </div>
        <div className="message-content">
          <h3>No messages yet</h3>
          <p>Start a conversation with your therapist by sending a message.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="message-thread-container">
      <div className="message-thread-header">
        <div className="thread-therapist">
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
            <h3>{therapist?.name || 'Your Therapist'}</h3>
            <p>{therapist?.title || 'Licensed Therapist'}</p>
          </div>
        </div>
        <div className="thread-actions">
          <button className="btn btn-outline btn-sm">
            <i className="fas fa-video"></i>
            Start Video Call
          </button>
          <button className="btn btn-outline btn-sm">
            <i className="fas fa-info-circle"></i>
          </button>
        </div>
      </div>
      
      <div className="message-list" ref={messageContainerRef}>
        <div className="messages-date-separator">
          <span>Conversation started {format(new Date(messages[0].timestamp), 'MMMM d, yyyy')}</span>
        </div>
        
        {messages.map((message, index) => {
          const isClient = message.senderType === 'client';
          const showDate = index === 0 || 
            new Date(message.timestamp).getDate() !== new Date(messages[index - 1].timestamp).getDate();
          
          return (
            <React.Fragment key={message.id}>
              {showDate && index !== 0 && (
                <div className="messages-date-separator">
                  <span>{format(new Date(message.timestamp), 'MMMM d, yyyy')}</span>
                </div>
              )}
              
              <div className={`message-item ${isClient ? 'client-message' : 'therapist-message'}`}>
                <div className="message-content">
                  <div className="message-bubble">
                    <p>{message.content}</p>
                  </div>
                  <div className="message-meta">
                    <span className="message-time">{formatMessageTime(message.timestamp)}</span>
                    {isClient && (
                      <span className={`message-status ${message.read ? 'read' : 'sent'}`}>
                        <i className={`fas fa-${message.read ? 'check-double' : 'check'}`}></i>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form className="message-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={handleInputChange}
          disabled={sending}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={sending || !newMessage.trim()}
        >
          {sending ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <i className="fas fa-paper-plane"></i>
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageThread;