import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDZ1Q9C2J2WqL3V4u9n5wLgPVGxo3M8XD4",
  authDomain: "bandobast-police.firebaseapp.com",
  projectId: "bandobast-police",
  storageBucket: "bandobast-police.appspot.com",
  messagingSenderId: "458796531234",
  appId: "1:458796531234:web:a1b2c3d4e5f6g7h8i9j0k1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Test database connection
const testConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    const officialsRef = collection(db, 'officials');
    const snapshot = await getDocs(officialsRef);
    console.log('Firebase connection test successful:', snapshot.size, 'officials found');
  } catch (err) {
    console.error('Firebase connection error:', err);
  }
};

testConnection();

// Helper functions for data operations
export const getOfficials = async () => {
  try {
    const officialsRef = collection(db, 'officials');
    const snapshot = await getDocs(officialsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching officials:', error);
    throw error;
  }
};

export const subscribeToOfficials = (callback: (officials: any[]) => void) => {
  const officialsRef = collection(db, 'officials');
  return onSnapshot(officialsRef, (snapshot) => {
    const officials = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(officials);
  });
};