import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { Official } from './types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const getOfficials = async (): Promise<Official[]> => {
  console.log('Fetching officials from Firestore...');
  const querySnapshot = await getDocs(collection(db, 'officials'));
  return querySnapshot.docs.map(doc => ({ 
    id: doc.id, 
    ...doc.data() 
  })) as Official[];
};

export const subscribeToOfficials = (callback: (officials: Official[]) => void) => {
  console.log('Setting up real-time subscription to officials...');
  return onSnapshot(collection(db, 'officials'), (snapshot) => {
    const officials = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Official[];
    callback(officials);
  });
};