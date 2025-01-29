import { Official } from '../lib/supabase';

export const mockOfficials: Official[] = [
  {
    id: '1',
    name: 'Officer Kumar',
    current_location: [80.2707, 13.0827],
    status: 'on-duty',
    last_updated: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Officer Priya',
    current_location: [80.2597, 13.0527],
    status: 'on-duty',
    last_updated: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Officer Raj',
    current_location: [80.2697, 13.0627],
    status: 'off-duty',
    last_updated: new Date().toISOString()
  }
];