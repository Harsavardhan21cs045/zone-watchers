import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials are missing. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are properly set.');
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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