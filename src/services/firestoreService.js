import { 
    collection, 
    addDoc, 
    doc, 
    getDoc, 
    getDocs, 
    //setDoc, 
    updateDoc, 
    query, 
    where, 
    orderBy,
    limit,
    serverTimestamp,
    Timestamp
  } from 'firebase/firestore';
  import { firestore } from '../config/firebase';
  
  // User Management
  export const saveUserResponses = async (userId, responses) => {
    try {
      // Create a reference to the user's document
      const userDocRef = doc(firestore, 'users', userId);
      
      // Add the questionnaire responses to the user document
      await updateDoc(userDocRef, {
        questionnaireResponses: responses,
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error saving user responses:', error);
      return { success: false, error };
    }
  };
  
  export const createNewUser = async (userData) => {
    try {
      // Create a new user document with provided data
      const userRef = collection(firestore, 'users');
      const newUser = {
        ...userData,
        isActive: true,
        isBlocked: false,
        isEmailVerified: false,
        isMatched: false,
        currentTherapistId: null,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        deviceTokens: [],
        medicalHistory: null,
        emergencyContact: null,
        additionalInfo: null,
        preferences: {
          notifications: true,
          emailReminders: true,
          smsReminders: false,
          darkMode: false,
          language: 'en'
        }
      };
      
      const docRef = await addDoc(userRef, newUser);
      return { success: true, userId: docRef.id };
    } catch (error) {
      console.error('Error creating new user:', error);
      return { success: false, error };
    }
  };
  
  export const getUserById = async (userId) => {
    try {
      const userDocRef = doc(firestore, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        return { success: true, data: { id: userDoc.id, ...userDoc.data() } };
      } else {
        return { success: false, error: 'User not found' };
      }
    } catch (error) {
      console.error('Error getting user:', error);
      return { success: false, error };
    }
  };
  
  export const updateUserProfile = async (userId, profileData) => {
    try {
      const userDocRef = doc(firestore, 'users', userId);
      await updateDoc(userDocRef, {
        ...profileData,
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error };
    }
  };
  
  // Therapist Management
  export const getAvailableTherapists = async (filters = {}) => {
    try {
      const therapistsRef = collection(firestore, 'therapists');
      let therapistsQuery = query(therapistsRef, where('isActive', '==', true));
      
      // Add additional filters if provided
      if (filters.specialization) {
        therapistsQuery = query(therapistsQuery, where('specializations', 'array-contains', filters.specialization));
      }
      
      if (filters.gender) {
        therapistsQuery = query(therapistsQuery, where('gender', '==', filters.gender));
      }
      
      if (filters.religion) {
        therapistsQuery = query(therapistsQuery, where('religion', '==', filters.religion));
      }
      
      const querySnapshot = await getDocs(therapistsQuery);
      const therapists = [];
      
      querySnapshot.forEach((doc) => {
        therapists.push({ id: doc.id, ...doc.data() });
      });
      
      return { success: true, data: therapists };
    } catch (error) {
      console.error('Error fetching therapists:', error);
      return { success: false, error };
    }
  };
  
  export const getTherapistById = async (therapistId) => {
    try {
      const therapistDocRef = doc(firestore, 'therapists', therapistId);
      const therapistDoc = await getDoc(therapistDocRef);
      
      if (therapistDoc.exists()) {
        return { success: true, data: { id: therapistDoc.id, ...therapistDoc.data() } };
      } else {
        return { success: false, error: 'Therapist not found' };
      }
    } catch (error) {
      console.error('Error getting therapist:', error);
      return { success: false, error };
    }
  };
  
  // Appointments Management
  export const getAppointments = async (userId, therapistId = null) => {
    try {
      const appointmentsRef = collection(firestore, 'appointments');
      let appointmentsQuery;
      
      if (therapistId) {
        appointmentsQuery = query(
          appointmentsRef,
          where('clientId', '==', userId),
          where('therapistId', '==', therapistId),
          orderBy('date', 'asc')
        );
      } else {
        appointmentsQuery = query(
          appointmentsRef,
          where('clientId', '==', userId),
          orderBy('date', 'asc')
        );
      }
      
      const querySnapshot = await getDocs(appointmentsQuery);
      const appointments = [];
      
      querySnapshot.forEach((doc) => {
        appointments.push({ id: doc.id, ...doc.data() });
      });
      
      return { success: true, data: appointments };
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return { success: false, error };
    }
  };
  
  export const getUpcomingSession = async (userId) => {
    try {
      const appointmentsRef = collection(firestore, 'appointments');
      const now = new Date();
      
      const appointmentsQuery = query(
        appointmentsRef,
        where('clientId', '==', userId),
        where('date', '>=', now),
        orderBy('date', 'asc'),
        limit(1)
      );
      
      const querySnapshot = await getDocs(appointmentsQuery);
      
      if (querySnapshot.empty) {
        return { success: true, data: null };
      }
      
      const appointment = { 
        id: querySnapshot.docs[0].id, 
        ...querySnapshot.docs[0].data() 
      };
      
      return { success: true, data: appointment };
    } catch (error) {
      console.error('Error fetching upcoming session:', error);
      return { success: false, error };
    }
  };
  
  export const bookAppointment = async (appointmentData) => {
    try {
      const appointmentsRef = collection(firestore, 'appointments');
      
      // Format the date to Firestore timestamp
      const formattedAppointment = {
        ...appointmentData,
        date: appointmentData.date instanceof Date ? 
          Timestamp.fromDate(appointmentData.date) : appointmentData.date,
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(appointmentsRef, formattedAppointment);
      
      return { success: true, appointmentId: docRef.id };
    } catch (error) {
      console.error('Error booking appointment:', error);
      return { success: false, error };
    }
  };
  
  export const getTherapistAvailability = async (therapistId) => {
    try {
      const therapistDocRef = doc(firestore, 'therapists', therapistId);
      const therapistDoc = await getDoc(therapistDocRef);
      
      if (therapistDoc.exists()) {
        const therapistData = therapistDoc.data();
        
        if (therapistData.availability) {
          return { success: true, data: therapistData.availability };
        } else {
          return { success: false, error: 'No availability found for this therapist' };
        }
      } else {
        return { success: false, error: 'Therapist not found' };
      }
    } catch (error) {
      console.error('Error getting therapist availability:', error);
      return { success: false, error };
    }
  };
  
  // Messages Management
  export const getMessages = async (userId, therapistId) => {
    try {
      const messagesRef = collection(firestore, 'messages');
      const messagesQuery = query(
        messagesRef,
        where('participants', 'array-contains', userId),
        where('therapistId', '==', therapistId),
        orderBy('timestamp', 'asc')
      );
      
      const querySnapshot = await getDocs(messagesQuery);
      const messages = [];
      
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      
      return { success: true, data: messages };
    } catch (error) {
      console.error('Error fetching messages:', error);
      return { success: false, error };
    }
  };
  
  export const sendMessage = async (messageData) => {
    try {
      const messagesRef = collection(firestore, 'messages');
      
      // Add participants array for easier querying
      const formattedMessage = {
        ...messageData,
        participants: [messageData.senderId, messageData.recipientId],
        timestamp: serverTimestamp()
      };
      
      const docRef = await addDoc(messagesRef, formattedMessage);
      
      return { success: true, messageId: docRef.id };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error };
    }
  };
  
  // Resources Management
  export const getUserResources = async (userId) => {
    try {
      const resourcesRef = collection(firestore, 'resources');
      const resourcesQuery = query(
        resourcesRef,
        where('assignedTo', '==', userId),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(resourcesQuery);
      const resources = [];
      
      querySnapshot.forEach((doc) => {
        resources.push({ id: doc.id, ...doc.data() });
      });
      
      return { success: true, data: resources };
    } catch (error) {
      console.error('Error fetching resources:', error);
      return { success: false, error };
    }
  };
  
  export const updateResourceStatus = async (resourceId, userId, statusData) => {
    try {
      const resourceDocRef = doc(firestore, 'resources', resourceId);
      
      await updateDoc(resourceDocRef, {
        ...statusData,
        lastUpdated: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating resource status:', error);
      return { success: false, error };
    }
  };
  
  // Password Management
  export const updateUserPassword = async (userId, newPassword) => {
    // Note: Password updates should be done through Firebase Auth
    // This is a placeholder function for completeness
    return { 
      success: false, 
      error: 'Password updates should be handled through Firebase Authentication' 
    };
  };