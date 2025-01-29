import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { mockTasks } from '../data/mockTasks';
import { mockOfficials } from '../data/mockOfficials';
import { useToast } from './use-toast';
import { useEffect } from 'react';

export const useControllerData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch officials with better error handling
  const { data: officials = [], error: officialsError } = useQuery({
    queryKey: ['officials'],
    queryFn: async () => {
      console.log('Fetching officials...');
      try {
        const { data, error } = await supabase
          .from('officials')
          .select('*')
          .order('last_updated', { ascending: false });
        
        if (error) {
          console.error('Supabase error:', error);
          console.log('Using mock officials data');
          return mockOfficials;
        }
        
        // Map data to ensure serializable objects
        const serializedOfficials = (data || []).map(official => ({
          id: official.id,
          name: official.name,
          current_location: official.current_location,
          status: official.status,
          last_updated: official.last_updated
        }));
        
        console.log('Officials fetched:', serializedOfficials);
        return serializedOfficials;
      } catch (error) {
        console.error('Error fetching officials:', error);
        console.log('Using mock officials data due to error');
        return mockOfficials;
      }
    },
    refetchInterval: 5000,
    retry: 1
  });

  // Use mock tasks and assign them to officials
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      console.log('Using mock tasks and assigning to officials');
      const availableOfficials = officials.filter(off => off.status === 'on-duty');
      
      return mockTasks.map((task, index) => ({
        ...task,
        assigned_to: availableOfficials[index % availableOfficials.length]?.id || null
      }));
    },
    enabled: !!officials.length,
    staleTime: Infinity
  });

  // Show errors if any
  useEffect(() => {
    if (officialsError) {
      toast({
        title: "Connection Issue",
        description: "Using mock data. Please check your connection.",
        variant: "destructive"
      });
    }
  }, [officialsError, toast]);

  // Subscribe to real-time updates with error handling
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
      .subscribe((status) => {
        console.log('Officials subscription status:', status);
      });

    return () => {
      console.log('Cleaning up subscriptions...');
      officialsSubscription.unsubscribe();
    };
  }, [queryClient]);

  return { 
    officials: officials || mockOfficials, 
    tasks: tasks || mockTasks 
  };
};