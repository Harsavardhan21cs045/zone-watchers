import React, { useEffect } from 'react';
import { MapComponent } from '../components/MapComponent';
import { OfficialsList } from '../components/OfficialsList';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, type Task, type Official } from '../lib/supabase';

const ControllerApp = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch officials
  const { data: officials = [] } = useQuery<Official[]>({
    queryKey: ['officials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('officials')
        .select('*');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch tasks
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Subscribe to real-time updates
  useEffect(() => {
    const officialsSubscription = supabase
      .channel('officials-channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'officials' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['officials'] });
        }
      )
      .subscribe();

    const tasksSubscription = supabase
      .channel('tasks-channel')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
      )
      .subscribe();

    return () => {
      officialsSubscription.unsubscribe();
      tasksSubscription.unsubscribe();
    };
  }, [queryClient]);

  const handleZoneViolation = (officialId: number) => {
    const official = officials.find(o => o.id === officialId.toString());
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
        <OfficialsList officials={officials} />
      </div>
      <div className="w-3/4">
        <MapComponent 
          officials={officials.map(official => ({
            id: parseInt(official.id),
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