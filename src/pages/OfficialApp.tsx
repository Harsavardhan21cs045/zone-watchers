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
  const { data: currentOfficial } = useQuery<Official>({
    queryKey: ['currentOfficial'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('officials')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch incomplete tasks
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ['officialTasks'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to', user.id)
        .in('status', ['pending', 'in-progress']);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Update location mutation
  const updateLocation = useMutation({
    mutationFn: async (location: [number, number]) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('officials')
        .update({ current_location: location, last_updated: new Date().toISOString() })
        .eq('id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentOfficial'] });
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
    const tasksSubscription = supabase
      .channel('official-tasks')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['officialTasks'] });
        }
      )
      .subscribe();

    return () => {
      tasksSubscription.unsubscribe();
    };
  }, [queryClient]);

  if (!currentOfficial) return null;

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