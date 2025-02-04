import { createClient } from '@supabase/supabase-js';

// Define all types
export interface Official {
  id: string;
  name: string;
  status: string;
  current_location?: [number, number] | null;
  last_updated?: string;
}

export interface Task {
  id: string;
  title: string;
  location: [number, number];
  status: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);