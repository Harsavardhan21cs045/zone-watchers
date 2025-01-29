import { Task } from '../lib/supabase';

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Traffic Management at Anna Nagar',
    location: [80.2707, 13.0827],
    status: 'pending',
    assigned_to: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Crowd Control at T Nagar',
    location: [80.2597, 13.0527],
    status: 'in-progress',
    assigned_to: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Traffic Signal Maintenance at Adyar',
    location: [80.2697, 13.0627],
    status: 'pending',
    assigned_to: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];