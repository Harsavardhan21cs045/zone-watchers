import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = 'https://iqxhvxjzwjxvvvwqxcxr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxeGh2eGp6d2p4dnZ2d3F4Y3hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY4NzI2NjAsImV4cCI6MjAyMjQ0ODY2MH0.pFKDlqPKQJVhQGiGgEOxXiJzpJ0HQHPtQQwQU_FUoTM';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials are missing');
  throw new Error('Missing Supabase credentials');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

// Log connection status
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event);
  console.log('Session status:', session ? 'active' : 'none');
});

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