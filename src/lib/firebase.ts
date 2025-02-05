import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { Official } from './types';
import { supabase } from '@/integrations/supabase/client';

// Fetch Firebase config from Supabase secrets
const getFirebaseConfig = async () => {
  console.log('Fetching Firebase configuration...');
  try {
    const { data: apiKeyResponse, error: apiKeyError } = await supabase.functions.invoke('get-secret', { 
      body: { name: 'VITE_FIREBASE_API_KEY' } 
    });
    if (apiKeyError) throw new Error(`Failed to fetch API key: ${apiKeyError.message}`);

    const { data: authDomainResponse, error: authDomainError } = await supabase.functions.invoke('get-secret', { 
      body: { name: 'VITE_FIREBASE_AUTH_DOMAIN' } 
    });
    if (authDomainError) throw new Error(`Failed to fetch auth domain: ${authDomainError.message}`);

    const { data: projectIdResponse, error: projectIdError } = await supabase.functions.invoke('get-secret', { 
      body: { name: 'VITE_FIREBASE_PROJECT_ID' } 
    });
    if (projectIdError) throw new Error(`Failed to fetch project ID: ${projectIdError.message}`);

    const { data: storageBucketResponse, error: storageBucketError } = await supabase.functions.invoke('get-secret', { 
      body: { name: 'VITE_FIREBASE_STORAGE_BUCKET' } 
    });
    if (storageBucketError) throw new Error(`Failed to fetch storage bucket: ${storageBucketError.message}`);

    const { data: messagingSenderIdResponse, error: messagingSenderIdError } = await supabase.functions.invoke('get-secret', { 
      body: { name: 'VITE_FIREBASE_MESSAGING_SENDER_ID' } 
    });
    if (messagingSenderIdError) throw new Error(`Failed to fetch messaging sender ID: ${messagingSenderIdError.message}`);

    const { data: appIdResponse, error: appIdError } = await supabase.functions.invoke('get-secret', { 
      body: { name: 'VITE_FIREBASE_APP_ID' } 
    });
    if (appIdError) throw new Error(`Failed to fetch app ID: ${appIdError.message}`);

    return {
      apiKey: apiKeyResponse?.VITE_FIREBASE_API_KEY,
      authDomain: authDomainResponse?.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: projectIdResponse?.VITE_FIREBASE_PROJECT_ID,
      storageBucket: storageBucketResponse?.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: messagingSenderIdResponse?.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: appIdResponse?.VITE_FIREBASE_APP_ID,
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
    
    // Validate config
    const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
    const missingFields = requiredFields.filter(field => !config[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required Firebase configuration fields: ${missingFields.join(', ')}`);
    }

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