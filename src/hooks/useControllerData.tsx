import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase, type Task, type Official } from '../lib/supabase';
import { mockTasks } from '../data/mockTasks';
import { useToast } from './use-toast';
import { useEffect } from 'react';

export const useControllerData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch officials with location tracking
  const { data: officials = [], error: officialsError } = useQuery({
    queryKey: ['officials'],
    queryFn: async () => {
      console.log('Fetching officials...');
      try {
        const { data, error } = await supabase
          .from('officials')
          .select('*')
          .order('last_updated', { ascending: false });
        
        if (error) throw error;
        
        console.log('Officials fetched:', data);
        return data || [];
      } catch (error) {
        console.error('Error fetching officials:', error);
        throw error;
      }
    },
    refetchInterval: 5000,
  });

  // Fetch tasks with fallback to mock data
  const { data: tasks = mockTasks, error: tasksError } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      console.log('Fetching tasks...');
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*');
        
        if (error) throw error;
        
        console.log('Tasks fetched:', data);
        return data || mockTasks;
      } catch (error) {
        console.error('Error fetching tasks:', error);
        return mockTasks;
      }
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
        title: "Using mock tasks",
        description: "Connected to mock data for demonstration",
        variant: "default"
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

  return { officials, tasks };
};