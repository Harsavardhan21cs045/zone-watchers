import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = 'https://iqxhvxjzwjxvvvwqxcxr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxeGh2eGp6d2p4dnZ2d3F4Y3hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY4NzI2NjAsImV4cCI6MjAyMjQ0ODY2MH0.pFKDlqPKQJVhQGiGgEOxXiJzpJ0HQHPtQQwQU_FUoTM';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials are missing');
  throw new Error('Missing Supabase credentials');
}

// Create Supabase client with additional options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  }
});

// Log connection status and add error handling
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event);
  console.log('Session status:', session ? 'active' : 'none');
});

// Test database connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('officials').select('*').limit(1);
    if (error) {
      console.error('Database connection test failed:', error);
    } else {
      console.log('Database connection test successful');
    }
  } catch (err) {
    console.error('Connection error:', err);
  }
};

testConnection();

export type Task = {
  id: string;
  title: string;
  location: [number, number];
  status: 'pending' | 'in-progress' | 'completed';
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
};

export type Official = {
  id: string;
  name: string;
  current_location: [number, number] | null;
  status: 'on-duty' | 'off-duty';
  last_updated: string;
};