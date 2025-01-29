import React, { useEffect } from 'react';
import { MapComponent } from '../components/MapComponent';
import { OfficialsList } from '../components/OfficialsList';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase, type Task, type Official } from '../lib/supabase';

const ControllerApp = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch officials with location tracking
  const { data: officials = [], error: officialsError } = useQuery<Official[]>({
    queryKey: ['officials'],
    queryFn: async () => {
      console.log('Fetching officials...');
      const { data, error } = await supabase
        .from('officials')
        .select('*')
        .order('last_updated', { ascending: false });
      
      if (error) {
        console.error('Error fetching officials:', error);
        throw error;
      }
      console.log('Officials fetched:', data);
      return data || [];
    },
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  // Fetch tasks
  const { data: tasks = [], error: tasksError } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      console.log('Fetching tasks...');
      const { data, error } = await supabase
        .from('tasks')
        .select('*');
      
      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }
      console.log('Tasks fetched:', data);
      return data || [];
    },
  });

  // Show errors if any
  useEffect(() => {
    if (officialsError) {
      toast({
        title: "Error fetching officials",
        description: officialsError.message,
        variant: "destructive"
      });
    }
    if (tasksError) {
      toast({
        title: "Error fetching tasks",
        description: tasksError.message,
        variant: "destructive"
      });
    }
  }, [officialsError, tasksError, toast]);

  // Subscribe to real-time updates
  useEffect(() => {
    console.log('Setting up real-time subscriptions...');
    const officialsSubscription = supabase
      .channel('officials-channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'officials' },
        (payload) => {
          console.log('Officials update received:', payload);
          queryClient.invalidateQueries({ queryKey: ['officials'] });
        }
      )
      .subscribe();

    const tasksSubscription = supabase
      .channel('tasks-channel')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        (payload) => {
          console.log('Tasks update received:', payload);
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up subscriptions...');
      officialsSubscription.unsubscribe();
      tasksSubscription.unsubscribe();
    };
  }, [queryClient]);

  const handleZoneViolation = (officialId: string) => {
    const official = officials.find(o => o.id === officialId);
    if (official) {
      toast({
        title: "Zone Violation Alert",
        description: `${official.name} is outside their assigned zone`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-white p-4 shadow-lg overflow-y-auto">
        <h1 className="text-2xl font-bold text-bandobast-primary mb-4">Controller Dashboard</h1>
        <OfficialsList officials={officials} showLocation={true} />
      </div>
      <div className="w-3/4">
        <MapComponent 
          officials={officials.map(official => ({
            id: official.id,
            name: official.name,
            location: official.current_location || [80.2707, 13.0827],
            status: official.status
          }))} 
          onZoneViolation={handleZoneViolation} 
        />
      </div>
    </div>
  );
};

export default ControllerApp;