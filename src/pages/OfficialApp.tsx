import React, { useEffect } from 'react';
import { MapComponent } from '../components/MapComponent';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, type Task, type Official } from '../lib/supabase';

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
      
      console.log('Official data fetched:', data);
      return data;
    }
  });

  // Fetch incomplete tasks
  const { data: tasks = [], isLoading: isLoadingTasks, error: tasksError } = useQuery({
    queryKey: ['officialTasks'],
    queryFn: async () => {
      console.log('Fetching tasks...');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No authenticated user found');
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to', user.id)
        .in('status', ['pending', 'in-progress']);
      
      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }
      
      console.log('Tasks fetched:', data);
      return data || [];
    },
    enabled: !!currentOfficial // Only fetch tasks if we have the current official
  });

  // Update location mutation
  const updateLocation = useMutation({
    mutationFn: async (location: [number, number]) => {
      console.log('Updating location:', location);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No authenticated user found');
        throw new Error('Not authenticated');
      }

      const { error } = await supabase
        .from('officials')
        .update({ 
          current_location: location, 
          last_updated: new Date().toISOString() 
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating location:', error);
        throw error;
      }
      
      console.log('Location updated successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentOfficial'] });
    },
    onError: (error) => {
      console.error('Location update error:', error);
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

  // Subscribe to real-time updates
  useEffect(() => {
    console.log('Setting up real-time subscription...');
    const tasksSubscription = supabase
      .channel('official-tasks')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        (payload) => {
          console.log('Tasks update received:', payload);
          queryClient.invalidateQueries({ queryKey: ['officialTasks'] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up subscription...');
      tasksSubscription.unsubscribe();
    };
  }, [queryClient]);

  // Handle loading states
  if (isLoadingOfficial || isLoadingTasks) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Handle errors
  if (officialError || tasksError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-red-500">
          {(officialError as Error)?.message || (tasksError as Error)?.message || 'An error occurred'}
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
      <div className="bg-primary text-primary-foreground p-4">
        <h1 className="text-xl font-bold">Official Dashboard</h1>
        <p className="text-sm opacity-90">Chennai Police Department</p>
      </div>
      
      <div className="flex flex-1 p-4 gap-4">
        <div className="w-1/3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tasks.map(task => (
                  <div 
                    key={task.id} 
                    className="p-3 bg-card rounded-lg border shadow-sm"
                  >
                    <h3 className="font-medium">{task.title}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant={task.status === 'pending' ? 'destructive' : 'default'}>
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <p className="text-sm text-muted-foreground">No pending tasks</p>
                )}
              </div>
            </CardContent>
          </Card>
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