import React, { useEffect } from 'react';
import { MapComponent } from '../components/MapComponent';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { TasksList } from '@/components/TasksList';
import { OfficialHeader } from '@/components/OfficialHeader';

const OfficialApp = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current official's data
  const { data: currentOfficial, isLoading: isLoadingOfficial, error: officialError } = useQuery({
    queryKey: ['currentOfficial'],
    queryFn: async () => {
      console.log('Fetching current official data...');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No authenticated user found');
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('officials')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching official:', error);
        throw error;
      }
      
      return data;
    }
  });

  // Fetch tasks assigned to the current official
  const { data: tasks = [], isLoading: isLoadingTasks } = useQuery({
    queryKey: ['officialTasks'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to', user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentOfficial
  });

  // Update location mutation
  const updateLocation = useMutation({
    mutationFn: async (location: [number, number]) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('officials')
        .update({ 
          current_location: location, 
          last_updated: new Date().toISOString() 
        })
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentOfficial'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update location",
        variant: "destructive"
      });
    }
  });

  // Simulate location updates
  useEffect(() => {
    if (!currentOfficial?.current_location) return;

    const interval = setInterval(() => {
      const [lng, lat] = currentOfficial.current_location!;
      const newLocation: [number, number] = [
        lng + (Math.random() - 0.5) * 0.001,
        lat + (Math.random() - 0.5) * 0.001
      ];
      updateLocation.mutate(newLocation);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentOfficial?.current_location]);

  if (isLoadingOfficial || isLoadingTasks) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (officialError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-red-500">
          {(officialError as Error)?.message || 'An error occurred'}
        </div>
      </div>
    );
  }

  if (!currentOfficial) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Please log in to access the official dashboard</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <OfficialHeader official={currentOfficial} />
      
      <div className="flex flex-1 p-4 gap-4">
        <div className="w-1/3 space-y-4">
          <TasksList tasks={tasks} />
        </div>
        
        <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
          <MapComponent 
            officials={[
              { 
                id: currentOfficial.id,
                name: currentOfficial.name, 
                location: currentOfficial.current_location || [80.2707, 13.0827], 
                status: currentOfficial.status 
              }
            ]}
            isOfficialApp={true}
          />
        </div>
      </div>
    </div>
  );
};

export default OfficialApp;