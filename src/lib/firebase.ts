import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs, onSnapshot } from 'firebase/firestore';
import type { Official } from './supabase';

const firebaseConfig = {
  apiKey: "AIzaSyDZ1Q9C2J2WqL3V4u9n5wLgPVGxo3M8XD4",
  authDomain: "bandobast-police.firebaseapp.com",
  projectId: "bandobast-police",
  storageBucket: "bandobast-police.appspot.com",
  messagingSenderId: "458796531234",
  appId: "1:458796531234:web:a1b2c3d4e5f6g7h8i9j0k1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

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

export const getOfficials = async (): Promise<Official[]> => {
  try {
    const officialsRef = collection(db, 'officials');
    const snapshot = await getDocs(officialsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Official[];
  } catch (error) {
    console.error('Error fetching officials:', error);
    throw error;
  }
};

export const subscribeToOfficials = (callback: (officials: Official[]) => void) => {
  const officialsRef = collection(db, 'officials');
  return onSnapshot(officialsRef, (snapshot) => {
    const officials = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Official[];
    callback(officials);
  });
};