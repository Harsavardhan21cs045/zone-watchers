import { Official } from '@/lib/supabase';

export interface Official {
  id: string;
  name: string;
  status: string;
  current_location?: [number, number] | null;
  last_updated?: string;
}
