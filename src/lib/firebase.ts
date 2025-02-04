import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { Official } from './types';
import { supabase } from '@/integrations/supabase/client';

// Fetch Firebase config from Supabase secrets
const getFirebaseConfig = async () => {
  console.log('Fetching Firebase configuration...');
  try {
    const { data: { VITE_FIREBASE_API_KEY } } = await supabase.functions.invoke('get-secret', { body: { name: 'VITE_FIREBASE_API_KEY' } });
    const { data: { VITE_FIREBASE_AUTH_DOMAIN } } = await supabase.functions.invoke('get-secret', { body: { name: 'VITE_FIREBASE_AUTH_DOMAIN' } });
    const { data: { VITE_FIREBASE_PROJECT_ID } } = await supabase.functions.invoke('get-secret', { body: { name: 'VITE_FIREBASE_PROJECT_ID' } });
    const { data: { VITE_FIREBASE_STORAGE_BUCKET } } = await supabase.functions.invoke('get-secret', { body: { name: 'VITE_FIREBASE_STORAGE_BUCKET' } });
    const { data: { VITE_FIREBASE_MESSAGING_SENDER_ID } } = await supabase.functions.invoke('get-secret', { body: { name: 'VITE_FIREBASE_MESSAGING_SENDER_ID' } });
    const { data: { VITE_FIREBASE_APP_ID } } = await supabase.functions.invoke('get-secret', { body: { name: 'VITE_FIREBASE_APP_ID' } });

    return {
      apiKey: VITE_FIREBASE_API_KEY,
      authDomain: VITE_FIREBASE_AUTH_DOMAIN,
      projectId: VITE_FIREBASE_PROJECT_ID,
      storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: VITE_FIREBASE_APP_ID,
    };
  } catch (error) {
    console.error('Error fetching Firebase configuration:', error);
    throw new Error('Failed to load Firebase configuration');
  }
};

let app: any;
let auth: any;
let db: any;

// Initialize Firebase with async configuration
export const initializeFirebase = async () => {
  if (!app) {
    console.log('Initializing Firebase...');
    const config = await getFirebaseConfig();
    app = initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('Firebase initialized successfully');
  }
  return { app, auth, db };
};

export const getOfficials = async (): Promise<Official[]> => {
  const { db } = await initializeFirebase();
  console.log('Fetching officials from Firestore...');
  const querySnapshot = await getDocs(collection(db, 'officials'));
  return querySnapshot.docs.map(doc => ({ 
    id: doc.id, 
    ...doc.data() 
  })) as Official[];
};

export const subscribeToOfficials = async (callback: (officials: Official[]) => void) => {
  const { db } = await initializeFirebase();
  console.log('Setting up real-time subscription to officials...');
  return onSnapshot(collection(db, 'officials'), (snapshot) => {
    const officials = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Official[];
    callback(officials);
  });
};

// Export the initialization function instead of direct instances
export { auth, db };