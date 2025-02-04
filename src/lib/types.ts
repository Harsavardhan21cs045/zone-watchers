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