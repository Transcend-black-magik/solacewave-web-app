import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCuOETA-7XJBlAP-Paf5Y90PmiFvYT3YvA",
    authDomain: "solacewave-15844.firebaseapp.com",
    projectId: "solacewave-15844",
    storageBucket: "solacewave-15844.firebasestorage.app",
    messagingSenderId: "963011451983",
    appId: "1:963011451983:web:7e22633ba9a083234b5e3a",
    measurementId: "G-N93S3YGZDQ"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { app, firestore, auth };